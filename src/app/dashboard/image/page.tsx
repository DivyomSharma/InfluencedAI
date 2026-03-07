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
        <div className="h-full flex flex-col lg:flex-row">
            {/* Main Area */}
            <div className="flex-1 p-6 lg:p-8 overflow-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-2xl font-bold text-text-primary">Generate Content</h1>
                    <p className="text-text-secondary mt-1">
                        Upload your product and create influencer-style marketing content
                    </p>
                </motion.div>

                {/* Upload Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mt-6"
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
                            className="mt-6"
                        >
                            <Card padding="md">
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text-primary">Generating influencer content...</p>
                                        <p className="text-xs text-text-muted mt-0.5">
                                            Creating {numImages} images • {INFLUENCER_TYPES.find(t => t.value === influencerType)?.label}
                                        </p>
                                        <div className="mt-3 h-1.5 bg-panel rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-primary to-[#A78BFA] rounded-full"
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
                            <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl">
                                <p className="text-sm text-danger font-medium">Generation Failed</p>
                                <p className="text-xs text-danger/80 mt-1">{errorMsg}</p>
                                <Button variant="danger" size="sm" className="mt-3" onClick={handleReset}>
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-text-primary">Generated Content</h2>
                                    <p className="text-sm text-text-muted">{generatedImages.length} images ready</p>
                                </div>
                                <Button variant="secondary" size="sm" onClick={handleReset}>
                                    Generate More
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {generatedImages.map((img, i) => (
                                    <motion.div
                                        key={img.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: i * 0.08 }}
                                        className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-panel"
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Generated content ${i + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2">
                                                <button
                                                    onClick={() => handleDownload(img.url, i)}
                                                    className="flex-1 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium hover:bg-white/30 transition-colors"
                                                >
                                                    ↓ Download
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(img.url);
                                                    }}
                                                    className="py-2 px-3 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium hover:bg-white/30 transition-colors"
                                                >
                                                    🔗
                                                </button>
                                            </div>
                                        </div>

                                        {/* Badge */}
                                        <div className="absolute top-2 left-2">
                                            <span className="text-[10px] bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded font-medium">
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
                className="w-full lg:w-80 bg-surface border-t lg:border-t-0 lg:border-l border-border p-6 overflow-auto"
            >
                <h2 className="text-lg font-semibold text-text-primary mb-6">Generation Settings</h2>

                <div className="space-y-5">
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
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-text-secondary">Number of Images</label>
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
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border bg-panel text-text-primary hover:border-primary/30"
                                        }
                                    `}
                                >
                                    {option.value}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cost Summary */}
                    <Card variant="elevated" padding="sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">Generation Cost</span>
                            <div className="text-right">
                                <span className="text-lg font-bold text-primary">{numImages}</span>
                                <span className="text-sm text-text-muted ml-1">images</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                            <span className="text-xs text-text-muted">Credits used</span>
                            <span className="text-sm font-semibold text-text-primary">{creditCost} credit{creditCost > 1 ? "s" : ""}</span>
                        </div>
                    </Card>

                    {/* Generate Button */}
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
                        <p className="text-xs text-text-muted text-center">
                            Upload a product image to start generating
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
