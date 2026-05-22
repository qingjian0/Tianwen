'use client';

import { useState } from 'react';
import { DivinationForm } from '@/components/divination/DivinationForm';
import { HexagramDisplay } from '@/components/divination/HexagramDisplay';

interface FormData {
  time: string;
  location: string;
  method: string;
  number1: string;
  number2: string;
  number3: string;
  advanced: {
    switchGeneral: string;
    zhongqi: boolean;
    dayNight: string;
    harmMethod: string;
  };
}

export default function HomePage() {
  const [hexagram, setHexagram] = useState<{ upper: number; lower: number; changingLine: number } | null>(null);

  const handleSubmit = (data: FormData) => {
    const upper = parseInt(data.number1) % 8;
    const lower = parseInt(data.number2) % 8;
    const changingLine = parseInt(data.number3) || 0;
    
    setHexagram({
      upper: upper === 0 ? 7 : upper - 1,
      lower: lower === 0 ? 7 : lower - 1,
      changingLine,
    });
  };

  return (
    <div className="flex h-[calc(100vh-56px)]">
      <div className="w-96 p-6 overflow-y-auto scrollbar-thin border-r border-border">
        <div className="mb-6">
          <h2 className="font-song text-xl font-bold text-text-primary mb-2">梅花易数</h2>
          <p className="text-sm text-text-muted font-kai">观梅占数 · 心易妙法</p>
        </div>
        <DivinationForm onSubmit={handleSubmit} />
      </div>

      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-bg-card border border-border rounded-sm p-6 shadow-card">
                <h3 className="font-song text-lg font-bold text-text-primary mb-4">今日概览</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg-medium rounded-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-text-muted text-sm">今日运势</span>
                      <span className="text-gold font-bold text-lg">良好</span>
                    </div>
                    <div className="h-2 bg-bg-dark rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-gold to-gold-light rounded-full" />
                    </div>
                  </div>
                  <div className="bg-bg-medium rounded-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-text-muted text-sm">本周占卜</span>
                      <span className="text-primary-light font-bold text-lg">3次</span>
                    </div>
                    <div className="flex gap-1">
                      {['大六壬', '梅花易数', '奇门'].map((item, idx) => (
                        <div key={idx} className="flex-1 text-xs text-center px-2 py-1 bg-bg-dark rounded-sm text-text-secondary">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-bg-card border border-border rounded-sm p-6 shadow-card">
                <h3 className="font-song text-lg font-bold text-text-primary mb-4">热门工具</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: '快速起卦', icon: '⚡', color: 'primary' },
                    { name: '八字排盘', icon: '☯', color: 'gold' },
                    { name: '黄历查询', icon: '📅', color: 'success' },
                    { name: '姓名分析', icon: '✍️', color: 'info' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className={`flex items-center gap-3 p-4 bg-bg-medium rounded-sm border border-border hover:border-border-light transition-all ${
                        item.color === 'primary' ? 'hover:bg-primary/10' : ''
                      } ${item.color === 'gold' ? 'hover:bg-gold/10' : ''} ${item.color === 'success' ? 'hover:bg-success/10' : ''} ${item.color === 'info' ? 'hover:bg-info/10' : ''}`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-kai text-text-secondary">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {hexagram ? (
                <HexagramDisplay
                  upperTrigram={hexagram.upper}
                  lowerTrigram={hexagram.lower}
                  changingLine={hexagram.changingLine}
                />
              ) : (
                <div className="bg-bg-card border border-border rounded-sm p-6 shadow-card">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">☯</div>
                    <div className="text-text-secondary font-kai">选择起卦方式</div>
                    <div className="text-text-muted text-sm mt-2">开始您的占卜之旅</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-64 p-6 border-l border-border bg-bg-medium/50">
        <h3 className="font-song text-lg font-bold text-text-primary mb-4">今日运势</h3>
        <div className="space-y-3">
          {['事业', '财运', '感情', '健康'].map((item, idx) => {
            const stars = [4, 5, 3, 4];
            const percentages = [85, 75, 80, 90];
            return (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-text-secondary">{item}</span>
                  <span className="text-xs text-text-muted">
                    {'⭐'.repeat(stars[idx])}
                  </span>
                </div>
                <div className="h-1.5 bg-bg-dark rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-gold' : idx === 2 ? 'bg-success' : 'bg-info'
                    }`}
                    style={{ width: `${percentages[idx]}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <h3 className="font-song text-lg font-bold text-text-primary mb-4">今日宜忌</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-success">
              <span>宜</span>
              <span className="text-sm">祭祀、祈福、求嗣</span>
            </div>
            <div className="flex items-center gap-2 text-danger">
              <span>忌</span>
              <span className="text-sm">嫁娶、开市、动土</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-song text-lg font-bold text-text-primary mb-4">系统提示</h3>
          <div className="space-y-2">
            {[
              '今日宜静心思考',
              '下午运势较佳',
              '注意沟通方式',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-primary-light">•</span>
                <span className="text-sm text-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
