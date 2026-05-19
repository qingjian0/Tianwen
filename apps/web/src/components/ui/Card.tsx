'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  variant?: 'default' | 'highlight' | 'subtle';
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  hover?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-ink-800/60 border border-gold-500/10 rounded-xl',
  highlight: 'bg-ink-800/60 border border-gold-500/30 rounded-xl shadow-glow-sm',
  subtle: 'bg-transparent border border-white/5 rounded-xl',
};

export const Card = ({
  variant = 'default',
  children,
  className,
  header,
  footer,
  hover = false,
  onClick,
}: CardProps) => {
  const base = variantStyles[variant];
  const hoverClass = hover ? 'hover:border-gold-500/30 hover:shadow-glow-sm transition-all duration-300' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={[base, hoverClass, clickClass, className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {header && (
        <div className="border-b border-gold-500/10 px-6 py-4 text-gold-400 font-serif">
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="border-t border-gold-500/10 px-6 py-3">
          {footer}
        </div>
      )}
    </motion.div>
  );
};