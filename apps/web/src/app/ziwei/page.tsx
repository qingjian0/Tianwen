'use client';

import React, { useState } from 'react';

export default function ZiweiPage() {
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

  // 紫微斗数数据
  const twelvePalaces = [
    { name: '命宫', star: '紫微', status: '庙' },
    { name: '兄弟', star: '天机', status: '旺' },
    { name: '夫妻', star: '太阴', status: '利' },
    { name: '子女', star: '贪狼', status: '陷' },
    { name: '财帛', star: '武曲', status: '庙' },
    { name: '疾厄', star: '天同', status: '旺' },
    { name: '迁移', star: '太阳', status: '庙' },
    { name: '交友', star: '巨门', status: '利' },
    { name: '官禄', star: '廉贞', status: '旺' },
    { name: '田宅', star: '天府', status: '庙' },
    { name: '福德', star: '天梁', status: '旺' },
    { name: '父母', star: '天相', status: '利' }
  ];

  const fourTransformations = [
    { name: '禄', position: '财帛' },
    { name: '权', position: '官禄' },
    { name: '科', position: '福德' },
    { name: '忌', position: '疾厄' }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* 顶部导航栏 */}
      <div className="bg-[#D92121] text-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4">
          <button className="text-3xl">←</button>
          <h1 className="text-2xl font-bold">紫微斗数排盘</h1>
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

        {/* 排盘预览区 */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mx-4 mb-8">
          <div className="space-y-6">
            {/* 十二宫预览 */}
            <div>
              <h3 className="text-2xl text-gray-800 text-center mb-6">十二宫位</h3>
              <div className="grid grid-cols-4 gap-3">
                {twelvePalaces.map((palace, index) => (
                  <div
                    key={index}
                    className={`text-center p-3 border-2 rounded-xl ${
                      palace.name === '命宫'
                        ? 'border-[#D92121] bg-red-50'
                        : 'border-[#F8D7DA] bg-white'
                    }`}
                  >
                    <div className="text-sm text-gray-600 mb-1">{palace.name}</div>
                    <div className="text-xl font-bold text-[#D92121]">{palace.star}</div>
                    <div className="text-sm text-gray-500">{palace.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 简要说明 */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xl text-gray-500">紫微独坐 · 命宫庙旺</p>
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
            <h2 className="text-3xl font-bold text-center mb-6 text-[#D92121]">紫微斗数排盘结果</h2>
            
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="text-center">
                <p className="text-xl text-gray-600">
                  {name || '求测者'} · {gender === 'male' ? '男命' : '女命'}
                </p>
                <p className="text-lg text-gray-500">
                  {calendarType === 'gregorian' ? '公历' : '农历'} {dateTime.getFullYear()}年{dateTime.getMonth() + 1}月{dateTime.getDate()}日{dateTime.getHours()}时
                </p>
              </div>

              {/* 完整十二宫 */}
              <div className="py-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">十二宫位</h3>
                <div className="grid grid-cols-4 gap-3">
                  {twelvePalaces.map((palace, index) => (
                    <div
                      key={index}
                      className={`text-center p-4 rounded-xl ${
                        palace.name === '命宫'
                          ? 'border-2 border-[#D92121] bg-red-50'
                          : 'border border-[#F8D7DA] bg-white'
                      }`}
                    >
                      <div className="text-sm text-gray-600 mb-2">{palace.name}</div>
                      <div className="text-2xl font-bold text-[#D92121]">{palace.star}</div>
                      <div className="text-sm text-gray-500">{palace.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 四化飞星 */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">四化飞星</h3>
                <div className="grid grid-cols-4 gap-4">
                  {fourTransformations.map((item, index) => (
                    <div key={index} className="text-center p-3 bg-[#F8D7DA] rounded-lg">
                      <div className="text-2xl font-bold text-[#D92121]">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.position}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 简要分析 */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">简要分析</h3>
                <div className="space-y-3 text-lg text-gray-600 leading-relaxed">
                  <p>
                    <span className="text-[#D92121] font-bold">【命宫】</span>
                    紫微独坐命宫，为人稳重正直，有领导才能，追求完美。
                  </p>
                  <p>
                    <span className="text-[#D92121] font-bold">【事业】</span>
                    官禄宫见太阳庙旺，事业发展顺利，适合从政或管理岗位。
                  </p>
                  <p>
                    <span className="text-[#D92121] font-bold">【财运】</span>
                    财帛宫见武曲，财运亨通，善于理财，财源广进。
                  </p>
                </div>
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
