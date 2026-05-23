'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ZiweiPage() {
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
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
              ZIWEI DOUSHU
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-song font-bold text-gradient-gold mb-4">
            紫微斗数
          </h1>
          <p className="text-xl text-text-secondary font-kai mb-6">
            星曜神术
          </p>
          <p className="text-text-secondary max-w-3xl mx-auto leading-relaxed text-lg mb-8 font-kai">
            紫微斗数是中国传统命理学的重要流派，通过紫微星垣的星曜排列，结合宫位、四化等要素，
            深入分析人的性格特质、事业发展、财运运势、感情婚姻等各个方面，被誉为“天下第一神术”。
          </p>
          <Button
            size="lg"
            onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            开始排盘
          </Button>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card hover header="星曜分布">
            <p className="text-text-secondary font-kai">
              查看紫微、天府、太阳、太阴等十四主星在十二宫位的分布情况，了解星曜庙旺利陷。
            </p>
          </Card>

          <Card hover header="宫位分析">
            <p className="text-text-secondary font-kai">
              深入分析命宫、财帛宫、官禄宫、迁移宫等十二宫位的星曜组合，解读各方面运势。
            </p>
          </Card>

          <Card hover header="四化飞星">
            <p className="text-text-secondary font-kai">
              追踪禄、权、科、忌四化飞星的流转，洞察运势的变化和关键转折点。
            </p>
          </Card>
        </motion.section>

        <motion.section
          id="form-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card header="排盘信息">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="出生日期"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  inputSize="lg"
                  required
                />
                <div className="w-full">
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    性别
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`flex-1 px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
                        gender === 'male'
                          ? 'border-imperial-gold bg-imperial-gold/10 text-imperial-gold'
                          : 'border-imperial-gold/20 text-text-secondary hover:border-imperial-gold/40'
                      }`}
                    >
                      <div className="font-kai">男</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`flex-1 px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
                        gender === 'female'
                          ? 'border-imperial-gold bg-imperial-gold/10 text-imperial-gold'
                          : 'border-imperial-gold/20 text-text-secondary hover:border-imperial-gold/40'
                      }`}
                    >
                      <div className="font-kai">女</div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  type="submit"
                  disabled={!birthDate || !gender}
                >
                  排盘分析
                </Button>
              </div>
            </form>
          </Card>
        </motion.section>

        {showResult && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-8"
          >
            <Card header="紫微命盘">
              <div className="aspect-square max-w-2xl mx-auto bg-gradient-to-br from-bg-tertiary to-bg-secondary rounded-xl border border-imperial-gold/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl text-imperial-gold mb-4">命盘</div>
                  <p className="text-text-muted">紫微斗数命盘展示区域</p>
                </div>
              </div>
            </Card>

            <Card header="星曜排列">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁'].map((star, index) => (
                  <div
                    key={index}
                    className="bg-bg-tertiary border border-imperial-gold/20 rounded-lg p-4 text-center"
                  >
                    <div className="text-imperial-gold font-song font-semibold text-lg">{star}</div>
                    <div className="text-xs text-text-muted mt-1">庙旺</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card header="简要解读">
              <div className="space-y-4 text-text-secondary font-kai leading-relaxed">
                <p>
                  <span className="text-imperial-gold font-song font-semibold">命宫分析：</span>
                  紫微独坐命宫，为人稳重正直，有领导才能，追求完美。
                </p>
                <p>
                  <span className="text-imperial-gold font-song font-semibold">事业运势：</span>
                  官禄宫见太阳庙旺，事业发展顺利，适合从政或管理岗位。
                </p>
                <p>
                  <span className="text-imperial-gold font-song font-semibold">感情婚姻：</span>
                  夫妻宫有太阴，感情细腻，婚姻美满。
                </p>
                <p>
                  <span className="text-imperial-gold font-song font-semibold">财运状况：</span>
                  财帛宫见武曲，财运亨通，善于理财。
                </p>
              </div>
            </Card>
          </motion.section>
        )}
      </div>
    </PageLayout>
  );
}
