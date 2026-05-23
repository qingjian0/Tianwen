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
  default: 'bg-[#12121A]/80 border border-[#D4AF37]/15 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]',
  highlight: 'bg-[#12121A]/90 border-2 border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]',
  plain: 'bg-transparent border border-[#D4AF37]/10',
};

const hoverStyles = 'hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:border-[#D4AF37]/40 transition-all duration-300';

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
      className={[base, hoverClass, clickClass, className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {(header || icon) && (
        <div className="border-b border-[#D4AF37]/10 px-6 py-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="text-[#D4AF37]">
                {icon}
              </div>
            )}
            {header && (
              <div className="text-[#D4AF37] font-semibold tracking-wider">
                {header}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="border-t border-[#D4AF37]/10 px-6 py-3">
          {footer}
        </div>
      )}
    </motion.div>
  );
};
