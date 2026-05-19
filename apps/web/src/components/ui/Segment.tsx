'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SegmentOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentProps {
  options: SegmentOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Segment = ({ options, value, onChange, className }: SegmentProps) => {
  return (
    <div className={['flex', className].filter(Boolean).join(' ')}>
      {options.map((option, index) => {
        const isSelected = option.id === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            whileTap={{ scale: 0.95 }}
            className={[
              'px-4 py-2.5 text-sm',
              isFirst && 'rounded-l-lg rounded-r-none',
              !isFirst && !isLast && 'rounded-none',
              isLast && 'rounded-r-lg rounded-l-none',
              isSelected
                ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                : 'bg-transparent text-gray-500 border border-white/5 hover:text-gray-300 hover:border-white/10',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {option.icon && <span className="mr-1.5">{option.icon}</span>}
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
};