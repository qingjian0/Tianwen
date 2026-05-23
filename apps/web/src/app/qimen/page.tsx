"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// 九星数据
const NINE_STARS = [
  { name: "天蓬星", color: "vermillion" },
  { name: "天芮星", color: "imperial-gold" },
  { name: "天冲星", color: "jade" },
  { name: "天辅星", color: "imperial-gold" },
  { name: "天禽星", color: "imperial-gold" },
  { name: "天心星", color: "imperial-gold" },
  { name: "天柱星", color: "imperial-gold" },
  { name: "天任星", color: "imperial-gold" },
  { name: "天英星", color: "vermillion" },
];

// 八门数据
const EIGHT_GATES = [
  { name: "休门" },
  { name: "生门" },
  { name: "伤门" },
  { name: "杜门" },
  { name: "景门" },
  { name: "死门" },
  { name: "惊门" },
  { name: "开门" },
];

// 九宫格位置（洛书布局）
const NINE_PALACES = [
  { position: "巽", palace: "东南" },
  { position: "离", palace: "正南" },
  { position: "坤", palace: "西南" },
  { position: "震", palace: "正东" },
  { position: "中", palace: "中宫" },
  { position: "兑", palace: "正西" },
  { position: "艮", palace: "东北" },
  { position: "坎", palace: "正北" },
  { position: "乾", palace: "西北" },
];

// 功能卡片数据
const features = [
  {
    title: "排盘方式",
    description:
      "支持多种排盘方式，包括时家奇门、日家奇门、月家奇门等，灵活满足不同预测需求。",
    icon: "📊",
  },
  {
    title: "九星八门",
    description:
      "详细展示九星八门在九宫的分布，结合天干地支、八神八诈，呈现完整的奇门格局。",
    icon: "⭐",
  },
  {
    title: "格局分析",
    description:
      "自动分析格局吉凶，提供伏吟、反吟、五不遇时等特殊格局的详细解读。",
    icon: "📜",
  },
];

// 九宫排盘组件
const NinePalaceGrid = ({ data }: { data: any[] }) => (
  <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto">
    {data.map((palace, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`aspect-square border border-imperial-gold/30 bg-bg-card/50 rounded-lg flex flex-col items-center justify-center p-2 ${
          index === 4
            ? "border-2 border-imperial-gold/50 bg-imperial-gold/5"
            : ""
        }`}
      >
        <div className="text-imperial-gold font-song text-sm mb-1">
          {palace.position}宫
        </div>
        <div className="text-xs text-text-primary font-song mb-1">
          {palace.star}
        </div>
        <div className="text-xs text-text-secondary font-kai">
          {palace.gate}
        </div>
        <div className="text-[10px] text-text-muted mt-1">
          {palace.heavenlyStem}
          {palace.earthlyBranch}
        </div>
      </motion.div>
    ))}
  </div>
);

export default function QimenPage() {
  const [dateTime, setDateTime] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  // 奇门配置
  const [panType, setPanType] = useState<"chaibu" | "zhirun" | "maoshan">("chaibu");
  const [panJuType, setPanJuType] = useState<"zhuan" | "fei">("zhuan");
  const [zhiShiMethod, setZhiShiMethod] = useState<"men" | "dizhi">("men");
  const [useTrueSun, setUseTrueSun] = useState(false);
  const [longitude, setLongitude] = useState("116.4");
  const [latitude, setLatitude] = useState("39.9");
  const [calendarType, setCalendarType] = useState<"gregorian" | "lunar">("gregorian");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [hour, setHour] = useState(new Date().getHours().toString());

  // 模拟排盘数据
  const mockPalaceData = NINE_PALACES.map((palace, index) => ({
    ...palace,
    star: NINE_STARS[index].name,
    gate: EIGHT_GATES[index % 8].name,
    heavenlyStem: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬"][index],
    earthlyBranch: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申"][
      index
    ],
  }));

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setShowResult(true);
      setIsGenerating(false);
    }, 1000);
  };

  const reset = () => {
    setShowResult(false);
    setDateTime("");
    setPanType("chaibu");
    setPanJuType("zhuan");
    setZhiShiMethod("men");
    setUseTrueSun(false);
    setLongitude("116.4");
    setLatitude("39.9");
    setCalendarType("gregorian");
    setYear(new Date().getFullYear().toString());
    setMonth((new Date().getMonth() + 1).toString());
    setDay(new Date().getDate().toString());
    setHour(new Date().getHours().toString());
  };

  return (
    <PageLayout>
      <div className="flex flex-col">
        {/* Hero 区域 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <span className="text-imperial-gold/60 text-xs tracking-[0.5em]">
              QIMEN DUNJIA
            </span>
          </div>
          <h1 className="text-4xl font-song font-bold text-gradient-gold mb-3">
            奇门遁甲
          </h1>
          <p className="text-text-secondary font-kai tracking-widest text-lg">
            帝王之学 · 三式之首
          </p>

          <div className="mt-8 max-w-2xl mx-auto">
            <p className="text-text-secondary font-kai leading-relaxed">
              奇门遁甲是中国古代最高层次的预测学，为三式之首。通过九宫八卦、天干地支、九星八门的排列组合，
              揭示天地人三才的运动规律，被誉为“帝王之学”。
            </p>
          </div>

          <div className="mt-8">
            <Button
              size="lg"
              onClick={() => {
                const element = document.getElementById("form-section");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              开始排盘
            </Button>
          </div>
        </motion.div>

        {/* 功能卡片网格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-imperial-gold/30 to-transparent" />
            <span className="text-text-secondary font-kai tracking-[0.3em]">
              核心功能
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-imperial-gold/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card hover>
                  <div className="text-4xl mb-4 text-imperial-gold">
                    {feature.icon}
                  </div>
                  <h3 className="font-song text-xl font-bold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary font-kai leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 操作表单区域 */}
        {!showResult && (
          <motion.div
            id="form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <Card>
              <div className="text-center mb-8">
                <h2 className="font-song text-2xl font-bold text-text-primary mb-2">
                  排盘设置
                </h2>
                <p className="text-text-secondary font-kai">
                  选择日期时间，生成奇门遁甲格局
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                {/* 日历类型选择 */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-kai text-text-primary">日历类型</p>
                    <p className="text-sm text-text-muted">选择公历或农历</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCalendarType("gregorian")}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        calendarType === "gregorian"
                          ? "bg-imperial-gold text-white"
                          : "bg-bg-secondary border border-border"
                      }`}
                    >
                      公历
                    </button>
                    <button
                      onClick={() => setCalendarType("lunar")}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        calendarType === "lunar"
                          ? "bg-imperial-gold text-white"
                          : "bg-bg-secondary border border-border"
                      }`}
                    >
                      农历
                    </button>
                  </div>
                </div>

                {/* 日期时间输入 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Input
                      label="年"
                      type="number"
                      placeholder="2024"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      inputSize="lg"
                    />
                  </div>
                  <div>
                    <Input
                      label="月"
                      type="number"
                      min="1"
                      max="12"
                      placeholder="1"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      inputSize="lg"
                    />
                  </div>
                  <div>
                    <Input
                      label="日"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="1"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      inputSize="lg"
                    />
                  </div>
                  <div>
                    <Input
                      label="时 (0-23)"
                      type="number"
                      min="0"
                      max="23"
                      placeholder="12"
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      inputSize="lg"
                    />
                  </div>
                </div>

                {/* 盘式选择 */}
                <div className="pt-4 border-t border-border">
                  <label className="block text-sm font-medium text-text-primary mb-4">
                    盘式（拆补/置闰/茅山）
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "chaibu", name: "拆补法", desc: "拆补置闰" },
                      { id: "zhirun", name: "置闰法", desc: "超神接气" },
                      { id: "maoshan", name: "茅山法", desc: "茅山道派" }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setPanType(type.id as any)}
                        className={`p-4 rounded-lg text-center transition-all border-2 ${
                          panType === type.id
                            ? "border-imperial-gold bg-imperial-gold/10"
                            : "border-border bg-bg-secondary hover:border-imperial-gold/50"
                        }`}
                      >
                        <div className="font-song font-bold text-text-primary">{type.name}</div>
                        <div className="text-xs text-text-muted mt-1">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 转盘/飞盘 */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-4">
                    盘局类型（转盘/飞盘）
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "zhuan", name: "转盘奇门", desc: "天盘转动" },
                      { id: "fei", name: "飞盘奇门", desc: "星门飞布" }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setPanJuType(type.id as any)}
                        className={`p-4 rounded-lg text-center transition-all border-2 ${
                          panJuType === type.id
                            ? "border-imperial-gold bg-imperial-gold/10"
                            : "border-border bg-bg-secondary hover:border-imperial-gold/50"
                        }`}
                      >
                        <div className="font-song font-bold text-text-primary">{type.name}</div>
                        <div className="text-xs text-text-muted mt-1">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 值使起法 */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-4">
                    值使起法
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "men", name: "值使门起", desc: "门宫对应" },
                      { id: "dizhi", name: "门起地盘", desc: "地盘落宫" }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setZhiShiMethod(method.id as any)}
                        className={`p-4 rounded-lg text-center transition-all border-2 ${
                          zhiShiMethod === method.id
                            ? "border-imperial-gold bg-imperial-gold/10"
                            : "border-border bg-bg-secondary hover:border-imperial-gold/50"
                        }`}
                      >
                        <div className="font-song font-bold text-text-primary">{method.name}</div>
                        <div className="text-xs text-text-muted mt-1">{method.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 真太阳时 */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-kai text-text-primary">真太阳时</p>
                      <p className="text-sm text-text-muted">使用经纬度计算真太阳时</p>
                    </div>
                    <button
                      onClick={() => setUseTrueSun(!useTrueSun)}
                      className={`w-14 h-7 rounded-full transition-colors ${
                        useTrueSun ? "bg-imperial-gold" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          useTrueSun ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  {useTrueSun && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          label="经度"
                          type="number"
                          step="0.1"
                          placeholder="116.4"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                          inputSize="lg"
                        />
                      </div>
                      <div>
                        <Input
                          label="纬度"
                          type="number"
                          step="0.1"
                          placeholder="39.9"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          inputSize="lg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    size="lg"
                    onClick={handleGenerate}
                    loading={isGenerating}
                    disabled={!dateTime}
                    className="w-full"
                  >
                    {isGenerating ? "排盘中..." : "生成排盘"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 结果展示区域 */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* 九宫排盘 */}
            <Card>
              <div className="text-center mb-8">
                <h2 className="font-song text-2xl font-bold text-text-primary mb-2">
                  九宫排盘
                </h2>
                <p className="text-text-secondary font-kai mb-2">
                  {calendarType === "gregorian" ? "公历" : "农历"} {year}年{month}月{day}日{hour}时
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <span className="text-xs bg-bg-secondary px-2 py-1 rounded">
                    {panType === "chaibu" ? "拆补法" : panType === "zhirun" ? "置闰法" : "茅山法"}
                  </span>
                  <span className="text-xs bg-bg-secondary px-2 py-1 rounded">
                    {panJuType === "zhuan" ? "转盘奇门" : "飞盘奇门"}
                  </span>
                  <span className="text-xs bg-bg-secondary px-2 py-1 rounded">
                    {zhiShiMethod === "men" ? "值使门起" : "门起地盘"}
                  </span>
                  {useTrueSun && (
                    <span className="text-xs bg-bg-secondary px-2 py-1 rounded">
                      真太阳时 {longitude}°E, {latitude}°N
                    </span>
                  )}
                </div>
              </div>

              <NinePalaceGrid data={mockPalaceData} />
            </Card>

            {/* 九星八门分布 */}
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-song text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <span className="text-imperial-gold">⭐</span>
                    九星分布
                  </h3>
                  <div className="space-y-2">
                    {NINE_STARS.map((star, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 px-3 bg-bg-card/30 rounded"
                      >
                        <span className="text-text-primary font-song">
                          {star.name}
                        </span>
                        <span className="text-text-secondary text-sm font-kai">
                          {mockPalaceData[index].position}宫
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-song text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <span className="text-imperial-gold">🚪</span>
                    八门分布
                  </h3>
                  <div className="space-y-2">
                    {EIGHT_GATES.map((gate, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 px-3 bg-bg-card/30 rounded"
                      >
                        <span className="text-text-primary font-song">
                          {gate.name}
                        </span>
                        <span className="text-text-secondary text-sm font-kai">
                          {
                            mockPalaceData[index !== 4 ? index : index + 1]
                              .position
                          }
                          宫
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 简要解读 */}
            <Card>
              <h3 className="font-song text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="text-imperial-gold">📜</span>
                简要解读
              </h3>
              <div className="text-text-secondary font-kai leading-relaxed space-y-4">
                <p>
                  此局为 <span className="text-imperial-gold">时家奇门</span>，
                  值符{" "}
                  <span className="text-imperial-gold">
                    {mockPalaceData[0].star}
                  </span>{" "}
                  落
                  <span className="text-imperial-gold">
                    {mockPalaceData[0].position}
                  </span>
                  宫， 值使{" "}
                  <span className="text-imperial-gold">
                    {mockPalaceData[0].gate}
                  </span>{" "}
                  落
                  <span className="text-imperial-gold">
                    {mockPalaceData[1].position}
                  </span>
                  宫。
                </p>
                <p>
                  天盘与地盘的组合揭示了当前的能量场状态，
                  三奇六仪的分布显示了吉凶祸福的潜在趋势。
                  建议结合具体求测事项，详细分析各宫位的生克关系。
                </p>
                <p className="text-text-muted text-sm">
                  注：以上为模拟展示，实际预测需结合具体求测事项和用神分析。
                </p>
              </div>
            </Card>

            <div className="flex justify-center gap-4">
              <Button size="lg" variant="ghost" onClick={reset}>
                重新排盘
              </Button>
            </div>
          </motion.div>
        )}

        {/* 底部装饰 */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-block px-10 py-4 border-t border-b border-imperial-gold/20">
            <p className="text-text-muted font-kai text-sm tracking-[0.3em]">
              八卦甲子，神机鬼藏，阴阳相胜之术，昭昭乎尽乎象矣
            </p>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
