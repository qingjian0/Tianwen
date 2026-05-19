'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, iconRight, className, disabled, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={[
            'bg-ink-900/80 border border-gold-500/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600',
            'focus:border-gold-500/40 focus:outline-none focus:shadow-glow-sm transition-all duration-300',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            icon ? 'pl-10' : '',
            iconRight ? 'pr-10' : '',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {iconRight}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';