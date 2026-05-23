'use client';

import { useEffect, useState, useMemo } from 'react';

const ConstellationPattern = () => {
  const nodes = [
    { x: 20, y: 15, size: 3 },
    { x: 35, y: 25, size: 2 },
    { x: 50, y: 20, size: 3 },
    { x: 65, y: 30, size: 2 },
    { x: 80, y: 25, size: 3 },
    { x: 90, y: 40, size: 2 },
    { x: 85, y: 55, size: 3 },
    { x: 70, y: 65, size: 2 },
    { x: 55, y: 70, size: 3 },
    { x: 40, y: 60, size: 2 },
    { x: 25, y: 70, size: 3 },
    { x: 15, y: 55, size: 2 },
    { x: 10, y: 40, size: 3 },
    { x: 30, y: 45, size: 2 },
    { x: 60, y: 45, size: 2 },
    { x: 45, y: 35, size: 2 },
  ];

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
    [10, 11], [11, 12], [12, 0], [13, 14], [14, 15],
    [1, 15], [3, 14], [7, 13], [9, 15], [11, 13]
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full opacity-10 will-change-transform animate-drift-pattern"
      style={{ pointerEvents: 'none' }}
    >
      {connections.map(([start, end], idx) => (
        <line
          key={idx}
          x1={`${nodes[start].x}%`}
          y1={`${nodes[start].y}%`}
          x2={`${nodes[end].x}%`}
          y2={`${nodes[end].y}%`}
          stroke="var(--color-imperial-gold)"
          strokeWidth="0.15"
          opacity="0.6"
        />
      ))}
      {nodes.map((node, idx) => (
        <circle
          key={idx}
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r={`${node.size * 0.3}%`}
          fill="var(--color-imperial-gold)"
          opacity="0.8"
        />
      ))}
    </svg>
  );
};

const StarField = ({ count = 60 }: { count?: number }) => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
      }))
    );
  }, [count]);

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-twinkle will-change-opacity"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'var(--bg-layer4-star-color)',
            animationDelay: `${star.delay}s`,
            opacity: 0.6,
            boxShadow: '0 0 6px rgba(212, 175, 55, 0.5)',
          }}
        />
      ))}
    </>
  );
};

export const CosmicBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0 will-change-opacity"
        style={{
          background: `
            linear-gradient(180deg, var(--bg-layer1-purple) 0%, var(--bg-layer1-blue) 40%, var(--bg-layer1-ink) 100%)
          `,
        }}
      />

      <div
        className="absolute inset-0 opacity-30 will-change-opacity"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(74, 144, 217, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(138, 43, 226, 0.06) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(26, 26, 46, 0.5) 0%, transparent 60%)
          `,
        }}
      />

      {!isMobile && (
        <>
          <div
            className="absolute animate-aura-pulse will-change-transform-opacity"
            style={{
              top: '50%',
              left: '50%',
              width: '800px',
              height: '800px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, var(--bg-layer2-aura) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div className="absolute inset-0">
            <ConstellationPattern />
          </div>
        </>
      )}

      <StarField count={isMobile ? 20 : 60} />
    </div>
  );
};
