/**
 * 宇宙背景组件
 */

'use client';

import { motion } from 'framer-motion';

export const CosmicBackground = () => {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 星空背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]" />
      
      {/* 星星 */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white/60"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      {/* 星云光晕 */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-amber-500/5 to-transparent blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500/5 to-transparent blur-3xl" />
    </div>
  );
};
