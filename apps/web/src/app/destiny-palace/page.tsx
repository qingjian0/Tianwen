/**
 * 命宫页面
 * Phase 2: UI骨架
 */

'use client';

import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-6xl mx-auto">{children}</div>
);

export default function DestinyPalacePage() {
  return (
    <PageContainer>
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-serif text-amber-400 mb-6">命宫</h1>
        <p className="text-gray-400 mb-8">用户核心空间 - Phase 2 架构稳定中...</p>

        <div className="grid gap-6">
          <div className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
            <h2 className="text-xl font-serif text-white mb-4">个人命盘</h2>
            <p className="text-gray-500">功能开发中...</p>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
