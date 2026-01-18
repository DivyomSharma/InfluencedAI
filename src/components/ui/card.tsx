"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef, ReactNode } from "react";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
    variant?: "default" | "elevated" | "interactive";
    padding?: "none" | "sm" | "md" | "lg";
    children: ReactNode;
}

const variants = {
    default: "bg-surface border border-border",
    elevated: "bg-panel border border-border shadow-md",
    interactive: "bg-surface border border-border hover:border-primary/30 cursor-pointer",
};

const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        { variant = "default", padding = "md", children, className = "", ...props },
        ref
    ) => {
        const isInteractive = variant === "interactive";

        return (
            <motion.div
                ref={ref}
                whileHover={isInteractive ? { scale: 1.01, y: -2 } : undefined}
                transition={{ duration: 0.2 }}
                className={`
          rounded-xl
          ${variants[variant]}
          ${paddings[padding]}
          ${className}
        `}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = "Card";

interface CardHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4 mb-4">
            <div>
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                {description && (
                    <p className="text-sm text-text-secondary mt-1">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`mt-4 pt-4 border-t border-border ${className}`}>
            {children}
        </div>
    );
}
