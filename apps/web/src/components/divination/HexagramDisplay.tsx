'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

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

  const hexagram = HEXAGRAMS[Math.floor(Math.random() * HEXAGRAMS.length)];

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
      <div className="bg-bg-card border border-border rounded-sm p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-song text-lg font-bold text-text-primary">卦象</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-kai">第{hexagram.number}卦</span>
            <span className="text-gold font-song font-bold text-xl">{hexagram.name}</span>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="flex flex-col-reverse gap-1.5 p-4 bg-bg-medium rounded-sm border border-border">
              {lines.map((line) => (
                <motion.div
                  key={line.number}
                  className="relative"
                  onMouseEnter={() => setHoveredLine(line.number)}
                  onMouseLeave={() => setHoveredLine(null)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className={`h-8 flex items-center justify-center rounded-sm transition-all duration-200 ${
                      line.isChanging
                        ? 'bg-primary/20 border border-primary'
                        : 'bg-bg-dark'
                    }`}
                  >
                    {line.isYang ? (
                      <div className="flex gap-2">
                        <div className={`w-16 h-2 rounded-sm ${line.isChanging ? 'bg-primary' : 'bg-gold'}`} />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className={`w-7 h-2 rounded-sm ${line.isChanging ? 'bg-primary' : 'bg-gold'}`} />
                        <div className={`w-7 h-2 rounded-sm ${line.isChanging ? 'bg-primary' : 'bg-gold'}`} />
                      </div>
                    )}
                  </div>
                  <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs text-text-muted font-kai">
                    {line.isYang ? '九' : '六'}{line.number}
                  </span>
                  {line.isChanging && (
                    <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-xs text-primary font-kai">
                      变
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-gold/50" />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-3xl mb-1">{upper.symbol}</div>
            <div className="text-sm font-kai text-text-secondary">{upper.name}</div>
            <div className="text-xs text-text-muted">{upper.element}</div>
          </div>
          <div className="text-text-muted">☯</div>
          <div className="text-center">
            <div className="text-3xl mb-1">{lower.symbol}</div>
            <div className="text-sm font-kai text-text-secondary">{lower.name}</div>
            <div className="text-xs text-text-muted">{lower.element}</div>
          </div>
        </div>

        {changingLine && (
          <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-sm">
            <div className="text-sm font-kai text-primary-light mb-2">动爻 · 第{changingLine}爻</div>
            <div className="text-text-secondary text-sm">
              {LINE_TEXT[changingLine as keyof typeof LINE_TEXT][lines[6 - changingLine].isYang ? 'yang' : 'yin']}
            </div>
          </div>
        )}
      </div>

      <div className="bg-bg-card border border-border rounded-sm shadow-card overflow-hidden">
        <button
          onClick={() => setExpandedDetail(!expandedDetail)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-bg-medium transition-colors"
        >
          <span className="font-kai text-text-secondary">卦辞解读</span>
          <motion.span
            animate={{ rotate: expandedDetail ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.span>
        </button>
        {expandedDetail && (
          <div className="px-5 pb-5">
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
          </div>
        )}
      </div>

      <div className="bg-bg-card border border-border rounded-sm p-5 shadow-card">
        <h3 className="font-song text-lg font-bold text-text-primary mb-4">五行关系</h3>
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
              
              <circle cx="100" cy="20" r="15" fill="#22C55E" className="opacity-60" />
              <text x="100" y="26" textAnchor="middle" className="text-xs fill-text-secondary" fontSize="10">木</text>
              
              <circle cx="170" cy="62" r="15" fill="#EF4444" className="opacity-60" />
              <text x="170" y="68" textAnchor="middle" className="text-xs fill-text-secondary" fontSize="10">火</text>
              
              <circle cx="170" cy="138" r="15" fill="#D4AF37" className="opacity-60" />
              <text x="170" y="144" textAnchor="middle" className="text-xs fill-text-secondary" fontSize="10">土</text>
              
              <circle cx="100" cy="180" r="15" fill="#3B82F6" className="opacity-60" />
              <text x="100" y="186" textAnchor="middle" className="text-xs fill-text-secondary" fontSize="10">水</text>
              
              <circle cx="30" cy="138" r="15" fill="#9CA3AF" className="opacity-60" />
              <text x="30" y="144" textAnchor="middle" className="text-xs fill-text-secondary" fontSize="10">金</text>
              
              <path d="M100 35 L155 57" stroke="#22C55E" strokeWidth="1" className="opacity-40" />
              <path d="M155 77 L155 123" stroke="#EF4444" strokeWidth="1" className="opacity-40" />
              <path d="M155 143 L115 165" stroke="#D4AF37" strokeWidth="1" className="opacity-40" />
              <path d="M85 165 L45 143" stroke="#3B82F6" strokeWidth="1" className="opacity-40" />
              <path d="M45 123 L45 77" stroke="#9CA3AF" strokeWidth="1" className="opacity-40" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-bg-medium border border-border rounded-sm text-text-secondary text-sm font-kai hover:bg-bg-light hover:text-text-primary transition-colors">
          导出 PDF
        </button>
        <button className="flex-1 px-4 py-2 bg-bg-medium border border-border rounded-sm text-text-secondary text-sm font-kai hover:bg-bg-light hover:text-text-primary transition-colors">
          保存记录
        </button>
      </div>
    </div>
  );
};
