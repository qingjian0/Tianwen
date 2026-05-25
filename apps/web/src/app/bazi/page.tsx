'use client';

import React, { useState } from 'react';

export default function BaziPage() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [dateTime, setDateTime] = useState(new Date());
  const [calendarType, setCalendarType] = useState<'gregorian' | 'lunar'>('gregorian');
  const [location, setLocation] = useState('未知地_北京时间_--');
  const [showResult, setShowResult] = useState(false);

  const formatDateTime = (dt: Date) => {
    return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()} ${dt.getHours()}:${String(dt.getMinutes()).padStart(2, '0')}`;
  };

  const handleReset = () => {
    setName('');
    setGender('male');
    setDateTime(new Date());
    setCalendarType('gregorian');
    setLocation('未知地_北京时间_--');
    setShowResult(false);
  };

  const handlePaipan = () => {
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* 顶部导航栏 */}
      <div className="bg-[#D92121] text-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4">
          <button className="text-3xl">←</button>
          <h1 className="text-2xl font-bold">八字四柱排盘</h1>
          <button className="text-2xl">•••</button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="p-4 pb-32">
        {/* 核心操作区 */}
        <div className="space-y-6 mb-8">
          {/* 姓名 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <input
              type="text"
              placeholder="请输入姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-2xl placeholder-gray-400 outline-none"
            />
          </div>

          {/* 性别选择 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-3xl text-gray-800">性别</span>
              <div className="flex gap-4">
                <button
                  onClick={() => setGender('male')}
                  className={`px-8 py-3 text-xl rounded-full border-2 transition-colors ${
                    gender === 'male'
                      ? 'bg-[#D92121] text-white border-[#D92121]'
                      : 'bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  男
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`px-8 py-3 text-xl rounded-full border-2 transition-colors ${
                    gender === 'female'
                      ? 'bg-[#D92121] text-white border-[#D92121]'
                      : 'bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  女
                </button>
              </div>
            </div>
          </div>

          {/* 出生日期时间 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg flex items-center justify-between">
            <span className="text-3xl text-gray-800">出生时间</span>
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

          {/* 日历类型选择 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-3xl text-gray-800">日历类型</span>
              <div className="flex gap-4">
                <button
                  onClick={() => setCalendarType('gregorian')}
                  className={`px-6 py-3 text-xl rounded-lg transition-colors ${
                    calendarType === 'gregorian'
                      ? 'bg-[#D92121] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  公历
                </button>
                <button
                  onClick={() => setCalendarType('lunar')}
                  className={`px-6 py-3 text-xl rounded-lg transition-colors ${
                    calendarType === 'lunar'
                      ? 'bg-[#D92121] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  农历
                </button>
              </div>
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

        {/* 排盘结果预览区 */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mx-4 mb-8">
          <div className="text-center py-4">
            <h3 className="text-2xl text-gray-800 mb-6">八字命盘</h3>
            
            {/* 年柱月柱日柱时柱 */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {['年柱', '月柱', '日柱', '时柱'].map((pillar, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl text-gray-600 mb-2">{pillar}</div>
                  <div className="text-4xl font-bold text-[#D92121]">
                    {['甲', '乙', '丙', '丁'][index]}
                  </div>
                  <div className="text-3xl text-gray-800 mt-1">
                    {['子', '丑', '寅', '卯'][index]}
                  </div>
                </div>
              ))}
            </div>

            {/* 简单说明 */}
            <p className="text-xl text-gray-500">
              {calendarType === 'gregorian' ? '公历' : '农历'} {dateTime.getFullYear()}年{dateTime.getMonth() + 1}月{dateTime.getDate()}日{dateTime.getHours()}时
            </p>
            <p className="text-lg text-gray-400 mt-2">
              {gender === 'male' ? '乾造' : '坤造'}
            </p>
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
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#D92121]">八字排盘结果</h2>
            
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="text-center">
                <p className="text-xl text-gray-600">
                  {name || '求测者'} · {gender === 'male' ? '乾造' : '坤造'}
                </p>
                <p className="text-lg text-gray-500">
                  {calendarType === 'gregorian' ? '公历' : '农历'} {dateTime.getFullYear()}年{dateTime.getMonth() + 1}月{dateTime.getDate()}日{dateTime.getHours()}时
                </p>
              </div>

              {/* 四柱八字 */}
              <div className="grid grid-cols-4 gap-4 py-4">
                {['年柱', '月柱', '日柱', '时柱'].map((pillar, index) => (
                  <div key={index} className="text-center p-4 border border-gray-200 rounded-xl">
                    <div className="text-sm text-gray-500 mb-2">{pillar}</div>
                    <div className="text-3xl font-bold text-[#D92121]">
                      {['甲', '乙', '丙', '丁'][index]}
                    </div>
                    <div className="text-2xl text-gray-700 mt-1">
                      {['子', '丑', '寅', '卯'][index]}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      {['海中金', '炉中火', '大林木', '路旁土'][index]}
                    </div>
                  </div>
                ))}
              </div>

              {/* 简要分析 */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">简要分析</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  日主天干为<span className="text-[#D92121] font-bold">丙火</span>，
                  代表命主性格热情开朗，积极向上。
                  八字中五行平衡，格局不错，
                  中年后运势逐步上升，事业财运可期。
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
