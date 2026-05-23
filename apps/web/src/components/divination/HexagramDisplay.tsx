'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface HexagramDisplayProps {
  upperTrigram: number;
  lowerTrigram: number;
  changingLine: number;
}

const TRIGRAMS = [
  { name: '乾', symbol: '☰', element: '金', palace: '乾' },
  { name: '兑', symbol: '☱', element: '金', palace: '兑' },
  { name: '离', symbol: '☲', element: '火', palace: '离' },
  { name: '震', symbol: '☳', element: '木', palace: '震' },
  { name: '巽', symbol: '☴', element: '木', palace: '巽' },
  { name: '坎', symbol: '☵', element: '水', palace: '坎' },
  { name: '艮', symbol: '☶', element: '土', palace: '艮' },
  { name: '坤', symbol: '☷', element: '土', palace: '坤' },
];

const HEXAGRAMS = [
  { number: 1, name: '乾', upper: 0, lower: 0, description: '元亨利贞' },
  { number: 2, name: '坤', upper: 7, lower: 7, description: '元亨，利牝马之贞' },
  { number: 11, name: '泰', upper: 7, lower: 0, description: '小往大来，吉亨' },
  { number: 12, name: '否', upper: 0, lower: 7, description: '否之匪人，不利君子贞' },
  { number: 33, name: '遯', upper: 0, lower: 5, description: '亨，小利贞' },
  { number: 10, name: '履', upper: 0, lower: 1, description: '履虎尾，不咥人，亨' },
  { number: 3, name: '屯', upper: 5, lower: 3, description: '元亨利贞，勿用有攸往' },
  { number: 4, name: '蒙', upper: 6, lower: 5, description: '亨。匪我求童蒙，童蒙求我' },
];

const LINE_TEXT = {
  1: { yang: '初九：潜龙，勿用。', yin: '初六：履霜，坚冰至。' },
  2: { yang: '九二：见龙在田，利见大人。', yin: '六二：直方大，不习无不利。' },
  3: { yang: '九三：君子终日乾乾，夕惕若厉，无咎。', yin: '六三：含章可贞。或从王事，无成有终。' },
  4: { yang: '九四：或跃在渊，无咎。', yin: '六四：括囊，无咎无誉。' },
  5: { yang: '九五：飞龙在天，利见大人。', yin: '六五：黄裳，元吉。' },
  6: { yang: '上九：亢龙有悔。', yin: '上六：龙战于野，其血玄黄。' },
};

export const HexagramDisplay = ({ upperTrigram, lowerTrigram, changingLine }: HexagramDisplayProps) => {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [expandedDetail, setExpandedDetail] = useState(false);

  const upper = TRIGRAMS[upperTrigram];
  const lower = TRIGRAMS[lowerTrigram];

  const hexagram = HEXAGRAMS[0];

  const lines = [];
  for (let i = 5; i >= 0; i--) {
    const isUpper = i >= 3;
    const trigramIndex = isUpper ? upperTrigram : lowerTrigram;
    const lineInTrigram = isUpper ? i - 3 : i;
    const isYang = (trigramIndex >> (2 - lineInTrigram)) & 1;
    const lineNumber = 6 - i;
    const isChanging = lineNumber === changingLine;

    lines.push({
      number: lineNumber,
      isYang,
      isChanging,
      isUpper,
    });
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Card variant="default">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-song text-lg font-bold text-text-primary">卦象</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-kai">第{hexagram.number}卦</span>
              <span className="text-gold font-song font-bold text-xl">{hexagram.name}</span>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                className="flex flex-col-reverse gap-1.5 p-4 bg-bg-medium rounded-lg border border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {lines.map((line, idx) => (
                  <motion.div
                    key={line.number}
                    className="relative"
                    onMouseEnter={() => setHoveredLine(line.number)}
                    onMouseLeave={() => setHoveredLine(null)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: idx * 0.1,
                      duration: 0.5,
                      ease: 'easeOut'
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div
                      className={`h-8 flex items-center justify-center rounded-sm transition-all duration-200 will-change-transform ${
                        line.isChanging
                          ? 'bg-primary/20 border border-primary animate-fire-burn'
                          : 'bg-bg-dark'
                      }`}
                    >
                      {line.isYang ? (
                        <motion.div
                          className="flex gap-2"
                          animate={line.isChanging ? {
                            opacity: [1, 1.2, 1],
                          } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className={`w-16 h-2 rounded-sm will-change-transform-opacity ${line.isChanging ? 'bg-primary' : 'bg-gold'}`} />
                        </motion.div>
                      ) : (
                        <motion.div
                          className="flex gap-2"
                          animate={line.isChanging ? {
                            opacity: [1, 1.2, 1],
                          } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className={`w-7 h-2 rounded-sm will-change-transform-opacity ${line.isChanging ? 'bg-primary' : 'bg-gold'}`} />
                          <div className={`w-7 h-2 rounded-sm will-change-transform-opacity ${line.isChanging ? 'bg-primary' : 'bg-gold'}`} />
                        </motion.div>
                      )}
                    </div>
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs text-text-muted font-kai">
                      {line.isYang ? '九' : '六'}{line.number}
                    </span>
                    {line.isChanging && (
                      <motion.span
                        className="absolute -right-6 top-1/2 -translate-y-1/2 text-xs text-primary font-kai font-bold"
                        animate={{
                          opacity: [0.7, 1, 0.7],
                          textShadow: [
                            '0 0 5px rgba(212, 175, 55, 0.3)',
                            '0 0 15px rgba(212, 175, 55, 0.6)',
                            '0 0 5px rgba(212, 175, 55, 0.3)',
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        变
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </motion.div>
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                  className="w-2 h-2 rounded-full bg-gold"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(212, 175, 55, 0.3)',
                      '0 0 20px rgba(212, 175, 55, 0.6)',
                      '0 0 10px rgba(212, 175, 55, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-8">
            <div className="text-center">
              <motion.div
                className="text-3xl mb-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {upper.symbol}
              </motion.div>
              <div className="text-sm font-kai text-text-secondary">{upper.name}</div>
              <div className="text-xs text-text-muted">{upper.element}</div>
            </div>
            <motion.div
              className="text-text-muted text-2xl flex items-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              ☯
            </motion.div>
            <div className="text-center">
              <motion.div
                className="text-3xl mb-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {lower.symbol}
              </motion.div>
              <div className="text-sm font-kai text-text-secondary">{lower.name}</div>
              <div className="text-xs text-text-muted">{lower.element}</div>
            </div>
          </div>

          {changingLine && changingLine >= 1 && changingLine <= 6 && (
            <motion.div
              className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm font-kai text-primary-light mb-2">动爻 · 第{changingLine}爻</div>
              <div className="text-text-secondary text-sm">
                {(() => {
                  const changingLineData = lines.find(l => l.number === changingLine);
                  if (!changingLineData) return '';
                  const lineText = LINE_TEXT[changingLine as keyof typeof LINE_TEXT];
                  return lineText[changingLineData.isYang ? 'yang' : 'yin'];
                })()}
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>

      <Card variant="default">
        <button
          onClick={() => setExpandedDetail(!expandedDetail)}
          className="w-full flex items-center justify-between text-left hover:text-gold transition-colors"
        >
          <span className="font-kai text-text-secondary">卦辞解读</span>
          <motion.span
            animate={{ rotate: expandedDetail ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-text-muted"
          >
            ▼
          </motion.span>
        </button>
        {expandedDetail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4"
          >
            <div className="text-text-primary font-song mb-4">{hexagram.description}</div>
            <div className="text-text-secondary text-sm leading-relaxed font-kai">
              <p className="mb-3">
                此卦象征{hexagram.name}，代表{upper.element}与{lower.element}的相互作用。
                {upper.element === lower.element ? '两气相通，吉庆之象。' : ''}
              </p>
              <p>
                体用关系：{upper.name}为体，{lower.name}为用。
                {upper.element === '金' && lower.element === '木' && '金克木，用克体，主事不成。'}
                {upper.element === '木' && lower.element === '土' && '木克土，体克用，事可成。'}
              </p>
            </div>
          </motion.div>
        )}
      </Card>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Card variant="default">
          <h3 className="font-song text-lg font-bold text-text-primary mb-4">五行关系</h3>
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <motion.circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border"
                  animate={{ strokeDashoffset: [502, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  strokeDasharray="502"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border"
                  animate={{ strokeDashoffset: [377, 0] }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: 'linear' }}
                  strokeDasharray="377"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border"
                  animate={{ strokeDashoffset: [251, 0] }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity, ease: 'linear' }}
                  strokeDasharray="251"
                />

                <motion.circle
                  cx="100"
                  cy="20"
                  r="15"
                  fill={upper.element === '木' ? '#228B22' : '#228B22'}
                  className={upper.element === '木' ? 'opacity-100' : 'opacity-40'}
                  animate={upper.element === '木' ? {
                    opacity: [1, 1.3, 1],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <text x="100" y="26" textAnchor="middle" className="text-xs fill-text-secondary" fontSize="10">木</text>

                <motion.circle
                  cx="170"
                  cy="62"
                  r="15"
                  fill={upper.element === '火' || lower.element === '火' ? '#DC143C' : '#DC143C'}
                  className={upper.element === '火' || lower.element === '火' ? 'opacity-100' : 'opacity-40'}
                  animate={upper.element === '火' || lower.element === '火' ? {
                    opacity: [1, 1.3, 1],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <text x="170" y="68" textAnchor="middle" className="text-xs fill-text-secondary" fontSize="10">火</text>

                <motion.circle
                  cx="170"
                  cy="138"
                  r="15"
                  fill={upper.element === '土' || lower.element === '土' ? '#DAA520' : '#DAA520'}
                  className={upper.element === '土' || lower.element === '土' ? 'opacity-100' : 'opacity-40'}
                  animate={upper.element === '土' || lower.element === '土' ? {
                    opacity: [1, 1.3, 1],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <text x="170" y="144" textAnchor="middle" className="text-xs fill-text-secondary" fontSize="10">土</text>

                <motion.circle
                  cx="100"
                  cy="180"
                  r="15"
                  fill={upper.element === '水' || lower.element === '水' ? '#4169E1' : '#4169E1'}
                  className={upper.element === '水' || lower.element === '水' ? 'opacity-100' : 'opacity-40'}
                  animate={upper.element === '水' || lower.element === '水' ? {
                    opacity: [1, 1.3, 1],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <text x="100" y="186" textAnchor="middle" className="text-xs fill-text-secondary" fontSize="10">水</text>

                <motion.circle
                  cx="30"
                  cy="138"
                  r="15"
                  fill={upper.element === '金' || lower.element === '金' ? '#C0C0C0' : '#C0C0C0'}
                  className={upper.element === '金' || lower.element === '金' ? 'opacity-100' : 'opacity-40'}
                  animate={upper.element === '金' || lower.element === '金' ? {
                    opacity: [1, 1.3, 1],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <text x="30" y="144" textAnchor="middle" className="text-xs fill-text-secondary" fontSize="10">金</text>

                <motion.path
                  d="M100 35 L155 57"
                  stroke="#22C55E"
                  strokeWidth="2"
                  className="opacity-60"
                  animate={{ strokeDashoffset: [100, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  strokeDasharray="100"
                />
                <motion.path
                  d="M155 77 L155 123"
                  stroke="#DC143C"
                  strokeWidth="2"
                  className="opacity-60"
                  animate={{ strokeDashoffset: [100, 0] }}
                  transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }}
                  strokeDasharray="100"
                />
                <motion.path
                  d="M155 143 L115 165"
                  stroke="#DAA520"
                  strokeWidth="2"
                  className="opacity-60"
                  animate={{ strokeDashoffset: [100, 0] }}
                  transition={{ duration: 1.5, delay: 0.6, repeat: Infinity }}
                  strokeDasharray="100"
                />
                <motion.path
                  d="M85 165 L45 143"
                  stroke="#4169E1"
                  strokeWidth="2"
                  className="opacity-60"
                  animate={{ strokeDashoffset: [100, 0] }}
                  transition={{ duration: 1.5, delay: 0.9, repeat: Infinity }}
                  strokeDasharray="100"
                />
                <motion.path
                  d="M45 123 L45 77"
                  stroke="#C0C0C0"
                  strokeWidth="2"
                  className="opacity-60"
                  animate={{ strokeDashoffset: [100, 0] }}
                  transition={{ duration: 1.5, delay: 1.2, repeat: Infinity }}
                  strokeDasharray="100"
                />
              </svg>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1">
          导出 PDF
        </Button>
        <Button variant="primary" className="flex-1">
          保存记录
        </Button>
      </div>
    </div>
  );
};
