"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectOption {
    value: string;
    label: string;
    icon?: string;
}

interface SelectDropdownProps {
    label: string;
    options: readonly SelectOption[] | SelectOption[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function SelectDropdown({ label, options, value, onChange, disabled }: SelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">{label}</label>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full flex items-center justify-between gap-2
                    px-4 py-3 rounded-lg border text-left
                    transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isOpen
                        ? "border-primary ring-1 ring-primary bg-surface"
                        : "border-border bg-surface hover:border-primary/40"
                    }
                `}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    {selected?.icon && <span className="text-lg shrink-0">{selected.icon}</span>}
                    <span className="text-text-primary truncate text-sm">
                        {selected?.label || "Select..."}
                    </span>
                </div>
                <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 text-text-muted shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </motion.svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1 bg-panel border border-border rounded-xl shadow-lg overflow-hidden"
                    >
                        <div className="max-h-56 overflow-auto py-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm
                                        transition-colors duration-100
                                        ${option.value === value
                                            ? "bg-primary/10 text-primary"
                                            : "text-text-primary hover:bg-surface"
                                        }
                                    `}
                                >
                                    {option.icon && <span className="text-base">{option.icon}</span>}
                                    <span className="font-medium">{option.label}</span>
                                    {option.value === value && (
                                        <svg className="w-4 h-4 ml-auto text-primary" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
