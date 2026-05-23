'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// 八字数据定义
interface BaziData {
  year: { tg: string; dz: string; shishen: string };
  month: { tg: string; dz: string; shishen: string };
  day: { tg: string; dz: string; shishen: string };
  time: { tg: string; dz: string; shishen: string };
  dayTiangan: string;
  interpretation: string;
}

// 生成示例八字数据
const generateSampleBazi = (): BaziData => {
  return {
    year: { tg: '甲', dz: '子', shishen: '比肩' },
    month: { tg: '丙', dz: '寅', shishen: '食神' },
    day: { tg: '甲', dz: '午', shishen: '日主' },
    time: { tg: '戊', dz: '辰', shishen: '偏财' },
    dayTiangan: '甲',
    interpretation: '甲木日主，生于寅月，得令得地，身强。年柱甲子，月柱丙寅，日柱甲午，时柱戊辰。五行木火土俱全，缺金水。'
  };
};

// 十神解释
const shishenInfo = [
  { name: '比肩', count: 2, desc: '自我意识、自尊心强，有竞争心' },
  { name: '食神', count: 1, desc: '智慧、福气，善于表达' },
  { name: '偏财', count: 1, desc: '财运、物质享受' },
];

export default function BaziPage() {
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [birthTime, setBirthTime] = useState('00:00');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [showResult, setShowResult] = useState(false);
  const [baziData, setBaziData] = useState<BaziData | null>(null);

  const handlePaipan = () => {
    const data = generateSampleBazi();
    setBaziData(data);
    setShowResult(true);
  };

  return (
    <PageLayout>
      <div className="space-y-12">
        {/* Hero区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="mb-6">
            <span className="text-imperial-gold/60 text-xs tracking-[0.5em]">
              BAZI PAIPAN
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-song font-bold text-gradient-gold mb-4">
            八字排盘
          </h1>
          <p className="text-xl text-text-secondary font-kai mb-6">
            命运密码
          </p>
          <p className="text-text-secondary font-kai max-w-2xl mx-auto mb-8 leading-relaxed">
            八字是根据出生年月日时排出的四柱命盘，通过天干地支的组合，分析人的性格、事业、财运、感情、健康等命运走向。
            天干有十：甲、乙、丙、丁、戊、己、庚、辛、壬、癸；地支有十二：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥。
          </p>
          <Button size="lg" onClick={handlePaipan}>
            开始排盘
          </Button>
        </motion.div>

        {/* 功能卡片网格 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover>
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-song text-xl font-bold text-text-primary mb-3">
                  命盘分析
                </h3>
                <p className="text-text-secondary font-kai leading-relaxed">
                  分析日主强弱、五行平衡、格局高低，解读你的先天命格与后天运势。
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="text-center">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="font-song text-xl font-bold text-text-primary mb-3">
                  大运流年
                </h3>
                <p className="text-text-secondary font-kai leading-relaxed">
                  查看十年大运与每年流年运势，把握人生机遇与挑战。
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="text-center">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="font-song text-xl font-bold text-text-primary mb-3">
                  十神解读
                </h3>
                <p className="text-text-secondary font-kai leading-relaxed">
                  深入解析十神配置，揭示你的性格特质与人际关系模式。
                </p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* 操作表单区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card header="排盘设置">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Input
                    label="出生日期"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    inputSize="lg"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    label="出生时间"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    inputSize="lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  性别
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setGender('male')}
                    className={`flex-1 px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
                      gender === 'male'
                        ? 'border-imperial-gold bg-imperial-gold/10 text-imperial-gold'
                        : 'border-imperial-gold/20 bg-transparent text-text-secondary hover:border-imperial-gold/40'
                    }`}
                  >
                    <div className="font-kai">男</div>
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`flex-1 px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
                      gender === 'female'
                        ? 'border-imperial-gold bg-imperial-gold/10 text-imperial-gold'
                        : 'border-imperial-gold/20 bg-transparent text-text-secondary hover:border-imperial-gold/40'
                    }`}
                  >
                    <div className="font-kai">女</div>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <Button size="lg" onClick={handlePaipan} className="w-full">
                  排盘
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 结果展示区域 */}
        {showResult && baziData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {/* 四柱展示 */}
            <Card header="四柱命盘">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-center py-3 px-4 text-imperial-gold font-song font-semibold">
                        年柱
                      </th>
                      <th className="text-center py-3 px-4 text-imperial-gold font-song font-semibold">
                        月柱
                      </th>
                      <th className="text-center py-3 px-4 text-imperial-gold font-song font-semibold">
                        日柱
                      </th>
                      <th className="text-center py-3 px-4 text-imperial-gold font-song font-semibold">
                        时柱
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center py-2 px-4">
                        <div className="text-3xl font-song text-text-primary">
                          {baziData.year.tg}
                        </div>
                      </td>
                      <td className="text-center py-2 px-4">
                        <div className="text-3xl font-song text-text-primary">
                          {baziData.month.tg}
                        </div>
                      </td>
                      <td className="text-center py-2 px-4">
                        <div className="text-3xl font-song text-imperial-gold">
                          {baziData.day.tg}
                        </div>
                      </td>
                      <td className="text-center py-2 px-4">
                        <div className="text-3xl font-song text-text-primary">
                          {baziData.time.tg}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center py-2 px-4">
                        <div className="text-3xl font-song text-text-primary">
                          {baziData.year.dz}
                        </div>
                      </td>
                      <td className="text-center py-2 px-4">
                        <div className="text-3xl font-song text-text-primary">
                          {baziData.month.dz}
                        </div>
                      </td>
                      <td className="text-center py-2 px-4">
                        <div className="text-3xl font-song text-imperial-gold">
                          {baziData.day.dz}
                        </div>
                      </td>
                      <td className="text-center py-2 px-4">
                        <div className="text-3xl font-song text-text-primary">
                          {baziData.time.dz}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center py-2 px-4">
                        <div className="text-sm text-text-muted">
                          {baziData.year.shishen}
                        </div>
                      </td>
                      <td className="text-center py-2 px-4">
                        <div className="text-sm text-text-muted">
                          {baziData.month.shishen}
                        </div>
                      </td>
                      <td className="text-center py-2 px-4">
                        <div className="text-sm text-imperial-gold">
                          {baziData.day.shishen}
                        </div>
                      </td>
                      <td className="text-center py-2 px-4">
                        <div className="text-sm text-text-muted">
                          {baziData.time.shishen}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-center">
                <p className="text-text-secondary font-kai">
                  日主：<span className="text-imperial-gold font-semibold">{baziData.dayTiangan}木</span>
                </p>
              </div>
            </Card>

            {/* 天干地支 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card header="天干分析">
                <div className="space-y-3">
                  {['甲', '丙', '戊'].map((tg, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
                      <span className="font-song text-xl text-text-primary">{tg}</span>
                      <span className="text-sm text-text-muted font-kai">
                        {tg === '甲' ? '阳木' : tg === '丙' ? '阳火' : '阳土'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card header="地支藏干">
                <div className="space-y-3">
                  {['子', '寅', '午', '辰'].map((dz, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
                      <span className="font-song text-xl text-text-primary">{dz}</span>
                      <span className="text-sm text-text-muted font-kai">
                        {dz === '子' ? '癸' : dz === '寅' ? '甲丙戊' : dz === '午' ? '丁己' : '戊乙癸'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* 十神分布 */}
            <Card header="十神分布">
              <div className="space-y-4">
                {shishenInfo.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-kai text-text-primary">{item.name}</span>
                      <span className="text-sm text-imperial-gold">{item.count}个</span>
                    </div>
                    <div className="w-full bg-bg-tertiary rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#F4D03F] via-[#D4AF37] to-[#B8860B] h-2 rounded-full"
                        style={{ width: `${item.count * 25}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-muted font-kai">{item.desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 简要解读 */}
            <Card header="简要解读">
              <div className="text-text-secondary font-kai leading-relaxed space-y-4">
                <p>
                  {baziData.interpretation}
                </p>
                <p>
                  甲木生于寅月，得春木之气，日主身强。八字中木火土旺，金水稍弱，宜补金水以平衡五行。
                  事业上适合与木火相关的行业，感情方面较为顺利，财运中等偏上。
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
