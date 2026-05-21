'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

const DIVINATION_SYSTEMS = [
  {
    id: 'meihua',
    name: '梅花易数',
    subtitle: '观梅占数 · 心易妙法',
    description: '以先天八卦为体，后天八卦为用，观物取象，触机成卦',
    icon: '☰',
    gradientFrom: 'from-ji-500',
    gradientTo: 'to-zhu-500',
    borderColor: 'border-ji-500/30',
    textColor: 'text-ji-400',
  },
  {
    id: 'liuyao',
    name: '六爻纳甲',
    subtitle: '火珠林法 · 金钱卦',
    description: '纳甲筮法，以钱代蓍，装卦安世，六亲六神',
    icon: '☷',
    gradientFrom: 'from-lan-500',
    gradientTo: 'to-yin-500',
    borderColor: 'border-lan-500/30',
    textColor: 'text-lan-400',
  },
  {
    id: 'bazi',
    name: '四柱命理',
    subtitle: '子平八字 · 穷通寿夭',
    description: '年日为主，月时为用，十神配置，五行盛衰',
    icon: '☯',
    gradientFrom: 'from-qing-500',
    gradientTo: 'to-lan-500',
    borderColor: 'border-qing-500/30',
    textColor: 'text-qing-400',
  },
  {
    id: 'qimen',
    name: '奇门遁甲',
    subtitle: '天盘地盘 · 三奇六仪',
    description: '帝王之学，九宫八卦，八门九星，隐显莫测',
    icon: '☲',
    gradientFrom: 'from-zhu-500',
    gradientTo: 'to-ji-500',
    borderColor: 'border-zhu-500/30',
    textColor: 'text-zhu-400',
  },
  {
    id: 'ziwei',
    name: '紫微斗数',
    subtitle: '南北斗星 · 命盘排布',
    description: '以星情为本，宫垣为用，四化飞星，吉凶昭然',
    icon: '◎',
    gradientFrom: 'from-yin-500',
    gradientTo: 'to-lan-500',
    borderColor: 'border-yin-500/30',
    textColor: 'text-yin-400',
  },
  {
    id: 'liuren',
    name: '大六壬',
    subtitle: '三传四课 · 天地盘',
    description: '七政三式之首，天垂象，圣人则之，克应如响',
    icon: '☴',
    gradientFrom: 'from-ji-600',
    gradientTo: 'to-qing-500',
    borderColor: 'border-ji-600/30',
    textColor: 'text-ji-500',
  },
  {
    id: 'xiaochengtu',
    name: '小成图',
    subtitle: '归藏易法 · 观象玩占',
    description: '以象为宗，数在其中，图成八卦，吉凶可见',
    icon: '☶',
    gradientFrom: 'from-mo-400',
    gradientTo: 'to-ji-500',
    borderColor: 'border-mo-400/30',
    textColor: 'text-mo-300',
  },
  {
    id: 'huangji',
    name: '皇极经世',
    subtitle: '元会运世 · 梅花数',
    description: '康节先生之学，天地万物之理，皆不出乎此',
    icon: '☵',
    gradientFrom: 'from-lan-600',
    gradientTo: 'to-yin-600',
    borderColor: 'border-lan-600/30',
    textColor: 'text-lan-500',
  },
  {
    id: 'cegui',
    name: '策轨数',
    subtitle: '太乙数 · 洞微数',
    description: '推往知来，定天下之吉凶，成天下之亹亹',
    icon: '☱',
    gradientFrom: 'from-zhu-600',
    gradientTo: 'to-ji-600',
    borderColor: 'border-zhu-600/30',
    textColor: 'text-zhu-500',
  },
  {
    id: 'huangli',
    name: '老黄历',
    subtitle: '万年历 · 择吉选时',
    description: '建除满平，定执破危，成收开闭，宜忌吉凶',
    icon: '📜',
    gradientFrom: 'from-ji-700',
    gradientTo: 'to-zhu-700',
    borderColor: 'border-ji-700/30',
    textColor: 'text-ji-600',
  },
];

const STATS = [
  { label: '术数系统', value: '10', icon: '☯' },
  { label: '推演次数', value: '∞', icon: '☰' },
  { label: '年历史', value: '5000+', icon: '📜' },
];

const CLASSICAL_QUOTES = [
  '《易》之为书也，广大悉备，有天道焉，有人道焉，有地道焉。',
  '仰以观于天文，俯以察于地理，是故知幽明之故。',
  '参伍以变，错综其数，通其变，遂成天地之文。',
];

const SealStamp = ({ text = '天问', className = '' }: { text?: string; className?: string }) => (
  <motion.div
    className={`relative inline-block ${className}`}
    initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
    animate={{ opacity: 1, scale: 1, rotate: -4 }}
    transition={{ duration: 0.6, delay: 1.2, type: 'spring' }}
  >
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-2 border-zhu-500/60 rounded-sm transform rotate-[-4deg]">
        <div className="absolute inset-1 border border-zhu-400/40 rounded-sm" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-kai text-3xl text-zhu-500 seal-stamp tracking-widest font-bold">
          {text}
        </span>
      </div>
    </div>
  </motion.div>
);

export default function HomePage() {
  const router = useRouter();
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % CLASSICAL_QUOTES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col px-8 py-12 max-w-7xl mx-auto w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="text-ji-500/60 text-sm tracking-[0.4em] uppercase">
              天 問 系 統
            </span>
          </motion.div>

          <div className="relative">
            <motion.h1
              className="text-5xl md:text-7xl font-song font-bold text-gradient-ji glow-ji mb-4 brush-stroke"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              天 問
            </motion.h1>
            <p className="text-xl md:text-2xl text-xuan-300 font-kai tracking-widest mb-6">
              究天人之际 · 通古今之变
            </p>

            <motion.div
              className="max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <motion.p
                key={currentQuote}
                className="text-xuan-400 font-kai text-lg leading-relaxed italic"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1 }}
              >
                {CLASSICAL_QUOTES[currentQuote]}
              </motion.p>
            </motion.div>

            <SealStamp />
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-8 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              className="text-center paper-border-thin bg-xuan-900/40 backdrop-blur-sm py-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + idx * 0.15 }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-song font-bold text-ji-400 mb-1">{stat.value}</div>
              <div className="text-xuan-400 text-sm tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ji-500/30 to-transparent" />
            <h2 className="text-xl font-kai text-xuan-300 tracking-[0.3em]">
              十 種 術 數
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-ji-500/30 to-transparent" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-12">
          {DIVINATION_SYSTEMS.map((system, idx) => (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 + idx * 0.08 }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
            >
              <Card
                className={`group cursor-pointer h-full paper-border bg-gradient-to-br from-xuan-900/70 via-mo-900/50 to-xuan-950/80 backdrop-blur-md border-2 ${system.borderColor} transition-all duration-300`}
                onClick={() => router.push(`/${system.id}`)}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className={`text-5xl mb-4 ${system.textColor} drop-shadow-glow-ji group-hover:scale-110 transition-transform duration-300`}>
                    {system.icon}
                  </div>
                  <h3 className="text-xl font-song font-bold text-xuan-100 mb-1 group-hover:text-ji-300 transition-colors">
                    {system.name}
                  </h3>
                  <p className="text-sm text-xuan-400 mb-4 font-kai">
                    {system.subtitle}
                  </p>
                  <p className="text-xs text-xuan-500 leading-relaxed flex-1">
                    {system.description}
                  </p>
                  <div className="mt-5 pt-4 border-t border-xuan-800/50">
                    <div className={`text-xs font-kai ${system.textColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      点击进入 →
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-ji-600 to-ji-700 hover:from-ji-500 hover:to-ji-600 text-xuan-950 font-song text-lg border-2 border-ji-500/50 shadow-glow-ji animate-glow-pulse-ji"
            onClick={() => router.push('/meihua')}
          >
            开始占卜
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="border border-xuan-700 bg-xuan-900/40 text-xuan-200 hover:bg-xuan-800/60 hover:text-ji-300 font-song"
          >
            了解更多
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <div className="inline-block px-8 py-3 border-t border-b border-ji-500/20">
            <p className="text-xuan-500 font-kai text-sm tracking-widest">
              君子居则观其象而玩其辞 · 动则观其变而玩其占
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
