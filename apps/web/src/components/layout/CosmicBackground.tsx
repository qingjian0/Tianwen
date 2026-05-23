'use client';

import { useEffect, useState } from 'react';

// 固定的星位置，确保服务端和客户端一致
const fixedStars = [
  { id: 0, x: 22.15, y: 28.98, size: 1.32, delay: 0.02 },
  { id: 1, x: 64.94, y: 10.05, size: 1.71, delay: 2.65 },
  { id: 2, x: 39.47, y: 73.36, size: 2.81, delay: 2.57 },
  { id: 3, x: 74.75, y: 70.98, size: 1.52, delay: 0.64 },
  { id: 4, x: 8.60, y: 81.47, size: 1.87, delay: 2.85 },
  { id: 5, x: 27.19, y: 13.67, size: 2.78, delay: 0.08 },
  { id: 6, x: 51.75, y: 76.67, size: 1.21, delay: 1.45 },
  { id: 7, x: 43.39, y: 38.30, size: 1.80, delay: 0.65 },
  { id: 8, x: 0.28, y: 52.86, size: 2.39, delay: 1.85 },
  { id: 9, x: 67.29, y: 23.59, size: 1.06, delay: 2.79 },
  { id: 10, x: 39.53, y: 70.40, size: 1.21, delay: 0.17 },
  { id: 11, x: 53.49, y: 50.76, size: 1.16, delay: 0.99 },
  { id: 12, x: 13.69, y: 17.81, size: 2.41, delay: 2.23 },
  { id: 13, x: 98.12, y: 42.16, size: 1.03, delay: 1.62 },
  { id: 14, x: 44.57, y: 62.92, size: 1.45, delay: 0.37 },
  { id: 15, x: 16.36, y: 84.74, size: 1.53, delay: 0.14 },
  { id: 16, x: 39.29, y: 1.53, size: 2.34, delay: 2.12 },
  { id: 17, x: 29.55, y: 42.73, size: 2.51, delay: 2.84 },
  { id: 18, x: 48.23, y: 0.43, size: 1.06, delay: 2.66 },
  { id: 19, x: 48.20, y: 26.04, size: 2.10, delay: 0.85 },
];

const StarField = ({ count = 20 }: { count?: number }) => {
  // 使用固定数量的星星
  const displayStars = fixedStars.slice(0, Math.min(count, fixedStars.length));

  return (
    <>
      {displayStars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#D4AF37',
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </>
  );
};

export const CosmicBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-deep-space" />
      <StarField count={20} />
    </div>
  );
};