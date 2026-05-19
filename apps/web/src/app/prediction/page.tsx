'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
);

const systems = [
  { id: 'meihua', name: '梅花易数', description: '观物取象，心易相合' },
  { id: 'liuyao', name: '六爻', description: '纳甲筮法，动变吉凶' },
  { id: 'qimen', name: '奇门遁甲', description: '天盘地盘，八门九星' },
  { id: 'bazi', name: '八字', description: '四柱干支，五行生克' },
  { id: 'ziwei', name: '紫微斗数', description: '命盘十二宫，星曜布局' },
];

const modes = [
  { id: 'single', name: '单系统', description: '使用选定的术数独立推演' },
  { id: 'multi', name: '多系统', description: '各系统独立推演，结果对比' },
  { id: 'fusion', name: '融合', description: '多系统信号融合分析' },
];

const timeRanges = [
  { id: 'short', name: '短期', days: 7, description: '一周内' },
  { id: 'medium', name: '中期', days: 30, description: '一月内' },
  { id: 'long', name: '长期', days: 90, description: '三月内' },
];

type PredictionState = 'idle' | 'loading' | 'success' | 'error';

async function callEngine(system: string): Promise<any> {
  switch (system) {
    case 'meihua': {
      const res = await fetch(`${API}/api/meihua/divinate?method=random`);
      const json = await res.json();
      const d = json.data || json;
      const gua = d.benGua || d;
      const dongYaoArr = d.dongYaoPositions || [];
      return { system: 'meihua', name: '梅花易数', guaName: gua.name || '—', guaNum: gua.number, changingYao: dongYaoArr[0], interpretation: d.interpretation?.split('\n')[0] || '', tiYong: d.tiYong };
    }
    case 'liuyao': {
      const res = await fetch(`${API}/api/liuyao/divinate?method=time`);
      const json = await res.json();
      const d = json.data || json;
      const bg = d.benGua || {};
      return { system: 'liuyao', name: '六爻', guaName: bg.name || '—', shiYao: bg.yaos?.find((y:any) => y.isShiyao)?.position, yingYao: bg.yaos?.find((y:any) => y.isYingyao)?.position, liuqin: (bg.yaos || []).slice(0,6).map((y:any) => y.liuqin) };
    }
    case 'qimen': {
      const res = await fetch(`${API}/api/qimen/layout`);
      const json = await res.json();
      const d = json.data || json;
      return { system: 'qimen', name: '奇门遁甲', ju: `${d.yinYang || ''}遁${d.ju}局`, zhiFu: d.zhiFu?.star || d.zhiFu, zhiShi: d.zhiShi?.door || d.zhiShi, patterns: d.patterns?.slice(0, 3) };
    }
    case 'bazi': {
      const now = new Date();
      const res = await fetch(`${API}/api/bazi/calculate?year=${now.getFullYear()}&month=${now.getMonth()+1}&day=${now.getDate()}&gender=male`);
      const json = await res.json();
      const d = json.data || json;
      const gz = d.ganzhi || d.chronoData?.ganzhi || {};
      return { system: 'bazi', name: '八字', year: gz.year || d.yearPillar || '—', month: gz.month || d.monthPillar || '—', day: gz.day || d.dayPillar || '—', hour: gz.hour || d.hourPillar || '—', favorable: d.favorable, score: d.score };
    }
    case 'ziwei': {
      const now = new Date();
      const res = await fetch(`${API}/api/ziwei/layout?year=${now.getFullYear()}&month=${now.getMonth()+1}&day=${now.getDate()}&gender=%E7%94%B7`);
      const json = await res.json();
      const d = json.data || json;
      const mpName = typeof d.mainPalace === 'string' ? d.mainPalace : d.mainPalace?.name || d.mainPalace;
      const mpObj = typeof d.mainPalace === 'string' ? (d.palaces || []).find((p:any) => p.name === d.mainPalace) : d.mainPalace;
      return { system: 'ziwei', name: '紫微斗数', mainPalace: mpName || '命宫', mainStar: mpObj?.mainStars?.[0] || '—', luckyStar: mpObj?.auxStars?.[0] || '—', score: d.luck || d.score };
    }
    default:
      return { error: 'Unknown system' };
  }
}

export default function PredictionPage() {
  const [question, setQuestion] = useState('');
  const [selectedSystems, setSelectedSystems] = useState<string[]>(['meihua']);
  const [selectedMode, setSelectedMode] = useState('single');
  const [selectedTimeRange, setSelectedTimeRange] = useState('medium');
  const [state, setState] = useState<PredictionState>('idle');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const toggleSystem = (systemId: string) => {
    setSelectedSystems((prev) =>
      prev.includes(systemId)
        ? prev.length > 1 ? prev.filter((s) => s !== systemId) : prev
        : [...prev, systemId]
    );
  };

  const handlePredict = async () => {
    setState('loading');
    setError('');
    setResults([]);

    try {
      const targetSystems = selectedMode === 'single' ? [selectedSystems[0]] : selectedSystems;
      const allResults = await Promise.all(targetSystems.map(callEngine));
      setResults(allResults);
      setState('success');
    } catch (e: any) {
      setError(e.message || '连接后端失败');
      setState('error');
    }
  };

  const getOverallFortune = () => {
    if (results.length === 0) return { text: '—', score: 0 };
    const scores = results.map(r => {
      if (r.score) return r.score;
      if (r.guaName) {
        const goodNames = ['乾', '坤', '泰', '既济', '益', '升', '晋', '鼎', '震'];
        return goodNames.some(n => r.guaName?.includes(n)) ? 75 : 55;
      }
      return 60;
    });
    const avg = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
    return { text: avg > 70 ? '吉' : avg > 55 ? '平' : '凶', score: avg };
  };

  return (
    <PageContainer>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <motion.h1 {...fadeInUp} className="text-4xl font-serif text-amber-400 mb-2">推演</motion.h1>
        <motion.p {...fadeInUp} className="text-gray-400 mb-8">至诚之道，可以前知</motion.p>

        <div className="grid gap-6 max-w-4xl">
          <motion.div {...fadeInUp} variants={stagger}>
            {/* 输入区 */}
            <motion.div variants={fadeInUp} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
              <label className="block text-sm text-gray-400 mb-2">请起一念</label>
              <textarea
                className="w-full bg-[#0a0a0f] border border-amber-500/10 rounded-lg p-4 text-white focus:border-amber-500/50 focus:outline-none resize-none transition-all"
                rows={3}
                placeholder="心中所想，一事一问..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </motion.div>

            {/* 推演模式 */}
            <motion.div variants={fadeInUp} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
              <label className="block text-sm text-gray-400 mb-4">推演模式</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modes.map((mode) => (
                  <button key={mode.id} onClick={() => setSelectedMode(mode.id)}
                    className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                      selectedMode === mode.id ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}>
                    <div className="font-medium mb-1">{mode.name}</div>
                    <div className="text-xs opacity-70">{mode.description}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 术数选择 */}
            <motion.div variants={fadeInUp} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
              <label className="block text-sm text-gray-400 mb-4">选择术数</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {systems.map((system) => (
                  <button key={system.id} onClick={() => toggleSystem(system.id)}
                    className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                      selectedSystems.includes(system.id) ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-500 opacity-50'
                    }`}>
                    <div className="font-medium">{system.name}</div>
                    <div className="text-xs opacity-70 mt-1">{system.description}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 时间范围 */}
            <motion.div variants={fadeInUp} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
              <label className="block text-sm text-gray-400 mb-4">时间范围</label>
              <div className="flex flex-wrap gap-3">
                {timeRanges.map((range) => (
                  <button key={range.id} onClick={() => setSelectedTimeRange(range.id)}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                      selectedTimeRange === range.id ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                    }`}>
                    {range.name}<span className="ml-1 text-xs opacity-60">({range.description})</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 推演按钮 */}
            <motion.button variants={fadeInUp} onClick={handlePredict}
              disabled={selectedSystems.length === 0 || state === 'loading'}
              className="w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 py-5 rounded-xl font-serif tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {state === 'loading' ? '推演中...' : '启·演'}
            </motion.button>

            {/* 结果区 */}
            {state !== 'idle' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
                <h2 className="text-xl font-serif text-white mb-6">推演结果</h2>

                {state === 'loading' ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">正在推演...</p>
                  </div>
                ) : state === 'error' ? (
                  <div className="text-center py-12 text-red-400">{error}</div>
                ) : (
                  <div className="space-y-6">
                    {/* 综合 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-4xl font-serif text-amber-400 mb-1">{getOverallFortune().text}</div>
                        <div className="text-sm text-gray-500">综合论断</div>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-4xl font-serif text-blue-400 mb-1">{getOverallFortune().score}</div>
                        <div className="text-sm text-gray-500">综合评分</div>
                      </div>
                    </div>

                    {/* 各系统结果 */}
                    {results.map((r, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-amber-400 font-medium mb-3">{r.name}</div>
                        {r.system === 'meihua' && (
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">卦名</div><div className="text-white">{r.guaName}</div></div>
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">卦数</div><div className="text-white">{r.guaNum}</div></div>
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">解读</div><div className="text-white text-xs">{r.interpretation?.slice(0,20) || '—'}</div></div>
                          </div>
                        )}
                        {r.system === 'liuyao' && (
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">卦名</div><div className="text-white">{r.guaName}</div></div>
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">世爻</div><div className="text-white">第{r.shiYao}爻</div></div>
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">六亲</div><div className="text-white text-xs">{(r.liuqin || []).slice(0,3).join(',')}</div></div>
                          </div>
                        )}
                        {r.system === 'qimen' && (
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">局数</div><div className="text-white">{r.ju}</div></div>
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">值符</div><div className="text-white">{r.zhiFu}</div></div>
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">值使</div><div className="text-white">{r.zhiShi}</div></div>
                          </div>
                        )}
                        {r.system === 'bazi' && (
                          <div className="grid grid-cols-4 gap-3 text-sm">
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">年柱</div><div className="text-white">{r.year}</div></div>
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">月柱</div><div className="text-white">{r.month}</div></div>
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">日柱</div><div className="text-white">{r.day}</div></div>
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">评分</div><div className="text-white">{r.score}</div></div>
                          </div>
                        )}
                        {r.system === 'ziwei' && (
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">命宫</div><div className="text-white">{r.mainPalace}</div></div>
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">主星</div><div className="text-white">{r.mainStar}</div></div>
                            <div className="text-center p-2 bg-white/5 rounded"><div className="text-gray-400 text-xs">运势</div><div className="text-white">{r.score || '—'}</div></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </PageContainer>
  );
}