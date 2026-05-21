'use client';

import { motion } from 'framer-motion';

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
    <circle cx="50" cy="50" r="46" stroke="rgba(199,138,6,0.15)" strokeWidth="1" />
    <path
      d="M50 4 C75.4 4 96 24.6 96 50 C96 75.4 75.4 96 50 96 C24.6 96 4 75.4 4 50 C4 24.6 24.6 4 50 4 Z"
      fill="url(#taijiGrad)"
      opacity="0.35"
    />
    <defs>
      <radialGradient id="taijiGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="rgba(199,138,6,0.25)" />
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
        fill="rgba(199,138,6,0.4)"
      />
    </svg>
  </motion.div>
);

export const CosmicBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 ink-wash-bg" />

      <InkCloud delay={0} size={340} x="15%" y="20%" />
      <InkCloud delay={5} size={260} x="70%" y="60%" />
      <InkCloud delay={11} size={300} x="50%" y="75%" />
      <InkCloud delay={17} size={220} x="85%" y="25%" />

      <AuspiciousCloud delay={0} x="8%" y="12%" scale={1.2} />
      <AuspiciousCloud delay={7} x="65%" y="8%" scale={0.85} />
      <AuspiciousCloud delay={13} x="78%" y="68%" scale={1.1} />
      <AuspiciousCloud delay={19} x="25%" y="72%" scale={0.95} />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 180,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <BaguaSymbol className="w-[480px] h-[480px]" />
      </motion.div>

      <div className="absolute left-12 top-0 h-full w-px bg-gradient-to-b from-transparent via-ji-500/20 to-transparent" />
      <div className="absolute right-12 top-0 h-full w-px bg-gradient-to-b from-transparent via-ji-500/20 to-transparent" />

      <motion.div
        className="absolute top-16 left-24 w-40 h-px bg-gradient-to-r from-transparent via-ji-500/15 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute bottom-24 right-24 w-52 h-px bg-gradient-to-r from-transparent via-ji-500/15 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 2.5 }}
      />
    </div>
  );
};
