/**
 * 推演页面
 * Phase 3: 完整推演界面
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// 动画预设
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
);

// 术数系统配置
const systems = [
  { id: 'meihua', name: '梅花易数', description: '观物取象，心易相合', defaultWeight: 1.0 },
  { id: 'liuyao', name: '六爻', description: '纳甲筮法，动变吉凶', defaultWeight: 1.0 },
  { id: 'qimen', name: '奇门遁甲', description: '天盘地盘，八门九星', defaultWeight: 1.2 },
  { id: 'bazi', name: '八字', description: '四柱干支，五行生克', defaultWeight: 1.1 },
];

// 推演模式
const modes = [
  { id: 'single', name: '单系统', description: '使用选定的术数独立推演' },
  { id: 'multi', name: '多系统', description: '各系统独立推演，结果对比' },
  { id: 'fusion', name: '融合', description: '多系统信号融合分析' },
];

// 时间范围
const timeRanges = [
  { id: 'short', name: '短期', days: 7, description: '一周内' },
  { id: 'medium', name: '中期', days: 30, description: '一月内' },
  { id: 'long', name: '长期', days: 90, description: '三月内' },
];

// 推演状态
type PredictionState = 'idle' | 'loading' | 'success' | 'error';

export default function PredictionPage() {
  const [question, setQuestion] = useState('');
  const [selectedSystems, setSelectedSystems] = useState<string[]>(['meihua']);
  const [selectedMode, setSelectedMode] = useState('fusion');
  const [selectedTimeRange, setSelectedTimeRange] = useState('medium');
  const [weights, setWeights] = useState<Record<string, number>>({
    meihua: 1.0,
    liuyao: 1.0,
    qimen: 1.2,
    bazi: 1.1,
  });
  const [state, setState] = useState<PredictionState>('idle');
  const [result, setResult] = useState<any>(null);

  // 切换术数选择
  const toggleSystem = (systemId: string) => {
    setSelectedSystems((prev) =>
      prev.includes(systemId)
        ? prev.length > 1 ? prev.filter((s) => s !== systemId) : prev
        : [...prev, systemId]
    );
  };

  // 更新权重
  const updateWeight = (systemId: string, weight: number) => {
    setWeights((prev) => ({
      ...prev,
      [systemId]: Math.max(0.1, Math.min(2.0, weight)),
    }));
  };

  // 执行推演
  const handlePredict = async () => {
    setState('loading');
    
    // 模拟推演过程
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // 模拟结果
    setResult({
      summary: '基于当前信号分析，整体趋势偏向积极。',
      probability: 72,
      fortune: '吉',
      keySignals: [
        { type: 'positive', content: '体用比和，局势有利', strength: 0.8 },
        { type: 'neutral', content: '变爻居中，需待时而动', strength: 0.5 },
      ],
      suggestions: [
        '把握当前有利时机，积极行动',
        '保持灵活应对的态度',
        '建议收集更多信息再做决策',
      ],
      risks: ['存在轻微不稳定因素'],
      opportunities: ['有积极信号指示'],
    });
    
    setState('success');
  };

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          {...fadeInUp}
          className="text-4xl font-serif text-amber-400 mb-2"
        >
          推演
        </motion.h1>
        <motion.p
          {...fadeInUp}
          className="text-gray-400 mb-8"
        >
          至诚之道，可以前知
        </motion.p>

        <div className="grid gap-6 max-w-4xl">
          <motion.div {...fadeInUp} variants={stagger}>
            {/* 输入区 */}
            <motion.div
              variants={fadeInUp}
              className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
            >
              <label className="block text-sm text-gray-400 mb-2">请起一念</label>
              <textarea
                className="w-full bg-[#0a0a0f] border border-amber-500/10 rounded-lg p-4 text-white focus:border-amber-500/50 focus:outline-none resize-none transition-all"
                rows={4}
                placeholder="心中所想，一事一问..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </motion.div>

            {/* 推演模式 */}
            <motion.div
              variants={fadeInUp}
              className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
            >
              <label className="block text-sm text-gray-400 mb-4">推演模式</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                      selectedMode === mode.id
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-medium mb-1">{mode.name}</div>
                    <div className="text-xs opacity-70">{mode.description}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 术数选择与权重 */}
            <motion.div
              variants={fadeInUp}
              className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
            >
              <label className="block text-sm text-gray-400 mb-4">选择术数与权重</label>
              <div className="space-y-4">
                {systems.map((system) => (
                  <div key={system.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleSystem(system.id)}
                        className={`flex-1 flex items-center p-3 rounded-lg border text-left transition-all duration-300 ${
                          selectedSystems.includes(system.id)
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-white/5 border-white/10 opacity-50'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-white">{system.name}</div>
                          <div className="text-xs text-gray-500">{system.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-amber-400 text-sm">权重: {weights[system.id].toFixed(1)}</div>
                        </div>
                      </button>
                    </div>
                    {selectedSystems.includes(system.id) && (
                      <div className="pl-4">
                        <input
                          type="range"
                          min="0.1"
                          max="2.0"
                          step="0.1"
                          value={weights[system.id]}
                          onChange={(e) => updateWeight(system.id, parseFloat(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 时间范围 */}
            <motion.div
              variants={fadeInUp}
              className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
            >
              <label className="block text-sm text-gray-400 mb-4">时间范围</label>
              <div className="flex flex-wrap gap-3">
                {timeRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedTimeRange(range.id)}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                      selectedTimeRange === range.id
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {range.name}
                    <span className="ml-1 text-xs opacity-60">({range.description})</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 推演按钮 */}
            <motion.button
              variants={fadeInUp}
              onClick={handlePredict}
              disabled={!question.trim() || selectedSystems.length === 0 || state === 'loading'}
              className="w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 py-5 rounded-xl font-serif tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state === 'loading' ? '推演中...' : '启·演'}
            </motion.button>

            {/* 结果区 */}
            {state !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
              >
                <h2 className="text-xl font-serif text-white mb-6">推演结果</h2>
                
                {state === 'loading' ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">正在推演...</p>
                  </div>
                ) : state === 'success' && result ? (
                  <div className="space-y-6">
                    {/* 吉凶与概率 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-4xl font-serif text-amber-400 mb-1">{result.fortune}</div>
                        <div className="text-sm text-gray-500">吉凶</div>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-4xl font-serif text-blue-400 mb-1">{result.probability}%</div>
                        <div className="text-sm text-gray-500">成功概率</div>
                      </div>
                    </div>

                    {/* 摘要 */}
                    <div>
                      <h3 className="text-sm text-gray-400 mb-2">摘要</h3>
                      <p className="text-white">{result.summary}</p>
                    </div>

                    {/* 关键信号 */}
                    <div>
                      <h3 className="text-sm text-gray-400 mb-3">关键信号</h3>
                      <div className="space-y-2">
                        {result.keySignals.map((signal: any, index: number) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              signal.type === 'positive'
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : signal.type === 'negative'
                                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                : 'bg-white/5 border-white/10 text-gray-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{signal.content}</span>
                              <span className="text-xs opacity-60">
                                强度: {Math.round(signal.strength * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 建议 */}
                    <div>
                      <h3 className="text-sm text-gray-400 mb-3">建议</h3>
                      <ul className="space-y-2">
                        {result.suggestions.map((suggestion: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-300"
                          >
                            <span className="text-amber-400 mt-1">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">推演失败，请重试</p>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
