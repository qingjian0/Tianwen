/**
 * 页面容器
 */

'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@tianwen/animations';

interface PageContainerProps {
  children: ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <motion.div
      {...pageTransition}
      className="max-w-6xl mx-auto"
    >
      {children}
    </motion.div>
  );
};
