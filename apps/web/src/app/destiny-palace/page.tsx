'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Segment } from '@/components/ui/Segment';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const now = new Date();

const palName = (n: string) => {
  const map: Record<string, string> = {
    'ming': '命宫', 'fumu': '父母宫', 'fude': '福德宫', 'tianzhai': '田宅宫',
    'guanlu': '官禄宫', 'jiaoyu': '交友宫', 'qianyi': '迁移宫', 'jier': '疾厄宫',
    'caibo': '财帛宫', 'zinv': '子女宫', 'fuqi': '夫妻宫', 'xiongdi': '兄弟宫'
  };
  return map[n] || n;
};

const wuxingOrder = ['金', '木', '水', '火', '土'];
const wuxingColors: Record<string, string> = {
  '金': 'bg-gold-500/60',
  '木': 'bg-jade-500/60',
  '水': 'bg-indigo-500/60',
  '火': 'bg-vermillion-500/60',
  '土': 'bg-amber-500/60',
};

const genderOptions = [
  { id: 'male', label: '男' },
  { id: 'female', label: '女' },
];

function AnimatedBar({ label, percent }: { label: string; percent: number }) {
  const [width, setWidth] = useState(0);
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;
    const timer = setTimeout(() => setWidth(percent), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-4 text-right">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${wuxingColors[label]}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function FortuneCircle({ label, score, color }: { label: string; score: number; color: string }) {
  const [displayScore, setDisplayScore] = useState(0);
  const triggered = useRef(false);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;
    const timer = setTimeout(() => setDisplayScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-serif text-white">
          {displayScore}
        </span>
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

export default function DestinyPalacePage() {
  const [loading, setLoading] = useState(true);
  const [baziData, setBaziData] = useState<any>(null);
  const [ziweiData, setZiweiData] = useState<any>(null);
  const [error, setError] = useState('');

  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [day, setDay] = useState(String(now.getDate()));
  const [gender, setGender] = useState('male');

  const loadData = useCallback(async (y?: string, m?: string, d?: string, g?: string) => {
    const yr = y ?? year;
    const mo = m ?? month;
    const dy = d ?? day;
    const gd = g ?? gender;
    setLoading(true);
    setError('');
    try {
      const gParam = gd === 'male' ? 'male' : '%E5%A5%B3';
      const gLabel = gd === 'male' ? '%E7%94%B7' : '%E5%A5%B3';
      const [baziRes, ziweiRes] = await Promise.all([
        fetch(`${API}/api/bazi/calculate?year=${yr}&month=${mo}&day=${dy}&gender=${gParam}`),
        fetch(`${API}/api/ziwei/layout?year=${yr}&month=${mo}&day=${dy}&gender=${gLabel}`)
      ]);
      const bazi = await baziRes.json();
      const ziwei = await ziweiRes.json();
      setBaziData(bazi.data || bazi);
      setZiweiData(ziwei.data || ziwei);
    } catch (e: any) {
      setError(e.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, [year, month, day, gender]);

  useEffect(() => {
    loadData();
  }, []);

  const handleCalculate = () => {
    loadData(year, month, day, gender);
  };

  const gz = baziData?.ganzhi || baziData?.chronoData?.ganzhi || {};
  const pillars: { label: string; gan: string; zhi: string }[] = [
    { label: '年', gan: (gz.year || baziData?.yearPillar || '——').charAt(0), zhi: (gz.year || baziData?.yearPillar || '——').charAt(1) },
    { label: '月', gan: (gz.month || baziData?.monthPillar || '——').charAt(0), zhi: (gz.month || baziData?.monthPillar || '——').charAt(1) },
    { label: '日', gan: (gz.day || baziData?.dayPillar || '——').charAt(0), zhi: (gz.day || baziData?.dayPillar || '——').charAt(1) },
    { label: '时', gan: (gz.hour || baziData?.hourPillar || '——').charAt(0), zhi: (gz.hour || baziData?.hourPillar || '——').charAt(1) },
  ];

  const wuxingStrengths: Record<string, number> = (() => {
    const raw = baziData?.wuxing || baziData?.elementWeights || {};
    if (Object.keys(raw).length > 0) return raw;
    const dm = baziData?.dayMasterWuxing;
    if (dm) {
      const base: Record<string, number> = { '金': 20, '木': 20, '水': 20, '火': 20, '土': 20 };
      if (base[dm] !== undefined) base[dm] = 40;
      return base;
    }
    return { '金': 20, '木': 20, '水': 20, '火': 20, '土': 20 };
  })();

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Button variant="secondary" onClick={handleCalculate}>重新尝试</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-4xl font-serif text-gold-400">命宫</h1>
      <p className="text-gray-400 -mt-2">知天命，尽人事</p>

      <Card>
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-24">
            <label className="block text-xs text-gray-500 mb-1">年份</label>
            <Input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="1990"
            />
          </div>
          <div className="w-16">
            <label className="block text-xs text-gray-500 mb-1">月份</label>
            <Input
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="1"
            />
          </div>
          <div className="w-16">
            <label className="block text-xs text-gray-500 mb-1">日期</label>
            <Input
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">性别</label>
            <Segment options={genderOptions} value={gender} onChange={setGender} />
          </div>
          <Button variant="primary" onClick={handleCalculate} loading={loading}>
            排盘
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="space-y-6">
          <Card>
            <Skeleton variant="rect" height="120px" />
          </Card>
          <Card>
            <Skeleton variant="rect" height="100px" />
          </Card>
          <Card>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} variant="rect" height="72px" />
              ))}
            </div>
          </Card>
          <Card>
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton variant="circle" width="80px" height="80px" />
                  <Skeleton variant="text" width="40px" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card variant="highlight" header="八字命盘">
            <div className="flex items-start gap-6">
              <div className="flex-1 grid grid-cols-4 gap-3">
                {pillars.map((p, i) => (
                  <div
                    key={i}
                    className={`text-center p-3 rounded-lg ${
                      i === 2
                        ? 'bg-gold-500/10 border border-gold-500/30 shadow-[0_0_20px_rgba(234,179,54,0.15)]'
                        : 'bg-white/5'
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">{p.label}</div>
                    <div className="text-3xl text-gold-400 font-serif">{p.gan}</div>
                    <div className="text-lg text-gray-400 font-serif mt-0.5">{p.zhi}</div>
                  </div>
                ))}
              </div>
              {baziData?.dayMasterWuxing && (
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-xs text-gray-500">日主</span>
                  <Badge variant="gold" size="md" className="text-lg px-3 py-1">
                    {baziData.dayMasterWuxing}
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          <Card header="五行强弱">
            <div className="space-y-3 max-w-md">
              {wuxingOrder.map((wx) => (
                <AnimatedBar
                  key={wx}
                  label={wx}
                  percent={Math.min(100, Math.max(5, wuxingStrengths[wx] || 20))}
                />
              ))}
            </div>
          </Card>

          <Card header="紫微斗数 · 十二宫">
            {ziweiData?.palaces ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ziweiData.palaces.slice(0, 12).map((p: any, i: number) => {
                  const name = palName(p.name) || p.name;
                  const isMing = p.name === 'ming' || name === '命宫';
                  return (
                    <div
                      key={i}
                      className={`rounded-lg p-3 border ${
                        isMing
                          ? 'border-gold-500/30 shadow-glow-sm'
                          : 'border-gold-500/10'
                      }`}
                    >
                      <div className="text-sm text-gold-400 font-serif mb-1.5">{name}</div>
                      <div className="flex flex-wrap gap-1">
                        {(p.mainStars || []).map((s: string, j: number) => (
                          <Badge key={j} variant="gold" size="sm">{s}</Badge>
                        ))}
                        {(p.auxStars || []).slice(0, 3).map((s: string, j: number) => (
                          <Badge key={j} variant="ghost" size="sm">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {ziweiData?.mainPalace ? (
                  <p>命宫: {ziweiData.mainPalace}, 主星: {ziweiData.mainStar}, 运势: {ziweiData.luck || ziweiData.score || '—'}</p>
                ) : '暂无数据'}
              </div>
            )}
          </Card>

          <Card header="运势总览">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
              <FortuneCircle
                label="事业"
                score={ziweiData?.careerScore || baziData?.score || 60}
                color="#60a5fa"
              />
              <FortuneCircle
                label="财运"
                score={(baziData?.score || 60) + 5}
                color="#eab336"
              />
              <FortuneCircle
                label="感情"
                score={60 + Math.floor((baziData?.score || 0) * 0.4)}
                color="#f472b6"
              />
              <FortuneCircle
                label="健康"
                score={55 + Math.floor((ziweiData?.luck || ziweiData?.healthScore || 50) * 0.5)}
                color="#4ade80"
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}