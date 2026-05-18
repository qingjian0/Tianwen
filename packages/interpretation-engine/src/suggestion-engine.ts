/**
 * 建议引擎
 */

import { Suggestion, InterpretationResult, InterpretationConfig } from './types';
import { SuggestionType, InterpretationTone } from './constants';
import { Signal, SignalProcessor, SignalPolarity } from '@tianwen/signal-system';
import { ProbabilityScore } from '@tianwen/probability-engine';
import { FortuneScore } from '@tianwen/fortune-engine';
import { InterpretationGenerator } from './interpretation-generator';

export class SuggestionEngine {
  private config: InterpretationConfig;
  private generator: InterpretationGenerator;

  constructor(config?: Partial<InterpretationConfig>) {
    this.config = {
      maxSuggestions: 5,
      tone: InterpretationTone.FRIENDLY,
      includeRisks: true,
      includeOpportunities: true,
      detailLevel: 'medium',
      ...config
    };
    this.generator = new InterpretationGenerator(this.config);
  }

  /**
   * 生成完整解释结果
   */
  generateInterpretation(
    signals: Signal[],
    probability?: ProbabilityScore,
    fortune?: FortuneScore
  ): InterpretationResult {
    const interpretation = this.generator.generate(signals, probability, fortune);
    const suggestions = this.generateSuggestions(signals, probability, fortune);
    const risks = this.extractRisks(signals);
    const opportunities = this.extractOpportunities(signals);

    return {
      interpretation,
      suggestions,
      risks,
      opportunities,
      sources: signals
    };
  }

  /**
   * 生成建议
   */
  private generateSuggestions(
    signals: Signal[],
    probability?: ProbabilityScore,
    fortune?: FortuneScore
  ): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const analysis = SignalProcessor.analyze(signals);

    if (analysis.dominantPolarity === SignalPolarity.POSITIVE) {
      suggestions.push({
        id: 'action-1',
        type: SuggestionType.ACTION,
        content: '把握当前有利时机，积极采取行动',
        priority: 1,
        actionable: true,
        reason: '积极信号占主导'
      });
    } else if (analysis.dominantPolarity === SignalPolarity.NEGATIVE) {
      suggestions.push({
        id: 'precaution-1',
        type: SuggestionType.PRECAUTION,
        content: '保持谨慎，避免重大决策',
        priority: 1,
        actionable: true,
        reason: '需要注意的信号较多'
      });
    }

    if (analysis.unstableSignals.length > 0) {
      suggestions.push({
        id: 'attitude-1',
        type: SuggestionType.ATTITUDE,
        content: '保持灵活应对的态度',
        priority: 2,
        actionable: true,
        reason: '存在不稳定因素'
      });
    }

    if (probability && probability.successProbability >= 0.7) {
      suggestions.push({
        id: 'timing-1',
        type: SuggestionType.TIMING,
        content: '当前时机有利，可以考虑行动',
        priority: 2,
        actionable: true,
        reason: '成功概率较高'
      });
    } else if (probability && probability.successProbability <= 0.3) {
      suggestions.push({
        id: 'timing-2',
        type: SuggestionType.TIMING,
        content: '建议暂缓行动，等待更好时机',
        priority: 2,
        actionable: true,
        reason: '成功概率较低'
      });
    }

    if (analysis.confidence < 0.5) {
      suggestions.push({
        id: 'precaution-2',
        type: SuggestionType.PRECAUTION,
        content: '建议收集更多信息再做决策',
        priority: 3,
        actionable: true,
        reason: '分析置信度较低'
      });
    }

    suggestions.push({
      id: 'attitude-2',
      type: SuggestionType.ATTITUDE,
      content: '保持理性思考，避免盲从',
      priority: 4,
      actionable: true,
      reason: '术数仅供参考'
    });

    return suggestions
      .sort((a, b) => a.priority - b.priority)
      .slice(0, this.config.maxSuggestions);
  }

  /**
   * 提取风险
   */
  private extractRisks(signals: Signal[]): string[] {
    if (!this.config.includeRisks) return [];

    const analysis = SignalProcessor.analyze(signals);
    const risks: string[] = [];

    if (analysis.negativeSignals.length > 0) {
      risks.push('存在需要注意的信号');
    }

    if (analysis.unstableSignals.length > 0) {
      risks.push('局势可能发生变化');
    }

    if (analysis.confidence < 0.5) {
      risks.push('分析结果置信度较低');
    }

    return risks;
  }

  /**
   * 提取机遇
   */
  private extractOpportunities(signals: Signal[]): string[] {
    if (!this.config.includeOpportunities) return [];

    const analysis = SignalProcessor.analyze(signals);
    const opportunities: string[] = [];

    if (analysis.positiveSignals.length > 0) {
      opportunities.push('有积极信号指示');
    }

    if (analysis.dominantPolarity === SignalPolarity.POSITIVE) {
      opportunities.push('整体趋势偏向积极');
    }

    if (analysis.confidence >= 0.7) {
      opportunities.push('分析结果置信度较高');
    }

    return opportunities;
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<InterpretationConfig>): void {
    this.config = { ...this.config, ...config };
    this.generator.updateConfig(config);
  }
}
