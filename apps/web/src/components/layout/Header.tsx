'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const pageTitles: Record<string, string> = {
  '/liuren': '大六壬',
  '/meihua': '梅花易数',
  '/qimen': '奇门遁甲',
  '/bazi': '八字排盘',
  '/fengshui': '风水辅助',
  '/other': '其他术数',
};

const getGanZhi = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();
  
  const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  const yearStem = heavenlyStems[(year - 4) % 10];
  const yearBranch = earthlyBranches[(year - 4) % 12];
  const monthStem = heavenlyStems[(month * 2 + 1) % 10];
  const monthBranch = earthlyBranches[(month + 1) % 12];
  const dayStem = heavenlyStems[day % 10];
  const dayBranch = earthlyBranches[day % 12];
  const hourStem = heavenlyStems[Math.floor((hour + 1) / 2) % 10];
  const hourBranch = earthlyBranches[hour % 12];
  
  return {
    year: `${yearStem}${yearBranch}`,
    month: `${monthStem}${monthBranch}`,
    day: `${dayStem}${dayBranch}`,
    hour: `${hourStem}${hourBranch}`,
  };
};

export const Header = () => {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [ganZhi, setGanZhi] = useState(getGanZhi());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setGanZhi(getGanZhi());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const pageTitle = pageTitles[pathname] || '首页';

  const quickActions = [
    { id: 'quick', name: '快速起卦', icon: '⚡' },
    { id: 'history', name: '历史记录', icon: '📜' },
    { id: 'help', name: '帮助', icon: '❓' },
  ];

  return (
    <header className="h-16 bg-bg-dark border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 backdrop-blur-sm bg-bg-dark/80">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="font-song text-xl font-bold text-text-primary">{pageTitle}</h1>
        </div>

        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-bg-medium/50 border border-border rounded-sm">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted">年</span>
            <span className="text-gold font-mono font-medium">{ganZhi.year}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted">月</span>
            <span className="text-gold font-mono font-medium">{ganZhi.month}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted">日</span>
            <span className="text-gold font-mono font-medium">{ganZhi.day}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted">时</span>
            <span className="text-gold font-mono font-medium">{ganZhi.hour}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {quickActions.map((item) => (
          <motion.button
            key={item.id}
            className="p-2 rounded-sm text-text-secondary hover:bg-bg-light hover:text-gold transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={item.name}
          >
            <span>{item.icon}</span>
          </motion.button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex"
        >
          🔍
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️
          </Button>
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-72 bg-bg-card border border-border rounded-sm shadow-card overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <div className="font-song font-bold text-text-primary">设置</div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted font-kai">主题色</label>
                    <div className="flex gap-2">
                      {['red', 'gold', 'blue', 'green'].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                            color === 'red' ? 'bg-primary border-primary' : ''
                          } ${color === 'gold' ? 'bg-gold border-gold' : ''} ${color === 'blue' ? 'bg-info border-info' : ''} ${color === 'green' ? 'bg-success border-success' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted font-kai">字体大小</label>
                    <div className="flex gap-2">
                      {['S', 'M', 'L'].map((size) => (
                        <button
                          key={size}
                          className={`px-3 py-1 rounded-sm text-sm font-kai transition-colors ${
                            size === 'M'
                              ? 'bg-gold/20 text-gold border border-gold/50'
                              : 'bg-bg-medium text-text-secondary border border-border hover:text-text-primary'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-border bg-bg-medium text-gold focus:ring-gold"
                      />
                      <span className="text-sm text-text-secondary">启用动画效果</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 bg-bg-card border-b border-border p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索占卜记录..."
                    className="flex-1 bg-bg-medium border border-border rounded-sm px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchOpen(false)}
                  >
                    取消
                  </Button>
                </div>
                {searchQuery && (
                  <div className="mt-6 space-y-2">
                    {[
                      { title: '大六壬排盘 - 2024-01-15', type: '排盘' },
                      { title: '梅花易数起卦 - 2024-01-14', type: '起卦' },
                      { title: '奇门遁甲布局 - 2024-01-13', type: '布局' },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between px-4 py-3 rounded-sm bg-bg-medium hover:bg-bg-light cursor-pointer border border-transparent hover:border-gold/20 transition-colors"
                      >
                        <div>
                          <div className="text-text-primary font-kai">{item.title}</div>
                          <div className="text-xs text-text-muted">{item.type}</div>
                        </div>
                        <span className="text-text-muted">→</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
