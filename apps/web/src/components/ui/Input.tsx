"use client";

import React, { forwardRef } from "react";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  inputSize?: InputSize;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

const iconSizes: Record<InputSize, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      prefixIcon,
      suffixIcon,
      inputSize = "md",
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <div
              className={`absolute left-0 top-0 flex items-center justify-center ${iconSizes[inputSize]} text-imperial-gold`}
            >
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={[
              "w-full bg-white border rounded-lg text-text-primary placeholder:text-text-muted transition-all duration-300",
              "focus:outline-none",
              sizeStyles[inputSize],
              hasError
                ? "border-vermillion focus:border-vermillion focus:ring-1 focus:ring-vermillion/30"
                : "border-border focus:border-imperial-gold/60 focus:ring-1 focus:ring-imperial-gold/20",
              disabled ? "opacity-50 cursor-not-allowed bg-bg-secondary" : "",
              prefixIcon ? "pl-10" : "",
              suffixIcon ? "pr-10" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          {suffixIcon && (
            <div className="absolute right-0 top-0 flex items-center justify-center h-full pr-3 text-imperial-gold">
              {suffixIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-vermillion">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

interface IconInputProps extends Omit<InputProps, "prefixIcon"> {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon, iconPosition = "left", ...props }, ref) => {
    return (
      <Input
        ref={ref}
        prefixIcon={iconPosition === "left" ? icon : undefined}
        suffixIcon={iconPosition === "right" ? icon : undefined}
        {...props}
      />
    );
  },
);

IconInput.displayName = "IconInput";
