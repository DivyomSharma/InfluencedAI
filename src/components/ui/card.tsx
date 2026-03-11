"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", interactive = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={interactive ? { y: -2 } : {}}
        transition={{ duration: 0.2 }}
        className={`bg-[#171717] border border-[#262626] rounded-[14px] p-6 ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
