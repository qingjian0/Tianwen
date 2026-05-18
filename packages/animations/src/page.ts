/**
 * 页面过渡动画
 */

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.6, ease: 'easeInOut' },
};

export const layoutTransition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};
