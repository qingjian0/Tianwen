/**
 * 头部
 */

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/uiStore';
import { useThemeStore } from '@/stores/themeStore';

const PAGE_TITLES: Record<string, string> = {
  '/': '天问殿',
  '/prediction': '推演',
  '/chart': '排盘',
  '/destiny-palace': '命宫',
};

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export const Header = () => {
  const { toggleMode } = useThemeStore();
  const { setSidebarOpen } = useUIStore();
  const pathname = usePathname();
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        [now.getHours(), now.getMinutes(), now.getSeconds()]
          .map((n) => String(n).padStart(2, '0'))
          .join(':')
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const title = PAGE_TITLES[pathname] ?? '';
  const weekday = WEEKDAYS[new Date().getDay()];

  return (
    <header className="h-16 bg-ink-800/80 backdrop-blur-sm border-b border-gold-500/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 text-gray-400 hover:text-gold-400"
        >
          ☰
        </button>

        {title && (
          <span className="text-sm text-gray-400 font-serif">
            · {title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-600 font-mono tracking-wider">
          {time} 周{weekday}
        </span>

        <button
          onClick={toggleMode}
          className="p-2 text-gray-500 hover:text-gold-400 transition-colors"
        >
          ☾
        </button>
      </div>
    </header>
  );
};
