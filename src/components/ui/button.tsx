"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[#fff] text-[#000] hover:bg-[#fafafa] shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] hover:-translate-y-[1px]",
  secondary: "bg-transparent border border-[#333] text-white hover:bg-[#111] hover:-translate-y-[1px]",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-[#111]",
  danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-[10px]",
  lg: "px-6 py-3 text-base rounded-[10px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ duration: 0.2 }}
        className={`
          inline-flex items-center justify-center gap-2
          font-medium
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
