'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DivinationForm } from '@/components/divination/DivinationForm';
import { HexagramDisplay } from '@/components/divination/HexagramDisplay';
import { Card } from '@/components/ui/Card';
import { AnimatedCard, StaggerReveal, StaggerItem, GlowText } from '@/components/ui/AnimatedComponents';

interface FormData {
  time: string;
  location: string;
  method: string;
  number1: string;
  number2: string;
  number3: string;
  advanced: {
    switchGeneral: string;
    zhongqi: boolean;
    dayNight: string;
    harmMethod: string;
  };
}

const systemCards = [
  { 
    id: 'liuren', 
    name: '大六壬', 
    icon: '☴', 
    desc: '三传四课，七政三式之首',
    color: 'gold'
  },
  { 
    id: 'meihua', 
    name: '梅花易数', 
    icon: '☰', 
    desc: '观梅占数，心易妙法',
    color: 'primary'
  },
  { 
    id: 'qimen', 
    name: '奇门遁甲', 
    icon: '☲', 
    desc: '九宫八卦，帝王之学',
    color: 'gold'
  },
  { 
    id: 'bazi', 
    name: '八字排盘', 
    icon: '☯', 
    desc: '四柱命理，子平之术',
    color: 'info'
  },
  { 
    id: 'fengshui', 
    name: '风水堪舆', 
    icon: '🗺', 
    desc: '地理风水，方位布局',
    color: 'success'
  },
];

export default function HomePage() {
  const [hexagram, setHexagram] = useState<{ upper: number; lower: number; changingLine: number } | null>(null);

  const handleSubmit = (data: FormData) => {
    const upper = parseInt(data.number1) % 8;
    const lower = parseInt(data.number2) % 8;
    const changingLine = parseInt(data.number3) || 0;
    
    setHexagram({
      upper: upper === 0 ? 7 : upper - 1,
      lower: lower === 0 ? 7 : lower - 1,
      changingLine,
    });
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="hidden md:block w-96 p-6 overflow-y-auto scrollbar-thin border-r border-border">
        <div className="mb-6">
          <h2 className="font-song text-xl font-bold text-text-primary mb-2">梅花易数</h2>
          <p className="text-sm text-text-muted font-kai">观梅占数 · 心易妙法</p>
        </div>
        <DivinationForm onSubmit={handleSubmit} />
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-thin">
        <div className="max-w-6xl mx-auto">
          <StaggerReveal staggerDelay={0.1}>
            <StaggerItem>
              <div className="text-center mb-6 md:mb-8">
                <motion.h1
                  className="font-song text-3xl md:text-5xl font-bold text-gradient-gold mb-3"
                  style={{
                    textShadow: '0 0 30px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.2)',
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  天问
                </motion.h1>
                <motion.p
                  className="text-text-secondary font-kai text-base md:text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  数字玄学美学
                </motion.p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="mb-6 md:mb-8">
                <h3 className="font-song text-base md:text-lg font-bold text-text-primary mb-4">术数系统</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                  {systemCards.map((card, idx) => (
                    <AnimatedCard key={card.id} delay={idx * 0.1}>
                      <Card
                        variant="highlight"
                        hover
                        className="h-full cursor-pointer"
                        onClick={() => window.location.href = `/${card.id}`}
                      >
                        <div className="text-center">
                          <div className={`text-3xl md:text-4xl mb-2 ${
                            card.color === 'gold' ? 'text-gold' : 
                            card.color === 'primary' ? 'text-primary' : 
                            card.color === 'info' ? 'text-info' : 
                            'text-success'
                          }`}>
                            {card.icon}
                          </div>
                          <h4 className="font-song font-bold text-text-primary text-sm md:text-base mb-1">{card.name}</h4>
                          <p className="text-xs text-text-muted hidden sm:block">{card.desc}</p>
                        </div>
                      </Card>
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  <Card variant="default">
                    <h3 className="font-song text-base md:text-lg font-bold text-text-primary mb-4">今日概览</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-bg-medium rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-text-muted text-sm font-kai">今日运势</span>
                          <span className="text-gold font-bold text-lg">良好</span>
                        </div>
                        <div className="h-2 bg-bg-dark rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '80%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                      <div className="bg-bg-medium rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-text-muted text-sm font-kai">本周占卜</span>
                          <span className="text-primary-light font-bold text-lg">3次</span>
                        </div>
                        <div className="flex gap-1">
                          {['大六壬', '梅花', '奇门'].map((item, idx) => (
                            <div key={idx} className="flex-1 text-xs text-center px-2 py-1 bg-bg-dark rounded-sm text-text-secondary font-kai">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card variant="default">
                    <h3 className="font-song text-base md:text-lg font-bold text-text-primary mb-4">热门工具</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: '快速起卦', icon: '⚡', color: 'primary' },
                        { name: '八字排盘', icon: '☯', color: 'gold' },
                        { name: '黄历查询', icon: '📅', color: 'success' },
                        { name: '姓名分析', icon: '✍️', color: 'info' },
                      ].map((item, idx) => (
                        <motion.button
                          key={idx}
                          className={`flex items-center gap-3 p-3 md:p-4 bg-bg-medium rounded-lg border border-border hover:border-gold/30 transition-all min-h-[48px] md:min-h-[56px] ${
                            item.color === 'primary' ? 'hover:bg-primary/10' : ''
                          } ${item.color === 'gold' ? 'hover:bg-gold/10' : ''} ${item.color === 'success' ? 'hover:bg-success/10' : ''} ${item.color === 'info' ? 'hover:bg-info/10' : ''}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-kai text-text-secondary text-sm md:text-base">{item.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  {hexagram ? (
                    <HexagramDisplay
                      upperTrigram={hexagram.upper}
                      lowerTrigram={hexagram.lower}
                      changingLine={hexagram.changingLine}
                    />
                  ) : (
                    <Card variant="default">
                      <div className="text-center py-8 md:py-12">
                        <motion.div
                          className="text-5xl md:text-6xl mb-4"
                          animate={{ 
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                        >
                          ☯
                        </motion.div>
                        <div className="text-text-secondary font-kai">选择起卦方式</div>
                        <div className="text-text-muted text-sm mt-2">开始您的占卜之旅</div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </div>

      <div className="hidden lg:block w-64 p-6 border-l border-border bg-bg-medium/50 overflow-y-auto scrollbar-thin">
        <h3 className="font-song text-lg font-bold text-text-primary mb-4">今日运势</h3>
        <div className="space-y-3">
          {['事业', '财运', '感情', '健康'].map((item, idx) => {
            const stars = [4, 5, 3, 4];
            const percentages = [85, 75, 80, 90];
            return (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-text-secondary font-kai">{item}</span>
                  <span className="text-xs text-text-muted">
                    {'⭐'.repeat(stars[idx])}
                  </span>
                </div>
                <div className="h-1.5 bg-bg-dark rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-gold' : idx === 2 ? 'bg-success' : 'bg-info'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentages[idx]}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <h3 className="font-song text-lg font-bold text-text-primary mb-4">今日宜忌</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-success font-bold">宜</span>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-success/10 border border-success/20 rounded text-xs text-success font-kai">祭祀</span>
                <span className="px-2 py-0.5 bg-success/10 border border-success/20 rounded text-xs text-success font-kai">祈福</span>
                <span className="px-2 py-0.5 bg-success/10 border border-success/20 rounded text-xs text-success font-kai">求嗣</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-danger font-bold">忌</span>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-danger/10 border border-danger/20 rounded text-xs text-danger font-kai">嫁娶</span>
                <span className="px-2 py-0.5 bg-danger/10 border border-danger/20 rounded text-xs text-danger font-kai">开市</span>
                <span className="px-2 py-0.5 bg-danger/10 border border-danger/20 rounded text-xs text-danger font-kai">动土</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-song text-lg font-bold text-text-primary mb-4">系统提示</h3>
          <div className="space-y-2">
            {[
              '今日宜静心思考',
              '下午运势较佳',
              '注意沟通方式',
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlowText intensity="low" className="text-primary-light text-sm">
                  •
                </GlowText>
                <span className="text-sm text-text-secondary font-kai">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
