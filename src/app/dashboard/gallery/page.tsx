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
        <div className="p-6 lg:p-10 max-w-7xl font-sans">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-[28px] tracking-tight font-medium text-[var(--text-primary)]">Gallery</h1>
                <p className="text-[var(--text-secondary)] mt-1 text-sm">Browse and download your generated content</p>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-8 flex flex-wrap items-end gap-4 border-b border-[#262626] pb-6"
            >
                <div className="w-52">
                    <SelectDropdown
                        label="Influencer Type"
                        options={typeOptions as unknown as { value: string; label: string; icon: string }[]}
                        value={filterType}
                        onChange={setFilterType}
                    />
                </div>
                <div className="w-52">
                    <SelectDropdown
                        label="Platform"
                        options={platformOptions as unknown as { value: string; label: string; icon: string }[]}
                        value={filterPlatform}
                        onChange={setFilterPlatform}
                    />
                </div>
                <div className="flex items-end ml-auto">
                    <p className="text-[13px] text-[var(--text-secondary)] pb-3">
                        {allImages.length} image{allImages.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </motion.div>

            {/* Gallery Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-[14px] bg-[#111] border border-[#262626] animate-pulse" />
                    ))}
                </div>
            ) : allImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
                    {allImages.map((img, i) => (
                        <motion.div
                            key={`${img.genId}-${img.index}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className="group relative aspect-square rounded-[14px] overflow-hidden border border-[#262626] bg-[#111] cursor-pointer"
                            onClick={() => setSelectedImage(img.url)}
                        >
                            <img
                                src={img.url}
                                alt={`${img.influencerType} content`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <div className="flex gap-2 mb-3">
                                        <span className="text-[10px] bg-black/60 backdrop-blur-md text-white border border-white/10 px-2 py-1 rounded-md capitalize font-medium tracking-wide">
                                            {img.influencerType}
                                        </span>
                                        <span className="text-[10px] bg-black/60 backdrop-blur-md text-white border border-white/10 px-2 py-1 rounded-md capitalize font-medium tracking-wide">
                                            {img.platform.replace("_", " ")}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(img.url, img.index);
                                            }}
                                            className="flex-1 py-2 bg-white text-black rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                                        >
                                            ↓ Download
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(img.url);
                                            }}
                                            className="py-2 px-3 bg-[#262626] border border-[#333] rounded-lg text-white text-xs font-medium hover:bg-[#333] transition-colors"
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
                    className="mt-16"
                >
                    <Card className="text-center max-w-md mx-auto !p-10 border-[#262626] bg-[#111111] shadow-none">
                        <div className="text-5xl mb-5 opacity-80 flex justify-center">
                            <svg className="w-12 h-12 text-[#666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                        <h3 className="text-[15px] font-medium text-[var(--text-primary)]">No content yet</h3>
                        <p className="text-[13px] text-[var(--text-secondary)] mt-2 mb-6">
                            Generate your first influencer content to see it here
                        </p>
                        <a href="/dashboard/image" className="inline-block">
                            <Button variant="secondary">Generate Content →</Button>
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
                        className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-md z-50 flex items-center justify-center p-8"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="relative max-w-4xl max-h-[85vh] group"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt="Full size preview"
                                className="max-w-full max-h-[85vh] object-contain rounded-[14px] shadow-2xl border border-[#262626]"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-4 -right-4 w-10 h-10 bg-[#171717] border border-[#262626] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-[#222] transition-colors shadow-lg"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => handleDownload(selectedImage, 0)}
                                    className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors shadow-lg flex items-center gap-2"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Download Image
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
