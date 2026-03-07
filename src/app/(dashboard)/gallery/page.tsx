"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectDropdown } from "@/components/generator/select-dropdown";
import { createClient } from "@/lib/supabase/client";
import { INFLUENCER_TYPES, PLATFORMS } from "@/lib/constants";

interface GalleryItem {
    id: string;
    influencer_type: string;
    platform: string;
    content_style: string;
    num_images: number;
    generated_image_urls: string[];
    created_at: string;
    status: string;
}

const allFilter = { value: "all", label: "All", icon: "📋" };

export default function GalleryPage() {
    const [generations, setGenerations] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [filterPlatform, setFilterPlatform] = useState("all");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        async function loadGenerations() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("generations")
                .select("*")
                .eq("user_id", user.id)
                .eq("status", "completed")
                .order("created_at", { ascending: false });

            if (data) setGenerations(data);
            setIsLoading(false);
        }

        loadGenerations();
    }, []);

    const filteredGenerations = generations.filter((gen) => {
        if (filterType !== "all" && gen.influencer_type !== filterType) return false;
        if (filterPlatform !== "all" && gen.platform !== filterPlatform) return false;
        return true;
    });

    const allImages = filteredGenerations.flatMap((gen) =>
        (gen.generated_image_urls || []).map((url: string, i: number) => ({
            url,
            genId: gen.id,
            index: i,
            influencerType: gen.influencer_type,
            platform: gen.platform,
            contentStyle: gen.content_style,
            createdAt: gen.created_at,
        }))
    );

    const handleDownload = async (imageUrl: string, index: number) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `influenced-ai-${index + 1}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch {
            window.open(imageUrl, "_blank");
        }
    };

    const typeOptions = [allFilter, ...INFLUENCER_TYPES.map(t => ({ ...t }))];
    const platformOptions = [allFilter, ...PLATFORMS.map(p => ({ ...p }))];

    return (
        <div className="p-6 lg:p-8 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-2xl font-bold text-text-primary">Gallery</h1>
                <p className="text-text-secondary mt-1">Browse and download your generated content</p>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-6 flex flex-wrap gap-4"
            >
                <div className="w-52">
                    <SelectDropdown
                        label="Influencer Type"
                        options={typeOptions}
                        value={filterType}
                        onChange={setFilterType}
                    />
                </div>
                <div className="w-52">
                    <SelectDropdown
                        label="Platform"
                        options={platformOptions}
                        value={filterPlatform}
                        onChange={setFilterPlatform}
                    />
                </div>
                <div className="flex items-end">
                    <p className="text-sm text-text-muted pb-3">
                        {allImages.length} image{allImages.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </motion.div>

            {/* Gallery Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-xl bg-surface border border-border animate-pulse" />
                    ))}
                </div>
            ) : allImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {allImages.map((img, i) => (
                        <motion.div
                            key={`${img.genId}-${img.index}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.03 }}
                            className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-panel cursor-pointer"
                            onClick={() => setSelectedImage(img.url)}
                        >
                            <img
                                src={img.url}
                                alt={`${img.influencerType} content`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <div className="flex gap-2 mb-2">
                                        <span className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded capitalize font-medium">
                                            {img.influencerType}
                                        </span>
                                        <span className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded capitalize font-medium">
                                            {img.platform.replace("_", " ")}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(img.url, img.index);
                                            }}
                                            className="flex-1 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium hover:bg-white/30 transition-colors"
                                        >
                                            ↓ Download
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(img.url);
                                            }}
                                            className="py-1.5 px-3 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium hover:bg-white/30 transition-colors"
                                        >
                                            🔗
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12"
                >
                    <Card padding="lg" className="text-center max-w-md mx-auto">
                        <div className="text-5xl mb-4">🖼️</div>
                        <h3 className="text-lg font-semibold text-text-primary">No content yet</h3>
                        <p className="text-sm text-text-secondary mt-2">
                            Generate your first influencer content to see it here
                        </p>
                        <a href="/dashboard/image" className="inline-block mt-5">
                            <Button>Generate Content →</Button>
                        </a>
                    </Card>
                </motion.div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-3xl max-h-[80vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt="Full size preview"
                                className="max-w-full max-h-[80vh] object-contain rounded-xl"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-3 -right-3 w-8 h-8 bg-panel border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                            >
                                ✕
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                                <button
                                    onClick={() => handleDownload(selectedImage, 0)}
                                    className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
                                >
                                    ↓ Download
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
