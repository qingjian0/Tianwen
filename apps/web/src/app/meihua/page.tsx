"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MeihuaEngine } from "@tianwen/meihua";
import { BAGUA_INFO } from "@tianwen/meihua";

const TRIGRAMS = [
  { name: "乾", symbol: "☰", element: "金", palace: "乾" },
  { name: "兑", symbol: "☱", element: "金", palace: "兑" },
  { name: "离", symbol: "☲", element: "火", palace: "离" },
  { name: "震", symbol: "☳", element: "木", palace: "震" },
  { name: "巽", symbol: "☴", element: "木", palace: "巽" },
  { name: "坎", symbol: "☵", element: "水", palace: "坎" },
  { name: "艮", symbol: "☶", element: "土", palace: "艮" },
  { name: "坤", symbol: "☷", element: "土", palace: "坤" },
];

const DivinationMethods = [
  { id: "time", name: "时间起卦", icon: "⏰", description: "根据年日月时数起卦" },
  { id: "number", name: "单数字起卦", icon: "🔢", description: "单个数字，拆为上下卦" },
  { id: "number2", name: "双数字起卦", icon: "✨", description: "两个数字，定上下卦与动爻" },
  { id: "number3", name: "三数字起卦", icon: "🎲", description: "三个数字，上卦下卦动爻" },
  { id: "random", name: "随机起卦", icon: "🌟", description: "至诚之道，可以前知" },
  { id: "manual", name: "手动起卦", icon: "✍️", description: "手动选择上下卦和动爻" },
];

const HexagramDisplay = ({ binary, title, changingPositions = [] }: {
  binary: string;
  title: string;
  changingPositions?: number[];
}) => {
  const yaos = binary.split('');
  
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-serif text-gray-600 mb-4 tracking-widest">{title}</h4>
      <div className="flex flex-col-reverse gap-2">
        {yaos.map((yao, idx) => {
          const position = idx + 1;
          const isChanging = changingPositions.includes(position);
          const isYang = yao === '1';
          
          return (
            <motion.div
              key={idx}
              className="relative flex items-center justify-center transition-all duration-300"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              {isYang ? (
                <div className={`h-2.5 w-28 rounded-sm ${isChanging ? 'bg-red-500' : 'bg-yellow-600'}`} />
              ) : (
                <div className="flex gap-4">
                  <div className={`h-2.5 w-12 rounded-sm ${isChanging ? 'bg-red-500' : 'bg-yellow-600'}`} />
                  <div className={`h-2.5 w-12 rounded-sm ${isChanging ? 'bg-red-500' : 'bg-yellow-600'}`} />
                </div>
              )}
              <span className="absolute -left-14 text-xs text-gray-500 font-serif w-12 text-right">{position}</span>
              {isChanging && (
                <span className="absolute -right-14 text-xs text-red-500 font-serif w-12">变</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default function MeihuaPage() {
  const [step, setStep] = useState<"intro" | "form" | "result">("intro");
  const [method, setMethod] = useState<string>("");
  const [engine] = useState(() => new MeihuaEngine());
  const [result, setResult] = useState<any>(null);
  
  const [selectedUpperTrigram, setSelectedUpperTrigram] = useState<number>(0);
  const [selectedLowerTrigram, setSelectedLowerTrigram] = useState<number>(0);
  const [selectedChangingLine, setSelectedChangingLine] = useState<string>("");
  const [upperNum, setUpperNum] = useState<string>("");
  const [lowerNum, setLowerNum] = useState<string>("");
  const [changingNum, setChangingNum] = useState<string>("");

  const getRelationText = {
    bihe: "比和，诸事顺遂",
    yongshengti: "用生体，得助力",
    tishengyong: "体生用，有损耗",
    ke: "体克用，可成功",
    sheng: "用克体，需谨慎",
  };

  const handleDivination = () => {
    let divinationResult;
    
    switch (method) {
      case "time":
        divinationResult = engine.divinateByTime();
        break;
      case "number":
        divinationResult = engine.divinateBySingleNumber(parseInt(upperNum) || 1);
        break;
      case "number2":
        divinationResult = engine.divinateByDoubleNumber(
          parseInt(upperNum) || 1,
          parseInt(lowerNum) || 1
        );
        break;
      case "number3":
        divinationResult = engine.divinateByTripleNumber(
          parseInt(upperNum) || 1,
          parseInt(lowerNum) || 1,
          parseInt(changingNum) || 1
        );
        break;
      case "random":
        divinationResult = engine.divinateByRandom();
        break;
      case "manual":
        divinationResult = engine.divinateByManual(
          TRIGRAMS[selectedUpperTrigram].name as any,
          TRIGRAMS[selectedLowerTrigram].name as any,
          selectedChangingLine ? parseInt(selectedChangingLine) : undefined
        );
        break;
      default:
        divinationResult = engine.divinateByRandom();
    }
    
    setResult(divinationResult);
    setStep("result");
  };

  const reset = () => {
    setStep("intro");
    setMethod("");
    setResult(null);
    setSelectedUpperTrigram(0);
    setSelectedLowerTrigram(0);
    setSelectedChangingLine("");
    setUpperNum("");
    setLowerNum("");
    setChangingNum("");
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {step === "intro" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 pt-12"
          >
            <div className="mb-6">
              <span className="text-yellow-700/60 text-xs tracking-[0.6em] uppercase">
                Mei Hua Yi Shu
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-gray-800 mb-6 tracking-wider">
              梅花易数
            </h1>
            <p className="text-xl sm:text-2xl text-yellow-700/70 font-serif mb-8 tracking-widest">
              古老的数字占卜术
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-serif mb-12">
              梅花易数是宋朝邵康节先生发明的占卜方法，
              通过数、象、理的结合，洞察天地之机，预测事物发展的吉凶祸福。
            </p>
            <Button
              size="lg"
              onClick={() => setStep("form")}
              className="text-lg px-10 py-4"
            >
              开始起卦
            </Button>
          </motion.div>
        )}

        {step === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <Card className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
                  选择起卦方式
                </h2>
                <p className="text-gray-500 font-serif">
                  请选择一种方式开始起卦
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {DivinationMethods.map((m, idx) => (
                  <motion.button
                    key={m.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setMethod(m.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      method === m.id
                        ? "border-yellow-600 bg-yellow-50"
                        : "border-gray-200 hover:border-yellow-600/40 bg-gray-50"
                    }`}
                  >
                    <div className="text-3xl mb-3">{m.icon}</div>
                    <div className="text-sm font-serif font-bold text-gray-800">{m.name}</div>
                  </motion.button>
                ))}
              </div>

              {method === "number" && (
                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-serif text-gray-700 mb-2">数字</label>
                      <input
                        type="number"
                        value={upperNum}
                        onChange={(e) => setUpperNum(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-yellow-600"
                        placeholder="请输入数字"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(method === "number2" || method === "number3") && (
                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-serif text-gray-700 mb-2">第一个数字</label>
                      <input
                        type="number"
                        value={upperNum}
                        onChange={(e) => setUpperNum(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-yellow-600"
                        placeholder="请输入数字"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-serif text-gray-700 mb-2">第二个数字</label>
                      <input
                        type="number"
                        value={lowerNum}
                        onChange={(e) => setLowerNum(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-yellow-600"
                        placeholder="请输入数字"
                      />
                    </div>
                  </div>
                  {method === "number3" && (
                    <div>
                      <label className="block text-sm font-serif text-gray-700 mb-2">第三个数字（动爻）</label>
                      <input
                        type="number"
                        value={changingNum}
                        onChange={(e) => setChangingNum(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-yellow-600"
                        placeholder="请输入数字"
                      />
                    </div>
                  )}
                </div>
              )}

              {method === "manual" && (
                <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-serif text-gray-700 mb-4 text-center">上卦</label>
                      <div className="grid grid-cols-4 gap-3">
                        {TRIGRAMS.map((trigram, idx) => (
                          <button
                            key={trigram.name}
                            onClick={() => setSelectedUpperTrigram(idx)}
                            className={`p-4 rounded-lg text-center transition-all ${
                              selectedUpperTrigram === idx
                                ? "bg-yellow-100 border-2 border-yellow-600"
                                : "bg-gray-50 border border-gray-200 hover:border-yellow-600/50"
                            }`}
                          >
                            <div className="text-3xl mb-1">{trigram.symbol}</div>
                            <div className="text-xs font-serif">{trigram.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-serif text-gray-700 mb-4 text-center">下卦</label>
                      <div className="grid grid-cols-4 gap-3">
                        {TRIGRAMS.map((trigram, idx) => (
                          <button
                            key={trigram.name}
                            onClick={() => setSelectedLowerTrigram(idx)}
                            className={`p-4 rounded-lg text-center transition-all ${
                              selectedLowerTrigram === idx
                                ? "bg-yellow-100 border-2 border-yellow-600"
                                : "bg-gray-50 border border-gray-200 hover:border-yellow-600/50"
                            }`}
                          >
                            <div className="text-3xl mb-1">{trigram.symbol}</div>
                            <div className="text-xs font-serif">{trigram.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-serif text-gray-700 mb-4">动爻（可选）</label>
                    <div className="flex gap-3 justify-center">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => setSelectedChangingLine(
                            selectedChangingLine === num.toString() ? "" : num.toString()
                          )}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            selectedChangingLine === num.toString()
                              ? "bg-red-500 text-white"
                              : "bg-gray-50 border border-gray-200 hover:border-red-500/50"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => setSelectedChangingLine("")}
                        className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        无动爻
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                <Button variant="secondary" size="lg" onClick={reset}>
                  返回
                </Button>
                <Button size="lg" onClick={handleDivination} disabled={!method}>
                  起卦
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === "result" && result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <Card>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
                  卦象展示
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                <HexagramDisplay
                  binary={result.benGua.binary}
                  title={`本卦 - ${result.benGua.name}`}
                  changingPositions={result.dongYaoPositions}
                />
                {result.huGua && (
                  <HexagramDisplay
                    binary={result.huGua.binary}
                    title={`互卦 - ${result.huGua.name}`}
                  />
                )}
                {result.bianGua && (
                  <HexagramDisplay
                    binary={result.bianGua.binary}
                    title={`变卦 - ${result.bianGua.name}`}
                  />
                )}
              </div>

              <div className="flex justify-center items-center gap-12 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-6xl text-yellow-600 mb-3">
                    {TRIGRAMS.find(t => t.name === result.benGua.shangGua)?.symbol}
                  </div>
                  <div className="text-lg font-serif text-gray-600">
                    上卦 - {result.benGua.shangGua}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    五行：{BAGUA_INFO[result.benGua.shangGua].wuxing}
                  </div>
                </div>
                <div className="text-4xl text-gray-400">☯</div>
                <div className="text-center">
                  <div className="text-6xl text-yellow-600 mb-3">
                    {TRIGRAMS.find(t => t.name === result.benGua.xiaGua)?.symbol}
                  </div>
                  <div className="text-lg font-serif text-gray-600">
                    下卦 - {result.benGua.xiaGua}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    五行：{BAGUA_INFO[result.benGua.xiaGua].wuxing}
                  </div>
                </div>
              </div>

              {result.dongYaoPositions.length > 0 && (
                <motion.div
                  className="mt-8 text-center pt-8 border-t border-red-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-red-500 font-serif text-xl">
                    动爻：第 {result.dongYaoPositions.join('、')} 爻
                  </span>
                </motion.div>
              )}
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-yellow-600 text-2xl">📜</span>
                <h3 className="text-2xl font-serif font-bold text-gray-800">
                  卦辞解读
                </h3>
              </div>
              <div className="text-gray-600 font-serif leading-relaxed text-lg space-y-4">
                <p>
                  本卦为事之始，代表事情的初始状态；
                  互卦为事之中，象征事情的发展过程；
                  变卦为事之终，预示事情的最终结果。
                </p>
                <p>
                  体卦：{result.tiYong.ti}（{result.tiYong.tiWuxing}），
                  用卦：{result.tiYong.yong}（{result.tiYong.yongWuxing}）。
                </p>
                <p className="text-yellow-700">
                  体用关系：{getRelationText[result.tiYong.relation as keyof typeof getRelationText]}
                </p>
                <p className="text-gray-500 pt-4 border-t border-gray-200 mt-6">
                  易曰：「寂然不动，感而遂通天下之故。」
                  占卜之道，重在诚心正意，方可感应天地之机。
                </p>
              </div>
            </Card>

            <div className="flex justify-center gap-4 pt-6">
              <Button variant="secondary" size="lg" onClick={reset}>
                重新起卦
              </Button>
            </div>
          </motion.div>
        )}

        {step === "intro" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center pt-12 pb-8"
          >
            <div className="inline-block px-16 py-6 border-t border-b border-yellow-600/20">
              <p className="text-gray-500 font-serif text-lg tracking-[0.4em]">
                易无思也，无为也，寂然不动，感而遂通天下之故
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
