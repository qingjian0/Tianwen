'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const systems = [
  {
    icon: '☰',
    name: '梅花易数',
    description: '观象玩占，八卦推演',
    href: '/prediction',
  },
  {
    icon: '☷',
    name: '六爻纳甲',
    description: '六爻装卦，世应生克',
    href: '/prediction',
  },
  {
    icon: '☯',
    name: '八字命理',
    description: '四柱八字，大运流年',
    href: '/destiny-palace',
  },
  {
    icon: '☲',
    name: '奇门遁甲',
    description: '九宫八门，时空推演',
    href: '/chart',
  },
  {
    icon: '◎',
    name: '紫微斗数',
    description: '十二命宫，星曜布局',
    href: '/destiny-palace',
  },
];

export default function TianWenDian() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 relative flex flex-col items-center justify-center">
      <section className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="text-7xl lg:text-8xl font-serif font-bold tracking-[0.2em] text-gradient-gold"
        >
          天问
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-lg text-gray-500 tracking-[0.3em] mt-4"
        >
          AI 华夏术数推演操作系统
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto my-8"
        />
      </section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto w-full"
      >
        {systems.map((system) => (
          <motion.div key={system.name} variants={itemVariants}>
            <Link href={system.href} className="block">
              <Card hover>
                <div className="flex flex-col items-center text-center gap-3">
                  <span className="text-3xl">{system.icon}</span>
                  <h3 className="text-lg font-serif text-gold-400">
                    {system.name}
                  </h3>
                  <p className="text-xs text-gray-500">{system.description}</p>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
        className="text-xs text-gray-600 text-center mt-12"
      >
        观乎天文，以察时变；观乎人文，以化成天下 —《周易》
      </motion.p>
    </div>
  );
}