'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MeihuaEngine } from '@tianwen/meihua';

export default function MeihuaPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const engine = new MeihuaEngine();

  const handleTimeDivination = () => {
    setLoading(true);
    setTimeout(() => {
      const res = engine.divinateByTime();
      setResult(res);
      setLoading(false);
    }, 500);
  };

  const handleRandomDivination = () => {
    setLoading(true);
    setTimeout(() => {
      const res = engine.divinateByRandom();
      setResult(res);
      setLoading(false);
    }, 500);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2">
          ← 返回天问殿
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            梅花易数
          </h1>
          <p className="text-gray-400">以数起卦 · 观象玩辞</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTimeDivination}
            disabled={loading}
            className="p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/40 rounded-xl hover:border-purple-500/60 transition-all disabled:opacity-50"
          >
            <div className="text-2xl mb-2">⏰</div>
            <h3 className="text-lg font-semibold text-purple-300">时间起卦</h3>
            <p className="text-gray-400 text-sm mt-1">以年月日时起卦</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRandomDivination}
            disabled={loading}
            className="p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/40 rounded-xl hover:border-blue-500/60 transition-all disabled:opacity-50"
          >
            <div className="text-2xl mb-2">🎲</div>
            <h3 className="text-lg font-semibold text-blue-300">随机起卦</h3>
            <p className="text-gray-400 text-sm mt-1">随机生成卦象</p>
          </motion.button>
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block animate-spin text-4xl mb-4">☯️</div>
            <p className="text-gray-400">推演中...</p>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-gray-700/40 rounded-2xl">
              <h2 className="text-xl font-semibold text-cosmic-gold mb-4">推演结果</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-700/30">
                  <h3 className="text-purple-300 text-sm mb-2">本卦</h3>
                  <div className="text-2xl font-bold">{result.benGua.name}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    {result.benGua.yao.map((y: any, i: number) => (
                      <span key={i} className={y.isChanging ? 'text-yellow-400' : ''}>
                        {y.type === 'yang' ? '━' : '━ ━'}
                      </span>
                    ))}
                  </div>
                </div>

                {result.huGua && (
                  <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
                    <h3 className="text-blue-300 text-sm mb-2">互卦</h3>
                    <div className="text-2xl font-bold">{result.huGua.name}</div>
                  </div>
                )}

                {result.bianGua && (
                  <div className="p-4 bg-green-900/20 rounded-lg border border-green-700/30">
                    <h3 className="text-green-300 text-sm mb-2">变卦</h3>
                    <div className="text-2xl font-bold">{result.bianGua.name}</div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600/30">
                <h3 className="text-gray-300 text-sm mb-3">体用关系</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">体卦：</span>
                    <span className="text-cosmic-gold font-semibold">{result.tiYong.ti}</span>
                    <span className="text-gray-500 ml-2">({result.tiYong.tiWuxing})</span>
                  </div>
                  <div>
                    <span className="text-gray-400">用卦：</span>
                    <span className="text-cosmic-gold font-semibold">{result.tiYong.yong}</span>
                    <span className="text-gray-500 ml-2">({result.tiYong.yongWuxing})</span>
                  </div>
                </div>
              </div>

              {result.interpretation && (
                <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/20">
                  <h3 className="text-gray-300 text-sm mb-2">简释</h3>
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm">{result.interpretation}</pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
