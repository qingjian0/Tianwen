/**
 * 徽章
 */

"use client";

import { ReactNode } from "react";

interface BadgeProps {
  variant: "gold" | "vermillion" | "jade" | "indigo" | "ghost";
  children: ReactNode;
  className?: string;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeProps["variant"], string> = {
  gold: "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20",
  vermillion: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20",
  jade: "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20",
  indigo: "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20",
  ghost: "bg-white/5 text-[#6B6B7B] border border-white/10",
};

const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
};

export const Badge = ({
  variant,
  children,
  className = "",
  size = "md",
}: BadgeProps) => {
  return (
    <span
      className={`rounded-full inline-flex items-center ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
