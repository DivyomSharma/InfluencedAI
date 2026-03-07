"use client";

import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
    preview: string | null;
    onClear: () => void;
    isDisabled?: boolean;
}

export function UploadZone({ onFileSelect, preview, onClear, isDisabled }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith("image/")) {
                onFileSelect(file);
            }
        }
    }, [onFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
    }, [onFileSelect]);

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {preview ? (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative rounded-xl overflow-hidden border border-border bg-surface"
                    >
                        <img
                            src={preview}
                            alt="Product preview"
                            className="w-full h-64 object-contain bg-panel/50 p-4"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                            <button
                                onClick={onClear}
                                disabled={isDisabled}
                                className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-all disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-3 bg-surface border-t border-border">
                            <p className="text-xs text-text-muted text-center">Product image loaded ✓</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onDragEnter={handleDragIn}
                        onDragLeave={handleDragOut}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative h-64 rounded-xl border-2 border-dashed cursor-pointer
                            flex flex-col items-center justify-center gap-4
                            transition-all duration-300
                            ${isDragging
                                ? "border-primary bg-primary/5 scale-[1.02]"
                                : "border-border hover:border-primary/40 hover:bg-surface/50"
                            }
                            ${isDisabled ? "opacity-50 pointer-events-none" : ""}
                        `}
                    >
                        <motion.div
                            animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                            className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                        >
                            <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </motion.div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-text-primary">
                                {isDragging ? "Drop your image here" : "Upload product image"}
                            </p>
                            <p className="text-xs text-text-muted mt-1">
                                Drag & drop or click to browse • PNG, JPG up to 10MB
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileInput}
                className="hidden"
            />
        </div>
    );
}
