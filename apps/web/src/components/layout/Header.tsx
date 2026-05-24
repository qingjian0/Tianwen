"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const navigationItems = [
  { id: "meihua", name: "梅花易数", icon: "☰", href: "/meihua" },
  { id: "liuren", name: "大六壬", icon: "☴", href: "/liuren" },
  { id: "qimen", name: "奇门遁甲", icon: "☲", href: "/qimen" },
  { id: "bazi", name: "八字排盘", icon: "☯", href: "/bazi" },
  { id: "ziwei", name: "紫微斗数", icon: "☷", href: "/ziwei" },
];

const getGanZhi = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();

  const heavenlyStems = [
    "甲",
    "乙",
    "丙",
    "丁",
    "戊",
    "己",
    "庚",
    "辛",
    "壬",
    "癸",
  ];
  const earthlyBranches = [
    "子",
    "丑",
    "寅",
    "卯",
    "辰",
    "巳",
    "午",
    "未",
    "申",
    "酉",
    "戌",
    "亥",
  ];

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ganZhi, setGanZhi] = useState<{ year: string; month: string; day: string; hour: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setGanZhi(getGanZhi());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setGanZhi(getGanZhi());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-bg-primary/90 border-b border-border/50 sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-md bg-gradient-imperial-gold flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <span className="text-white font-song text-lg font-bold">天</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-song text-xl font-bold text-gradient-gold">
              天问
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-kai transition-all duration-200 ${
                pathname === item.href
                  ? "text-imperial-gold bg-imperial-gold/5 border border-imperial-gold/20"
                  : "text-text-secondary hover:text-imperial-gold hover:bg-bg-secondary"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Time Display (Desktop) */}
          {ganZhi && (
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-bg-secondary/50 border border-border/30 rounded-md">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-text-muted">干支</span>
                <span className="text-imperial-gold font-mono font-medium">
                  {ganZhi.year} {ganZhi.month} {ganZhi.day} {ganZhi.hour}
                </span>
              </div>
            </div>
          )}

          {/* Settings Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-text-secondary hover:text-imperial-gold"
            >
              ⚙️
            </Button>
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-bg-card border border-border rounded-md shadow-lg overflow-hidden"
                >
                  <div className="p-4 border-b border-border/30">
                    <div className="font-song font-bold text-text-primary">
                      设置
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-text-muted font-kai">
                        主题色
                      </label>
                      <div className="flex gap-2">
                        {["imperial-gold", "vermillion", "jade"].map(
                          (color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                                color === "imperial-gold"
                                  ? "bg-imperial-gold border-imperial-gold"
                                  : color === "vermillion"
                                    ? "bg-vermillion border-vermillion"
                                    : "bg-jade border-jade"
                              }`}
                            />
                          ),
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded border-border bg-bg-card text-imperial-gold focus:ring-imperial-gold"
                        />
                        <span className="text-sm text-text-secondary">
                          启用动画效果
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-imperial-gold rounded-md hover:bg-bg-secondary transition-colors"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-primary border-b border-border overflow-hidden"
          >
            <nav className="p-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-kai transition-all ${
                    pathname === item.href
                      ? "text-imperial-gold bg-imperial-gold/5 border border-imperial-gold/20"
                      : "text-text-secondary hover:text-imperial-gold hover:bg-bg-secondary"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
