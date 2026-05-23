"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Segment } from "@/components/ui/Segment";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const systems = [
  { id: "meihua", name: "梅花易数", description: "观物取象，心易相合" },
  { id: "liuyao", name: "六爻", description: "纳甲筮法，动变吉凶" },
  { id: "qimen", name: "奇门遁甲", description: "天盘地盘，八门九星" },
  { id: "bazi", name: "八字", description: "四柱干支，五行生克" },
  { id: "ziwei", name: "紫微斗数", description: "命盘十二宫，星曜布局" },
];

const systemOptions = [
  { id: "meihua", label: "梅花", icon: "☰" },
  { id: "liuyao", label: "六爻", icon: "☷" },
  { id: "bazi", label: "八字", icon: "☯" },
  { id: "qimen", label: "奇门", icon: "☲" },
  { id: "ziwei", label: "紫微", icon: "◎" },
];

const modes = [
  { id: "single", name: "单系统", description: "使用选定的术数独立推演" },
  { id: "multi", name: "多系统", description: "各系统独立推演，结果对比" },
  { id: "fusion", name: "融合", description: "多系统信号融合分析" },
];

const modeOptions = [
  { id: "single", label: "单系统" },
  { id: "multi", label: "多系统" },
  { id: "fusion", label: "融合" },
];

const timeRanges = [
  { id: "immediate", label: "即时" },
  { id: "week", label: "本周" },
  { id: "month", label: "本月" },
];

type PredictionState = "idle" | "loading" | "success" | "error";

async function callEngine(system: string): Promise<any> {
  switch (system) {
    case "meihua": {
      const res = await fetch(`${API}/api/meihua/divinate?method=random`);
      const json = await res.json();
      const d = json.data || json;
      const gua = d.benGua || d;
      const dongYaoArr = d.dongYaoPositions || [];
      return {
        system: "meihua",
        name: "梅花易数",
        guaName: gua.name || "—",
        guaNum: gua.number,
        changingYao: dongYaoArr[0],
        interpretation: d.interpretation?.split("\n")[0] || "",
        tiYong: d.tiYong,
      };
    }
    case "liuyao": {
      const res = await fetch(`${API}/api/liuyao/divinate?method=time`);
      const json = await res.json();
      const d = json.data || json;
      const bg = d.benGua || {};
      return {
        system: "liuyao",
        name: "六爻",
        guaName: bg.name || "—",
        shiYao: bg.yaos?.find((y: any) => y.isShiyao)?.position,
        yingYao: bg.yaos?.find((y: any) => y.isYingyao)?.position,
        liuqin: (bg.yaos || []).slice(0, 6).map((y: any) => y.liuqin),
      };
    }
    case "qimen": {
      const res = await fetch(`${API}/api/qimen/layout`);
      const json = await res.json();
      const d = json.data || json;
      return {
        system: "qimen",
        name: "奇门遁甲",
        ju: `${d.yinYang || ""}遁${d.ju}局`,
        zhiFu: d.zhiFu?.star || d.zhiFu,
        zhiShi: d.zhiShi?.door || d.zhiShi,
        patterns: d.patterns?.slice(0, 3),
      };
    }
    case "bazi": {
      const now = new Date();
      const res = await fetch(
        `${API}/api/bazi/calculate?year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}&gender=male`,
      );
      const json = await res.json();
      const d = json.data || json;
      const gz = d.ganzhi || d.chronoData?.ganzhi || {};
      return {
        system: "bazi",
        name: "八字",
        year: gz.year || d.yearPillar || "—",
        month: gz.month || d.monthPillar || "—",
        day: gz.day || d.dayPillar || "—",
        hour: gz.hour || d.hourPillar || "—",
        favorable: d.favorable,
        score: d.score,
      };
    }
    case "ziwei": {
      const now = new Date();
      const res = await fetch(
        `${API}/api/ziwei/layout?year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}&gender=%E7%94%B7`,
      );
      const json = await res.json();
      const d = json.data || json;
      const mpName =
        typeof d.mainPalace === "string"
          ? d.mainPalace
          : d.mainPalace?.name || d.mainPalace;
      const mpObj =
        typeof d.mainPalace === "string"
          ? (d.palaces || []).find((p: any) => p.name === d.mainPalace)
          : d.mainPalace;
      return {
        system: "ziwei",
        name: "紫微斗数",
        mainPalace: mpName || "命宫",
        mainStar: mpObj?.mainStars?.[0] || "—",
        luckyStar: mpObj?.auxStars?.[0] || "—",
        score: d.luck || d.score,
      };
    }
    default:
      return { error: "Unknown system" };
  }
}

export default function PredictionPage() {
  const [question, setQuestion] = useState("");
  const [selectedSystems, setSelectedSystems] = useState<string[]>(["meihua"]);
  const [selectedMode, setSelectedMode] = useState("single");
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const [state, setState] = useState<PredictionState>("idle");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  const toggleSystem = (systemId: string) => {
    setSelectedSystems((prev) =>
      prev.includes(systemId)
        ? prev.length > 1
          ? prev.filter((s) => s !== systemId)
          : prev
        : [...prev, systemId],
    );
  };

  const handlePredict = async () => {
    setState("loading");
    setError("");
    setResults([]);

    try {
      const targetSystems =
        selectedMode === "single"
          ? [selectedSystems[0]]
          : systems.map((s) => s.id);
      const allResults = await Promise.all(targetSystems.map(callEngine));
      setResults(allResults);
      setState("success");
    } catch (e: any) {
      setError(e.message || "连接后端失败");
      setState("error");
    }
  };

  const getOverallFortune = () => {
    if (results.length === 0) return { text: "—", score: 0 };
    const scores = results.map((r) => {
      if (r.score) return r.score;
      if (r.guaName) {
        const goodNames = [
          "乾",
          "坤",
          "泰",
          "既济",
          "益",
          "升",
          "晋",
          "鼎",
          "震",
        ];
        return goodNames.some((n) => r.guaName?.includes(n)) ? 75 : 55;
      }
      return 60;
    });
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return { text: avg > 70 ? "吉" : avg > 55 ? "平" : "凶", score: avg };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          {...fadeInUp}
          className="text-4xl font-serif text-amber-400 mb-2"
        >
          推演
        </motion.h1>
        <motion.p {...fadeInUp} className="text-gray-400 mb-8">
          至诚之道，可以前知
        </motion.p>

        <div className="space-y-6">
          <motion.div {...fadeInUp} variants={stagger}>
            <motion.div variants={fadeInUp}>
              <Card>
                <label className="block text-sm text-gray-400 mb-3">
                  请起一念
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-500 text-lg">
                    🔮
                  </div>
                  <textarea
                    className="w-full bg-[#0a0a0f] border border-gold-500/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-gold-500/40 focus:outline-none focus:shadow-glow-sm transition-all duration-300 resize-none"
                    rows={3}
                    placeholder="心中所想，一事一问..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card>
                <label className="block text-sm text-gray-400 mb-4">
                  选择术数
                </label>
                <Segment
                  options={systemOptions}
                  value={selectedSystems[0]}
                  onChange={(id) => setSelectedSystems([id])}
                />
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card>
                <label className="block text-sm text-gray-400 mb-4">
                  推演模式
                </label>
                <Segment
                  options={modeOptions}
                  value={selectedMode}
                  onChange={setSelectedMode}
                />
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card>
                <label className="block text-sm text-gray-400 mb-4">
                  时间范围
                </label>
                <Segment
                  options={timeRanges}
                  value={selectedTimeRange}
                  onChange={setSelectedTimeRange}
                />
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                variant="primary"
                size="lg"
                loading={state === "loading"}
                disabled={selectedSystems.length === 0 || state === "loading"}
                onClick={handlePredict}
                className="w-full font-serif tracking-widest"
              >
                {state === "loading" ? "推演中..." : "启·演"}
              </Button>
            </motion.div>

            {state !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <h2 className="text-xl font-serif text-white mb-6">
                    推演结果
                  </h2>

                  {state === "loading" ? (
                    <div className="space-y-4 py-4">
                      <Skeleton variant="rect" height="5rem" />
                      <Skeleton variant="rect" height="5rem" />
                      <Skeleton variant="rect" height="5rem" />
                    </div>
                  ) : state === "error" ? (
                    <div className="text-center py-12 text-red-400">
                      {error}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <Card variant="highlight">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-5xl font-serif text-amber-400 mb-1">
                              {getOverallFortune().text}
                            </div>
                            <div className="text-sm text-gray-500">
                              综合论断
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-5xl font-serif text-blue-400 mb-1">
                              {getOverallFortune().score}
                            </div>
                            <div className="text-sm text-gray-500">
                              综合评分
                            </div>
                          </div>
                        </div>
                      </Card>

                      <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="space-y-4"
                      >
                        {results.map((r, i) => (
                          <motion.div key={i} variants={staggerItem}>
                            <Card>
                              <div className="flex items-center gap-3 mb-4">
                                <span className="text-gold-400 font-medium">
                                  {r.name}
                                </span>
                                <Badge variant="gold" size="sm">
                                  {r.system}
                                </Badge>
                              </div>
                              {r.system === "meihua" && (
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      卦名
                                    </div>
                                    <div className="text-white">
                                      {r.guaName}
                                    </div>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      卦数
                                    </div>
                                    <div className="text-white">{r.guaNum}</div>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      解读
                                    </div>
                                    <div className="text-white text-xs">
                                      {r.interpretation?.slice(0, 20) || "—"}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {r.system === "liuyao" && (
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      卦名
                                    </div>
                                    <div className="text-white">
                                      {r.guaName}
                                    </div>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      世爻
                                    </div>
                                    <div className="text-white">
                                      第{r.shiYao}爻
                                    </div>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      六亲
                                    </div>
                                    <div className="text-white text-xs">
                                      {(r.liuqin || []).slice(0, 3).join(",")}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {r.system === "qimen" && (
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      局数
                                    </div>
                                    <div className="text-white">{r.ju}</div>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      值符
                                    </div>
                                    <div className="text-white">{r.zhiFu}</div>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      值使
                                    </div>
                                    <div className="text-white">{r.zhiShi}</div>
                                  </div>
                                </div>
                              )}
                              {r.system === "bazi" && (
                                <div className="grid grid-cols-4 gap-3 text-sm">
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      年柱
                                    </div>
                                    <div className="text-white">{r.year}</div>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      月柱
                                    </div>
                                    <div className="text-white">{r.month}</div>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      日柱
                                    </div>
                                    <div className="text-white">{r.day}</div>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      评分
                                    </div>
                                    <div className="text-white">{r.score}</div>
                                  </div>
                                </div>
                              )}
                              {r.system === "ziwei" && (
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      命宫
                                    </div>
                                    <div className="text-white">
                                      {r.mainPalace}
                                    </div>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      主星
                                    </div>
                                    <div className="text-white">
                                      {r.mainStar}
                                    </div>
                                  </div>
                                  <div className="text-center p-2 bg-white/5 rounded">
                                    <div className="text-gray-400 text-xs">
                                      运势
                                    </div>
                                    <div className="text-white">
                                      {r.score || "—"}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
