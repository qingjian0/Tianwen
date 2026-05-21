'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: '天问殿', href: '/', icon: '⊙', color: 'gold' },
  { label: '梅花易数', href: '/meihua', icon: '☰', color: 'gold' },
  { label: '六爻纳甲', href: '/liuyao', icon: '☷', color: 'red' },
  { label: '四柱命理', href: '/bazi', icon: '☯', color: 'jade' },
  { label: '奇门遁甲', href: '/qimen', icon: '☲', color: 'gold' },
  { label: '紫微斗数', href: '/ziwei', icon: '◎', color: 'red' },
  { label: '大六壬', href: '/liuren', icon: '☴', color: 'jade' },
  { label: '小成图', href: '/xiaochengtu', icon: '☶', color: 'gold' },
  { label: '皇极经世', href: '/huangji', icon: '☵', color: 'red' },
  { label: '策轨数', href: '/cegui', icon: '☱', color: 'jade' },
  { label: '老黄历', href: '/huangli', icon: '📜', color: 'gold' },
];

const PalaceHeader = () => (
  <div className="relative">
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-b from-imperial-gold/30 to-transparent" />
    <div className="flex items-center gap-4 p-6 border-b border-imperial-gold/10">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-2 border-vermillion-500/60 transform rotate-[-3deg]">
          <div className="absolute inset-1.5 border border-vermillion-400/40" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-kai text-xl text-vermillion-400 font-bold">
            天
          </span>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-song font-bold text-gradient-gold tracking-wider">
          天问
        </h2>
        <p className="text-xs text-parchment/40 tracking-[0.2em]">
          TIANWEN
        </p>
      </div>
    </div>
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-t from-imperial-gold/20 to-transparent" />
  </div>
);

const PalaceFooter = () => (
  <div className="relative">
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-b from-imperial-gold/20 to-transparent" />
    <div className="p-6 border-t border-imperial-gold/10 text-center">
      <p className="text-xs text-parchment/40 font-kai tracking-[0.25em] mb-3">
        观天之道 · 执天之行
      </p>
      <div className="flex justify-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-imperial-gold/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-imperial-gold/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-imperial-gold/40" />
      </div>
    </div>
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-t from-imperial-gold/30 to-transparent" />
  </div>
);

export const Sidebar = () => {
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={sidebarOpen ? { x: 0 } : { x: -256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-ink-dark/98 via-ink-medium/95 to-ink-dark/98 backdrop-blur-md border-r border-imperial-gold/15 lg:static"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-imperial-gold/20 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-imperial-gold/10 to-transparent" />

      <PalaceHeader />

      <nav className="px-4 py-6 space-y-1">
        {navItems.map((item, idx) => (
          <motion.Link
            key={item.href}
            href={item.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`group flex items-center gap-3 px-4 py-3 text-sm font-kai tracking-wide transition-all duration-300 ${
              pathname === item.href
                ? `${item.color === 'gold' ? 'bg-imperial-gold/10 text-imperial-gold' : ''} ${item.color === 'red' ? 'bg-vermillion-500/10 text-vermillion-400' : ''} ${item.color === 'jade' ? 'bg-jade-500/10 text-jade-400' : ''} border-l-2 ${item.color === 'gold' ? 'border-imperial-gold' : ''} ${item.color === 'red' ? 'border-vermillion-500' : ''} ${item.color === 'jade' ? 'border-jade-500' : ''}`
                : 'text-parchment/50 hover:text-parchment/80 hover:bg-ink-light/30 border-l-2 border-transparent hover:border-imperial-gold/30'
            }`}
          >
            <span className={`text-lg transition-transform duration-300 ${pathname === item.href ? 'scale-110' : 'group-hover:scale-105'}`}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
          </motion.Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0">
        <PalaceFooter />
      </div>
    </motion.aside>
  );
};
