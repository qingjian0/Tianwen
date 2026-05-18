'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// 临时定义动画
const float = {
  animate: {
    y: [0, -15, 0],
  },
  transition: {
    duration: 6,
    ease: 'easeInOut',
    repeat: Infinity,
  },
};

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-6xl mx-auto">{children}</div>
);

export default function TianWenDian() {
  return (
    <PageContainer>
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center"
        >
          {/* 天问标题 */}
          <div className="mb-12">
            <motion.div
              animate={float.animate}
              transition={float.transition}
              className="inline-block"
            >
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                天问
              </h1>
            </motion.div>
            <p className="text-xl text-gray-400 mt-4 tracking-[0.3em] font-serif">
              TIANWEN
            </p>
          </div>

          {/* 副标题 */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-serif text-gray-200 mb-2">
              AI 华夏术数推演操作系统
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              时间、命运、概率与 AI 的融合推演系统
            </p>
          </div>

          {/* 说明文字 */}
          <p className="text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed font-serif">
            遂古之初，谁传道之？上下未形，何由考之？
          </p>

          {/* 按钮区域 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/prediction">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-xl backdrop-blur-sm hover:border-amber-500/70 transition-all font-serif tracking-wider"
              >
                启·演
              </motion.button>
            </Link>

            <Link href="/destiny-palace">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-white/5 border border-white/10 text-gray-300 rounded-xl backdrop-blur-sm hover:border-white/20 transition-all font-serif tracking-wider"
              >
                命宫
              </motion.button>
            </Link>
          </div>

          {/* 底部装饰 */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-20 text-gray-600 text-sm font-serif"
          >
            <p>东方时空认知基础设施 · Phase 2</p>
          </motion.div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
