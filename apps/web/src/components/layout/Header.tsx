'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const quickActions = [
    { id: 'quick', name: '快速起卦', icon: '⚡' },
    { id: 'history', name: '历史记录', icon: '📜' },
    { id: 'help', name: '帮助', icon: '❓' },
  ];

  return (
    <header className="h-14 bg-bg-dark border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <motion.button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-bg-medium border border-border rounded-sm text-text-secondary hover:border-border-light hover:text-text-primary transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>🔍</span>
          <span className="text-sm font-kai">搜索占卜记录...</span>
        </motion.button>
      </div>

      <div className="flex items-center gap-2">
        {quickActions.map((item) => (
          <motion.button
            key={item.id}
            className="p-2 rounded-sm text-text-secondary hover:bg-bg-light hover:text-text-primary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={item.name}
          >
            <span>{item.icon}</span>
          </motion.button>
        ))}

        <motion.button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-sm text-text-secondary hover:bg-bg-light hover:text-text-primary transition-colors relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="设置"
        >
          <span>⚙️</span>
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-64 bg-bg-card border border-border rounded-sm shadow-card overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border">
                  <div className="font-song font-bold text-text-primary">设置</div>
                </div>
                <div className="p-4 space-y-3">
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
                              ? 'bg-primary/20 text-primary-light border border-primary/50'
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
                        className="w-4 h-4 rounded border-border bg-bg-medium text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-text-secondary">启用动画效果</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
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
              className="absolute top-0 left-0 right-0 bg-bg-card border-b border-border p-4"
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
                    className="flex-1 bg-bg-medium border border-border rounded-sm px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    取消
                  </button>
                </div>
                {searchQuery && (
                  <div className="mt-4 space-y-2">
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
                        className="flex items-center justify-between px-3 py-2 rounded-sm bg-bg-medium hover:bg-bg-light cursor-pointer"
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
