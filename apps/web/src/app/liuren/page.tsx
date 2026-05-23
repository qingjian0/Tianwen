'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LiurenPage() {
  const [dateTime, setDateTime] = useState('');
  const [resultVisible, setResultVisible] = useState(false);

  const handlePaiPan = () => {
    setResultVisible(true);
  };

  return (
    <PageLayout>
      <div className="space-y-12">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="mb-6">
            <span className="text-imperial-gold/60 text-xs tracking-[0.5em]">
              最高占卜术
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-song font-bold text-gradient-gold mb-6">
            大六壬
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 font-kai leading-relaxed">
            大六壬是中国古代三大占卜术之一，以天人感应为基础，通过天地盘、四课、三传的推演来预测事物发展，被誉为“占卜之王”。
          </p>
          <Button size="lg" onClick={handlePaiPan}>
            开始排盘
          </Button>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover header="排盘方式" icon={<div className="text-2xl">📅</div>}>
              <p className="text-text-secondary font-kai mb-4">支持多种排盘方式</p>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-imperial-gold rounded-full"></span>
                  日期时间自动排盘
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-imperial-gold rounded-full"></span>
                  手动输入参数排盘
                </li>
              </ul>
            </Card>
            <Card hover header="神煞解读" icon={<div className="text-2xl">✨</div>}>
              <p className="text-text-secondary font-kai mb-4">完整的神煞系统</p>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-imperial-gold rounded-full"></span>
                  十二天将
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-imperial-gold rounded-full"></span>
                  贵神系统
                </li>
              </ul>
            </Card>
            <Card hover header="课体分析" icon={<div className="text-2xl">📊</div>}>
              <p className="text-text-secondary font-kai mb-4">专业的课体解析</p>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-imperial-gold rounded-full"></span>
                  九宗门
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-imperial-gold rounded-full"></span>
                  六十四课体
                </li>
              </ul>
            </Card>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card header="排盘参数">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="日期时间"
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  inputSize="lg"
                />
              </div>
              <div>
                <Input
                  label="占事（可选）"
                  placeholder="请输入您想占卜的事情"
                  inputSize="lg"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Button size="lg" onClick={handlePaiPan}>
                排盘
              </Button>
            </div>
          </Card>
        </motion.section>

        {resultVisible && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-song text-text-primary mb-2">排盘结果</h2>
              <p className="text-text-secondary text-sm">以下为示例数据，实际排盘需接入算法引擎</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card header="三传四课">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 border border-imperial-gold/20 rounded-lg bg-bg-card/50">
                      <div className="text-xs text-text-muted mb-2">初传</div>
                      <div className="text-3xl font-song text-imperial-gold">子</div>
                      <div className="text-xs text-text-muted mt-1">青龙</div>
                    </div>
                    <div className="p-4 border border-imperial-gold/20 rounded-lg bg-bg-card/50">
                      <div className="text-xs text-text-muted mb-2">中传</div>
                      <div className="text-3xl font-song text-imperial-gold">丑</div>
                      <div className="text-xs text-text-muted mt-1">朱雀</div>
                    </div>
                    <div className="p-4 border border-imperial-gold/20 rounded-lg bg-bg-card/50">
                      <div className="text-xs text-text-muted mb-2">末传</div>
                      <div className="text-3xl font-song text-imperial-gold">寅</div>
                      <div className="text-xs text-text-muted mt-1">六合</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-imperial-gold/15 rounded-lg">
                      <div className="text-xs text-text-muted mb-2">四课</div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="text-lg text-text-primary">卯</div>
                        <div className="text-lg text-text-primary">辰</div>
                        <div className="text-lg text-text-primary">巳</div>
                        <div className="text-lg text-text-primary">午</div>
                      </div>
                    </div>
                    <div className="p-4 border border-imperial-gold/15 rounded-lg">
                      <div className="text-xs text-text-muted mb-2">地盘</div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="text-lg text-text-muted">未</div>
                        <div className="text-lg text-text-muted">申</div>
                        <div className="text-lg text-text-muted">酉</div>
                        <div className="text-lg text-text-muted">戌</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card header="简要解读">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-imperial-gold mb-2">课体</div>
                    <div className="text-lg font-song text-text-primary">元首课</div>
                  </div>
                  <div>
                    <div className="text-sm text-imperial-gold mb-2">判断</div>
                    <p className="text-text-secondary font-kai leading-relaxed">
                      元首课者，乾为首，坤为腹，事有元首，吉庆之象。初传得位，中传相助，末传有成，凡事顺遂。
                    </p>
                  </div>
                  <div>
                    <div className="text-sm text-imperial-gold mb-2">宜忌</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-jade/10 text-jade rounded-full text-xs">宜：出行、求财</span>
                      <span className="px-3 py-1 bg-vermillion/10 text-vermillion rounded-full text-xs">忌：诉讼、嫁娶</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card header="天地盘">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm text-text-muted mb-4">地盘</div>
                  <div className="relative w-48 h-48 mx-auto rounded-full border-2 border-imperial-gold/30 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>巳</div><div>午</div><div>未</div>
                        <div>辰</div><div>中</div><div>申</div>
                        <div>卯</div><div>寅</div><div>丑</div>
                      </div>
                    </div>
                    {['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'].map((char, i) => {
                      const angle = (i * 30 - 90) * Math.PI / 180;
                      const x = Math.cos(angle) * 75;
                      const y = Math.sin(angle) * 75;
                      return (
                        <div
                          key={char}
                          className="absolute w-8 h-8 flex items-center justify-center text-sm text-imperial-gold font-song"
                          style={{
                            transform: `translate(${x}px, ${y}px)`,
                            left: '50%',
                            top: '50%',
                            marginLeft: '-16px',
                            marginTop: '-16px',
                          }}
                        >
                          {char}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-text-muted mb-4">天盘</div>
                  <div className="relative w-48 h-48 mx-auto rounded-full border-2 border-imperial-gold/30 flex items-center justify-center">
                    {['亥','子','丑','寅','卯','辰','巳','午','未','申','酉','戌'].map((char, i) => {
                      const angle = (i * 30 - 90) * Math.PI / 180;
                      const x = Math.cos(angle) * 75;
                      const y = Math.sin(angle) * 75;
                      return (
                        <div
                          key={char}
                          className="absolute w-8 h-8 flex items-center justify-center text-sm text-text-primary font-song"
                          style={{
                            transform: `translate(${x}px, ${y}px)`,
                            left: '50%',
                            top: '50%',
                            marginLeft: '-16px',
                            marginTop: '-16px',
                          }}
                        >
                          {char}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-text-muted mb-4">人盘</div>
                  <div className="relative w-48 h-48 mx-auto rounded-full border-2 border-imperial-gold/30 flex items-center justify-center bg-imperial-gold/5">
                    <div className="text-4xl text-imperial-gold font-song">壬</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>
        )}
      </div>
    </PageLayout>
  );
}
