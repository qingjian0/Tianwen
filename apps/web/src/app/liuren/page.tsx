'use client';

import React, { useState } from 'react';

export default function LiurenPage() {
  const [dateTime, setDateTime] = useState(new Date());
  const [location, setLocation] = useState('未知地_北京时间_--');
  const [showResult, setShowResult] = useState(false);

  const formatDateTime = (dt: Date) => {
    return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()} ${dt.getHours()}:${String(dt.getMinutes()).padStart(2, '0')}`;
  };

  const handleReset = () => {
    setDateTime(new Date());
    setLocation('未知地_北京时间_--');
    setShowResult(false);
  };

  const handlePaipan = () => {
    setShowResult(true);
  };

  // 大六壬数据
  const threeTransmissions = [
    { position: '初传', branch: '子', god: '青龙' },
    { position: '中传', branch: '丑', god: '朱雀' },
    { position: '末传', branch: '寅', god: '六合' }
  ];

  const fourLessons = [
    { name: '第一课', upper: '卯', lower: '辰' },
    { name: '第二课', upper: '巳', lower: '午' },
    { name: '第三课', upper: '未', lower: '申' },
    { name: '第四课', upper: '酉', lower: '戌' }
  ];

  const twelveEarthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* 顶部导航栏 */}
      <div className="bg-[#D92121] text-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4">
          <button className="text-3xl">←</button>
          <h1 className="text-2xl font-bold">大六壬排盘</h1>
          <button className="text-2xl">•••</button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="p-4 pb-32">
        {/* 核心操作区 */}
        <div className="space-y-6 mb-8">
          {/* 起卦时间 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-between">
            <span className="text-3xl text-gray-800">起课时间</span>
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

        {/* 功能主体区 - 排盘预览 */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mx-4 mb-8">
          <div className="space-y-8">
            {/* 三传 */}
            <div>
              <h3 className="text-2xl text-gray-800 text-center mb-6">三传</h3>
              <div className="grid grid-cols-3 gap-4">
                {threeTransmissions.map((item, index) => (
                  <div key={index} className="text-center p-4 border-2 border-[#F8D7DA] rounded-xl">
                    <div className="text-lg text-gray-600 mb-2">{item.position}</div>
                    <div className="text-4xl font-bold text-[#D92121]">{item.branch}</div>
                    <div className="text-lg text-gray-500 mt-2">{item.god}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 四课 */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-2xl text-gray-800 text-center mb-6">四课</h3>
              <div className="grid grid-cols-4 gap-3">
                {fourLessons.map((item, index) => (
                  <div key={index} className="text-center p-3 border border-[#F8D7DA] rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">{item.name}</div>
                    <div className="text-2xl text-gray-700">{item.upper}</div>
                    <div className="text-xl text-gray-500">—</div>
                    <div className="text-2xl text-gray-700">{item.lower}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 简要说明 */}
            <div className="text-center py-4">
              <p className="text-xl text-gray-500">元首课 · 吉庆之象</p>
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
            <h2 className="text-3xl font-bold text-center mb-6 text-[#D92121]">大六壬排盘结果</h2>
            
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="text-center">
                <p className="text-xl text-gray-600">元首课</p>
                <p className="text-lg text-gray-500">{formatDateTime(dateTime)}</p>
              </div>

              {/* 完整三传四课 */}
              <div className="space-y-6 py-4">
                {/* 三传 */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">三传</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {threeTransmissions.map((item, index) => (
                      <div key={index} className="text-center p-4 border-2 border-[#D92121] rounded-xl bg-red-50">
                        <div className="text-lg text-gray-700 mb-2">{item.position}</div>
                        <div className="text-4xl font-bold text-[#D92121]">{item.branch}</div>
                        <div className="text-lg text-gray-600 mt-2">{item.god}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 四课 */}
                <div className="pt-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">四课</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {fourLessons.map((item, index) => (
                      <div key={index} className="text-center p-4 border border-[#F8D7DA] rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">{item.name}</div>
                        <div className="text-2xl text-gray-800">{item.upper}</div>
                        <div className="text-xl text-gray-500">—</div>
                        <div className="text-2xl text-gray-800">{item.lower}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 简要分析 */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">简要分析</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  元首课者，乾为首，事有元首，吉庆之象。
                  初传<span className="text-[#D92121] font-bold">子（青龙）</span>得位，
                  中传<span className="text-[#D92121] font-bold">丑（朱雀）</span>相助，
                  末传<span className="text-[#D92121] font-bold">寅（六合）</span>有成。
                  凡事顺遂，宜求财、出行。
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
