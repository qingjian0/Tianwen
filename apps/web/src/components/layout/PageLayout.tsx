'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

export const PageLayout = ({ children, title }: PageLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {title && (
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-song font-bold text-text-primary">
              {title}
            </h1>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
};
