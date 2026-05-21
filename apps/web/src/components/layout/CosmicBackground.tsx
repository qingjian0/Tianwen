'use client';

import { motion } from 'framer-motion';

const PalaceRoof = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 400 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 120L60 40L100 80L140 30L180 70L220 25L260 65L300 35L340 75L380 45L400 120H0Z"
      fill="url(#roofGradient)"
      stroke="rgba(212, 175, 55, 0.6)"
      strokeWidth="2"
    />
    <path
      d="M100 80V120M180 70V120M260 65V120M340 75V120"
      stroke="rgba(212, 175, 55, 0.4)"
      strokeWidth="1"
    />
    <defs>
      <linearGradient id="roofGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(212, 175, 55, 0.15)" />
        <stop offset="100%" stopColor="rgba(212, 175, 55, 0.05)" />
      </linearGradient>
    </defs>
  </svg>
);

const AuspiciousCloud = ({ delay = 0, x = '10%', y = '15%', scale = 1 }: { delay?: number; x?: string; y?: string; scale?: number }) => (
  <motion.div
    className="absolute opacity-15"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -15, 0, 10, 0],
      opacity: [0.08, 0.18, 0.1],
    }}
    transition={{ duration: 22, repeat: Infinity, delay, ease: 'easeInOut' }}
  >
    <svg width={200 * scale} height={100 * scale} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100 90C60 90 30 70 30 50C30 30 55 20 85 22C65 5 85 0 105 10C120 18 115 38 135 42C165 48 180 68 165 82C155 90 125 95 100 90Z"
        fill="rgba(212, 175, 55, 0.5)"
      />
    </svg>
  </motion.div>
);

const DragonPattern = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M100 20 Q140 40 130 80 Q120 120 100 140 Q80 160 60 140 Q40 120 50 80 Q60 40 100 20"
      stroke="rgba(212, 175, 55, 0.12)"
      strokeWidth="1"
      fill="none"
    />
    <circle cx="100" cy="100" r="30" stroke="rgba(212, 175, 55, 0.08)" strokeWidth="1" />
    <circle cx="100" cy="100" r="20" stroke="rgba(212, 175, 55, 0.06)" strokeWidth="1" />
    <circle cx="100" cy="100" r="10" fill="rgba(212, 175, 55, 0.1)" />
  </svg>
);

const CelestialStars = () => {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
  }));

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
        <DragonPattern className="w-[500px] h-[500px]" />
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 right-0"
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      >
        <PalaceRoof className="w-full h-32" />
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
