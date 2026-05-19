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

const baguaMap: Record<string, string> = { '乾': '☰', '兑': '☱', '离': '☲', '震': '☳', '巽': '☴', '坎': '☵', '艮': '☶', '坤': '☷' };
const baguaPos: Record<string, string> = { '乾': '西北', '兑': '西', '离': '南', '震': '东', '巽': '东南', '坎': '北', '艮': '东北', '坤': '西南' };
const baguaElem: Record<string, string> = { '乾':'金','兑':'金','离':'火','震':'木','巽':'木','坎':'水','艮':'土','坤':'土' };

type ChartType = 'meihua' | 'liuyao' | 'qimen' | 'bazi';

export default function ChartPage() {
  const [chartType, setChartType] = useState<ChartType>('meihua');
  const [meihuaData, setMeihuaData] = useState<any>(null);
  const [liuyaoData, setLiuyaoData] = useState<any>(null);
  const [qimenData, setQimenData] = useState<any>(null);
  const [baziData, setBaziData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChart(chartType);
  }, [chartType]);

  async function loadChart(type: ChartType) {
    setLoading(true);
    setError('');
    try {
      switch (type) {
        case 'meihua': {
          if (!meihuaData) {
            const res = await fetch(`${API}/api/meihua/divinate?method=time`);
            setMeihuaData((await res.json()).data || await res.json());
          }
          break;
        }
        case 'liuyao': {
          if (!liuyaoData) {
            const res = await fetch(`${API}/api/liuyao/divinate?method=time`);
            setLiuyaoData((await res.json()).data || await res.json());
          }
          break;
        }
        case 'qimen': {
          if (!qimenData) {
            const res = await fetch(`${API}/api/qimen/layout`);
            setQimenData((await res.json()).data || await res.json());
          }
          break;
        }
        case 'bazi': {
          if (!baziData) {
            const now = new Date();
            const res = await fetch(`${API}/api/bazi/calculate?year=${now.getFullYear()}&month=${now.getMonth()+1}&day=${now.getDate()}&gender=male`);
            setBaziData((await res.json()).data || await res.json());
          }
          break;
        }
      }
    } catch (e: any) {
      setError(e.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }

  const gz = baziData?.ganzhi || baziData?.chronoData?.ganzhi || {};

  return (
    <PageContainer>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <motion.h1 {...fadeInUp} className="text-4xl font-serif text-amber-400 mb-2">排盘</motion.h1>
        <motion.p {...fadeInUp} className="text-gray-400 mb-8">仰观天文，俯察地理</motion.p>

        {/* 排盘类型选择 */}
        <motion.div {...fadeInUp} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6 mb-6">
          <label className="block text-sm text-gray-400 mb-4">选择排盘</label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'meihua', name: '梅花卦', desc: '观物取象' },
              { id: 'liuyao', name: '六爻', desc: '纳甲筮法' },
              { id: 'qimen', name: '奇门', desc: '九宫遁甲' },
              { id: 'bazi', name: '八字', desc: '四柱命理' },
            ].map((type) => (
              <button key={type.id} onClick={() => setChartType(type.id as ChartType)}
                className={`px-5 py-3 rounded-lg border transition-all duration-300 ${
                  chartType === type.id ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                }`}>
                <div className="font-medium">{type.name}</div>
                <div className="text-xs opacity-60">{type.desc}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">正在排盘...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 主排盘区 */}
            <motion.div {...fadeInUp} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6 lg:col-span-2">
              <h2 className="text-xl font-serif text-white mb-6">
                {chartType === 'meihua' && `梅花卦 · ${meihuaData?.benGua?.name || meihuaData?.name || '—'}`}
                {chartType === 'liuyao' && `六爻 · ${liuyaoData?.benGua?.name || '—'}`}
                {chartType === 'qimen' && `奇门遁甲 · ${(qimenData?.yinYang||qimenData?.juxing||'')}遁${qimenData?.ju||qimenData?.jushu||''}局`}
                {chartType === 'bazi' && '四柱八字'}
              </h2>

              {/* 梅花卦 */}
              {chartType === 'meihua' && meihuaData && (
                <div className="text-center space-y-6">
                  <div className="flex justify-center items-center gap-8">
                    <div className="text-center">
                      <div className="text-6xl mb-2">{baguaMap[meihuaData.benGua?.shangGua] || baguaMap[meihuaData.benGua?.name] || '—'}</div>
                      <div className="text-white font-serif text-lg">{meihuaData.benGua?.name || '—'}</div>
                      <div className="text-gray-500 text-sm">本卦</div>
                    </div>
                    {meihuaData.huGua && (
                      <div className="text-center">
                        <div className="text-5xl mb-2">{baguaMap[meihuaData.huGua?.name] || '—'}</div>
                        <div className="text-white font-serif text-lg">{meihuaData.huGua?.name || '—'}</div>
                        <div className="text-gray-500 text-sm">互卦</div>
                      </div>
                    )}
                    {meihuaData.bianGua && (
                      <div className="text-center">
                        <div className="text-6xl mb-2">{baguaMap[meihuaData.bianGua?.name] || '—'}</div>
                        <div className="text-white font-serif text-lg">{meihuaData.bianGua?.name || '—'}</div>
                        <div className="text-gray-500 text-sm">变卦</div>
                      </div>
                    )}
                  </div>
                  {meihuaData.interpretation && (
                    <p className="text-gray-300 text-sm max-w-md mx-auto">{meihuaData.interpretation}</p>
                  )}
                </div>
              )}

              {/* 六爻 */}
              {chartType === 'liuyao' && liuyaoData && (
                <div className="max-w-md mx-auto space-y-3">
                  {(liuyaoData.benGua?.yaos || []).slice().reverse().map((yao: any, idx: number) => (
                    <div key={idx}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        yao.state?.includes('Yang') || yao.type === 'yang' ? 'border-blue-500/20 bg-blue-500/5' : 'border-red-500/20 bg-red-500/5'
                      }`}>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm w-12">第{6-idx}爻</span>
                        <span className={`text-3xl ${yao.state?.includes('Yang') || yao.type === 'yang' ? 'text-blue-400' : 'text-red-400'}`}>
                          {yao.state?.includes('Yang') || yao.type === 'yang' ? '⚊' : '⚋'}
                        </span>
                        {yao.isShiyao && <span className="text-xs text-amber-400 px-1.5 py-0.5 bg-amber-500/10 rounded">世</span>}
                        {yao.isYingyao && <span className="text-xs text-blue-400 px-1.5 py-0.5 bg-blue-500/10 rounded">应</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">{yao.wuxing}</span>
                        <span className="text-gray-400">{yao.liuqin}</span>
                        {yao.isChanging && <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">动</span>}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>月建: {liuyaoData.yueJian || liuyaoData.month || '—'}</span>
                    <span>旬空: {liuyaoData.xunKong || '—'}</span>
                  </div>
                </div>
              )}

              {/* 奇门 */}
              {chartType === 'qimen' && qimenData && (
                <div className="max-w-lg mx-auto">
                  <div className="grid grid-cols-3 gap-2">
                    {['坎宫','坤宫','震宫','巽宫','中宫','乾宫','兑宫','艮宫','离宫'].map((name, idx) => {
                      const pData = qimenData.palaces?.[name];
                      return (
                        <div key={idx} className="p-3 bg-[#0a0a0f] border border-amber-500/10 rounded-lg text-center text-xs">
                          <div className="text-amber-400 mb-1">{name}</div>
                          {pData ? (
                            <div className="space-y-0.5">
                              <div className="text-white">{pData.eightStar || pData.star || '—'}</div>
                              <div className="text-gray-400">{pData.eightDoor || pData.door || '—'}</div>
                              {pData.deity && <div className="text-gray-500">{pData.deity}</div>}
                            </div>
                          ) : (
                            <div className="text-gray-600">—</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center gap-6 mt-4 text-sm">
                    <span className="text-gray-400">值符: <span className="text-amber-400">{qimenData.zhiFu?.star || qimenData.zhiFu || '—'}</span></span>
                    <span className="text-gray-400">值使: <span className="text-amber-400">{qimenData.zhiShi?.door || qimenData.zhiShi || '—'}</span></span>
                  </div>
                </div>
              )}

              {/* 八字 */}
              {chartType === 'bazi' && baziData && (
                <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {[
                    { label: '年柱', gan: (gz.year || baziData?.yearPillar || '—').slice(0, 1), zhi: (gz.year || baziData?.yearPillar || '—').slice(1) },
                    { label: '月柱', gan: (gz.month || baziData?.monthPillar || '—').slice(0, 1), zhi: (gz.month || baziData?.monthPillar || '—').slice(1) },
                    { label: '日柱', gan: (gz.day || baziData?.dayPillar || '—').slice(0, 1), zhi: (gz.day || baziData?.dayPillar || '—').slice(1) },
                    { label: '时柱', gan: (gz.hour || baziData?.hourPillar || '—').slice(0, 1), zhi: (gz.hour || baziData?.hourPillar || '—').slice(1) }
                  ].map((col, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-gray-500 text-sm mb-2">{col.label}</div>
                      <div className="bg-[#0a0a0f] border border-amber-500/10 rounded-lg p-4">
                        <div className="text-2xl text-amber-400 font-serif">{col.gan || '—'}</div>
                        <div className="text-sm text-gray-400">{col.zhi || '—'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 时间干支 */}
            <motion.div {...fadeInUp} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
              <h2 className="text-xl font-serif text-white mb-4">时间干支</h2>
              <div className="space-y-3">
                {[
                    { label: '年柱', value: gz.year || baziData?.yearPillar || '—' },
                    { label: '月柱', value: gz.month || baziData?.monthPillar || '—' },
                    { label: '日柱', value: gz.day || baziData?.dayPillar || '—' },
                    { label: '时柱', value: gz.hour || baziData?.hourPillar || '—' }
                ].map((col, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">{col.label}</span>
                    <span className="text-amber-400 font-serif text-lg">{col.value || '—'}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 text-center text-gray-500 text-sm">
                {new Date().toLocaleString('zh-CN')}
              </div>
            </motion.div>

            {/* 八卦信息 */}
            <motion.div {...fadeInUp} className="bg-[#12121c] border border-amber-500/10 rounded-xl p-6">
              <h2 className="text-xl font-serif text-white mb-4">八卦基础</h2>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(baguaMap).map(([name, symbol]) => (
                  <div key={name} className="text-center p-3 bg-[#0a0a0f] border border-amber-500/10 rounded-lg">
                    <div className="text-3xl text-amber-400 mb-1">{symbol}</div>
                    <div className="text-sm text-white">{name}</div>
                    <div className="text-xs text-gray-600">{baguaElem[name]}</div>
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