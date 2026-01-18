"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const baseStyles = `
  w-full px-4 py-3
  bg-surface border border-border rounded-lg
  text-text-primary placeholder:text-text-muted
  transition-all duration-150
  focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
  disabled:opacity-50 disabled:cursor-not-allowed
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`${baseStyles} ${error ? "border-danger" : ""} ${className}`}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs text-text-muted">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-danger">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`${baseStyles} min-h-[120px] resize-y ${error ? "border-danger" : ""} ${className}`}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs text-text-muted">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-danger">{error}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";
