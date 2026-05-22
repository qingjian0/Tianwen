'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useEffect, useState } from 'react';

const DIVINATION_SYSTEMS = [
  {
    id: 'meihua',
    name: '梅花易数',
    subtitle: '观梅占数',
    description: '以先天八卦为体，后天八卦为用',
    icon: '☰',
    color: 'gold',
  },
  {
    id: 'liuyao',
    name: '六爻纳甲',
    subtitle: '火珠林法',
    description: '纳甲筮法，以钱代蓍',
    icon: '☷',
    color: 'red',
  },
  {
    id: 'bazi',
    name: '四柱命理',
    subtitle: '子平八字',
    description: '年日为主，月时为用',
    icon: '☯',
    color: 'jade',
  },
  {
    id: 'qimen',
    name: '奇门遁甲',
    subtitle: '帝王之学',
    description: '九宫八卦，八门九星',
    icon: '☲',
    color: 'gold',
  },
  {
    id: 'ziwei',
    name: '紫微斗数',
    subtitle: '南北斗星',
    description: '四化飞星，吉凶昭然',
    icon: '◎',
    color: 'red',
  },
  {
    id: 'liuren',
    name: '大六壬',
    subtitle: '三传四课',
    description: '七政三式之首',
    icon: '☴',
    color: 'jade',
  },
  {
    id: 'xiaochengtu',
    name: '小成图',
    subtitle: '归藏易法',
    description: '观象玩占，吉凶可见',
    icon: '☶',
    color: 'gold',
  },
  {
    id: 'huangji',
    name: '皇极经世',
    subtitle: '元会运世',
    description: '康节先生之学',
    icon: '☵',
    color: 'red',
  },
  {
    id: 'cegui',
    name: '策轨数',
    subtitle: '太乙数',
    description: '推往知来，定天下吉凶',
    icon: '☱',
    color: 'jade',
  },
  {
    id: 'huangli',
    name: '老黄历',
    subtitle: '万年历',
    description: '择吉选时，宜忌吉凶',
    icon: '📜',
    color: 'gold',
  },
];

const CLASSICAL_QUOTES = [
  '《易》有太极，是生两仪，两仪生四象，四象生八卦。',
  '天行健，君子以自强不息；地势坤，君子以厚德载物。',
  '穷则变，变则通，通则久。',
];

const SealStamp = ({ text = '天府' }: { text?: string }) => (
  <motion.div
    className="relative inline-block"
    initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
    animate={{ opacity: 1, scale: 1, rotate: -3 }}
    transition={{ duration: 0.6, delay: 1.2, type: 'spring' }}
  >
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-2 border-vermillion-500/70 transform rotate-[-3deg]">
        <div className="absolute inset-2 border border-vermillion-400/40" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-kai text-4xl text-vermillion-500 font-bold tracking-widest">
          {text}
        </span>
      </div>
    </div>
  </motion.div>
);

const Pillar = ({ className = '' }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-imperial-gold/40 to-imperial-gold/20 rounded-t-sm" />
    <div className="h-full w-2 bg-gradient-to-r from-transparent via-imperial-gold/30 to-transparent" />
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-t from-imperial-gold/40 to-imperial-gold/20 rounded-b-sm" />
  </div>
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
      <div className="flex-1 flex flex-col px-8 py-16 max-w-6xl mx-auto w-full relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="text-imperial-gold/60 text-xs tracking-[0.5em] uppercase">
              TIANWEN SYSTEM
            </span>
          </motion.div>

          <div className="relative">
            <motion.h1
              className="text-6xl md:text-8xl font-song font-bold text-gradient-gold glow-gold mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              天 问
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-parchment/70 font-kai tracking-[0.3em] mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              究 天 人 之 际 · 通 古 今 之 变
            </motion.p>

            <motion.div
              className="max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <motion.p
                key={currentQuote}
                className="text-parchment/50 font-kai text-lg leading-relaxed italic"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
              >
                「{CLASSICAL_QUOTES[currentQuote]}」
              </motion.p>
            </motion.div>

            <SealStamp />
          </div>
        </motion.div>

        <div className="flex justify-center gap-4 mb-16">
          <Pillar className="h-32" />
          <Pillar className="h-40" />
          <Pillar className="h-32" />
        </div>

        <motion.div
          className="grid grid-cols-3 gap-12 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 border border-imperial-gold/30 flex items-center justify-center">
              <span className="text-3xl">☯</span>
            </div>
            <div className="text-3xl font-song font-bold text-imperial-gold mb-2">10</div>
            <div className="text-parchment/50 text-sm font-kai">术数系统</div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 border border-imperial-gold/30 flex items-center justify-center">
              <span className="text-3xl">☰</span>
            </div>
            <div className="text-3xl font-song font-bold text-imperial-gold mb-2">∞</div>
            <div className="text-parchment/50 text-sm font-kai">推演次数</div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 border border-imperial-gold/30 flex items-center justify-center">
              <span className="text-3xl">📜</span>
            </div>
            <div className="text-3xl font-song font-bold text-imperial-gold mb-2">5000+</div>
            <div className="text-parchment/50 text-sm font-kai">年历史</div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <div className="flex items-center gap-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-imperial-gold/30 to-transparent" />
            <h2 className="text-xl font-song text-parchment/70 tracking-[0.4em]">
              十 方 术 数
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-imperial-gold/30 to-transparent" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {DIVINATION_SYSTEMS.map((system, idx) => (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 + idx * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Card
                className={`group cursor-pointer h-full palace-border bg-gradient-to-br from-ink-dark/80 via-ink-medium/50 to-ink-dark/90 backdrop-blur-md transition-all duration-300 hover:shadow-gold-glow ${
                  system.color === 'gold' ? 'border-imperial-gold/20 hover:border-imperial-gold/40' : ''
                } ${
                  system.color === 'red' ? 'border-vermillion-500/20 hover:border-vermillion-500/40' : ''
                } ${
                  system.color === 'jade' ? 'border-jade-500/20 hover:border-jade-500/40' : ''
                }`}
                onClick={() => router.push(`/${system.id}`)}
              >
                <div className="p-5 flex flex-col h-full">
                  <div className={`text-4xl mb-3 ${
                    system.color === 'gold' ? 'text-imperial-gold' : ''
                  } ${system.color === 'red' ? 'text-vermillion-400' : ''} ${system.color === 'jade' ? 'text-jade-400' : ''}
                    group-hover:scale-110 transition-transform duration-300`}
                  >
                    {system.icon}
                  </div>
                  <h3 className="text-lg font-song font-bold text-parchment/90 mb-1 group-hover:text-imperial-gold transition-colors">
                    {system.name}
                  </h3>
                  <p className="text-xs text-parchment/40 font-kai mb-3">
                    {system.subtitle}
                  </p>
                  <p className="text-xs text-parchment/30 leading-relaxed flex-1">
                    {system.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-imperial-gold/10">
                    <span className={`text-xs font-kai opacity-0 group-hover:opacity-100 transition-opacity ${
                      system.color === 'gold' ? 'text-imperial-gold/70' : ''
                    } ${system.color === 'red' ? 'text-vermillion-400/70' : ''} ${system.color === 'jade' ? 'text-jade-400/70' : ''}`}>
                      进入 →
                    </span>
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
            className="bg-gradient-gold text-ink-black font-song text-lg border-2 border-imperial-gold/50 shadow-gold-glow animate-glow-pulse"
            onClick={() => router.push('/meihua')}
          >
            开 始 占 卜
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="border border-imperial-gold/30 bg-ink-dark/50 text-parchment/70 hover:bg-ink-medium/50 hover:text-imperial-gold font-song"
          >
            了 解 更 多
          </Button>
        </motion.div>

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <div className="inline-block px-10 py-4 border-t border-b border-imperial-gold/20">
            <p className="text-parchment/40 font-kai text-sm tracking-[0.3em]">
              君子居则观其象而玩其辞 · 动则观其变而玩其占
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
