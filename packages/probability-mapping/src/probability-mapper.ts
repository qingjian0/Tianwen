import { Signal } from "@tianwen/signal-system";
import { ProbabilityScore } from "@tianwen/probability-engine";
import {
  DEFAULT_MAPPING_CONFIG,
  POLARITY_SCORE_WEIGHTS,
  STRENGTH_WEIGHTS,
  CONFIDENCE_FACTOR,
} from "./constants";
import { MappingConfig, MappedProbability } from "./types";

export class ProbabilityMapper {
  private config: MappingConfig;

  constructor(config?: Partial<MappingConfig>) {
    this.config = { ...DEFAULT_MAPPING_CONFIG, ...config };
  }

  /**
   * 将信号集合映射为概率分数
   */
  mapSignals(signals: Signal[]): MappedProbability {
    if (signals.length === 0) {
      return this.createEmptyResult();
    }

    // 计算初始分数
    let score = this.config.baseProbability;
    const contributingSignals: Signal[] = [];
    const uncertaintyFactors: string[] = [];

    for (const signal of signals) {
      // 跳过低置信度信号
      if (signal.confidence < this.config.confidenceThreshold) {
        uncertaintyFactors.push(`信号 ${signal.id} 置信度过低`);
        continue;
      }

      // 计算该信号对分数的贡献
      const polarityWeight = POLARITY_SCORE_WEIGHTS[signal.polarity];
      const strengthWeight = STRENGTH_WEIGHTS[signal.strength];
      const contribution = polarityWeight * strengthWeight * signal.confidence;

      // 应用贡献
      if (contribution > 0) {
        score +=
          (contribution * this.config.positiveMultiplier) / signals.length;
      } else if (contribution < 0) {
        score +=
          (contribution * this.config.negativeMultiplier) / signals.length;
      }

      contributingSignals.push(signal);

      // 收集不稳定因素
      if (signal.polarity === "unstable") {
        uncertaintyFactors.push(`信号 ${signal.id} 不稳定`);
      }
    }

    // 限制在 0.05 - 0.95 之间
    score = Math.max(0.05, Math.min(0.95, score));

    // 计算置信度
    const avgConfidence =
      contributingSignals.length > 0
        ? contributingSignals.reduce((sum, s) => sum + s.confidence, 0) /
          contributingSignals.length
        : 0.5;

    // 计算波动率
    const volatility = this.calculateVolatility(signals);

    // 构建概率分数
    const probabilityScore: ProbabilityScore = {
      successProbability: score,
      failureProbability: 1 - score,
      uncertainty: 1 - avgConfidence,
      volatility,
      confidence: avgConfidence,
    };

    return {
      probabilityScore,
      contributingSignals,
      reasoning: this.generateReasoning(signals, probabilityScore),
      uncertaintyFactors,
    };
  }

  /**
   * 计算波动率
   */
  private calculateVolatility(signals: Signal[]): number {
    if (signals.length === 0) return 0.5;

    // 基于极性的分布计算波动率
    const positiveCount = signals.filter(
      (s) => s.polarity === "positive",
    ).length;
    const negativeCount = signals.filter(
      (s) => s.polarity === "negative",
    ).length;
    const unstableCount = signals.filter(
      (s) => s.polarity === "unstable",
    ).length;

    // 如果信号冲突强烈，波动率高
    const conflict =
      Math.min(positiveCount, negativeCount) / Math.max(1, signals.length);
    const unstableFactor = unstableCount / signals.length;

    return Math.min(0.95, conflict * 0.6 + unstableFactor * 0.4);
  }

  /**
   * 生成推理说明
   */
  private generateReasoning(
    signals: Signal[],
    score: ProbabilityScore,
  ): string {
    const positiveCount = signals.filter(
      (s) => s.polarity === "positive",
    ).length;
    const negativeCount = signals.filter(
      (s) => s.polarity === "negative",
    ).length;
    const neutralCount = signals.filter((s) => s.polarity === "neutral").length;
    const unstableCount = signals.filter(
      (s) => s.polarity === "unstable",
    ).length;

    const lines = [
      `基于 ${signals.length} 个信号分析:`,
      `积极信号: ${positiveCount} 个`,
      `消极信号: ${negativeCount} 个`,
      `中性信号: ${neutralCount} 个`,
      `不稳定信号: ${unstableCount} 个`,
      `综合成功概率: ${Math.round(score.successProbability * 100)}%`,
    ];

    return lines.join("\n");
  }

  /**
   * 创建空结果
   */
  private createEmptyResult(): MappedProbability {
    return {
      probabilityScore: {
        successProbability: 0.5,
        failureProbability: 0.5,
        uncertainty: 0.5,
        volatility: 0.5,
        confidence: 0.3,
      },
      contributingSignals: [],
      reasoning: "无可用信号，返回中性概率。",
      uncertaintyFactors: ["无信号数据"],
    };
  }
}
