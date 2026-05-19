/**
 * 侧边栏
 */

'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: '天问殿', href: '/', icon: '⊙' },
  { label: '命宫', href: '/destiny-palace', icon: '◎' },
  { label: '推演', href: '/prediction', icon: '◈' },
  { label: '排盘', href: '/chart', icon: '◇' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={sidebarOpen ? { x: 0 } : { x: -256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-y-0 left-0 z-40 w-64 bg-ink-800/90 border-r border-gold-500/10 lg:static"
    >
      <div className="p-6">
        <h2 className="text-2xl font-serif font-bold tracking-widest text-gradient-gold">
          天问
        </h2>
        <p className="text-xs text-gray-600 tracking-[0.3em] uppercase mt-1">
          TIANWEN OS
        </p>
      </div>

      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20 shadow-glow-sm'
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gold-500/10">
        <p className="text-xs text-gray-600">观天之道 · 执天之行</p>
      </div>
    </motion.aside>
  );
};
