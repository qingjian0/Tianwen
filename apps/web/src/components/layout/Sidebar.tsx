'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const highFreqModules = [
  { id: 'liuren', name: '大六壬', icon: '☴', desc: '三传四课，七政三式之首', color: 'gold' },
  { id: 'meihua', name: '梅花易数', icon: '☰', desc: '观梅占数，心易妙法', color: 'red' },
  { id: 'qimen', name: '奇门遁甲', icon: '☲', desc: '九宫八卦，帝王之学', color: 'gold' },
];

const lowFreqModules = [
  { id: 'bazi', name: '八字排盘', icon: '☯', desc: '四柱命理，子平之术' },
  { id: 'fengshui', name: '风水辅助', icon: '🗺', desc: '地理风水，方位布局' },
  { id: 'other', name: '其他术数', icon: '⊕', desc: '紫微斗数、六爻纳甲等' },
];

const historyItems = [
  { id: 1, module: '大六壬', time: '10分钟前', type: '排盘' },
  { id: 2, module: '梅花易数', time: '30分钟前', type: '起卦' },
  { id: 3, module: '奇门遁甲', time: '1小时前', type: '布局' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [expandedLowFreq, setExpandedLowFreq] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside className="w-64 bg-bg-dark border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-primary flex items-center justify-center">
            <span className="text-white font-song text-xl font-bold">天</span>
          </div>
          <div>
            <h1 className="font-song text-lg font-bold text-text-primary">天问</h1>
            <p className="text-xs text-text-muted">TIANWEN</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-4">
          <div className="text-xs text-text-muted mb-3 font-kai tracking-wider">高频功能</div>
          <nav className="space-y-1">
            {highFreqModules.map((item) => (
              <motion.div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={`/${item.id}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 ${
                    pathname === `/${item.id}`
                      ? `${item.color === 'gold' ? 'bg-gold/10 text-gold' : 'bg-primary/10 text-primary-light'}`
                      : 'text-text-secondary hover:bg-bg-light hover:text-text-primary'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-kai">{item.name}</span>
                  {pathname === `/${item.id}` && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </Link>
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, x: 10 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      exit={{ opacity: 0, y: -5, x: 10 }}
                      className="absolute left-full top-0 ml-2 px-3 py-2 bg-bg-light border border-border rounded-sm shadow-card z-50 whitespace-nowrap text-xs text-text-secondary"
                    >
                      {item.desc}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </nav>
        </div>

        <div className="p-4 pt-0">
          <button
            onClick={() => setExpandedLowFreq(!expandedLowFreq)}
            className="flex items-center justify-between w-full text-xs text-text-muted mb-3 font-kai tracking-wider hover:text-text-secondary transition-colors"
          >
            <span>更多功能</span>
            <motion.span
              animate={{ rotate: expandedLowFreq ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▶
            </motion.span>
          </button>
          <AnimatePresence>
            {expandedLowFreq && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <nav className="space-y-1">
                  {lowFreqModules.map((item) => (
                    <Link
                      key={item.id}
                      href={`/${item.id}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-sm text-text-muted hover:bg-bg-light hover:text-text-secondary transition-all duration-200"
                      onMouseEnter={() => setHoveredItem('low-' + item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="font-kai text-sm">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 pt-0">
          <button
            onClick={() => setExpandedHistory(!expandedHistory)}
            className="flex items-center justify-between w-full text-xs text-text-muted mb-3 font-kai tracking-wider hover:text-text-secondary transition-colors"
          >
            <span>历史记录</span>
            <span className="text-primary-light text-xs">{historyItems.length}</span>
          </button>
          <AnimatePresence>
            {expandedHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-bg-light transition-colors cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-bg-medium flex items-center justify-center">
                        <span className="text-xs">{item.module[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-kai text-text-secondary truncate">
                          {item.module}
                        </div>
                        <div className="text-xs text-text-muted">{item.type}</div>
                      </div>
                      <div className="text-xs text-text-muted">{item.time}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-sm bg-bg-medium">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-kai">用</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-kai text-text-primary">天机子</div>
            <div className="text-xs text-text-muted">VIP</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
