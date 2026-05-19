/**
 * 骨架屏
 */

'use client';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  className?: string;
  width?: string;
  height?: string;
}

const variantDefaults: Record<
  NonNullable<SkeletonProps['variant']>,
  { width: string; height: string; className: string }
> = {
  text: { width: '100%', height: '1rem', className: 'h-4 rounded' },
  circle: { width: '2.5rem', height: '2.5rem', className: 'rounded-full' },
  rect: { width: '100%', height: '6rem', className: 'rounded-lg' },
};

export const Skeleton = ({
  variant = 'text',
  className = '',
  width,
  height,
}: SkeletonProps) => {
  const defaults = variantDefaults[variant];
  const w = width ?? defaults.width;
  const h = height ?? defaults.height;

  return (
    <div
      className={`bg-white/5 animate-pulse ${defaults.className} ${className}`}
      style={{ width: w, height: h }}
      aria-hidden="true"
    />
  );
};