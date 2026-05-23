'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageLayout } from '@/components/layout/PageLayout';

const TRIGRAMS = [
  { name: '乾', symbol: '☰', element: '金', palace: '乾' },
  { name: '兑', symbol: '☱', element: '金', palace: '兑' },
  { name: '离', symbol: '☲', element: '火', palace: '离' },
  { name: '震', symbol: '☳', element: '木', palace: '震' },
  { name: '巽', symbol: '☴', element: '木', palace: '巽' },
  { name: '坎', symbol: '☵', element: '水', palace: '坎' },
  { name: '艮', symbol: '☶', element: '土', palace: '艮' },
  { name: '坤', symbol: '☷', element: '土', palace: '坤' },
];

const DivinationMethods = [
  { id: 'dice', name: '骰子起卦', icon: '🎲', description: '抛掷三枚铜钱或骰子，以阴阳数起卦' },
  { id: 'number', name: '报数起卦', icon: '🔢', description: '随心报数，上卦下卦随意而成' },
  { id: 'double', name: '双数起卦', icon: '✨', description: '两个数字，定上下卦与动爻' },
  { id: 'random', name: '随机起卦', icon: '🌟', description: '至诚之道，感而遂通' },
];

const HexagramDisplay = ({
  hexagram,
  title,
  highlightLine = null,
}: {
  hexagram: number[];
  title: string;
  highlightLine?: number | null;
}) => (
  <div className="flex flex-col items-center">
    <h4 className="text-sm font-kai text-text-muted mb-4 tracking-widest">{title}</h4>
    <div className="flex flex-col-reverse gap-2">
      {hexagram.map((line, idx) => {
        const isChanging = line >= 2;
        const lineNum = 6 - idx;
        const isHighlighted = highlightLine === lineNum;
        return (
          <motion.div
            key={idx}
            className={`relative flex items-center justify-center transition-all duration-300 ${isHighlighted ? 'scale-110' : ''}`}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            {line === 0 || line === 2 ? (
              <div
                className={`h-2.5 w-28 rounded-sm transition-all duration-300 ${
                  isChanging
                    ? 'bg-vermillion'
                    : 'bg-imperial-gold'
                }`}
              />
            ) : (
              <div className="flex gap-4">
                <div
                  className={`h-2.5 w-12 rounded-sm transition-all duration-300 ${
                    isChanging
                      ? 'bg-vermillion'
                      : 'bg-imperial-gold'
                  }`}
                />
                <div
                  className={`h-2.5 w-12 rounded-sm transition-all duration-300 ${
                    isChanging
                      ? 'bg-vermillion'
                      : 'bg-imperial-gold'
                  }`}
                />
              </div>
            )}
            <span className="absolute -left-14 text-xs text-text-muted font-kai w-12 text-right">
              {lineNum}
            </span>
            {isChanging && (
              <span className="absolute -right-14 text-xs text-vermillion font-kai w-12">
                变
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default function MeihuaPage() {
  const [step, setStep] = useState<'intro' | 'form' | 'result'>('intro');
  const [method, setMethod] = useState<string>('');
  const [upperNum, setUpperNum] = useState<string>('');
  const [lowerNum, setLowerNum] = useState<string>('');
  const [changingNum, setChangingNum] = useState<string>('');
  const [result, setResult] = useState<{
    original: number[];
    mutual: number[];
    changed: number[];
    upperTrigram: typeof TRIGRAMS[0];
    lowerTrigram: typeof TRIGRAMS[0];
    changingLine: number | null;
  } | null>(null);

  const generateTrigram = () => Math.floor(Math.random() * 8);

  const generateLine = () => {
    const r = Math.floor(Math.random() * 4) + 6;
    if (r === 6) return 2;
    if (r === 9) return 3;
    return r % 2;
  };

  const getHexagramFromTrigrams = (upper: number, lower: number) => {
    const hexagram: number[] = [];
    for (let i = 0; i < 3; i++) {
      hexagram.push((lower >> (2 - i)) & 1);
    }
    for (let i = 0; i < 3; i++) {
      hexagram.push((upper >> (2 - i)) & 1);
    }
    return hexagram;
  };

  const getMutualHexagram = (original: number[]) => {
    if (original.length !== 6) return [];
    return [original[1], original[2], original[3], original[2], original[3], original[4]];
  };

  const getChangedHexagram = (original: number[]) => {
    return original.map((line) => {
      if (line === 2) return 1;
      if (line === 3) return 0;
      return line;
    });
  };

  const getChangingLine = (hexagram: number[]) => {
    const changingLines = hexagram
      .map((line, idx) => (line >= 2 ? 6 - idx : null))
      .filter((n): n is number => n !== null);
    if (changingLines.length === 1) return changingLines[0];
    return null;
  };

  const handleStartDivination = () => {
    setStep('form');
  };

  const handleDivination = () => {
    let upper: number;
    let lower: number;
    let hexagram: number[];
    let changingLine: number | null = null;

    switch (method) {
      case 'dice':
      case 'random':
        hexagram = [];
        for (let i = 0; i < 6; i++) {
          hexagram.push(generateLine());
        }
        upper = generateTrigram();
        lower = generateTrigram();
        changingLine = getChangingLine(hexagram);
        break;

      case 'number':
      case 'double':
        upper = upperNum ? (parseInt(upperNum) - 1) % 8 : generateTrigram();
        lower = lowerNum ? (parseInt(lowerNum) - 1) % 8 : generateTrigram();
        const cl = changingNum ? parseInt(changingNum) % 6 : Math.floor(Math.random() * 6) + 1;
        hexagram = getHexagramFromTrigrams(upper, lower);
        if (cl !== 0) {
          const lineIndex = 6 - cl;
          hexagram[lineIndex] = hexagram[lineIndex] === 0 ? 2 : 3;
        }
        changingLine = cl === 0 ? null : cl;
        break;

      default:
        hexagram = getHexagramFromTrigrams(generateTrigram(), generateTrigram());
        upper = generateTrigram();
        lower = generateTrigram();
    }

    setResult({
      original: hexagram,
      mutual: getMutualHexagram(hexagram),
      changed: getChangedHexagram(hexagram),
      upperTrigram: TRIGRAMS[upper < 0 ? 7 : upper],
      lowerTrigram: TRIGRAMS[lower < 0 ? 7 : lower],
      changingLine,
    });
    setStep('result');
  };

  const reset = () => {
    setStep('intro');
    setMethod('');
    setResult(null);
    setUpperNum('');
    setLowerNum('');
    setChangingNum('');
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        {step === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20 pt-12"
          >
            <div className="mb-6">
              <span className="text-imperial-gold/60 text-xs tracking-[0.6em] uppercase">
                Meihua Yishu
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-song font-bold text-text-primary mb-6 tracking-wider">
              梅花易数
            </h1>
            <p className="text-xl sm:text-2xl text-imperial-gold/70 font-kai mb-8 tracking-widest">
              古老的数字占卜术
            </p>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed font-kai mb-12">
              梅花易数是宋朝邵康节先生发明的占卜方法，
              通过数、象、理的结合，洞察天地之机，
              预测事物发展的吉凶祸福。
            </p>
            <Button
              size="lg"
              onClick={handleStartDivination}
              className="text-lg px-10 py-4"
            >
              开始起卦
            </Button>
          </motion.div>
        )}

        {/* Feature Cards Grid */}
        {step === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card hover className="text-center">
                <div className="mb-6">
                  <span className="text-5xl">🎯</span>
                </div>
                <h3 className="text-xl font-song font-bold text-text-primary mb-3">
                  起卦方式
                </h3>
                <p className="text-text-secondary font-kai leading-relaxed">
                  支持骰子、报数、双数、随机四种起卦方式，
                  随心而动，至诚感通。
                </p>
              </Card>

              <Card hover className="text-center">
                <div className="mb-6">
                  <span className="text-5xl">📖</span>
                </div>
                <h3 className="text-xl font-song font-bold text-text-primary mb-3">
                  卦象解读
                </h3>
                <p className="text-text-secondary font-kai leading-relaxed">
                  本卦、互卦、变卦三位一体，
                  深入解析事情的始末与变化。
                </p>
              </Card>

              <Card hover className="text-center">
                <div className="mb-6">
                  <span className="text-5xl">📜</span>
                </div>
                <h3 className="text-xl font-song font-bold text-text-primary mb-3">
                  历史记录
                </h3>
                <p className="text-text-secondary font-kai leading-relaxed">
                  保存每次占卜记录，
                  便于回顾与验证，温故而知新。
                </p>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Form Section */}
        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <Card className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-song font-bold text-text-primary mb-4">
                  选择起卦方式
                </h2>
                <p className="text-text-muted font-kai">
                  请选择一种方式开始起卦
                </p>
              </div>

              {/* Method Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {DivinationMethods.map((m, idx) => (
                  <motion.button
                    key={m.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setMethod(m.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      method === m.id
                        ? 'border-imperial-gold bg-imperial-gold/10'
                        : 'border-border hover:border-imperial-gold/40 bg-bg-secondary'
                    }`}
                  >
                    <div className="text-3xl mb-3">{m.icon}</div>
                    <div className="text-sm font-song font-bold text-text-primary">
                      {m.name}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Input Fields */}
              {(method === 'number' || method === 'double') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6 mb-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Input
                        label="上卦数字"
                        type="number"
                        placeholder="请输入上卦数字"
                        value={upperNum}
                        onChange={(e) => setUpperNum(e.target.value)}
                        inputSize="lg"
                      />
                    </div>
                    <div>
                      <Input
                        label="下卦数字"
                        type="number"
                        placeholder="请输入下卦数字"
                        value={lowerNum}
                        onChange={(e) => setLowerNum(e.target.value)}
                        inputSize="lg"
                      />
                    </div>
                    <div>
                      <Input
                        label="动爻数字（可选）"
                        type="number"
                        placeholder="动爻数字"
                        value={changingNum}
                        onChange={(e) => setChangingNum(e.target.value)}
                        inputSize="lg"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-6 border-t border-border">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={reset}
                >
                  返回
                </Button>
                <Button
                  size="lg"
                  onClick={handleDivination}
                  disabled={!method}
                >
                  起卦
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Result Section */}
        {step === 'result' && result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <Card>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-song font-bold text-text-primary mb-4">
                  卦象展示
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                <HexagramDisplay
                  hexagram={result.original}
                  title="本卦"
                  highlightLine={result.changingLine}
                />
                <HexagramDisplay hexagram={result.mutual} title="互卦" />
                <HexagramDisplay hexagram={result.changed} title="变卦" />
              </div>

              <div className="flex justify-center items-center gap-12 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-6xl text-imperial-gold mb-3">
                    {result.upperTrigram.symbol}
                  </div>
                  <div className="text-lg font-kai text-text-secondary">
                    上卦 · {result.upperTrigram.name}
                  </div>
                  <div className="text-sm text-text-muted mt-1">
                    五行：{result.upperTrigram.element}
                  </div>
                </div>
                <div className="text-4xl text-text-muted">☯</div>
                <div className="text-center">
                  <div className="text-6xl text-imperial-gold mb-3">
                    {result.lowerTrigram.symbol}
                  </div>
                  <div className="text-lg font-kai text-text-secondary">
                    下卦 · {result.lowerTrigram.name}
                  </div>
                  <div className="text-sm text-text-muted mt-1">
                    五行：{result.lowerTrigram.element}
                  </div>
                </div>
              </div>

              {result.changingLine && (
                <motion.div
                  className="mt-8 text-center pt-8 border-t border-vermillion/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-vermillion font-kai text-xl">
                    动爻：第 {result.changingLine} 爻
                  </span>
                </motion.div>
              )}
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-imperial-gold text-2xl">📜</span>
                <h3 className="text-2xl font-song font-bold text-text-primary">
                  卦辞解读
                </h3>
              </div>
              <div className="text-text-secondary font-kai leading-relaxed text-lg space-y-4">
                <p>
                  本卦为事之始，代表事情的初始状态；
                  互卦为事之中，象征事情的发展过程；
                  变卦为事之终，预示事情的最终结果。
                </p>
                <p>
                  上卦 <span className="text-imperial-gold font-song">
                    {result.upperTrigram.name}
                  </span> 为体，
                  下卦 <span className="text-imperial-gold font-song">
                    {result.lowerTrigram.name}
                  </span> 为用。
                  {result.upperTrigram.element} 与 {result.lowerTrigram.element} 的生克关系，
                  决定了事情的吉凶祸福。
                </p>
                {result.changingLine && (
                  <p className="text-vermillion">
                    动爻第 {result.changingLine} 爻为事情的关键转折点，
                    宜以变爻的爻辞来判断吉凶，此乃天机所在。
                  </p>
                )}
                <p className="text-text-muted pt-4 border-t border-border mt-6">
                  易曰：「寂然不动，感而遂通天下之故。」
                  占卜之道，重在诚心正意，方可感应天地之机。
                </p>
              </div>
            </Card>

            <div className="flex justify-center gap-4 pt-6">
              <Button
                variant="secondary"
                size="lg"
                onClick={reset}
              >
                重新起卦
              </Button>
            </div>
          </motion.div>
        )}

        {/* Footer Quote */}
        {step === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center pt-12 pb-8"
          >
            <div className="inline-block px-16 py-6 border-t border-b border-imperial-gold/20">
              <p className="text-text-muted font-kai text-lg tracking-[0.4em]">
                易无思也，无为也，寂然不动，感而遂通天下之故
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
