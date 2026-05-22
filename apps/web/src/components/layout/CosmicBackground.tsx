'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const INK_CLOUD_ANIMATION = {
  duration: 35,
  repeat: Infinity,
  ease: 'easeInOut' as const,
};

const CLOUD_FLOAT = {
  duration: 22,
  repeat: Infinity,
  ease: 'easeInOut' as const,
};

const BaguaSymbol = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" stroke="rgba(212,175,55,0.15)" strokeWidth="1" />
    <path
      d="M50 4 C75.4 4 96 24.6 96 50 C96 75.4 75.4 96 50 96 C24.6 96 4 75.4 4 50 C4 24.6 24.6 4 50 4 Z"
      fill="url(#taijiGrad)"
      opacity="0.35"
    />
    <defs>
      <radialGradient id="taijiGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="rgba(212,175,55,0.25)" />
        <stop offset="100%" stopColor="rgba(8,7,6,0)" />
      </radialGradient>
    </defs>
  </svg>
);

const InkCloud = ({ delay = 0, size = 280, x = '30%', y = '25%' }: { delay?: number; size?: number; x?: string; y?: string }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      left: x,
      top: y,
      width: size,
      height: size * 0.7,
      background: 'radial-gradient(ellipse at center, rgba(8,7,6,0.5) 0%, transparent 70%)',
    }}
    animate={{
      x: [0, 40, 0, -30, 0],
      y: [0, -25, 30, 0],
      opacity: [0.35, 0.55, 0.3],
    }}
    transition={{
      ...INK_CLOUD_ANIMATION,
      delay,
    }}
  />
);

const AuspiciousCloud = ({ delay = 0, x = '10%', y = '15%', scale = 1 }: { delay?: number; x?: string; y?: string; scale?: number }) => (
  <motion.div
    className="absolute opacity-10"
    style={{
      left: x,
      top: y,
    }}
    animate={{
      y: [0, -18, 0, 12, 0],
      opacity: [0.06, 0.14, 0.08],
    }}
    transition={{
      ...CLOUD_FLOAT,
      delay,
    }}
  >
    <svg
      width={160 * scale}
      height={90 * scale}
      viewBox="0 0 160 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M80 85C55 85 35 72 35 55C35 38 50 28 70 30C55 15 70 5 85 15C95 22 92 38 105 40C125 43 135 58 125 70C118 78 100 85 80 85Z"
        fill="rgba(212,175,55,0.4)"
      />
    </svg>
  </motion.div>
);

const CelestialStars = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-imperial-gold/60"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: star.delay }}
        />
      ))}
    </>
  );
};

export const CosmicBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-celestial-blue-dark via-ink-black to-ink-dark" />
      
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(212, 175, 55, 0.12) 0%, transparent 40%),
                             radial-gradient(circle at 70% 80%, rgba(196, 30, 58, 0.08) 0%, transparent 35%),
                             radial-gradient(circle at 50% 50%, rgba(30, 58, 95, 0.15) 0%, transparent 50%)`
          }}
        />
      </div>

      <CelestialStars />

      <AuspiciousCloud delay={0} x="8%" y="10%" scale={1.3} />
      <AuspiciousCloud delay={7} x="65%" y="5%" scale={0.9} />
      <AuspiciousCloud delay={13} x="75%" y="70%" scale={1.1} />
      <AuspiciousCloud delay={19} x="20%" y="65%" scale={0.85} />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
      >
        <BaguaSymbol className="w-[500px] h-[500px]" />
      </motion.div>

      <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-imperial-gold/15 to-transparent" />
      <div className="absolute right-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-imperial-gold/15 to-transparent" />

      <motion.div
        className="absolute top-20 left-20 w-48 h-px bg-gradient-to-r from-transparent via-imperial-gold/20 to-transparent"
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute bottom-32 right-20 w-56 h-px bg-gradient-to-r from-transparent via-imperial-gold/20 to-transparent"
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2.5 }}
      />
    </div>
  );
};
