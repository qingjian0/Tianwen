"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { BaziPanel } from "@/components/divination/BaziPanel";
import { Card } from "@/components/ui/Card";

export default function BaziPage() {
  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Hero区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-8"
        >
          <div className="mb-4">
            <span className="text-imperial-gold/60 text-xs tracking-[0.5em]">
              BAZI PAIPAN
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-song font-bold text-gradient-gold mb-3">
            八字排盘
          </h1>
          <p className="text-lg text-text-secondary font-kai">
            命运密码 · 四柱八字解析
          </p>
        </motion.div>

        {/* 功能介绍卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-song text-lg font-bold text-text-primary mb-2">
                命盘分析
              </h3>
              <p className="text-sm text-text-secondary font-kai">
                分析日主强弱、五行平衡、格局高低
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="font-song text-lg font-bold text-text-primary mb-2">
                大运流年
              </h3>
              <p className="text-sm text-text-secondary font-kai">
                十年大运与流年运势预测
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="font-song text-lg font-bold text-text-primary mb-2">
                十神解读
              </h3>
              <p className="text-sm text-text-secondary font-kai">
                揭示性格特质与人际关系
              </p>
            </Card>
          </div>
        </motion.div>

        {/* 八字排盘面板 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <BaziPanel />
        </motion.div>
      </div>
    </PageLayout>
  );
}
