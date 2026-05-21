'use client';

import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ComponentPropsWithoutRef<typeof motion.button> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-ji-600 to-ji-700 text-xuan-950 font-song hover:from-ji-500 hover:to-ji-600 border border-ji-500/50 shadow-glow-ji',
  secondary:
    'bg-xuan-800/60 border border-xuan-600/50 text-xuan-200 font-kai hover:bg-xuan-700/60 hover:border-ji-500/30',
  ghost: 'bg-transparent text-xuan-400 font-kai hover:text-ji-300 hover:bg-xuan-800/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs tracking-wide',
  md: 'px-5 py-2.5 text-sm tracking-wide',
  lg: 'px-7 py-3.5 text-base tracking-wide',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className = '',
  type = 'button',
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
        'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-300',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
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
