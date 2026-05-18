'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TianWenDian() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* 星空背景效果 */}
      <div className="absolute inset-0 bg-cosmic-black">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center relative z-10"
      >
        {/* 天问标题 */}
        <div className="mb-12">
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-br from-cosmic-gold via-yellow-400 to-cosmic-gold bg-clip-text text-transparent glow-gold">
              天问
            </h1>
          </motion.div>
          <p className="text-xl text-gray-400 mt-4 tracking-[0.3em]">
            TIANWEN
          </p>
        </div>

        {/* 副标题 */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-200 mb-2">
            AI 华夏术数推演操作系统
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            时间、命运、概率与 AI 的融合推演系统
          </p>
        </div>

        {/* 说明文字 */}
        <p className="text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed">
          遂古之初，谁传道之？上下未形，何由考之？
        </p>

        {/* 按钮区域 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/meihua">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-gradient-to-r from-cosmic-gold/20 to-yellow-600/20 border border-cosmic-gold/40 text-cosmic-gold rounded-xl backdrop-blur-sm hover:border-cosmic-gold/70 transition-all font-semibold"
            >
              开始推演
            </motion.button>
          </Link>

          <button
            disabled
            className="px-10 py-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-600/30 text-gray-400 rounded-xl backdrop-blur-sm cursor-not-allowed font-semibold"
          >
            进入命宫
          </button>
        </div>

        {/* 底部装饰 */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-20 text-gray-600 text-sm"
        >
          <p>东方时空认知基础设施</p>
        </motion.div>
      </motion.div>
    </main>
  );
}
