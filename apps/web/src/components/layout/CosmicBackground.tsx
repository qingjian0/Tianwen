'use client';

import { motion } from 'framer-motion';

const NEBULA_ANIMATION = {
  duration: 25,
  repeat: Infinity,
  ease: 'easeInOut' as const,
};

const DOT_PULSE = {
  duration: 3,
  repeat: Infinity,
  ease: 'easeInOut' as const,
};

const dots = [
  { id: 1, x: 15, y: 18, size: 3 },
  { id: 2, x: 28, y: 20, size: 2 },
  { id: 3, x: 40, y: 14, size: 4 },
  { id: 4, x: 55, y: 17, size: 2 },
  { id: 5, x: 72, y: 22, size: 3 },
  { id: 6, x: 85, y: 20, size: 2 },
  { id: 7, x: 20, y: 38, size: 3 },
  { id: 8, x: 42, y: 42, size: 5 },
  { id: 9, x: 58, y: 40, size: 2 },
  { id: 10, x: 78, y: 36, size: 3 },
  { id: 11, x: 25, y: 62, size: 2 },
  { id: 12, x: 45, y: 68, size: 3 },
  { id: 13, x: 65, y: 65, size: 2 },
  { id: 14, x: 80, y: 58, size: 4 },
];

const connections = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  [7, 8], [8, 9], [9, 10],
  [11, 12], [12, 13], [13, 14],
  [2, 7], [3, 8], [8, 12], [5, 10],
];

function getDotById(id: number) {
  return dots.find((d) => d.id === id)!;
}

export const CosmicBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-900 to-ink-800" />

      <motion.div
        className="absolute -top-20 -left-20 w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-amber-500/[0.04] to-amber-600/[0.02] blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ ...NEBULA_ANIMATION, duration: 28 }}
      />

      <motion.div
        className="absolute -bottom-32 -right-16 w-[35vw] h-[35vw] rounded-full bg-gradient-to-tl from-indigo-500/[0.04] to-indigo-400/[0.02] blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, -18, 0] }}
        transition={{ ...NEBULA_ANIMATION, duration: 24 }}
      />

      <motion.div
        className="absolute top-1/4 left-1/3 w-[30vw] h-[20vw] rounded-full bg-gradient-to-b from-amber-400/[0.03] to-transparent blur-3xl"
        animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
        transition={{ ...NEBULA_ANIMATION, duration: 22 }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50% 50%' }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {connections.map(([from, to]) => {
            const a = getDotById(from);
            const b = getDotById(to);
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(202,138,4,0.08)"
                strokeWidth={0.15}
              />
            );
          })}
        </svg>

        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-gold-500/50"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ opacity: [0.15, 0.55, 0.15] }}
            transition={{ ...DOT_PULSE, delay: dot.id * 0.3 }}
          />
        ))}
      </motion.div>

      <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold-500/10 to-transparent" />
      <div className="absolute right-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold-500/10 to-transparent" />
    </div>
  );
};