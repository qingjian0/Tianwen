/**
 * 宇宙风格动画
 * 要求：缓慢、高级、克制
 */

export const float = {
  animate: {
    y: [0, -15, 0],
  },
  transition: {
    duration: 6,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

export const glow = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
  },
  transition: {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

export const cosmicRotate = {
  animate: {
    rotate: [0, 3, -3, 0],
  },
  transition: {
    duration: 8,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

export const starPulse = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.6, 1, 0.6],
  },
  transition: {
    duration: 2.5,
    ease: "easeInOut",
    repeat: Infinity,
  },
};
