"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Quality = "standard" | "hd";
type Status = "idle" | "generating" | "complete" | "error";

const qualityOptions = [
    { value: "standard", label: "Standard", credits: 3 },
    { value: "hd", label: "HD Quality", credits: 5 },
];

export default function ImageGenerationPage() {
    const [prompt, setPrompt] = useState("");
    const [quality, setQuality] = useState<Quality>("standard");
    const [status, setStatus] = useState<Status>("idle");
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const selectedCredits = qualityOptions.find(q => q.value === quality)?.credits || 3;

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setStatus("generating");

        // Simulate generation
        setTimeout(() => {
            setGeneratedImage("/api/placeholder/512/512");
            setStatus("complete");
        }, 3000);
    };

    return (
        <div className="h-full flex">
            {/* Canvas Area */}
            <div className="flex-1 p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="h-full flex flex-col"
                >
                    <h1 className="text-2xl font-bold text-text-primary">Image Generation</h1>
                    <p className="text-text-secondary mt-1">Create stunning images with AI</p>

                    {/* Preview Area */}
                    <div className="flex-1 mt-6 bg-surface border border-border rounded-xl flex items-center justify-center">
                        {status === "idle" && (
                            <div className="text-center">
                                <div className="text-5xl mb-4">🎨</div>
                                <p className="text-text-secondary">Enter a prompt to generate an image</p>
                            </div>
                        )}
                        {status === "generating" && (
                            <div className="text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                                />
                                <p className="text-text-secondary">Generating your image...</p>
                            </div>
                        )}
                        {status === "complete" && generatedImage && (
                            <div className="text-center">
                                <div className="w-80 h-80 bg-panel rounded-lg flex items-center justify-center">
                                    <span className="text-text-muted">Generated Image Preview</span>
                                </div>
                                <div className="mt-4 flex gap-3 justify-center">
                                    <Button variant="secondary" size="sm">Download</Button>
                                    <Button variant="ghost" size="sm" onClick={() => setStatus("idle")}>
                                        Generate Another
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Prompt Input */}
                    <div className="mt-6">
                        <Textarea
                            placeholder="Describe the image you want to create..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="resize-none"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Inspector Panel */}
            <div className="w-72 bg-surface border-l border-border p-6">
                <h2 className="font-semibold text-text-primary mb-4">Settings</h2>

                {/* Quality Selection */}
                <div className="space-y-2 mb-6">
                    <label className="text-sm text-text-secondary">Quality</label>
                    {qualityOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setQuality(option.value as Quality)}
                            className={`
                w-full p-3 rounded-lg border text-left transition-all
                ${quality === option.value
                                    ? "border-primary bg-primary/10"
                                    : "border-border bg-panel hover:border-primary/30"
                                }
              `}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-text-primary">{option.label}</span>
                                <span className="text-sm text-text-secondary">{option.credits} cr</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Cost Summary */}
                <Card variant="elevated" padding="sm" className="mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Cost</span>
                        <span className="font-semibold text-primary">{selectedCredits} credits</span>
                    </div>
                </Card>

                {/* Generate Button */}
                <Button
                    className="w-full"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || status === "generating"}
                    isLoading={status === "generating"}
                >
                    Generate Image
                </Button>
            </div>
        </div>
    );
}
