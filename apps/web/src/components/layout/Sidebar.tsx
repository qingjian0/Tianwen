/**
 * 侧边栏
 */

'use client';

import { useUIStore } from '@/stores/uiStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: '天问殿', href: '/' },
  { label: '命宫', href: '/destiny-palace' },
  { label: '推演', href: '/prediction' },
  { label: '排盘', href: '/chart' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();

  return (
    <aside className={`w-64 bg-[#12121c]/90 border-r border-amber-500/10 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-amber-400 font-serif tracking-wider">
          问·道
        </h2>
        <p className="text-xs text-gray-500 mt-1">TIANWEN OS</p>
      </div>

      <nav className="px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-3 rounded-lg transition-all duration-300 text-sm ${
              pathname === item.href
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
