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
  default: 'bg-xuan-900/70 border border-ji-500/15',
  highlight: 'bg-gradient-to-br from-xuan-900/80 to-mo-900/60 border-2 border-ji-500/30 shadow-glow-ji',
  subtle: 'bg-transparent border border-xuan-700/30',
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
  const hoverClass = hover ? 'hover:border-ji-500/40 hover:-translate-y-1 transition-all duration-300' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={[base, hoverClass, clickClass, className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {header && (
        <div className="border-b border-ji-500/10 px-6 py-4 text-ji-400 font-song tracking-wider">
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="border-t border-ji-500/10 px-6 py-3">
          {footer}
        </div>
      )}
    </motion.div>
  );
};
