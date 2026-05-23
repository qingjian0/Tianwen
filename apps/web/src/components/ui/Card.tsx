'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  variant?: 'default' | 'highlight' | 'plain';
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  hover?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-white border border-border shadow-subtle',
  highlight: 'bg-white border-2 border-imperial-gold/40 shadow-card',
  plain: 'bg-transparent border border-border',
};

const hoverStyles = 'hover:-translate-y-1 hover:shadow-hover hover:border-imperial-gold/30 transition-all duration-300';

export const Card = ({
  variant = 'default',
  children,
  className,
  header,
  footer,
  icon,
  hover = false,
  onClick,
}: CardProps) => {
  const base = variantStyles[variant];
  const hoverClass = hover ? hoverStyles : '';
  const clickClass = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={['rounded-xl', base, hoverClass, clickClass, className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {(header || icon) && (
        <div className="border-b border-border px-8 py-6">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="text-imperial-gold">
                {icon}
              </div>
            )}
            {header && (
              <div className="text-imperial-gold font-semibold tracking-wider">
                {header}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-8">{children}</div>
      {footer && (
        <div className="border-t border-border px-8 py-4">
          {footer}
        </div>
      )}
    </motion.div>
  );
};
