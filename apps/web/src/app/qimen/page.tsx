'use client';

import React, { useState } from 'react';

export default function QimenPage() {
  const [dateTime, setDateTime] = useState(new Date());
  const [panType, setPanType] = useState<'chaibu' | 'zhirun' | 'maoshan'>('chaibu');
  const [panJuType, setPanJuType] = useState<'zhuan' | 'fei'>('zhuan');
  const [location, setLocation] = useState('未知地_北京时间_--');
  const [showResult, setShowResult] = useState(false);

  const formatDateTime = (dt: Date) => {
    return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()} ${dt.getHours()}:${String(dt.getMinutes()).padStart(2, '0')}`;
  };

  const handleReset = () => {
    setDateTime(new Date());
    setPanType('chaibu');
    setPanJuType('zhuan');
    setLocation('未知地_北京时间_--');
    setShowResult(false);
  };

  const handlePaipan = () => {
    setShowResult(true);
  };

  // 九宫格数据
  const ninePalaces = [
    { position: '巽', palace: '东南', star: '天辅星', gate: '杜门', stem: '甲', branch: '辰' },
    { position: '离', palace: '正南', star: '天英星', gate: '景门', stem: '丙', branch: '午' },
    { position: '坤', palace: '西南', star: '天芮星', gate: '死门', stem: '己', branch: '未' },
    { position: '震', palace: '正东', star: '天冲星', gate: '伤门', stem: '乙', branch: '卯' },
    { position: '中', palace: '中宫', star: '天禽星', gate: '', stem: '戊', branch: '' },
    { position: '兑', palace: '正西', star: '天柱星', gate: '惊门', stem: '庚', branch: '酉' },
    { position: '艮', palace: '东北', star: '天任星', gate: '生门', stem: '辛', branch: '丑' },
    { position: '坎', palace: '正北', star: '天蓬星', gate: '休门', stem: '壬', branch: '子' },
    { position: '乾', palace: '西北', star: '天心星', gate: '开门', stem: '丁', branch: '戌' }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* 顶部导航栏 */}
      <div className="bg-[#D92121] text-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4">
          <button className="text-3xl">←</button>
          <h1 className="text-2xl font-bold">奇门遁甲排盘</h1>
          <button className="text-2xl">•••</button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="p-4 pb-32">
        {/* 核心操作区 */}
        <div className="space-y-6 mb-8">
          {/* 起卦时间 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-between">
            <span className="text-3xl text-gray-800">起盘时间</span>
            <span className="text-3xl text-gray-800">{formatDateTime(dateTime)}</span>
            <div className="flex items-center gap-4">
              <button className="text-4xl text-gray-600">▼</button>
              <button
                onClick={() => setDateTime(new Date())}
                className="text-4xl text-gray-600"
              >
                ↻
              </button>
            </div>
          </div>

          {/* 地点设置 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-between">
            <span className="text-3xl text-gray-800">{location}</span>
            <div className="flex items-center gap-4">
              <button className="text-4xl text-gray-600">▼</button>
              <button className="text-4xl text-gray-600">📍</button>
            </div>
          </div>
        </div>

        {/* 起卦方式选择区 */}
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl text-gray-800">
              {panType === 'chaibu' ? '拆补法' : panType === 'zhirun' ? '置闰法' : '茅山法'}
            </span>
            <button
              onClick={() => {
                // 循环切换
                if (panType === 'chaibu') setPanType('zhirun');
                else if (panType === 'zhirun') setPanType('maoshan');
                else setPanType('chaibu');
              }}
              className="text-5xl text-gray-600"
            >
              ▼
            </button>
          </div>
        </div>

        {/* 功能主体区 - 排盘选择 */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mx-4 mb-8">
          <div className="space-y-6">
            {/* 转盘/飞盘选择 */}
            <div className="flex items-center justify-center gap-8 py-4">
              <button
                onClick={() => setPanJuType('zhuan')}
                className={`px-8 py-4 text-2xl rounded-xl border-2 transition-colors ${
                  panJuType === 'zhuan'
                    ? 'bg-[#D92121] text-white border-[#D92121]'
                    : 'bg-white text-gray-800 border-gray-300'
                }`}
              >
                转盘奇门
              </button>
              <button
                onClick={() => setPanJuType('fei')}
                className={`px-8 py-4 text-2xl rounded-xl border-2 transition-colors ${
                  panJuType === 'fei'
                    ? 'bg-[#D92121] text-white border-[#D92121]'
                    : 'bg-white text-gray-800 border-gray-300'
                }`}
              >
                飞盘奇门
              </button>
            </div>

            {/* 九宫格预览 */}
            <div className="py-6">
              <h3 className="text-2xl text-gray-800 text-center mb-6">九宫排盘</h3>
              
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                {ninePalaces.map((palace, index) => (
                  <div
                    key={index}
                    className={`aspect-square border-2 rounded-xl flex flex-col items-center justify-center p-2 ${
                      index === 4
                        ? 'border-[#D92121] bg-red-50'
                        : 'border-[#F8D7DA] bg-white'
                    }`}
                  >
                    <div className="text-lg font-bold text-[#D92121] mb-1">
                      {palace.position}宫
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{palace.star}</div>
                    <div className="text-sm text-gray-500">{palace.gate}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {palace.stem}{palace.branch}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 简要说明 */}
            <div className="text-center py-4">
              <p className="text-xl text-gray-500">
                {panType === 'chaibu' ? '拆补法' : panType === 'zhirun' ? '置闰法' : '茅山法'} · {panJuType === 'zhuan' ? '转盘' : '飞盘'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作按钮区 */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#f5f5f5] p-6 pb-16">
        <div className="flex gap-6 max-w-lg mx-auto">
          <button
            onClick={handleReset}
            className="flex-1 py-5 text-3xl bg-white text-[#D92121] border-2 border-[#D92121] rounded-3xl"
          >
            重置
          </button>
          <button
            onClick={handlePaipan}
            className="flex-1 py-5 text-3xl bg-[#D92121] text-white rounded-3xl"
          >
            排盘
          </button>
        </div>
      </div>

      {/* 结果展示弹窗 */}
      {showResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#D92121]">奇门遁甲排盘结果</h2>
            
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="text-center">
                <p className="text-xl text-gray-600">
                  {panType === 'chaibu' ? '拆补法' : panType === 'zhirun' ? '置闰法' : '茅山法'} · {panJuType === 'zhuan' ? '转盘' : '飞盘'}
                </p>
                <p className="text-lg text-gray-500">
                  {formatDateTime(dateTime)}
                </p>
              </div>

              {/* 完整九宫格 */}
              <div className="grid grid-cols-3 gap-3 py-4">
                {ninePalaces.map((palace, index) => (
                  <div
                    key={index}
                    className={`aspect-square border-2 rounded-xl flex flex-col items-center justify-center p-3 ${
                      index === 4
                        ? 'border-[#D92121] bg-red-50'
                        : 'border-[#F8D7DA] bg-white'
                    }`}
                  >
                    <div className="text-xl font-bold text-[#D92121] mb-1">
                      {palace.position}宫
                    </div>
                    <div className="text-base text-gray-700 mb-1">{palace.star}</div>
                    <div className="text-base text-gray-600">{palace.gate}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {palace.stem}{palace.branch}
                    </div>
                    <div className="text-xs text-gray-400">{palace.palace}</div>
                  </div>
                ))}
              </div>

              {/* 简要分析 */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">简要分析</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  值符<span className="text-[#D92121] font-bold">天辅星</span>落巽宫，
                  值使<span className="text-[#D92121] font-bold">杜门</span>落巽宫。
                  天盘与地盘组合良好，利于文书、学业、考试之事。
                  建议求测者结合具体事项，详看各宫生克关系。
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowResult(false)}
              className="w-full py-4 bg-[#D92121] text-white text-xl rounded-xl mt-6"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
