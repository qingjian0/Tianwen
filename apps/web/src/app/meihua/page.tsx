'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
    <h4 className="text-sm font-kai text-parchment/50 mb-3 tracking-widest">{title}</h4>
    <div className="flex flex-col-reverse gap-1.5">
      {hexagram.map((line, idx) => {
        const isChanging = line >= 2;
        const lineNum = 6 - idx;
        return (
          <motion.div
            key={idx}
            className={`relative flex items-center justify-center ${
              isChanging ? 'text-vermillion-400' : 'text-imperial-gold/80'
            } ${highlightLine === lineNum ? 'scale-110' : ''} transition-transform`}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            {line === 0 || line === 2 ? (
              <div className={`h-2 w-24 ${isChanging ? 'bg-vermillion-500/70' : 'bg-imperial-gold/70'}`} />
            ) : (
              <div className="flex gap-5">
                <div className={`h-2 w-10 ${isChanging ? 'bg-vermillion-500/70' : 'bg-imperial-gold/70'}`} />
                <div className={`h-2 w-10 ${isChanging ? 'bg-vermillion-500/70' : 'bg-imperial-gold/70'}`} />
              </div>
            )}
            <span className="absolute -left-12 text-xs text-parchment/40 font-kai w-10 text-right">
              {lineNum}
            </span>
            {isChanging && (
              <span className="absolute -right-12 text-xs text-vermillion-400 font-kai w-10">
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
  const [method, setMethod] = useState<'time' | 'random' | 'number' | null>(null);
  const [numberInput, setNumberInput] = useState('');
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

  const handleTimeMethod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();

    const upper = (year + month + day) % 8;
    const lower = (year + month + day + hour) % 8;
    const changingLine = (year + month + day + hour) % 6;

    let hexagram = getHexagramFromTrigrams(upper, lower);
    if (changingLine !== 0) {
      const lineIndex = 6 - changingLine;
      hexagram[lineIndex] = hexagram[lineIndex] === 0 ? 2 : 3;
    }

    setResult({
      original: hexagram,
      mutual: getMutualHexagram(hexagram),
      changed: getChangedHexagram(hexagram),
      upperTrigram: TRIGRAMS[upper === 0 ? 7 : upper - 1],
      lowerTrigram: TRIGRAMS[lower === 0 ? 7 : lower - 1],
      changingLine: changingLine === 0 ? null : changingLine,
    });
  };

  const handleRandomMethod = () => {
    const upper = generateTrigram();
    const lower = generateTrigram();

    let hexagram: number[] = [];
    for (let i = 0; i < 6; i++) {
      hexagram.push(generateLine());
    }

    setResult({
      original: hexagram,
      mutual: getMutualHexagram(hexagram),
      changed: getChangedHexagram(hexagram),
      upperTrigram: TRIGRAMS[upper],
      lowerTrigram: TRIGRAMS[lower],
      changingLine: getChangingLine(hexagram),
    });
  };

  const handleNumberMethod = () => {
    const nums = numberInput.split(/[,\s，]+/).filter(Boolean).map(Number);
    if (nums.length < 2) return;

    const upper = (nums[0] - 1) % 8;
    const lower = (nums[1] - 1) % 8;
    const changingLine = nums.length >= 3 ? nums[2] % 6 : Math.floor(Math.random() * 6) + 1;

    let hexagram = getHexagramFromTrigrams(upper, lower);
    if (changingLine !== 0) {
      const lineIndex = 6 - changingLine;
      hexagram[lineIndex] = hexagram[lineIndex] === 0 ? 2 : 3;
    }

    setResult({
      original: hexagram,
      mutual: getMutualHexagram(hexagram),
      changed: getChangedHexagram(hexagram),
      upperTrigram: TRIGRAMS[upper < 0 ? 7 : upper],
      lowerTrigram: TRIGRAMS[lower < 0 ? 7 : lower],
      changingLine: changingLine === 0 ? null : changingLine,
    });
  };

  const reset = () => {
    setMethod(null);
    setResult(null);
    setNumberInput('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col px-8 py-10 max-w-4xl mx-auto w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <span className="text-imperial-gold/60 text-xs tracking-[0.5em]">
              MEIHUA YISHU
            </span>
          </div>
          <h1 className="text-4xl font-song font-bold text-gradient-gold glow-gold mb-3">
            梅花易数
          </h1>
          <p className="text-parchment/50 font-kai tracking-widest">
            观梅占数 · 心易妙法
          </p>
        </motion.div>

        {!method && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-imperial-gold/30 to-transparent" />
              <span className="text-parchment/50 font-kai tracking-[0.3em]">选择起卦方式</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-imperial-gold/30 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card
                className="palace-border bg-gradient-to-br from-ink-dark/70 to-ink-medium/50 cursor-pointer hover:shadow-gold-glow transition-all group"
                onClick={() => setMethod('time')}
              >
                <div className="p-6 text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⏰</div>
                  <h3 className="text-lg font-song font-bold text-parchment/90 mb-2 group-hover:text-imperial-gold">
                    时间起卦
                  </h3>
                  <p className="text-sm text-parchment/40 font-kai">
                    以年月日时起卦，上卦年+月+日，下卦年+月+日+时
                  </p>
                </div>
              </Card>

              <Card
                className="palace-border bg-gradient-to-br from-ink-dark/70 to-ink-medium/50 cursor-pointer hover:shadow-gold-glow transition-all group"
                onClick={() => setMethod('random')}
              >
                <div className="p-6 text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">✨</div>
                  <h3 className="text-lg font-song font-bold text-parchment/90 mb-2 group-hover:text-imperial-gold">
                    随机起卦
                  </h3>
                  <p className="text-sm text-parchment/40 font-kai">
                    至诚之道，可以前知，感而遂通天下之故
                  </p>
                </div>
              </Card>

              <Card
                className="palace-border bg-gradient-to-br from-ink-dark/70 to-ink-medium/50 cursor-pointer hover:shadow-gold-glow transition-all group"
                onClick={() => setMethod('number')}
              >
                <div className="p-6 text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🔢</div>
                  <h3 className="text-lg font-song font-bold text-parchment/90 mb-2 group-hover:text-imperial-gold">
                    数字起卦
                  </h3>
                  <p className="text-sm text-parchment/40 font-kai">
                    随心报数，第一个数为上卦，第二个数为下卦
                  </p>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {method && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full"
          >
            <Card className="palace-border bg-gradient-to-br from-ink-dark/80 to-ink-medium/60 p-8">
              {method === 'time' && (
                <div className="text-center space-y-6">
                  <div className="text-7xl mb-4">⏰</div>
                  <p className="text-parchment/70 font-kai">
                    以当前年月日时起卦
                    <br />
                    <span className="text-parchment/40 text-sm">
                      {new Date().toLocaleString('zh-CN')}
                    </span>
                  </p>
                  <div className="flex gap-4 justify-center pt-4">
                    <Button
                      size="lg"
                      className="bg-gradient-gold text-ink-black font-song border-2 border-imperial-gold/50"
                      onClick={handleTimeMethod}
                    >
                      起卦
                    </Button>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="border border-imperial-gold/30 bg-ink-dark/50"
                      onClick={reset}
                    >
                      返回
                    </Button>
                  </div>
                </div>
              )}

              {method === 'random' && (
                <div className="text-center space-y-6">
                  <div className="text-7xl mb-4">✨</div>
                  <p className="text-parchment/70 font-kai">
                    静心诚意，随机起卦
                    <br />
                    <span className="text-parchment/40 text-sm">
                      一念才动，鬼神已知
                    </span>
                  </p>
                  <div className="flex gap-4 justify-center pt-4">
                    <Button
                      size="lg"
                      className="bg-gradient-gold text-ink-black font-song border-2 border-imperial-gold/50"
                      onClick={handleRandomMethod}
                    >
                      起卦
                    </Button>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="border border-imperial-gold/30 bg-ink-dark/50"
                      onClick={reset}
                    >
                      返回
                    </Button>
                  </div>
                </div>
              )}

              {method === 'number' && (
                <div className="text-center space-y-6">
                  <div className="text-7xl mb-4">🔢</div>
                  <p className="text-parchment/70 font-kai mb-4">
                    请输入两个或三个数字，用逗号或空格分隔
                  </p>
                  <input
                    type="text"
                    value={numberInput}
                    onChange={(e) => setNumberInput(e.target.value)}
                    placeholder="例如：12, 34 或 12 34 5"
                    className="w-full bg-ink-medium/60 border border-imperial-gold/30 px-4 py-3 text-parchment/90 placeholder-parchment/40 focus:outline-none focus:border-imperial-gold/60 font-song"
                  />
                  <div className="flex gap-4 justify-center pt-2">
                    <Button
                      size="lg"
                      className="bg-gradient-gold text-ink-black font-song border-2 border-imperial-gold/50"
                      onClick={handleNumberMethod}
                      disabled={!numberInput}
                    >
                      起卦
                    </Button>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="border border-imperial-gold/30 bg-ink-dark/50"
                      onClick={reset}
                    >
                      返回
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <Card className="palace-border bg-gradient-to-br from-ink-dark/80 to-ink-medium/60 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <HexagramDisplay
                  hexagram={result.original}
                  title="本卦"
                  highlightLine={result.changingLine}
                />
                <HexagramDisplay hexagram={result.mutual} title="互卦" />
                <HexagramDisplay hexagram={result.changed} title="变卦" />
              </div>

              <div className="flex justify-center items-center gap-10 border-t border-imperial-gold/10 pt-6">
                <div className="text-center">
                  <div className="text-5xl text-imperial-gold mb-2">{result.upperTrigram.symbol}</div>
                  <div className="text-sm font-kai text-parchment/50">
                    上卦 · {result.upperTrigram.name}
                  </div>
                  <div className="text-xs text-parchment/30 mt-1">
                    五行：{result.upperTrigram.element}
                  </div>
                </div>
                <div className="text-3xl text-parchment/30">☯</div>
                <div className="text-center">
                  <div className="text-5xl text-imperial-gold mb-2">{result.lowerTrigram.symbol}</div>
                  <div className="text-sm font-kai text-parchment/50">
                    下卦 · {result.lowerTrigram.name}
                  </div>
                  <div className="text-xs text-parchment/30 mt-1">
                    五行：{result.lowerTrigram.element}
                  </div>
                </div>
              </div>

              {result.changingLine && (
                <motion.div
                  className="mt-6 text-center pt-6 border-t border-vermillion-500/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-vermillion-400 font-kai text-lg">
                    动爻：第 {result.changingLine} 爻
                  </span>
                </motion.div>
              )}
            </Card>

            <Card className="palace-border bg-gradient-to-br from-ink-dark/80 to-ink-medium/60 p-6">
              <h3 className="text-lg font-song font-bold text-parchment/90 mb-4 flex items-center gap-2">
                <span className="text-imperial-gold text-xl">📜</span>
                卦象解析
              </h3>
              <div className="text-parchment/50 font-kai leading-relaxed">
                <p className="mb-4">
                  本卦为事之始，互卦为事之中，变卦为事之终。
                </p>
                <p className="mb-4">
                  上卦 <span className="text-imperial-gold">{result.upperTrigram.name}</span> 为体，
                  下卦 <span className="text-imperial-gold">{result.lowerTrigram.name}</span> 为用。
                  {result.upperTrigram.element} 与 {result.lowerTrigram.element} 的生克关系，
                  决定了事情的吉凶祸福。
                </p>
                {result.changingLine && (
                  <p className="text-vermillion-400">
                    动爻第 {result.changingLine} 爻为事情的关键转折点，
                    宜以变爻的爻辞来判断吉凶。
                  </p>
                )}
              </div>
            </Card>

            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                variant="ghost"
                className="border border-imperial-gold/30 bg-ink-dark/50"
                onClick={reset}
              >
                重新起卦
              </Button>
            </div>
          </motion.div>
        )}

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-block px-10 py-4 border-t border-b border-imperial-gold/20">
            <p className="text-parchment/40 font-kai text-sm tracking-[0.3em]">
              易无思也，无为也，寂然不动，感而遂通天下之故
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
