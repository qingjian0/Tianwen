"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ComponentPropsWithoutRef<typeof motion.button> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#F4D03F] via-[#D4AF37] to-[#B8860B] text-white font-semibold border border-[#D4AF37]/80",
  secondary: "bg-white border border-border text-text-primary font-semibold",
  ghost:
    "bg-transparent border border-transparent text-text-secondary font-medium",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs tracking-wider",
  md: "px-6 py-2.5 text-sm tracking-wider",
  lg: "px-8 py-3.5 text-base tracking-wider",
};

const hoverStyles: Record<ButtonVariant, string> = {
  primary: "hover:border-[#D4AF37] hover:shadow-card",
  secondary: "hover:border-imperial-gold/40 hover:text-imperial-gold",
  ghost: "hover:text-imperial-gold hover:bg-bg-secondary",
};

export const Button = ({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      role="button"
      className={[
        "inline-flex items-center justify-center gap-2 transition-all duration-300 rounded-lg",
        variantStyles[variant],
        sizeStyles[size],
        hoverStyles[variant],
        isDisabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      whileHover={isDisabled ? undefined : { y: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
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
      )}
      {children}
    </motion.button>
  );
};

interface RoyalButtonProps extends Omit<ButtonProps, "variant"> {}

export const RoyalButton = ({ size = "md", ...props }: RoyalButtonProps) => {
  return <Button variant="primary" size={size} {...props} />;
};
