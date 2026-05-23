'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// 天干地支定义
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 地支藏干
const DIZHI_CANGGAN: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '辛', '癸'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '戊', '庚'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
};

// 五行属性
const TIANGAN_WUXING: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

const DIZHI_WUXING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 十神定义
const SHISHEN_NAMES = ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印'];

interface PillarData {
  tg: string;
  dz: string;
  shishen: string;
  tgWuxing: string;
  dzWuxing: string;
}

interface BaziResult {
  year: PillarData;
  month: PillarData;
  day: PillarData;
  time: PillarData;
  dayTiangan: string;
  wuxingCount: Record<string, number>;
  shishenCount: Record<string, number>;
  daYun: Array<{ age: string; pillar: string; years: string }>;
  interpretation: string;
}

// 计算十神
function calculateShishen(riZhu: string, otherTg: string): string {
  const riIndex = TIANGAN.indexOf(riZhu);
  const otherIndex = TIANGAN.indexOf(otherTg);
  let diff = otherIndex - riIndex;
  if (diff < 0) diff += 10;
  return SHISHEN_NAMES[diff];
}

// 获取节气日期（简化版本）
function getSolarTerm(year: number, month: number): number {
  // 简化的节气计算，实际应用中需要更精确的算法
  const solarTerms = [
    [6, 21], [2, 19], [5, 6], [4, 5], [5, 6], [6, 6],
    [7, 7], [8, 8], [8, 23], [9, 8], [10, 8], [11, 8],
    [12, 7], [1, 6], [2, 4], [3, 6], [4, 5], [5, 5],
    [6, 5], [7, 6], [8, 7], [9, 7], [10, 7], [11, 7]
  ];
  const index = (month - 1) * 2;
  return solarTerms[index][1];
}

// 计算月柱
function calculateMonthPillar(year: number, month: number, day: number): { tg: string; dz: string } {
  // 简化的月柱计算
  const baseYear = 1900;
  const yearDiff = year - baseYear;
  let monthIndex = (yearDiff * 12 + month - 1) % 60;
  
  // 根据节气调整
  const solarTerm = getSolarTerm(year, month);
  if (day < solarTerm && month > 1) {
    monthIndex = (monthIndex - 1 + 60) % 60;
  }
  
  return {
    tg: TIANGAN[monthIndex % 10],
    dz: DIZHI[monthIndex % 12]
  };
}

// 计算日柱（简化版本）
function calculateDayPillar(year: number, month: number, day: number): { tg: string; dz: string } {
  // 简化的日柱计算，使用基准日期
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const index = (diffDays + 9) % 60; // 1900-01-01 为甲子
  
  return {
    tg: TIANGAN[index % 10],
    dz: DIZHI[index % 12]
  };
}

// 计算时柱
function calculateTimePillar(dayTg: string, hour: number, minute: number,子时算明天: boolean): { tg: string; dz: string } {
  let adjustedHour = hour;
  
  // 子时处理
  if (!子时算明天 && hour === 0) {
    adjustedHour = 23;
  }
  
  // 将时间转换为时支索引
  let dzIndex = Math.floor(adjustedHour / 2);
  if (adjustedHour % 2 === 1 && adjustedHour !== 23) {
    dzIndex += 1;
  }
  dzIndex = dzIndex % 12;
  
  const dayTgIndex = TIANGAN.indexOf(dayTg);
  const tgIndex = (dayTgIndex * 2 + dzIndex) % 10;
  
  return {
    tg: TIANGAN[tgIndex],
    dz: DIZHI[dzIndex]
  };
}

// 计算年柱
function calculateYearPillar(year: number, month: number, day: number): { tg: string; dz: string } {
  // 判断是否过了立春
  const solarTerm = getSolarTerm(year, 2);
  let actualYear = year;
  if (month === 1 || (month === 2 && day < solarTerm)) {
    actualYear = year - 1;
  }
  
  const baseYear = 1900;
  const yearDiff = actualYear - baseYear;
  const index = yearDiff % 60;
  
  return {
    tg: TIANGAN[index % 10],
    dz: DIZHI[index % 12]
  };
}

// 计算大运
function calculateDaYun(bazi: BaziResult, gender: 'male' | 'female', birthYear: number): Array<{ age: string; pillar: string; years: string }> {
  const daYun: Array<{ age: string; pillar: string; years: string }> = [];
  
  // 确定起运年龄（简化计算）
  const startAge = 10;
  const isForward = (gender === 'male' && ['甲', '丙', '戊', '庚', '壬'].includes(bazi.day.tg)) ||
                    (gender === 'female' && ['乙', '丁', '己', '辛', '癸'].includes(bazi.day.tg));
  
  // 获取月柱索引作为大运起始
  const monthIndex = TIANGAN.indexOf(bazi.month.tg) * 12 + DIZHI.indexOf(bazi.month.dz);
  
  for (let i = 0; i < 10; i++) {
    let index = isForward ? (monthIndex + i) % 60 : (monthIndex - i + 60) % 60;
    const tg = TIANGAN[index % 10];
    const dz = DIZHI[index % 12];
    const ageStart = startAge + i * 10;
    const ageEnd = ageStart + 9;
    const yearStart = birthYear + ageStart;
    const yearEnd = yearStart + 9;
    
    daYun.push({
      age: `${ageStart}-${ageEnd}岁`,
      pillar: `${tg}${dz}`,
      years: `${yearStart}-${yearEnd}`
    });
  }
  
  return daYun;
}

// 生成解读
function generateInterpretation(bazi: BaziResult): string {
  const { dayTiangan, wuxingCount, shishenCount } = bazi;
  let interpretation = `${dayTiangan}${TIANGAN_WUXING[dayTiangan]}日主，`;
  
  // 五行分析
  const wuxingList = ['金', '木', '水', '火', '土'];
  const strongElements: string[] = [];
  const weakElements: string[] = [];
  
  wuxingList.forEach(element => {
    const count = wuxingCount[element] || 0;
    if (count >= 3) strongElements.push(element);
    else if (count <= 1) weakElements.push(element);
  });
  
  if (strongElements.length > 0) {
    interpretation += `${strongElements.join('、')}偏旺，`;
  }
  if (weakElements.length > 0) {
    interpretation += `${weakElements.join('、')}偏弱，`;
  }
  
  interpretation += '宜五行调和。';
  
  // 十神分析
  if (shishenCount['正官'] || shishenCount['七杀']) {
    interpretation += '官杀透出，事业心强。';
  }
  if (shishenCount['正财'] || shishenCount['偏财']) {
    interpretation += '财星得地，财运不错。';
  }
  if (shishenCount['正印'] || shishenCount['偏印']) {
    interpretation += '印星护身，学业有成。';
  }
  
  return interpretation;
}

// 排盘主函数
function performPaipan(
  year: number, month: number, day: number, hour: number, minute: number,
  gender: 'male' | 'female', timezone: string, 子时算明天: boolean,
  manualPillars?: { year: string; month: string; day: string; time: string }
): BaziResult {
  let yearPillar: { tg: string; dz: string };
  let monthPillar: { tg: string; dz: string };
  let dayPillar: { tg: string; dz: string };
  let timePillar: { tg: string; dz: string };
  
  if (manualPillars) {
    yearPillar = { tg: manualPillars.year[0], dz: manualPillars.year[1] };
    monthPillar = { tg: manualPillars.month[0], dz: manualPillars.month[1] };
    dayPillar = { tg: manualPillars.day[0], dz: manualPillars.day[1] };
    timePillar = { tg: manualPillars.time[0], dz: manualPillars.time[1] };
  } else {
    // 真太阳时修正（简化处理）
    if (timezone === 'solar') {
      // 简化的真太阳时调整
      hour = (hour + 1) % 24;
    }
    
    yearPillar = calculateYearPillar(year, month, day);
    monthPillar = calculateMonthPillar(year, month, day);
    dayPillar = calculateDayPillar(year, month, day);
    timePillar = calculateTimePillar(dayPillar.tg, hour, minute, 子时算明天);
  }
  
  const dayTiangan = dayPillar.tg;
  
  // 计算十神
  const yearShishen = calculateShishen(dayTiangan, yearPillar.tg);
  const monthShishen = calculateShishen(dayTiangan, monthPillar.tg);
  const dayShishen = '日主';
  const timeShishen = calculateShishen(dayTiangan, timePillar.tg);
  
  // 计算五行分布
  const wuxingCount: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  
  const allPillars = [yearPillar, monthPillar, dayPillar, timePillar];
  allPillars.forEach(pillar => {
    wuxingCount[TIANGAN_WUXING[pillar.tg]]++;
    wuxingCount[DIZHI_WUXING[pillar.dz]]++;
    
    // 地支藏干五行
    DIZHI_CANGGAN[pillar.dz].forEach(canggan => {
      wuxingCount[TIANGAN_WUXING[canggan]]++;
    });
  });
  
  // 计算十神分布
  const shishenCount: Record<string, number> = {};
  SHISHEN_NAMES.forEach(name => { shishenCount[name] = 0; });
  shishenCount[yearShishen]++;
  shishenCount[monthShishen]++;
  shishenCount[dayShishen]++;
  shishenCount[timeShishen]++;
  
  const result: BaziResult = {
    year: {
      tg: yearPillar.tg,
      dz: yearPillar.dz,
      shishen: yearShishen,
      tgWuxing: TIANGAN_WUXING[yearPillar.tg],
      dzWuxing: DIZHI_WUXING[yearPillar.dz]
    },
    month: {
      tg: monthPillar.tg,
      dz: monthPillar.dz,
      shishen: monthShishen,
      tgWuxing: TIANGAN_WUXING[monthPillar.tg],
      dzWuxing: DIZHI_WUXING[monthPillar.dz]
    },
    day: {
      tg: dayPillar.tg,
      dz: dayPillar.dz,
      shishen: dayShishen,
      tgWuxing: TIANGAN_WUXING[dayPillar.tg],
      dzWuxing: DIZHI_WUXING[dayPillar.dz]
    },
    time: {
      tg: timePillar.tg,
      dz: timePillar.dz,
      shishen: timeShishen,
      tgWuxing: TIANGAN_WUXING[timePillar.tg],
      dzWuxing: DIZHI_WUXING[timePillar.dz]
    },
    dayTiangan,
    wuxingCount,
    shishenCount,
    daYun: calculateDaYun({} as BaziResult, gender, year), // 临时传递
    interpretation: ''
  };
  
  result.daYun = calculateDaYun(result, gender, year);
  result.interpretation = generateInterpretation(result);
  
  return result;
}

export const BaziPanel = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [paipanMode, setPaipanMode] = useState<'time' | 'manual' | 'instant'>('time');
  
  // 出生时间排盘
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  
  // 四柱直接输入
  const [manualYear, setManualYear] = useState('');
  const [manualMonth, setManualMonth] = useState('');
  const [manualDay, setManualDay] = useState('');
  const [manualTime, setManualTime] = useState('');
  
  // 配置参数
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [timezone, setTimezone] = useState<'beijing' | 'solar' | 'local'>('beijing');
  const [子时算明天, set子时算明天] = useState(false);
  
  // 结果
  const [showResult, setShowResult] = useState(false);
  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);
  
  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // 处理排盘
  const handlePaipan = () => {
    let result: BaziResult;
    
    if (paipanMode === 'instant') {
      const now = new Date();
      result = performPaipan(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        gender,
        timezone,
        子时算明天
      );
    } else if (paipanMode === 'manual') {
      result = performPaipan(
        2000, 1, 1, 0, 0, gender, timezone, 子时算明天,
        {
          year: manualYear,
          month: manualMonth,
          day: manualDay,
          time: manualTime
        }
      );
    } else {
      const [year, month, day] = birthDate.split('-').map(Number);
      const [hour, minute] = birthTime.split(':').map(Number);
      result = performPaipan(year, month, day, hour, minute, gender, timezone, 子时算明天);
    }
    
    setBaziResult(result);
    setShowResult(true);
  };
  
  // 即时排盘
  const handleInstantPaipan = () => {
    setPaipanMode('instant');
    handlePaipan();
  };
  
  // 验证四柱输入
  const isValidPillar = (value: string): boolean => {
    if (value.length !== 2) return false;
    const tg = value[0];
    const dz = value[1];
    return TIANGAN.includes(tg) && DIZHI.includes(dz);
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  return (
    <div className="space-y-6">
      {/* 排盘方式切换 */}
      <Card>
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={paipanMode === 'time' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setPaipanMode('time')}
          >
            出生时间排盘
          </Button>
          <Button
            variant={paipanMode === 'manual' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setPaipanMode('manual')}
          >
            四柱直接输入
          </Button>
          <Button
            variant={paipanMode === 'instant' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setPaipanMode('instant')}
          >
            即时排盘
          </Button>
        </div>
        
        {/* 出生时间排盘 */}
        {paipanMode === 'time' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="出生日期"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              inputSize="lg"
            />
            <Input
              label="出生时间"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              inputSize="lg"
            />
          </div>
        )}
        
        {/* 四柱直接输入 */}
        {paipanMode === 'manual' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="年柱"
              value={manualYear}
              onChange={(e) => setManualYear(e.target.value.slice(0, 2))}
              placeholder="如：甲子"
              inputSize="lg"
              className={manualYear && !isValidPillar(manualYear) ? 'border-red-500' : ''}
            />
            <Input
              label="月柱"
              value={manualMonth}
              onChange={(e) => setManualMonth(e.target.value.slice(0, 2))}
              placeholder="如：丙寅"
              inputSize="lg"
              className={manualMonth && !isValidPillar(manualMonth) ? 'border-red-500' : ''}
            />
            <Input
              label="日柱"
              value={manualDay}
              onChange={(e) => setManualDay(e.target.value.slice(0, 2))}
              placeholder="如：甲午"
              inputSize="lg"
              className={manualDay && !isValidPillar(manualDay) ? 'border-red-500' : ''}
            />
            <Input
              label="时柱"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value.slice(0, 2))}
              placeholder="如：戊辰"
              inputSize="lg"
              className={manualTime && !isValidPillar(manualTime) ? 'border-red-500' : ''}
            />
          </div>
        )}
        
        {/* 参数配置 */}
        <div className="border-t border-[#D4AF37]/10 pt-6 mt-6">
          <h4 className="text-[#D4AF37] font-semibold mb-4">排盘参数</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 性别选择 */}
            <div>
              <label className="block text-sm font-medium text-[#F5F5F5] mb-3">性别</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGender('male')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                    gender === 'male'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'border-[#D4AF37]/20 bg-transparent text-text-secondary hover:border-[#D4AF37]/40'
                  }`}
                >
                  男
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                    gender === 'female'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'border-[#D4AF37]/20 bg-transparent text-text-secondary hover:border-[#D4AF37]/40'
                  }`}
                >
                  女
                </button>
              </div>
            </div>
            
            {/* 时区选择 */}
            <div>
              <label className="block text-sm font-medium text-[#F5F5F5] mb-3">时区设置</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value as 'beijing' | 'solar' | 'local')}
                className="w-full px-4 py-2 bg-[#12121A] border border-[#D4AF37]/20 rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#D4AF37]/60"
              >
                <option value="beijing">北京时间</option>
                <option value="solar">真太阳时</option>
                <option value="local">本地时间</option>
              </select>
            </div>
            
            {/* 子时设置 */}
            <div>
              <label className="block text-sm font-medium text-[#F5F5F5] mb-3">子时设置</label>
              <div className="flex items-center h-full">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={子时算明天}
                    onChange={(e) => set子时算明天(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D4AF37]/30 bg-[#12121A] text-[#D4AF37] focus:ring-[#D4AF37]/50"
                  />
                  <span className="text-sm text-text-secondary">子时算明天</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* 排盘按钮 */}
        <div className="pt-6">
          <Button size="lg" onClick={handlePaipan} className="w-full">
            开始排盘
          </Button>
        </div>
      </Card>
      
      {/* 结果展示 */}
      {showResult && baziResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 四柱命盘 */}
          <Card header="四柱八字">
            <div className="grid grid-cols-4 gap-4">
              {['年柱', '月柱', '日柱', '时柱'].map((label, idx) => {
                const pillar = [baziResult.year, baziResult.month, baziResult.day, baziResult.time][idx];
                const isDay = idx === 2;
                return (
                  <div
                    key={label}
                    className={`text-center p-4 rounded-lg ${
                      isDay ? 'bg-[#D4AF37]/10' : 'bg-bg-tertiary'
                    }`}
                  >
                    <div className="text-sm text-[#D4AF37]/70 mb-2">{label}</div>
                    <div className={`text-4xl font-song ${isDay ? 'text-[#D4AF37]' : 'text-text-primary'}`}>
                      {pillar.tg}
                    </div>
                    <div className={`text-4xl font-song ${isDay ? 'text-[#D4AF37]' : 'text-text-primary'}`}>
                      {pillar.dz}
                    </div>
                    <div className={`text-sm mt-2 ${isDay ? 'text-[#D4AF37]' : 'text-text-muted'}`}>
                      {pillar.shishen}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <span className="text-text-secondary font-kai">
                日主：<span className="text-[#D4AF37] font-semibold">{baziResult.dayTiangan}{TIANGAN_WUXING[baziResult.dayTiangan]}</span>
              </span>
            </div>
          </Card>
          
          {/* 五行分布 */}
          <Card header="五行分布">
            <div className="space-y-4">
              {Object.entries(baziResult.wuxingCount).map(([element, count]) => (
                <div key={element}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-kai text-text-primary">{element}</span>
                    <span className="text-sm text-[#D4AF37]">{count}</span>
                  </div>
                  <div className="w-full bg-bg-tertiary rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#F4D03F] via-[#D4AF37] to-[#B8860B] h-2 rounded-full"
                      style={{ width: `${(count / 12) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* 十神分析 */}
          <Card header="十神分析">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {SHISHEN_NAMES.map(name => {
                const count = baziResult.shishenCount[name] || 0;
                return (
                  <div key={name} className="text-center p-3 bg-bg-tertiary rounded-lg">
                    <div className="text-sm text-text-muted mb-1">{name}</div>
                    <div className={`text-2xl font-song ${count > 0 ? 'text-[#D4AF37]' : 'text-text-muted/50'}`}>
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          
          {/* 地支藏干 */}
          <Card header="地支藏干">
            <div className="grid grid-cols-4 gap-4">
              {[baziResult.year.dz, baziResult.month.dz, baziResult.day.dz, baziResult.time.dz].map((dz, idx) => (
                <div key={idx} className="text-center p-3 bg-bg-tertiary rounded-lg">
                  <div className="text-xl font-song text-text-primary mb-2">{dz}</div>
                  <div className="text-sm text-text-muted font-kai">
                    藏干：{DIZHI_CANGGAN[dz].join('、')}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* 大运流年 */}
          <Card header="十年大运">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {baziResult.daYun.map((yun, idx) => (
                      <th key={idx} className="text-center py-2 px-3 text-sm text-[#D4AF37]">
                        {yun.age}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {baziResult.daYun.map((yun, idx) => (
                      <td key={idx} className="text-center py-3 px-3">
                        <div className="text-xl font-song text-text-primary">{yun.pillar}</div>
                        <div className="text-xs text-text-muted mt-1">{yun.years}</div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* 简要解读 */}
          <Card header="简要解读">
            <p className="text-text-secondary font-kai leading-relaxed">
              {baziResult.interpretation}
            </p>
          </Card>
        </motion.div>
      )}
      
      {/* 底部实时时间和即时排盘 */}
      <Card className="fixed bottom-0 left-0 right-0 bg-[#12121A]/95 backdrop-blur-sm border-t border-[#D4AF37]/10 rounded-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="text-2xl font-mono text-[#D4AF37]">{formatTime(currentTime)}</div>
            <div className="text-sm text-text-muted">{formatDate(currentTime)}</div>
          </div>
          <Button onClick={handleInstantPaipan}>
            即时排盘
          </Button>
        </div>
      </Card>
      
      {/* 底部占位 */}
      <div className="h-24"></div>
    </div>
  );
}
