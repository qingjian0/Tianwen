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
  default: 'bg-gradient-to-br from-ink-dark/80 via-ink-medium/50 to-ink-dark/90 border border-imperial-gold/15',
  highlight: 'bg-gradient-to-br from-ink-dark/90 via-celestial-blue-dark/30 to-ink-dark/90 border-2 border-imperial-gold/30 shadow-gold-glow',
  subtle: 'bg-transparent border border-imperial-gold/10',
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
  const hoverClass = hover ? 'hover:border-imperial-gold/40 hover:-translate-y-1 hover:shadow-gold-glow transition-all duration-300' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={[base, hoverClass, clickClass, className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {header && (
        <div className="border-b border-imperial-gold/10 px-6 py-4 text-imperial-gold font-song tracking-wider">
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="border-t border-imperial-gold/10 px-6 py-3">
          {footer}
        </div>
      )}
    </motion.div>
  );
};
