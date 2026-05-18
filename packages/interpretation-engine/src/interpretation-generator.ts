/**
 * 解释生成器
 */

import { Interpretation, InterpretationConfig, InterpretationResult } from './types';
import { InterpretationTone, TONE_LABELS } from './constants';
import { Signal, SignalProcessor, SignalPolarity } from '@tianwen/signal-system';
import { ProbabilityScore } from '@tianwen/probability-engine';
import { FortuneScore } from '@tianwen/fortune-engine';

export class InterpretationGenerator {
  private config: InterpretationConfig;

  constructor(config?: Partial<InterpretationConfig>) {
    this.config = {
      maxSuggestions: 5,
      tone: InterpretationTone.FRIENDLY,
      includeRisks: true,
      includeOpportunities: true,
      detailLevel: 'medium',
      ...config
    };
  }

  /**
   * 生成解释
   */
  generate(
    signals: Signal[],
    probability?: ProbabilityScore,
    fortune?: FortuneScore
  ): Interpretation {
    const analysis = SignalProcessor.analyze(signals);
    
    const summary = this.generateSummary(analysis, probability, fortune);
    const detailedAnalysis = this.generateDetailedAnalysis(analysis, signals);
    const keyPoints = this.generateKeyPoints(analysis);

    return {
      summary,
      detailedAnalysis,
      keyPoints,
      tone: this.config.tone,
      confidence: analysis.confidence
    };
  }

  /**
   * 生成摘要
   */
  private generateSummary(
    analysis: ReturnType<typeof SignalProcessor.analyze>,
    probability?: ProbabilityScore,
    fortune?: FortuneScore
  ): string {
    let summary = '基于当前分析';

    if (analysis.dominantPolarity === SignalPolarity.POSITIVE) {
      summary += '，整体趋势偏积极正面';
    } else if (analysis.dominantPolarity === SignalPolarity.NEGATIVE) {
      summary += '，整体趋势偏谨慎保守';
    } else {
      summary += '，整体趋势保持中性';
    }

    if (fortune) {
      summary += `，${fortune.description}`;
    }

    if (probability) {
      summary += `。成功概率约为${Math.round(probability.successProbability * 100)}%`;
    }

    return summary + '。';
  }

  /**
   * 生成详细分析
   */
  private generateDetailedAnalysis(
    analysis: ReturnType<typeof SignalProcessor.analyze>,
    signals: Signal[]
  ): string[] {
    const details: string[] = [];

    if (analysis.positiveSignals.length > 0) {
      details.push(`有${analysis.positiveSignals.length}个积极信号，平均强度为${Math.round(analysis.averageStrength * 100)}%。`);
    }

    if (analysis.negativeSignals.length > 0) {
      details.push(`有${analysis.negativeSignals.length}个需要注意的信号。`);
    }

    if (analysis.unstableSignals.length > 0) {
      details.push(`存在${analysis.unstableSignals.length}个不稳定因素。`);
    }

    if (analysis.confidence >= 0.8) {
      details.push('分析结果置信度较高，可作为参考。');
    } else if (analysis.confidence >= 0.5) {
      details.push('分析结果有一定参考价值，但建议结合其他信息综合判断。');
    } else {
      details.push('分析结果置信度较低，建议谨慎参考或重新起卦。');
    }

    return details;
  }

  /**
   * 生成关键点
   */
  private generateKeyPoints(
    analysis: ReturnType<typeof SignalProcessor.analyze>
  ): string[] {
    const points: string[] = [];

    if (analysis.dominantPolarity === SignalPolarity.POSITIVE) {
      points.push('抓住积极信号带来的机遇');
    } else if (analysis.dominantPolarity === SignalPolarity.NEGATIVE) {
      points.push('注意潜在风险，保持谨慎');
    }

    if (analysis.averageStrength >= 0.7) {
      points.push('信号强度较高，指示性较强');
    }

    if (analysis.unstableSignals.length > 0) {
      points.push('局势可能发生变化，保持灵活');
    }

    return points;
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<InterpretationConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
