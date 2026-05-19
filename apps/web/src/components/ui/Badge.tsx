/**
 * 徽章
 */

'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  variant: 'gold' | 'vermillion' | 'jade' | 'indigo' | 'ghost';
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeProps['variant'], string> = {
  gold: 'bg-gold-500/15 text-gold-400 border border-gold-500/20',
  vermillion: 'bg-vermillion-500/15 text-vermillion-400 border border-vermillion-500/20',
  jade: 'bg-jade-500/15 text-jade-400 border border-jade-500/20',
  indigo: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20',
  ghost: 'bg-white/5 text-gray-400 border border-white/10',
};

const sizeStyles: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

export const Badge = ({
  variant,
  children,
  className = '',
  size = 'md',
}: BadgeProps) => {
  return (
    <span
      className={`rounded-full inline-flex items-center ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};