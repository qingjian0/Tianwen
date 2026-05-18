/**
 * 推演页面
 * Phase 2: UI骨架
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-6xl mx-auto">{children}</div>
);

const systems = ['梅花易数', '六爻', '奇门遁甲', '八字'];

export default function PredictionPage() {
  const [question, setQuestion] = useState('');
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);

  return (
    <PageContainer>
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-serif text-amber-400 mb-6">推演</h1>

        <div className="grid gap-6 max-w-2xl">
          {/* 输入区 */}
          <div className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
            <label className="block text-sm text-gray-400 mb-2">请起一念</label>
            <textarea
              className="w-full bg-[#0a0a0f] border border-amber-500/10 rounded-lg p-4 text-white focus:border-amber-500/50 focus:outline-none resize-none"
              rows={4}
              placeholder="心中所想..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* 术数选择 */}
          <div className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
            <label className="block text-sm text-gray-400 mb-4">选择术数</label>
            <div className="flex flex-wrap gap-3">
              {systems.map((system) => (
                <button
                  key={system}
                  onClick={() => {
                    setSelectedSystems((prev) =>
                      prev.includes(system)
                        ? prev.filter((s) => s !== system)
                        : [...prev, system]
                    );
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedSystems.includes(system)
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {system}
                </button>
              ))}
            </div>
          </div>

          {/* 按钮 */}
          <button
            disabled={!question || selectedSystems.length === 0}
            className="w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 py-4 rounded-xl font-serif tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            启·演
          </button>

          {/* 结果区 */}
          <div className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
            <h2 className="text-xl font-serif text-white mb-4">推演结果</h2>
            <p className="text-gray-500">等待起念...</p>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
