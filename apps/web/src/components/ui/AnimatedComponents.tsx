'use client';

import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  hover: {
    boxShadow: '0 0 30px rgba(212, 175, 55, 0.5), 0 0 50px rgba(212, 175, 55, 0.3)',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

export const AnimatedCard = ({
  children,
  className = '',
  delay = 0,
}: AnimatedCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={delay}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerRevealProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const StaggerReveal = ({
  children,
  staggerDelay = 0.1,
  className = '',
}: StaggerRevealProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={staggerDelay}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const StaggerItem = ({ children, className = '' }: StaggerItemProps) => {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

interface GlowTextProps {
  children: ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  animate?: boolean;
}

const glowStyles = {
  low: 'text-shadow-[0_0_10px_rgba(212,175,55,0.3)]',
  medium: 'text-shadow-[0_0_20px_rgba(212,175,55,0.5)]',
  high: 'text-shadow-[0_0_30px_rgba(212,175,55,0.7)]',
};

export const GlowText = ({
  children,
  intensity = 'medium',
  className = '',
  animate = false,
}: GlowTextProps) => {
  if (animate) {
    return (
      <motion.span
        className={`inline-block text-[#D4AF37] ${glowStyles[intensity]} ${className}`}
        animate={{
          textShadow: [
            glowStyles[intensity],
            intensity === 'high'
              ? '0 0 40px rgba(212, 175, 55, 0.9)'
              : intensity === 'medium'
              ? '0 0 30px rgba(212, 175, 55, 0.7)'
              : '0 0 20px rgba(212, 175, 55, 0.5)',
            glowStyles[intensity],
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={`inline-block text-[#D4AF37] ${glowStyles[intensity]} ${className}`}>
      {children}
    </span>
  );
};

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const fadeInVariants: Variants = {
  hidden: (direction: string) => {
    const getInitialPosition = () => {
      switch (direction) {
        case 'up':
          return { y: 20 };
        case 'down':
          return { y: -20 };
        case 'left':
          return { x: 20 };
        case 'right':
          return { x: -20 };
        default:
          return {};
      }
    };

    return {
      opacity: 0,
      ...getInitialPosition(),
    };
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  direction = 'up',
}: FadeInProps) => {
  return (
    <motion.div
      custom={direction}
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      transition={{
        delay,
        duration,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
