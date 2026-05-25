'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MeihuaEngine } from '@tianwen/meihua';

// 八卦数据
const BAGUA = [
  { name: '乾', symbol: '☰', element: '金', yin: 0b111 },
  { name: '兑', symbol: '☱', element: '金', yin: 0b110 },
  { name: '离', symbol: '☲', element: '火', yin: 0b101 },
  { name: '震', symbol: '☳', element: '木', yin: 0b100 },
  { name: '巽', symbol: '☴', element: '木', yin: 0b011 },
  { name: '坎', symbol: '☵', element: '水', yin: 0b010 },
  { name: '艮', symbol: '☶', element: '土', yin: 0b001 },
  { name: '坤', symbol: '☷', element: '土', yin: 0b000 }
];

// 起卦方式
const QIGUA_MODES = [
  { id: 'time', name: '时间起卦' },
  { id: 'double', name: '双数起卦' },
  { id: 'manual', name: '手动起卦' }
];

export default function MeihuaPage() {
  const [engine] = useState(() => new MeihuaEngine());
  const [currentMode, setCurrentMode] = useState('time');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [queryContent, setQueryContent] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [location, setLocation] = useState('未知地_北京时间_--');
  
  // 双数起卦状态
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [addShichen, setAddShichen] = useState(false);
  
  // 手动起卦状态
  const [manualYao, setManualYao] = useState([1, 1, 1, 1, 1, 1]); // 1=阳, 0=阴
  const [dongYao, setDongYao] = useState([false, false, false, false, false, false]);
  
  // 结果状态
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 格式化日期时间
  const formatDateTime = (dt: Date) => {
    return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()} ${dt.getHours()}:${String(dt.getMinutes()).padStart(2, '0')}`;
  };

  // 切换动爻
  const toggleDongYao = (index: number) => {
    const newDongYao = [...dongYao];
    newDongYao[index] = !newDongYao[index];
    setDongYao(newDongYao);
  };

  // 切换爻的阴阳
  const toggleYao = (index: number) => {
    const newYao = [...manualYao];
    newYao[index] = newYao[index] === 1 ? 0 : 1;
    setManualYao(newYao);
  };

  // 重置
  const handleReset = () => {
    setQueryContent('');
    setDateTime(new Date());
    setNum1('');
    setNum2('');
    setAddShichen(false);
    setManualYao([1, 1, 1, 1, 1, 1]);
    setDongYao([false, false, false, false, false, false]);
    setShowResult(false);
    setResult(null);
  };

  // 排盘
  const handlePaipan = () => {
    try {
      // 设置配置
      engine.setConfig({ addShichen: addShichen });
      
      let divResult;
      
      switch (currentMode) {
        case 'time':
          divResult = engine.divinateByTime(dateTime);
          break;
        case 'double':
          if (num1 && num2) {
            divResult = engine.divinateByDoubleNumber(parseInt(num1), parseInt(num2));
          }
          break;
        case 'manual':
          const shangGua = getGuaFromYao(manualYao.slice(3));
          const xiaGua = getGuaFromYao(manualYao.slice(0, 3));
          const dongYaoPositions = dongYao
            .map((d, i) => d ? i + 1 : null)
            .filter(d => d !== null) as number[];
          
          if (shangGua && xiaGua) {
            divResult = engine.divinateByManual(shangGua, xiaGua, dongYaoPositions);
          }
          break;
      }
      
      if (divResult) {
        setResult(divResult);
        setShowResult(true);
      }
    } catch (error) {
      console.error('排盘失败:', error);
    }
  };

  // 从爻获取卦名
  const getGuaFromYao = (yao: number[]) => {
    const num = yao[0] * 4 + yao[1] * 2 + yao[2];
    const baguaMap = [
      { num: 0b000, name: '坤' },
      { num: 0b001, name: '艮' },
      { num: 0b010, name: '坎' },
      { num: 0b011, name: '巽' },
      { num: 0b100, name: '震' },
      { num: 0b101, name: '离' },
      { num: 0b110, name: '兑' },
      { num: 0b111, name: '乾' }
    ];
    return baguaMap.find(b => b.num === num)?.name;
  };

  // 获取卦名
  const getGuaName = () => {
    if (currentMode === 'manual') {
      const shangGua = getGuaFromYao(manualYao.slice(3));
      const xiaGua = getGuaFromYao(manualYao.slice(0, 3));
      return `${shangGua}为${xiaGua} 之 ${shangGua}为${xiaGua}`;
    }
    return '风水涣 之 天水讼';
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* 顶部导航栏 */}
      <div className="bg-[#c0392b] text-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4">
          <button className="text-3xl">←</button>
          <h1 className="text-2xl font-bold">神算堂梅花易数</h1>
          <button className="text-2xl">•••</button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="p-4 pb-32">
        {/* 核心操作区 */}
        <div className="space-y-6 mb-8">
          {/* 占问内容 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <input
              type="text"
              placeholder="请填写占问内容"
              value={queryContent}
              onChange={(e) => setQueryContent(e.target.value)}
              className="w-full text-2xl placeholder-gray-400 outline-none"
            />
          </div>

          {/* 起卦时间 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-between">
            <span className="text-3xl text-gray-800">起卦时间</span>
            <span className="text-3xl text-gray-800">{formatDateTime(dateTime)}</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="text-4xl text-gray-600"
              >
                ▽
              </button>
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
              <button className="text-4xl text-gray-600">▽</button>
              <button className="text-4xl text-gray-600">📍</button>
            </div>
          </div>
        </div>

        {/* 起卦方式选择区 */}
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl text-gray-800">
              {QIGUA_MODES.find(m => m.id === currentMode)?.name}
            </span>
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="text-5xl text-gray-600"
            >
              ▽
            </button>
          </div>
          {showResult && (
            <span className="text-3xl text-gray-800">{getGuaName()}</span>
          )}
        </div>

        {/* 起卦方式下拉菜单 */}
        {showModeDropdown && (
          <div className="bg-white rounded-xl shadow-lg mb-4 overflow-hidden">
            {QIGUA_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => {
                  setCurrentMode(mode.id);
                  setShowModeDropdown(false);
                }}
                className={`w-full p-5 text-2xl text-left ${
                  currentMode === mode.id ? 'bg-red-50 text-[#c0392b]' : 'text-gray-800'
                }`}
              >
                {mode.name}
              </button>
            ))}
          </div>
        )}

        {/* 功能主体区 */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mx-4">
          {currentMode === 'time' && (
            <div className="text-center py-8">
              <p className="text-2xl text-gray-600 leading-relaxed">
                根据输入时间起卦 直接点击排盘即可
              </p>
            </div>
          )}

          {currentMode === 'double' && (
            <div className="space-y-6">
              <input
                type="number"
                placeholder="[请输入第一个数字]"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                className="w-full p-5 text-3xl border-2 border-[#c0392b] rounded-2xl text-center placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="[请输入第二个数字]"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                className="w-full p-5 text-3xl border-2 border-[#c0392b] rounded-2xl text-center placeholder-gray-400"
              />
              
              <div className="flex items-center gap-4 mt-8">
                <span className="text-3xl text-gray-800">动爻加时辰</span>
                <button
                  onClick={() => setAddShichen(!addShichen)}
                  className={`w-24 h-14 rounded-full ${
                    addShichen ? 'bg-[#c0392b]' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-12 h-12 bg-white rounded-full shadow transform transition-transform ${
                    addShichen ? 'translate-x-12' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <p className="text-2xl text-gray-500 mt-6 leading-relaxed">
                说明:上卦数字除8,余数取上卦;下卦数字除8,余数取下卦;全数之和除6,余数取动爻。
              </p>
            </div>
          )}

          {currentMode === 'manual' && (
            <div className="py-4">
              <div className="space-y-5">
                {['上爻', '五爻', '四爻', '三爻', '二爻', '初爻'].map((label, index) => (
                  <div key={index} className="flex items-center gap-6">
                    <span className="text-4xl text-gray-800 w-24">{label}</span>
                    <button
                      onClick={() => toggleYao(index)}
                      className={`flex-1 h-12 rounded-full ${
                        manualYao[index] === 1 
                          ? 'bg-[#c0392b]' 
                          : 'flex gap-6 justify-center items-center'
                      }`}
                    >
                      {manualYao[index] === 0 && (
                        <>
                          <div className="w-1/3 h-12 bg-[#c0392b] rounded-full" />
                          <div className="w-1/3 h-12 bg-[#c0392b] rounded-full" />
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => toggleDongYao(index)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                        dongYao[index]
                          ? 'bg-[#c0392b] text-white'
                          : 'bg-red-100 text-[#c0392b]'
                      }`}
                    >
                      动
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部操作按钮区 */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#f8f8f8] p-6 pb-16">
        <div className="flex gap-6 max-w-lg mx-auto">
          <button
            onClick={handleReset}
            className="flex-1 py-5 text-3xl bg-white text-[#c0392b] border-2 border-[#c0392b] rounded-3xl"
          >
            重置
          </button>
          <button
            onClick={handlePaipan}
            className="flex-1 py-5 text-3xl bg-[#c0392b] text-white rounded-3xl"
          >
            排盘
          </button>
        </div>
      </div>

      {/* 结果展示（模拟）*/}
      {showResult && result && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#c0392b]">排盘结果</h2>
            <div className="text-center py-8">
              <p className="text-2xl text-gray-600">卦象已生成</p>
              <p className="text-xl text-gray-500 mt-4">
                {result.benGua?.name} 之 {result.bianGua?.name}
              </p>
            </div>
            <button
              onClick={() => setShowResult(false)}
              className="w-full py-4 bg-[#c0392b] text-white text-xl rounded-xl mt-6"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
