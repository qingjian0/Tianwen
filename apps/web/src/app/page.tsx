"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const systems = [
  {
    id: "meihua",
    name: "梅花易数",
    icon: "☰",
    description: "观梅占数，心易妙法",
    color: "imperial-gold",
  },
  {
    id: "liuren",
    name: "大六壬",
    icon: "☴",
    description: "三传四课，七政三式",
    color: "imperial-gold",
  },
  {
    id: "qimen",
    name: "奇门遁甲",
    icon: "☲",
    description: "九宫八卦，帝王之学",
    color: "imperial-gold",
  },
  {
    id: "bazi",
    name: "八字排盘",
    icon: "☯",
    description: "四柱命理，子平之术",
    color: "imperial-gold",
  },
  {
    id: "ziwei",
    name: "紫微斗数",
    icon: "⭐",
    description: "星曜推命，命理绝学",
    color: "imperial-gold",
  },
];

const features = [
  {
    title: "精准推演",
    description:
      "基于传统术数理论，结合现代算法，提供精准的命运分析与趋势预测。",
    icon: "📊",
  },
  {
    title: "完整体系",
    description:
      "覆盖梅花易数、大六壬、奇门遁甲、八字排盘、紫微斗数五大术数系统。",
    icon: "📜",
  },
  {
    title: "直观展示",
    description: "现代化的用户界面，清晰呈现命盘、卦象与解析结果，一目了然。",
    icon: "🎨",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <PageLayout>
      {/* Hero 区域 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-imperial-gold-200 text-sm tracking-[0.3em] uppercase font-kai">
            数字玄学平台
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-song text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="text-gradient-gold">天问</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 font-kai leading-relaxed"
        >
          以华夏传统术数为根基，融合现代计算科学，
          <br />
          打造精准、优雅的数字玄学体验
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Button
            size="lg"
            onClick={() => router.push("/meihua")}
            className="text-lg px-10 py-4"
          >
            开始使用
          </Button>
        </motion.div>
      </motion.div>

      {/* 术数系统卡片网格 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mb-24"
      >
        <div className="text-center mb-12">
          <h2 className="font-song text-2xl md:text-3xl font-bold text-text-primary mb-3">
            术数系统
          </h2>
          <p className="text-text-secondary font-kai">
            五大传统术数，一套完整体系
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {systems.map((system, index) => (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card
                hover
                className="h-full cursor-pointer text-center"
                onClick={() => router.push(`/${system.id}`)}
              >
                <div className="text-5xl mb-4 text-imperial-gold-200">
                  {system.icon}
                </div>
                <h3 className="font-song text-lg font-bold text-text-primary mb-2">
                  {system.name}
                </h3>
                <p className="text-text-muted text-sm font-kai">
                  {system.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 功能介绍区块 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="text-center mb-12">
          <h2 className="font-song text-2xl md:text-3xl font-bold text-text-primary mb-3">
            核心特性
          </h2>
          <p className="text-text-secondary font-kai">
            专业、精准、优雅的玄学体验
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
            >
              <Card>
                <div className="text-4xl mb-4 text-imperial-gold-200">
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
    </PageLayout>
  );
}
