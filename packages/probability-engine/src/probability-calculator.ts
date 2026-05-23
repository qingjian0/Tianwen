/**
 * 概率计算器
 */

import {
  ProbabilityScore,
  ProbabilityFactors,
  ProbabilityAnalysis,
} from "./types";
import { ProbabilityLevel, PROBABILITY_THRESHOLDS } from "./constants";
import {
  Signal,
  SignalProcessor,
  SignalPolarity,
} from "@tianwen/signal-system";

export class ProbabilityCalculator {
  /**
   * 从信号计算概率
   */
  static calculateFromSignals(signals: Signal[]): ProbabilityScore {
    const analysis = SignalProcessor.analyze(signals);

    const successProbability = Math.max(
      0,
      Math.min(1, (1 + analysis.netPolarity) / 2),
    );
    const failureProbability = 1 - successProbability;

    const uncertainty = 1 - analysis.confidence;
    const volatility = this.calculateVolatility(signals);
    const confidence = analysis.confidence;

    const level = this.determineLevel(successProbability);

    return {
      successProbability,
      failureProbability,
      uncertainty,
      volatility,
      confidence,
      level,
      timestamp: new Date(),
    };
  }

  /**
   * 确定概率等级
   */
  private static determineLevel(probability: number): ProbabilityLevel {
    if (probability <= PROBABILITY_THRESHOLDS.VERY_LOW)
      return ProbabilityLevel.VERY_LOW;
    if (probability <= PROBABILITY_THRESHOLDS.LOW) return ProbabilityLevel.LOW;
    if (probability <= PROBABILITY_THRESHOLDS.MEDIUM)
      return ProbabilityLevel.MEDIUM;
    if (probability <= PROBABILITY_THRESHOLDS.HIGH)
      return ProbabilityLevel.HIGH;
    return ProbabilityLevel.VERY_HIGH;
  }

  /**
   * 计算波动率
   */
  private static calculateVolatility(signals: Signal[]): number {
    if (signals.length === 0) return 0.5;

    const polarities = signals.map((s) => {
      switch (s.polarity) {
        case SignalPolarity.POSITIVE:
          return 1;
        case SignalPolarity.NEGATIVE:
          return -1;
        case SignalPolarity.UNSTABLE:
          return 0.5;
        default:
          return 0;
      }
    });

    const mean = polarities.reduce((a, b) => a + b, 0) / polarities.length;
    const variance =
      polarities.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) /
      polarities.length;

    return Math.min(1, Math.sqrt(variance));
  }

  /**
   * 合并多个概率分数
   */
  static mergeScores(
    scores: ProbabilityScore[],
    weights?: number[],
  ): ProbabilityScore {
    const validWeights = weights || scores.map(() => 1);
    const totalWeight = validWeights.reduce((a, b) => a + b, 0);

    const weightedSum = (key: keyof ProbabilityScore) => {
      return (
        scores.reduce((sum, score, i) => {
          const value = (score as any)[key];
          if (typeof value === "number") {
            return sum + value * validWeights[i];
          }
          return sum;
        }, 0) / totalWeight
      );
    };

    const successProbability = weightedSum("successProbability");
    const failureProbability = weightedSum("failureProbability");
    const uncertainty = weightedSum("uncertainty");
    const volatility = weightedSum("volatility");
    const confidence = weightedSum("confidence");
    const level = this.determineLevel(successProbability);

    return {
      successProbability,
      failureProbability,
      uncertainty,
      volatility,
      confidence,
      level,
      timestamp: new Date(),
    };
  }
}
