/**
 * 排盘页面
 * Phase 3: 完整排盘UI
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

// 八卦数据
const bagua = [
  { name: '乾', symbol: '☰', position: '西北', element: '金' },
  { name: '兑', symbol: '☱', position: '西', element: '金' },
  { name: '离', symbol: '☲', position: '南', element: '火' },
  { name: '震', symbol: '☳', position: '东', element: '木' },
  { name: '巽', symbol: '☴', position: '东南', element: '木' },
  { name: '坎', symbol: '☵', position: '北', element: '水' },
  { name: '艮', symbol: '☶', position: '东北', element: '土' },
  { name: '坤', symbol: '☷', position: '西南', element: '土' },
];

// 九宫格位置
const jiugongPositions = [
  { row: 0, col: 0, trigram: bagua[4] }, // 巽 - 东南
  { row: 0, col: 1, trigram: null, label: '离宫' }, // 南 - 中
  { row: 0, col: 2, trigram: bagua[2] }, // 离 - 南
  { row: 1, col: 0, trigram: bagua[0] }, // 乾 - 西北
  { row: 1, col: 1, trigram: null, label: '中宫' }, // 中
  { row: 1, col: 2, trigram: bagua[6] }, // 艮 - 东北
  { row: 2, col: 0, trigram: bagua[7] }, // 坤 - 西南
  { row: 2, col: 1, trigram: bagua[5] }, // 坎 - 北
  { row: 2, col: 2, trigram: bagua[3] }, // 震 - 东
];

// 六爻示例
const yaolines = [
  { line: '初爻', symbol: '⚊', type: '阳', moving: false },
  { line: '二爻', symbol: '⚋', type: '阴', moving: true },
  { line: '三爻', symbol: '⚊', type: '阳', moving: false },
  { line: '四爻', symbol: '⚊', type: '阳', moving: false },
  { line: '五爻', symbol: '⚋', type: '阴', moving: false },
  { line: '上爻', symbol: '⚊', type: '阳', moving: false },
];

// 时间信息
const currentTime = new Date();
const ganzhi = {
  year: '甲辰',
  month: '庚午',
  day: '丁亥',
  hour: '丙午',
};

// 排盘类型
type ChartType = 'meihua' | 'liuyao' | 'qimen' | 'bazi';

export default function ChartPage() {
  const [chartType, setChartType] = useState<ChartType>('meihua');

  // 渲染九宫八卦
  const renderJiugong = () => (
    <div className="aspect-square max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-2 h-full">
        {jiugongPositions.map((pos, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-3 bg-[#0a0a0f] border border-amber-500/10 rounded-lg"
          >
            {pos.trigram ? (
              <>
                <div className="text-4xl text-amber-400 mb-1">{pos.trigram.symbol}</div>
                <div className="text-sm text-white font-medium">{pos.trigram.name}</div>
                <div className="text-xs text-gray-500">{pos.trigram.position}</div>
                <div className="text-xs text-gray-600">{pos.trigram.element}</div>
              </>
            ) : (
              <div className="text-center">
                <div className="text-amber-500/50 text-2xl mb-1">●</div>
                <div className="text-xs text-gray-600">{pos.label}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染六爻
  const renderLiuyao = () => (
    <div className="max-w-md mx-auto space-y-3">
      {[...yaolines].reverse().map((yao, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-4 rounded-lg border ${
            yao.type === '阳' ? 'border-blue-500/20 bg-blue-500/5' : 'border-red-500/20 bg-red-500/5'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm w-12">{yao.line}</span>
            <span className={`text-4xl ${yao.type === '阳' ? 'text-blue-400' : 'text-red-400'}`}>
              {yao.symbol}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${yao.type === '阳' ? 'text-blue-400' : 'text-red-400'}`}>
              {yao.type}
            </span>
            {yao.moving && (
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">
                动
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // 渲染梅花卦
  const renderMeihua = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center items-center gap-12">
        <div className="text-center">
          <div className="text-6xl text-amber-400 mb-2">☰</div>
          <div className="text-white font-serif text-lg">本卦·乾</div>
          <div className="text-gray-500 text-sm">体</div>
        </div>
        <div className="text-amber-500/30 text-4xl">→</div>
        <div className="text-center">
          <div className="text-6xl text-amber-400 mb-2">☶</div>
          <div className="text-white font-serif text-lg">变卦·艮</div>
          <div className="text-gray-500 text-sm">用</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-gray-500 text-sm">互卦·渐</div>
        <div className="text-4xl text-gray-600 mt-1">☴ ☵</div>
      </div>
    </div>
  );

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
          排盘
        </motion.h1>
        <motion.p
          {...fadeInUp}
          className="text-gray-400 mb-8"
        >
          仰观天文，俯察地理
        </motion.p>

        {/* 排盘类型选择 */}
        <motion.div
          {...fadeInUp}
          className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6 mb-6"
        >
          <label className="block text-sm text-gray-400 mb-4">选择排盘</label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'meihua', name: '梅花卦', desc: '观物取象' },
              { id: 'liuyao', name: '六爻', desc: '纳甲筮法' },
              { id: 'qimen', name: '奇门', desc: '九宫遁甲' },
              { id: 'bazi', name: '八字', desc: '四柱命理' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id as ChartType)}
                className={`px-5 py-3 rounded-lg border transition-all duration-300 ${
                  chartType === type.id
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="font-medium">{type.name}</div>
                <div className="text-xs opacity-60">{type.desc}</div>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 主排盘区 */}
          <motion.div
            {...fadeInUp}
            className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6 lg:col-span-2"
          >
            <h2 className="text-xl font-serif text-white mb-6">
              {chartType === 'meihua' && '梅花卦'}
              {chartType === 'liuyao' && '六爻盘'}
              {chartType === 'qimen' && '奇门遁甲'}
              {chartType === 'bazi' && '四柱八字'}
            </h2>

            {chartType === 'meihua' && renderMeihua()}
            {chartType === 'liuyao' && renderLiuyao()}
            {chartType === 'qimen' && renderJiugong()}
            {chartType === 'bazi' && (
              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                {['年', '月', '日', '时'].map((position, idx) => (
                  <div key={position} className="text-center space-y-2">
                    <div className="text-gray-500 text-sm">{position}</div>
                    <div className="bg-[#0a0a0f] border border-amber-500/10 rounded-lg p-4">
                      <div className="text-2xl text-amber-400 font-serif">
                        {Object.values(ganzhi)[idx][0]}
                      </div>
                      <div className="text-sm text-gray-400">{Object.values(ganzhi)[idx][1]}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* 时间信息 */}
          <motion.div
            {...fadeInUp}
            className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-serif text-white mb-4">时间干支</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">年柱</span>
                <span className="text-amber-400 font-serif text-lg">{ganzhi.year}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">月柱</span>
                <span className="text-amber-400 font-serif text-lg">{ganzhi.month}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">日柱</span>
                <span className="text-amber-400 font-serif text-lg">{ganzhi.day}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">时柱</span>
                <span className="text-amber-400 font-serif text-lg">{ganzhi.hour}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-center text-gray-500 text-sm">
              {currentTime.toLocaleString('zh-CN')}
            </div>
          </motion.div>

          {/* 八卦基础信息 */}
          <motion.div
            {...fadeInUp}
            className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-serif text-white mb-4">八卦基础</h2>
            <div className="grid grid-cols-4 gap-3">
              {bagua.map((gua, index) => (
                <div
                  key={index}
                  className="text-center p-3 bg-[#0a0a0f] border border-amber-500/10 rounded-lg"
                >
                  <div className="text-3xl text-amber-400 mb-1">{gua.symbol}</div>
                  <div className="text-sm text-white">{gua.name}</div>
                  <div className="text-xs text-gray-600">{gua.element}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 时间轴 */}
          <motion.div
            {...fadeInUp}
            className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6 lg:col-span-2"
          >
            <h2 className="text-xl font-serif text-white mb-4">时间轴</h2>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/30 to-transparent"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { time: '初', title: '初始阶段', desc: '事情开端，元气初生' },
                  { time: '中', title: '发展过程', desc: '势之所趋，变化显现' },
                  { time: '末', title: '结果归宿', desc: '终有所成，吉凶昭显' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center relative"
                  >
                    <div className="w-3 h-3 bg-amber-500/50 rounded-full mx-auto mb-3 relative z-10"></div>
                    <div className="text-amber-400 font-serif mb-1">{item.time}</div>
                    <div className="text-white font-medium mb-1">{item.title}</div>
                    <div className="text-gray-500 text-sm">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
