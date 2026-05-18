/**
 * 头部
 */

'use client';

import { useUIStore } from '@/stores/uiStore';
import { useThemeStore } from '@/stores/themeStore';

export const Header = () => {
  const { toggleMode } = useThemeStore();
  const { setSidebarOpen } = useUIStore();

  return (
    <header className="h-16 bg-[#12121c]/80 border-b border-amber-500/10 flex items-center justify-between px-6">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 text-gray-400 hover:text-white"
      >
        ☰
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleMode}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          ☾
        </button>
      </div>
    </header>
  );
};
