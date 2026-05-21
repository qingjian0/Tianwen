'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const systems = [
  {
    icon: '☰',
    name: '梅花易数',
    description: '观象玩占，八卦推演',
    href: '/meihua',
    color: 'from-gold-600 to-amber-600',
  },
  {
    icon: '☷',
    name: '六爻纳甲',
    description: '六爻装卦，世应生克',
    href: '/prediction',
    color: 'from-indigo-600 to-indigo-800',
  },
  {
    icon: '☯',
    name: '八字命理',
    description: '四柱八字，大运流年',
    href: '/destiny-palace',
    color: 'from-vermillion-600 to-red-800',
  },
  {
    icon: '☲',
    name: '奇门遁甲',
    description: '九宫八门，时空推演',
    href: '/chart',
    color: 'from-jade-600 to-emerald-800',
  },
  {
    icon: '◎',
    name: '紫微斗数',
    description: '十二命宫，星曜布局',
    href: '/destiny-palace',
    color: 'from-purple-600 to-purple-800',
  },
  {
    icon: '☴',
    name: '大六壬',
    description: '月将加时，天地盘布',
    href: '/prediction',
    color: 'from-blue-600 to-blue-800',
  },
  {
    icon: '☶',
    name: '小成图',
    description: '归藏起卦，九宫定位',
    href: '/prediction',
    color: 'from-cyan-600 to-cyan-800',
  },
  {
    icon: '☵',
    name: '皇极经世',
    description: '元会运世，卦气流转',
    href: '/prediction',
    color: 'from-rose-600 to-rose-800',
  },
  {
    icon: '☱',
    name: '策轨数',
    description: '动植数起，策轨成卦',
    href: '/prediction',
    color: 'from-teal-600 to-teal-800',
  },
  {
    icon: '📅',
    name: '老黄历',
    description: '择吉选时，宜忌查询',
    href: '/prediction',
    color: 'from-orange-600 to-orange-800',
  },
];

const stats = [
  { label: '术数系统', value: '10', icon: '☯' },
  { label: '规则条数', value: '70+', icon: '📜' },
  { label: '核心模块', value: '19', icon: '🧠' },
  { label: 'API 端点', value: '50+', icon: '🔗' },
];

export default function TianWenHome() {
  const [activeSystem, setActiveSystem] = useState<string | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 relative">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="inline-block mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-3xl scale-150" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-amber-700 flex items-center justify-center shadow-glow-lg animate-float">
              <span className="text-5xl">天</span>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="text-6xl lg:text-8xl font-serif font-bold tracking-[0.25em] text-gradient-gold mb-4"
        >
          天问
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-xl text-gray-400 tracking-[0.4em] mt-4"
        >
          AI 华夏术数推演操作系统
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="w-32 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent mx-auto my-10"
        />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
          className="flex justify-center gap-4 mb-12"
        >
          <Link href="/prediction">
            <Button size="lg" variant="primary" className="px-8">
              开始推演
            </Button>
          </Link>
          <Link href="/chart">
            <Button size="lg" variant="secondary">
              查看排盘
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto"
      >
        {stats.map((stat, i) => (
          <Card key={i} variant="subtle" className="text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gold-400 mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500 tracking-wider">{stat.label}</div>
          </Card>
        ))}
      </motion.section>

      {/* Systems Grid */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-gold-500 to-transparent rounded-full" />
          <h2 className="text-2xl font-serif text-gold-400 tracking-wider">术数系统</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {systems.map((system, index) => (
            <motion.div key={system.name} variants={itemVariants} custom={index}>
              <Link href={system.href} className="block">
                <Card
                  hover
                  className="group h-full"
                  onClick={() => setActiveSystem(system.name)}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    {/* Icon with gradient background */}
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${system.color} flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300 group-hover:scale-110`}
                    >
                      <span className="text-3xl text-white drop-shadow-lg">{system.icon}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-serif text-gold-300 group-hover:text-gold-200 transition-colors">
                        {system.name}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{system.description}</p>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
                    <span className="text-xs text-gray-600 group-hover:text-gold-500/80 transition-colors">
                      进入 →
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quote */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
        className="text-center mt-16 pt-8 border-t border-gold-500/5"
      >
        <p className="text-sm text-gray-600 tracking-widest italic">
          观乎天文，以察时变；观乎人文，以化成天下
        </p>
        <p className="text-xs text-gray-700 mt-2">—《周易·贲卦》</p>
      </motion.section>
    </div>
  );
}
