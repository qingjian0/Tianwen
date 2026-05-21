'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MeihuaEngine } from '@tianwen/meihua';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function MeihuaPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [n1, setN1] = useState('');
  const [n2, setN2] = useState('');
  const [n3, setN3] = useState('');

  const engine = new MeihuaEngine();

  const handleTimeDivination = () => {
    setLoading(true);
    setTimeout(() => {
      const res = engine.divinateByTime();
      setResult(res);
      setLoading(false);
    }, 600);
  };

  const handleRandomDivination = () => {
    setLoading(true);
    setTimeout(() => {
      const res = engine.divinateByRandom();
      setResult(res);
      setLoading(false);
    }, 600);
  };

  const handleNumberDivination = () => {
    if (!n1 || !n2) return;
    setLoading(true);
    setTimeout(() => {
      const res = engine.divinateByNumber(
        parseInt(n1),
        parseInt(n2),
        n3 ? parseInt(n3) : undefined
      );
      setResult(res);
      setLoading(false);
    }, 600);
  };

  const renderYao = (y: any) => {
    if (y.isChanging) {
      return y.type === 'yang' ? '━ O ━' : '━ × ━';
    }
    return y.type === 'yang' ? '━━━━━━━' : '━ ━ ━━━';
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-gold-400 mb-8 inline-flex items-center gap-2 transition-colors">
          ← 返回天问殿
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">☰</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-3">
            梅花易数
          </h1>
          <p className="text-gray-400 tracking-wider">以数起卦 · 观象玩辞 · 体用相生</p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent mx-auto mt-6" />
        </motion.div>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Time Divination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card hover>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500/30 to-amber-700/30 flex items-center justify-center border border-gold-500/20">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <h3 className="text-lg font-serif text-gold-300 mb-1">时间起卦</h3>
                  <p className="text-xs text-gray-500">以年月日时数起卦</p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleTimeDivination}
                  disabled={loading}
                  className="w-full mt-2"
                >
                  起卦
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Random Divination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card hover>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-700/30 flex items-center justify-center border border-indigo-500/20">
                  <span className="text-2xl">🎲</span>
                </div>
                <div>
                  <h3 className="text-lg font-serif text-gold-300 mb-1">随机起卦</h3>
                  <p className="text-xs text-gray-500">随机生成卦象</p>
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleRandomDivination}
                  disabled={loading}
                  className="w-full mt-2"
                >
                  起卦
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Number Divination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card hover>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-jade-500/30 to-emerald-700/30 flex items-center justify-center border border-jade-500/20">
                  <span className="text-2xl">🔢</span>
                </div>
                <div>
                  <h3 className="text-lg font-serif text-gold-300 mb-1">数字起卦</h3>
                  <p className="text-xs text-gray-500">输入三个数字起卦</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="上"
                    value={n1}
                    onChange={(e) => setN1(e.target.value)}
                    className="w-full px-3 py-2 bg-ink-700/50 border border-gold-500/10 rounded-lg text-center text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/30"
                  />
                  <input
                    type="number"
                    placeholder="下"
                    value={n2}
                    onChange={(e) => setN2(e.target.value)}
                    className="w-full px-3 py-2 bg-ink-700/50 border border-gold-500/10 rounded-lg text-center text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/30"
                  />
                  <input
                    type="number"
                    placeholder="爻"
                    value={n3}
                    onChange={(e) => setN3(e.target.value)}
                    className="w-full px-3 py-2 bg-ink-700/50 border border-gold-500/10 rounded-lg text-center text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/30"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleNumberDivination}
                  disabled={loading || !n1 || !n2}
                  className="w-full"
                >
                  起卦
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block animate-spin text-5xl mb-4 text-gold-400">☯</div>
            <p className="text-gray-400 tracking-widest">推演中...</p>
          </motion.div>
        )}

        {/* Result */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card variant="highlight" className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif text-gold-400 flex items-center gap-3">
                  <span className="text-3xl">☰</span>
                  推演结果
                </h2>
                <div className="text-xs text-gray-600 tracking-widest">
                  {new Date().toLocaleString()}
                </div>
              </div>

              {/* Guas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Ben Gua */}
                <div className="p-6 bg-ink-800/60 rounded-xl border border-gold-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm text-gold-400 tracking-wider">本卦</h3>
                    <span className="text-xs text-gray-600">体</span>
                  </div>
                  <div className="text-2xl font-bold text-gold-300 mb-3">
                    {result.benGua.name}
                  </div>
                  <div className="space-y-1.5 text-center font-mono text-xl text-gray-300">
                    {[...result.benGua.yao].reverse().map((y: any, i: number) => (
                      <div key={i} className={y.isChanging ? 'text-gold-400' : ''}>
                        {renderYao(y)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hu Gua */}
                {result.huGua && (
                  <div className="p-6 bg-ink-800/60 rounded-xl border border-indigo-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm text-indigo-400 tracking-wider">互卦</h3>
                      <span className="text-xs text-gray-600">辅</span>
                    </div>
                    <div className="text-2xl font-bold text-indigo-300 mb-3">
                      {result.huGua.name}
                    </div>
                  </div>
                )}

                {/* Bian Gua */}
                {result.bianGua && (
                  <div className="p-6 bg-ink-800/60 rounded-xl border border-jade-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm text-jade-400 tracking-wider">变卦</h3>
                      <span className="text-xs text-gray-600">用</span>
                    </div>
                    <div className="text-2xl font-bold text-jade-300 mb-3">
                      {result.bianGua.name}
                    </div>
                  </div>
                )}
              </div>

              {/* Ti Yong */}
              <div className="p-6 bg-ink-800/40 rounded-lg border border-gold-500/5 mb-6">
                <h3 className="text-sm text-gray-400 tracking-wider mb-4">体用关系</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">体卦</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gold-400">{result.tiYong.ti}</span>
                      <span className="text-sm text-gray-500">({result.tiYong.tiWuxing})</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">用卦</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gold-400">{result.tiYong.yong}</span>
                      <span className="text-sm text-gray-500">({result.tiYong.yongWuxing})</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gold-500/5">
                  <div className="text-sm text-gray-400">
                    关系：
                    <span className="text-gold-300 font-medium ml-2">
                      {result.tiYong.relation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interpretation */}
              {result.interpretation && (
                <div className="p-6 bg-ink-800/30 rounded-lg border border-gold-500/5">
                  <h3 className="text-sm text-gray-400 tracking-wider mb-3">简释</h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.interpretation}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}
