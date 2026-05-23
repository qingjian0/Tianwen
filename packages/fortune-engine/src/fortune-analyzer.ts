/**
 * 吉凶分析器
 */

import { FortuneScore, FortuneFactors, FortuneAnalysis } from "./types";
import { FortuneCalculator } from "./fortune-calculator";
import { Signal, SignalProcessor } from "@tianwen/signal-system";
import { FortuneLevel } from "./constants";

export class FortuneAnalyzer {
  /**
   * 完整吉凶分析
   */
  static analyze(signals: Signal[]): FortuneAnalysis {
    const score = FortuneCalculator.calculateFromSignals(signals);
    const factors = this.extractFactors(signals);

    const warnings = this.extractWarnings(score, signals);
    const recommendations = this.extractRecommendations(score, signals);

    return {
      score,
      factors,
      contributingSignals: signals,
      warnings,
      recommendations,
    };
  }

  /**
   * 提取影响因素
   */
  private static extractFactors(signals: Signal[]): FortuneFactors {
    const analysis = SignalProcessor.analyze(signals);

    const positiveSignalRatio =
      analysis.totalSignals > 0
        ? analysis.positiveSignals.length / analysis.totalSignals
        : 0.5;

    return {
      positiveSignalRatio,
      signalStrength: analysis.averageStrength,
      probabilityAlignment: 0.5,
      timingSupport: 0.5,
    };
  }

  /**
   * 提取警告
   */
  private static extractWarnings(
    score: FortuneScore,
    signals: Signal[],
  ): string[] {
    const warnings: string[] = [];
    const analysis = SignalProcessor.analyze(signals);

    if (
      score.level === FortuneLevel.DANGER ||
      score.level === FortuneLevel.WARNING
    ) {
      warnings.push("当前运势不佳，请谨慎决策");
    }

    if (analysis.negativeSignals.length > analysis.positiveSignals.length) {
      warnings.push("负面信号较多，需多加留意");
    }

    if (analysis.unstableSignals.length > 0) {
      warnings.push("存在不稳定因素，局势可能变化");
    }

    return warnings;
  }

  /**
   * 提取建议
   */
  private static extractRecommendations(
    score: FortuneScore,
    signals: Signal[],
  ): string[] {
    const recommendations: string[] = [];
    const analysis = SignalProcessor.analyze(signals);

    if (
      score.level === FortuneLevel.GREAT_FORTUNE ||
      score.level === FortuneLevel.FORTUNE
    ) {
      recommendations.push("把握机遇，积极行动");
    }

    if (score.level === FortuneLevel.NEUTRAL) {
      recommendations.push("静观其变，等待时机");
    }

    if (analysis.positiveSignals.length > 0) {
      recommendations.push("关注正面信号所指示的方向");
    }

    if (analysis.confidence < 0.6) {
      recommendations.push("建议获取更多信息后再决策");
    }

    return recommendations;
  }
}
