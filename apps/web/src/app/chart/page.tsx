"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Segment } from "@/components/ui/Segment";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
);

const baguaMap: Record<string, string> = {
  乾: "☰",
  兑: "☱",
  离: "☲",
  震: "☳",
  巽: "☴",
  坎: "☵",
  艮: "☶",
  坤: "☷",
};
const baguaPos: Record<string, string> = {
  乾: "西北",
  兑: "西",
  离: "南",
  震: "东",
  巽: "东南",
  坎: "北",
  艮: "东北",
  坤: "西南",
};
const baguaElem: Record<string, string> = {
  乾: "金",
  兑: "金",
  离: "火",
  震: "木",
  巽: "木",
  坎: "水",
  艮: "土",
  坤: "土",
};

type ChartType = "meihua" | "liuyao" | "qimen" | "bazi";

const SEGMENT_OPTIONS = [
  { id: "meihua", label: "梅花卦", icon: "☰" },
  { id: "liuyao", label: "六爻", icon: "☷" },
  { id: "qimen", label: "奇门", icon: "☲" },
  { id: "bazi", label: "八字", icon: "☯" },
];

export default function ChartPage() {
  const [chartType, setChartType] = useState<ChartType>("meihua");
  const [meihuaData, setMeihuaData] = useState<any>(null);
  const [liuyaoData, setLiuyaoData] = useState<any>(null);
  const [qimenData, setQimenData] = useState<any>(null);
  const [baziData, setBaziData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadChart(chartType);
  }, [chartType]);

  async function loadChart(type: ChartType) {
    setLoading(true);
    setError("");
    try {
      switch (type) {
        case "meihua": {
          if (!meihuaData) {
            const res = await fetch(`${API}/api/meihua/divinate?method=time`);
            setMeihuaData((await res.json()).data || (await res.json()));
          }
          break;
        }
        case "liuyao": {
          if (!liuyaoData) {
            const res = await fetch(`${API}/api/liuyao/divinate?method=time`);
            setLiuyaoData((await res.json()).data || (await res.json()));
          }
          break;
        }
        case "qimen": {
          if (!qimenData) {
            const res = await fetch(`${API}/api/qimen/layout`);
            setQimenData((await res.json()).data || (await res.json()));
          }
          break;
        }
        case "bazi": {
          if (!baziData) {
            const now = new Date();
            const res = await fetch(
              `${API}/api/bazi/calculate?year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}&gender=male`,
            );
            setBaziData((await res.json()).data || (await res.json()));
          }
          break;
        }
      }
    } catch (e: any) {
      setError(e.message || "加载失败");
    } finally {
      setLoading(false);
    }
  }

  const gz = baziData?.ganzhi || baziData?.chronoData?.ganzhi || {};

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          {...fadeInUp}
          className="text-4xl font-serif text-amber-400 mb-2"
        >
          排盘
        </motion.h1>
        <motion.p {...fadeInUp} className="text-gray-400 mb-8">
          仰观天文，俯察地理
        </motion.p>

        <motion.div {...fadeInUp} className="mb-6">
          <p className="text-sm text-gray-400 mb-3">选择排盘</p>
          <Segment
            options={SEGMENT_OPTIONS}
            value={chartType}
            onChange={(id) => setChartType(id as ChartType)}
          />
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton variant="rect" height="16rem" />
            <div className="grid gap-6 lg:grid-cols-2">
              <Skeleton variant="rect" height="12rem" />
              <Skeleton variant="rect" height="12rem" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ---- 主排盘区 ---- */}
            <Card
              className="lg:col-span-2"
              header={
                <span>
                  {chartType === "meihua" &&
                    `梅花卦 · ${meihuaData?.benGua?.name || meihuaData?.name || "—"}`}
                  {chartType === "liuyao" &&
                    `六爻 · ${liuyaoData?.benGua?.name || "—"}`}
                  {chartType === "qimen" &&
                    `奇门遁甲 · ${qimenData?.yinYang || qimenData?.juxing || ""}遁${qimenData?.ju || qimenData?.jushu || ""}局`}
                  {chartType === "bazi" && "四柱八字"}
                </span>
              }
            >
              {/* ---------- 梅花卦 ---------- */}
              {chartType === "meihua" && meihuaData && (
                <div className="space-y-6">
                  <div className="flex justify-center items-start gap-12">
                    {/* 本卦 */}
                    <div className="text-center flex flex-col items-center gap-2">
                      <div className="text-6xl">
                        {baguaMap[meihuaData.benGua?.shangGua] ||
                          baguaMap[meihuaData.benGua?.name] ||
                          "—"}
                      </div>
                      <div className="text-gold-400 font-serif text-2xl">
                        {meihuaData.benGua?.name || "—"}
                      </div>
                      <Badge variant="gold" size="sm">
                        {baguaElem[meihuaData.benGua?.shangGua] ||
                          meihuaData.benGua?.wuxing ||
                          "—"}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">本卦</div>
                    </div>
                    {/* 互卦 */}
                    {meihuaData.huGua && (
                      <div className="text-center flex flex-col items-center gap-2">
                        <div className="text-5xl">
                          {baguaMap[meihuaData.huGua?.name] || "—"}
                        </div>
                        <div className="text-gold-400 font-serif text-2xl">
                          {meihuaData.huGua?.name || "—"}
                        </div>
                        <Badge variant="gold" size="sm">
                          {baguaElem[meihuaData.huGua?.shangGua] ||
                            meihuaData.huGua?.wuxing ||
                            "—"}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">互卦</div>
                      </div>
                    )}
                    {/* 变卦 */}
                    {meihuaData.bianGua && (
                      <div className="text-center flex flex-col items-center gap-2">
                        <div className="text-6xl">
                          {baguaMap[meihuaData.bianGua?.name] || "—"}
                        </div>
                        <div className="text-gold-400 font-serif text-2xl">
                          {meihuaData.bianGua?.name || "—"}
                        </div>
                        <Badge variant="gold" size="sm">
                          {baguaElem[meihuaData.bianGua?.shangGua] ||
                            meihuaData.bianGua?.wuxing ||
                            "—"}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">变卦</div>
                      </div>
                    )}
                  </div>
                  {meihuaData.dongYao != null && (
                    <div className="flex justify-center gap-2">
                      <Badge variant="vermillion" size="sm">
                        动爻:{" "}
                        {Array.isArray(meihuaData.dongYao)
                          ? meihuaData.dongYao.join(", ")
                          : meihuaData.dongYao}
                      </Badge>
                    </div>
                  )}
                  {meihuaData.interpretation && (
                    <p className="text-sm text-gray-400 text-center max-w-md mx-auto">
                      {meihuaData.interpretation}
                    </p>
                  )}
                </div>
              )}

              {/* ---------- 六爻 ---------- */}
              {chartType === "liuyao" && liuyaoData && (
                <div className="max-w-md mx-auto space-y-2">
                  {(liuyaoData.benGua?.yaos || [])
                    .slice()
                    .reverse()
                    .map((yao: any, idx: number) => {
                      const pos = 6 - idx;
                      const isYang =
                        yao.state?.includes("Yang") || yao.type === "yang";
                      const lineSymbol = isYang ? "━━━" : "━ ━";
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            yao.isChanging
                              ? "border-vermillion-500/30 bg-vermillion-500/5"
                              : "border-white/5 bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-xs w-8">
                              第{pos}爻
                            </span>
                            <span
                              className={`text-2xl font-bold ${yao.isChanging ? "text-vermillion-400 animate-pulse" : "text-gray-300"}`}
                            >
                              {lineSymbol}
                            </span>
                            {yao.isShiyao && (
                              <span className="text-xs text-gold-400 px-1.5 py-0.5 bg-gold-500/10 rounded">
                                世
                              </span>
                            )}
                            {yao.isYingyao && (
                              <span className="text-xs text-indigo-400 px-1.5 py-0.5 bg-indigo-500/10 rounded">
                                应
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="gold" size="sm">
                              {yao.liuqin || "—"}
                            </Badge>
                            <Badge variant="indigo" size="sm">
                              {yao.wuxing || "—"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  <div className="flex justify-between text-xs text-gray-500 mt-3 font-mono">
                    <span>
                      月建: {liuyaoData.yueJian || liuyaoData.month || "—"}
                    </span>
                    <span>旬空: {liuyaoData.xunKong || "—"}</span>
                  </div>
                </div>
              )}

              {/* ---------- 奇门 ---------- */}
              {chartType === "qimen" && qimenData && (
                <div className="max-w-lg mx-auto">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      "坎宫",
                      "坤宫",
                      "震宫",
                      "巽宫",
                      "中宫",
                      "乾宫",
                      "兑宫",
                      "艮宫",
                      "离宫",
                    ].map((name, idx) => {
                      const pData = qimenData.palaces?.[name];
                      return (
                        <div
                          key={idx}
                          className="p-3 bg-[#0a0a0f] border border-amber-500/10 rounded-lg text-center"
                        >
                          <div className="text-xs text-gray-600 mb-1">
                            {name}
                          </div>
                          {pData ? (
                            <div className="space-y-0.5 text-xs">
                              <div className="text-gold-400">
                                {pData.eightStar || pData.star || "—"}
                              </div>
                              <div className="text-indigo-400">
                                {pData.eightDoor || pData.door || "—"}
                              </div>
                              {pData.deity && (
                                <div className="text-vermillion-400">
                                  {pData.deity}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-600 text-xs">—</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center gap-6 mt-4 text-sm">
                    <span className="text-gold-400">
                      值符: {qimenData.zhiFu?.star || qimenData.zhiFu || "—"}
                    </span>
                    <span className="text-gold-400">
                      值使: {qimenData.zhiShi?.door || qimenData.zhiShi || "—"}
                    </span>
                  </div>
                </div>
              )}

              {/* ---------- 八字 ---------- */}
              {chartType === "bazi" && baziData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {[
                      {
                        label: "年柱",
                        gan: (gz.year || baziData?.yearPillar || "—").slice(
                          0,
                          1,
                        ),
                        zhi: (gz.year || baziData?.yearPillar || "—").slice(1),
                      },
                      {
                        label: "月柱",
                        gan: (gz.month || baziData?.monthPillar || "—").slice(
                          0,
                          1,
                        ),
                        zhi: (gz.month || baziData?.monthPillar || "—").slice(
                          1,
                        ),
                      },
                      {
                        label: "日柱",
                        gan: (gz.day || baziData?.dayPillar || "—").slice(0, 1),
                        zhi: (gz.day || baziData?.dayPillar || "—").slice(1),
                        highlight: true,
                      },
                      {
                        label: "时柱",
                        gan: (gz.hour || baziData?.hourPillar || "—").slice(
                          0,
                          1,
                        ),
                        zhi: (gz.hour || baziData?.hourPillar || "—").slice(1),
                      },
                    ].map((col, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-gray-500 text-sm mb-2">
                          {col.label}
                        </div>
                        <Card
                          variant={
                            (col as any).highlight ? "highlight" : "default"
                          }
                          className="p-4 text-center"
                        >
                          <div className="text-3xl text-gold-400 font-serif">
                            {col.gan || "—"}
                          </div>
                          <div className="text-lg text-gray-400">
                            {col.zhi || "—"}
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                  {baziData.dayMasterWuxing && (
                    <div className="flex justify-center">
                      <Badge variant="gold">
                        日主五行: {baziData.dayMasterWuxing}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* ---- 时间干支 ---- */}
            <Card
              header={<span className="font-serif text-white">时间干支</span>}
            >
              <div className="space-y-3">
                {[
                  {
                    label: "年柱",
                    value: gz.year || baziData?.yearPillar || "—",
                  },
                  {
                    label: "月柱",
                    value: gz.month || baziData?.monthPillar || "—",
                  },
                  {
                    label: "日柱",
                    value: gz.day || baziData?.dayPillar || "—",
                  },
                  {
                    label: "时柱",
                    value: gz.hour || baziData?.hourPillar || "—",
                  },
                ].map((col, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-2 border-b border-white/5"
                  >
                    <span className="text-gray-400">{col.label}</span>
                    <span className="text-amber-400 font-serif text-lg">
                      {col.value || "—"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 text-center text-gray-500 text-sm">
                {new Date().toLocaleString("zh-CN")}
              </div>
            </Card>

            {/* ---- 八卦信息 ---- */}
            <Card
              header={<span className="font-serif text-white">八卦基础</span>}
            >
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(baguaMap).map(([name, symbol]) => (
                  <div
                    key={name}
                    className="text-center p-3 bg-[#0a0a0f] border border-amber-500/10 rounded-lg"
                  >
                    <div className="text-3xl text-amber-400 mb-1">{symbol}</div>
                    <div className="text-sm text-white">{name}</div>
                    <div className="text-xs text-gray-600">
                      {baguaElem[name]}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
}
