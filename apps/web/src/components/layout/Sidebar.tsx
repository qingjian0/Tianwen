'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: '天问殿', href: '/', icon: '⊙', category: 'main' },
  { label: '梅花易数', href: '/meihua', icon: '☰', category: 'divination' },
  { label: '六爻纳甲', href: '/liuyao', icon: '☷', category: 'divination' },
  { label: '四柱命理', href: '/bazi', icon: '☯', category: 'divination' },
  { label: '奇门遁甲', href: '/qimen', icon: '☲', category: 'divination' },
  { label: '紫微斗数', href: '/ziwei', icon: '◎', category: 'divination' },
  { label: '大六壬', href: '/liuren', icon: '☴', category: 'divination' },
  { label: '小成图', href: '/xiaochengtu', icon: '☶', category: 'divination' },
  { label: '皇极经世', href: '/huangji', icon: '☵', category: 'divination' },
  { label: '策轨数', href: '/cegui', icon: '☱', category: 'divination' },
  { label: '老黄历', href: '/huangli', icon: '📜', category: 'calendar' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={sidebarOpen ? { x: 0 } : { x: -256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-y-0 left-0 z-40 w-64 bg-xuan-900/95 backdrop-blur-md border-r border-ji-500/15 lg:static"
    >
      <div className="p-6 border-b border-ji-500/10">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-ji-500/60 rounded-sm transform rotate-[-4deg]">
              <div className="absolute inset-1 border border-ji-400/40 rounded-sm" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-kai text-xl text-ji-400 tracking-widest font-bold">
                天
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-song font-bold text-gradient-ji tracking-wider">
              天问
            </h2>
            <p className="text-xs text-xuan-500 tracking-[0.2em]">
              TIANWEN
            </p>
          </div>
        </div>
      </div>

      <nav className="px-4 py-4 space-y-1">
        {navItems.map((item, idx) => (
          <motion.Link
            key={item.href}
            href={item.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`group flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-kai tracking-wide transition-all duration-300 ${
              pathname === item.href
                ? 'bg-ji-500/10 text-ji-300 border-l-2 border-ji-500'
                : 'text-xuan-400 hover:bg-xuan-800/50 hover:text-xuan-200 border-l-2 border-transparent hover:border-ji-500/30'
            }`}
          >
            <span className={`text-lg transition-transform duration-300 ${pathname === item.href ? 'scale-110' : 'group-hover:scale-105'}`}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
          </motion.Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-ji-500/10">
        <div className="text-center">
          <p className="text-xs text-xuan-500 font-kai tracking-widest mb-2">
            观天之道 · 执天之行
          </p>
          <div className="flex justify-center gap-1">
            <div className="w-1 h-1 rounded-full bg-ji-500/40" />
            <div className="w-1 h-1 rounded-full bg-ji-500/60" />
            <div className="w-1 h-1 rounded-full bg-ji-500/40" />
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
