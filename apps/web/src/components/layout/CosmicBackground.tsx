'use client';

export const CosmicBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-bg-secondary to-bg-tertiary" />
    </div>
  );
};
