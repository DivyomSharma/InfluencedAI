"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadZone } from "@/components/generator/upload-zone";
import { SelectDropdown } from "@/components/generator/select-dropdown";
import {
    INFLUENCER_TYPES,
    PLATFORMS,
    CONTENT_STYLES,
    IMAGE_COUNT_OPTIONS,
} from "@/lib/constants";
import type { InfluencerType, Platform, ContentStyle } from "@/lib/constants";

type GenerationStatus = "idle" | "generating" | "complete" | "error";

interface GeneratedImage {
    url: string;
    id: string;
}

export default function GeneratorPage() {
    // Upload state
    const [productFile, setProductFile] = useState<File | null>(null);
    const [productPreview, setProductPreview] = useState<string | null>(null);

    // Generation settings
    const [influencerType, setInfluencerType] = useState<InfluencerType>("lifestyle");
    const [platform, setPlatform] = useState<Platform>("instagram");
    const [contentStyle, setContentStyle] = useState<ContentStyle>("selfie");
    const [numImages, setNumImages] = useState(4);

    // Generation state
    const [status, setStatus] = useState<GenerationStatus>("idle");
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const creditCost = IMAGE_COUNT_OPTIONS.find((o) => o.value === numImages)?.credits || 1;

    const handleFileSelect = useCallback((file: File) => {
        setProductFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProductPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleClear = useCallback(() => {
        setProductFile(null);
        setProductPreview(null);
    }, []);

    const handleGenerate = async () => {
        if (!productFile) return;

        setStatus("generating");
        setProgress(0);
        setErrorMsg(null);
        setGeneratedImages([]);

        // Simulate progress for upload phase
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + Math.random() * 15;
            });
        }, 400);

        try {
            // 1. Get Supabase client
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();

            // 2. Upload image to Storage
            const fileExt = productFile.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET_NAME || "products")
                .upload(filePath, productFile);

            if (uploadError) {
                throw new Error("Failed to upload product image: " + uploadError.message);
            }

            // 3. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET_NAME || "products")
                .getPublicUrl(filePath);


            // 4. Call generation API
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productImageUrl: publicUrl,
                    influencerType,
                    platform,
                    contentStyle,
                    numImages,
                }),
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Generation failed");
            }

            const data = await response.json();
            setProgress(100);

            setTimeout(() => {
                setGeneratedImages(
                    data.images.map((url: string, i: number) => ({
                        url,
                        id: `gen-${Date.now()}-${i}`,
                    }))
                );
                setStatus("complete");
            }, 500);
        } catch (err) {
            clearInterval(progressInterval);
            setErrorMsg(err instanceof Error ? err.message : "Generation failed");
            setStatus("error");
        }
    };

    const handleDownload = async (imageUrl: string, index: number) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `influenced-ai-${influencerType}-${platform}-${index + 1}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch {
            // Fallback: open in new tab
            window.open(imageUrl, "_blank");
        }
    };

    const handleReset = () => {
        setStatus("idle");
        setGeneratedImages([]);
        setProgress(0);
        setErrorMsg(null);
    };

    return (
        <div className="h-full flex flex-col lg:flex-row font-sans">
            {/* Main Area */}
            <div className="flex-1 p-6 lg:p-10 overflow-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-[28px] tracking-tight font-medium text-[var(--text-primary)]">Generate Content</h1>
                    <p className="text-[var(--text-secondary)] mt-1 text-sm">
                        Upload your product and create influencer-style marketing content
                    </p>
                </motion.div>

                {/* Upload Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mt-8"
                >
                    <UploadZone
                        onFileSelect={handleFileSelect}
                        preview={productPreview}
                        onClear={handleClear}
                        isDisabled={status === "generating"}
                    />
                </motion.div>

                {/* Generation Progress */}
                <AnimatePresence>
                    {status === "generating" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 overflow-hidden"
                        >
                            <Card>
                                <div className="flex items-center gap-5">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="w-8 h-8 rounded-full border-[3px] border-[var(--primary)] border-t-transparent shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[var(--text-primary)]">Generating influencer content...</p>
                                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                                            Creating {numImages} images • {INFLUENCER_TYPES.find(t => t.value === influencerType)?.label}
                                        </p>
                                        <div className="mt-4 h-1 bg-[#262626] rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-white rounded-full"
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error State */}
                <AnimatePresence>
                    {status === "error" && errorMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6"
                        >
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-[14px]">
                                <p className="text-sm text-red-500 font-medium">Generation Failed</p>
                                <p className="text-[13px] text-red-500/80 mt-1 mb-4">{errorMsg}</p>
                                <Button variant="secondary" size="sm" onClick={handleReset}>
                                    Try Again
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Generated Images Grid */}
                <AnimatePresence>
                    {status === "complete" && generatedImages.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-10"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-[15px] font-medium text-[var(--text-primary)]">Generated Content</h2>
                                    <p className="text-[13px] text-[var(--text-secondary)]">{generatedImages.length} images ready</p>
                                </div>
                                <Button variant="secondary" size="sm" onClick={handleReset}>
                                    Generate More
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                {generatedImages.map((img, i) => (
                                    <motion.div
                                        key={img.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: i * 0.08 }}
                                        className="group relative aspect-square rounded-[14px] overflow-hidden border border-[var(--border)] bg-[#111]"
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Generated content ${i + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2">
                                                <button
                                                    onClick={() => handleDownload(img.url, i)}
                                                    className="flex-1 py-2 bg-white text-black rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                                                >
                                                    ↓ Download
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(img.url);
                                                    }}
                                                    className="py-2 px-3 bg-[#262626] border border-[#333] rounded-lg text-white text-xs font-medium hover:bg-[#333] transition-colors"
                                                >
                                                    🔗
                                                </button>
                                            </div>
                                        </div>

                                        {/* Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="text-[10px] bg-black/60 backdrop-blur-md text-white border border-white/10 px-2 py-1 rounded-md font-medium tracking-wide shadow-sm">
                                                {PLATFORMS.find(p => p.value === platform)?.label}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Settings Panel */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-full lg:w-80 bg-[#0A0A0A] border-t lg:border-t-0 lg:border-l border-[var(--border)] p-8 overflow-auto shrink-0"
            >
                <div className="sticky top-0 bg-[#0A0A0A] pb-4 z-10">
                    <h2 className="text-[15px] font-medium text-[var(--text-primary)]">Generation Settings</h2>
                </div>

                <div className="space-y-6 mt-2">
                    <SelectDropdown
                        label="Influencer Type"
                        options={INFLUENCER_TYPES as unknown as { value: string; label: string; icon: string }[]}
                        value={influencerType}
                        onChange={(v) => setInfluencerType(v as InfluencerType)}
                        disabled={status === "generating"}
                    />

                    <SelectDropdown
                        label="Platform"
                        options={PLATFORMS as unknown as { value: string; label: string; icon: string }[]}
                        value={platform}
                        onChange={(v) => setPlatform(v as Platform)}
                        disabled={status === "generating"}
                    />

                    <SelectDropdown
                        label="Content Style"
                        options={CONTENT_STYLES as unknown as { value: string; label: string; icon: string }[]}
                        value={contentStyle}
                        onChange={(v) => setContentStyle(v as ContentStyle)}
                        disabled={status === "generating"}
                    />

                    {/* Image Count */}
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Number of Images</label>
                        <div className="grid grid-cols-3 gap-2">
                            {IMAGE_COUNT_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setNumImages(option.value)}
                                    disabled={status === "generating"}
                                    className={`
                                        py-2.5 rounded-lg border text-sm font-medium transition-all
                                        disabled:opacity-50
                                        ${numImages === option.value
                                            ? "border-white bg-white text-black"
                                            : "border-[#262626] bg-[#111111] text-[var(--text-primary)] hover:border-[#444]"
                                        }
                                    `}
                                >
                                    {option.value}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cost Summary */}
                    <Card className="!p-4 bg-[#111111]">
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] text-[var(--text-secondary)]">Generation Cost</span>
                            <div className="text-right flex items-baseline gap-1">
                                <span className="text-lg font-medium text-white">{numImages}</span>
                                <span className="text-xs text-[var(--text-secondary)]">images</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#262626]">
                            <span className="text-xs text-[var(--text-secondary)]">Credits used</span>
                            <span className="text-[13px] font-medium text-white">{creditCost} credit{creditCost > 1 ? "s" : ""}</span>
                        </div>
                    </Card>

                    {/* Generate Button */}
                    <div className="pt-2">
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleGenerate}
                            disabled={!productFile || status === "generating"}
                            isLoading={status === "generating"}
                        >
                            {status === "generating" ? "Generating..." : "Generate Content"}
                        </Button>

                        {!productFile && (
                            <p className="text-[13px] text-[var(--text-secondary)] text-center mt-3">
                                Upload a product image to start
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
