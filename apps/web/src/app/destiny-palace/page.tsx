'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
);

export default function DestinyPalacePage() {
  const [loading, setLoading] = useState(true);
  const [baziData, setBaziData] = useState<any>(null);
  const [ziweiData, setZiweiData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const now = new Date();
      const [baziRes, ziweiRes] = await Promise.all([
        fetch(`${API}/api/bazi/calculate?year=${now.getFullYear()}&month=${now.getMonth()+1}&day=${now.getDate()}&gender=male`),
        fetch(`${API}/api/ziwei/layout?year=${now.getFullYear()}&month=${now.getMonth()+1}&day=${now.getDate()}&gender=%E7%94%B7`)
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
  }

  const gz = baziData?.ganzhi || baziData?.chronoData?.ganzhi || {};
  const palName = (n: string) => {
    const map: Record<string, string> = {
      'ming': '命宫', 'fumu': '父母宫', 'fude': '福德宫', 'tianzhai': '田宅宫',
      'guanlu': '官禄宫', 'jiaoyu': '交友宫', 'qianyi': '迁移宫', 'jier': '疾厄宫',
      'caibo': '财帛宫', 'zinv': '子女宫', 'fuqi': '夫妻宫', 'xiongdi': '兄弟宫'
    };
    return map[n] || n;
  };

  return (
    <PageContainer>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <motion.h1 {...fadeInUp} className="text-4xl font-serif text-amber-400 mb-2">命宫</motion.h1>
        <motion.p {...fadeInUp} className="text-gray-400 mb-8">知天命，尽人事</motion.p>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">正在排盘...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : (
          <div className="grid gap-6 max-w-4xl">
            {/* 八字四柱 */}
            <motion.div {...fadeInUp} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
              <h2 className="text-lg font-medium text-amber-400 mb-4">八字命盘</h2>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: '年柱', value: gz.year || baziData?.yearPillar || '—' },
                  { label: '月柱', value: gz.month || baziData?.monthPillar || '—' },
                  { label: '日柱', value: gz.day || baziData?.dayPillar || '—' },
                  { label: '时柱', value: gz.hour || baziData?.hourPillar || '—' }
                ].map((col, i) => (
                  <div key={i} className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{col.label}</div>
                    <div className="text-2xl font-serif text-white">{col.value}</div>
                  </div>
                ))}
              </div>
              {baziData?.dayMasterWuxing && (
                <div className="mt-4 flex gap-4 text-sm">
                  <span className="text-gray-400">日主:</span>
                  <span className="text-amber-400">{baziData.dayMasterWuxing}性</span>
                </div>
              )}
            </motion.div>

            {/* 紫微十二宫 */}
            <motion.div {...fadeInUp} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
              <h2 className="text-lg font-medium text-amber-400 mb-4">紫微斗数 · 十二宫</h2>
              {ziweiData?.palaces ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ziweiData.palaces.slice(0, 12).map((p: any, i: number) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-xs text-amber-400 mb-1">{palName(p.name) || p.name}</div>
                      <div className="flex gap-2 flex-wrap">
                        {(p.mainStars || []).slice(0, 2).map((s: string, j: number) => (
                          <span key={j} className="text-xs text-white bg-amber-500/10 px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                        {(p.auxStars || []).slice(0, 1).map((s: string, j: number) => (
                          <span key={j} className="text-xs text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {ziweiData?.mainPalace ? (
                    <p>命宫: {ziweiData.mainPalace}, 主星: {ziweiData.mainStar}, 运势: {ziweiData.luck || ziweiData.score || '—'}</p>
                  ) : '暂无数据'}
                </div>
              )}
            </motion.div>

            {/* 运势总览 */}
            <motion.div {...fadeInUp} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
              <h2 className="text-lg font-medium text-amber-400 mb-4">运势总览</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: '事业', score: ziweiData?.score || baziData?.score || 60, color: 'text-blue-400' },
                  { label: '财运', score: (baziData?.score || 60) + 5, color: 'text-amber-400' },
                  { label: '感情', score: 60 + Math.floor((baziData?.score || 0) * 0.4), color: 'text-pink-400' },
                  { label: '健康', score: 55 + Math.floor((ziweiData?.luck || 50) * 0.5), color: 'text-green-400' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                    <div className={`text-2xl font-serif ${item.color}`}>{item.score}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
}