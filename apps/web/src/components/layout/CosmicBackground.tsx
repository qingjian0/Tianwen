"use client";

export const CosmicBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 简洁的深色渐变背景 - 天府Agent风格 */}
      <div className="absolute inset-0 bg-gradient-deep-space" />
      {/* 极其细微的金色点缀 */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-imperial-gold-200 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-imperial-gold-300 blur-3xl" />
      </div>
    </div>
  );
};
