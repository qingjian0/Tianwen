"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

interface StaggerChildrenProps {
  children: ReactNode[];
  className?: string;
  delay?: number;
}

const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export const PageTransition = ({
  children,
  className,
}: PageTransitionProps) => {
  return (
    <motion.div className={className} {...pageTransition}>
      {children}
    </motion.div>
  );
};

export const StaggerChildren = ({
  children,
  className,
  delay = 80,
}: StaggerChildrenProps) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index * delay) / 1000 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};
