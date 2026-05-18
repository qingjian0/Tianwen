/**
 * 排盘页面
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

export default function ChartPage() {
  return (
    <PageContainer>
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-serif text-amber-400 mb-6">排盘</h1>

        <div className="grid gap-6">
          <div className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
            <h2 className="text-xl font-serif text-white mb-4">九宫八卦</h2>
            <div className="aspect-square max-w-md mx-auto bg-[#0a0a0f] border border-amber-500/10 rounded-xl flex items-center justify-center">
              <span className="text-gray-500">排盘中...</span>
            </div>
          </div>

          <div className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
            <h2 className="text-xl font-serif text-white mb-4">时间干支</h2>
            <p className="text-gray-500">显示当前时空信息</p>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
