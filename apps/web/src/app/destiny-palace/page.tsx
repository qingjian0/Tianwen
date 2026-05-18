/**
 * 命宫页面
 * Phase 3: 完整命宫UI
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

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
);

// 当前运势数据
const currentFortune = {
  overall: '吉',
  score: 75,
  career: 80,
  wealth: 70,
  relationship: 65,
  health: 85,
  description: '本月运势良好，事业上有贵人相助，但感情方面需要多些耐心。',
};

// 系统状态
const systemStatus = {
  chronoEngine: '在线',
  meihuaEngine: '在线',
  liuyaoEngine: '在线',
  qimenEngine: '就绪',
  lastUpdate: new Date().toLocaleString('zh-CN'),
};

// 推演历史
const predictionHistory = [
  {
    id: '1',
    date: '2025-05-15',
    question: '项目能否顺利交付？',
    system: '梅花易数',
    result: '吉',
    probability: 80,
  },
  {
    id: '2',
    date: '2025-05-10',
    question: '是否应该接受这个offer？',
    system: '六爻',
    result: '中平',
    probability: 55,
  },
  {
    id: '3',
    date: '2025-05-05',
    question: '近期财运如何？',
    system: '八字',
    result: '吉',
    probability: 72,
  },
];

// 命运时间轴数据
const timelineData = [
  { period: '今年', keyPoint: '事业发展期', description: '工作上有新的机遇', fortune: '吉' },
  { period: '下半年', keyPoint: '财运好转', description: '投资理财宜谨慎', fortune: '中平' },
  { period: '明年', keyPoint: '感情机遇', description: '可能遇到正缘', fortune: '吉' },
];

// 运势卡片组件
const FortuneCard = ({ label, value, icon }: { label: string; value: number; icon?: string }) => (
  <div className="bg-[#0a0a0f] border border-amber-500/10 rounded-xl p-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-400 text-sm">{label}</span>
      {icon && <span className="text-amber-400">{icon}</span>}
    </div>
    <div className="text-3xl font-serif text-amber-400 mb-2">{value}</div>
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-amber-500/50 to-amber-400 rounded-full transition-all"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export default function DestinyPalacePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview');

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
          命宫
        </motion.h1>
        <motion.p
          {...fadeInUp}
          className="text-gray-400 mb-8"
        >
          知命而行，顺势而为
        </motion.p>

        {/* 标签导航 */}
        <motion.div
          {...fadeInUp}
          className="flex gap-2 mb-8"
        >
          {[
            { id: 'overview', label: '概览' },
            { id: 'history', label: '推演历史' },
            { id: 'settings', label: '设置' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-lg border transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* 概览标签页 */}
        {activeTab === 'overview' && (
          <div className="grid gap-6">
            {/* 当前运势概览 */}
            <motion.div
              {...fadeInUp}
              className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-serif text-white mb-2">当前运势</h2>
                  <p className="text-gray-500 text-sm">综合运势评分</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-serif text-amber-400 mb-1">{currentFortune.overall}</div>
                  <div className="text-amber-500/70">{currentFortune.score}分</div>
                </div>
              </div>

              <p className="text-gray-300 mb-6 bg-[#0a0a0f] border border-amber-500/10 rounded-lg p-4">
                {currentFortune.description}
              </p>

              {/* 各维度运势 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FortuneCard label="事业" value={currentFortune.career} icon="⚡" />
                <FortuneCard label="财运" value={currentFortune.wealth} icon="💰" />
                <FortuneCard label="感情" value={currentFortune.relationship} icon="💕" />
                <FortuneCard label="健康" value={currentFortune.health} icon="✨" />
              </div>
            </motion.div>

            {/* 命运时间轴 */}
            <motion.div
              {...fadeInUp}
              className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
            >
              <h2 className="text-xl font-serif text-white mb-6">命运时间轴</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 to-transparent"></div>
                <div className="space-y-6">
                  {timelineData.map((item, index) => (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      </div>
                      <div className="bg-[#0a0a0f] border border-amber-500/10 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-amber-400 font-medium">{item.period}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            item.fortune === '吉' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {item.fortune}
                          </span>
                        </div>
                        <div className="text-white font-medium mb-1">{item.keyPoint}</div>
                        <div className="text-gray-500 text-sm">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 系统状态 */}
            <motion.div
              {...fadeInUp}
              className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
            >
              <h2 className="text-xl font-serif text-white mb-6">系统状态</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.entries(systemStatus).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="bg-[#0a0a0f] border border-amber-500/10 rounded-lg p-4">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-white">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right text-gray-600 text-sm">
                最后更新：{systemStatus.lastUpdate}
              </div>
            </motion.div>
          </div>
        )}

        {/* 历史记录标签页 */}
        {activeTab === 'history' && (
          <motion.div
            {...fadeInUp}
            className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-serif text-white mb-6">推演历史</h2>
            <div className="space-y-3">
              {predictionHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-[#0a0a0f] border border-amber-500/10 rounded-lg hover:border-amber-500/20 transition-all"
                >
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1">{item.question}</div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">{item.date}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-amber-500/70">{item.system}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-lg font-serif ${
                        item.result === '吉' ? 'text-green-400' :
                        item.result === '凶' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {item.result}
                      </div>
                      <div className="text-gray-500 text-sm">{item.probability}%</div>
                    </div>
                    <button className="text-gray-500 hover:text-amber-400 transition-colors">
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 设置标签页 */}
        {activeTab === 'settings' && (
          <motion.div
            {...fadeInUp}
            className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-serif text-white mb-6">设置</h2>
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-gray-400 text-sm mb-2">默认排盘系统</label>
                <select className="w-full bg-[#0a0a0f] border border-amber-500/10 rounded-lg p-3 text-white focus:border-amber-500/50 focus:outline-none">
                  <option>梅花易数</option>
                  <option>六爻</option>
                  <option>奇门遁甲</option>
                  <option>八字</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">默认推演模式</label>
                <select className="w-full bg-[#0a0a0f] border border-amber-500/10 rounded-lg p-3 text-white focus:border-amber-500/50 focus:outline-none">
                  <option>多系统融合</option>
                  <option>单系统独立</option>
                  <option>系统对比</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">主题模式</label>
                <select className="w-full bg-[#0a0a0f] border border-amber-500/10 rounded-lg p-3 text-white focus:border-amber-500/50 focus:outline-none">
                  <option>深空黑</option>
                  <option>东方青</option>
                  <option>星空紫</option>
                </select>
              </div>
              <button className="w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 py-3 rounded-lg transition-all duration-300">
                保存设置
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </PageContainer>
  );
}
