'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="mb-8">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cosmic-gold to-yellow-400 bg-clip-text text-transparent glow-gold mb-2">
              天问
            </h1>
          </motion.div>
          <p className="text-xl text-gray-400 tracking-widest">TIANWEN</p>
        </div>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
          东方时空认知操作系统<br />
          探索时间与命运的奥秘
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/meihua">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-8 bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30 rounded-2xl backdrop-blur-sm cursor-pointer"
            >
              <div className="text-3xl mb-3">☯️</div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">梅花易数</h3>
              <p className="text-gray-400 text-sm">以数起卦，观象玩辞</p>
            </motion.div>
          </Link>

          <div className="p-8 bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-2xl backdrop-blur-sm opacity-50 cursor-not-allowed">
            <div className="text-3xl mb-3">🔮</div>
            <h3 className="text-xl font-semibold text-blue-300 mb-2">六爻纳甲</h3>
            <p className="text-gray-400 text-sm">即将上线</p>
          </div>

          <div className="p-8 bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-700/30 rounded-2xl backdrop-blur-sm opacity-50 cursor-not-allowed">
            <div className="text-3xl mb-3">🌀</div>
            <h3 className="text-xl font-semibold text-amber-300 mb-2">奇门遁甲</h3>
            <p className="text-gray-400 text-sm">即将上线</p>
          </div>
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16 text-gray-500"
        >
          <p className="text-sm">溯洄从之，道阻且长 · 探索东方智慧的现代诠释</p>
        </motion.div>
      </motion.div>
    </main>
  );
}
