/**
 * 概率分析器
 */

import { ProbabilityScore, ProbabilityFactors, ProbabilityAnalysis } from './types';
import { ProbabilityCalculator } from './probability-calculator';
import { Signal, SignalProcessor, SignalPolarity } from '@tianwen/signal-system';

export class ProbabilityAnalyzer {
  /**
   * 完整概率分析
   */
  static analyze(signals: Signal[]): ProbabilityAnalysis {
    const score = ProbabilityCalculator.calculateFromSignals(signals);
    const factors = this.extractFactors(signals);
    
    const analysis = SignalProcessor.analyze(signals);
    
    const riskIndicators = this.extractRiskIndicators(analysis);
    const opportunityIndicators = this.extractOpportunityIndicators(analysis);

    return {
      score,
      factors,
      contributingSignals: signals,
      riskIndicators,
      opportunityIndicators
    };
  }

  /**
   * 提取影响因素
   */
  private static extractFactors(signals: Signal[]): ProbabilityFactors {
    const analysis = SignalProcessor.analyze(signals);
    
    return {
      signalStrength: analysis.averageStrength,
      signalConsistency: analysis.confidence,
      timingAlignment: 0.5,
      resonanceScore: 0.5
    };
  }

  /**
   * 提取风险指标
   */
  private static extractRiskIndicators(analysis: ReturnType<typeof SignalProcessor.analyze>): string[] {
    const indicators: string[] = [];
    
    if (analysis.negativeSignals.length > analysis.positiveSignals.length) {
      indicators.push('负面信号占主导');
    }
    
    if (analysis.unstableSignals.length > 0) {
      indicators.push('存在不稳定信号');
    }
    
    if (analysis.confidence < 0.5) {
      indicators.push('信号置信度较低');
    }
    
    return indicators;
  }

  /**
   * 提取机会指标
   */
  private static extractOpportunityIndicators(analysis: ReturnType<typeof SignalProcessor.analyze>): string[] {
    const indicators: string[] = [];
    
    if (analysis.positiveSignals.length > analysis.negativeSignals.length) {
      indicators.push('正面信号占主导');
    }
    
    if (analysis.averageStrength > 0.6) {
      indicators.push('信号强度较高');
    }
    
    if (analysis.confidence > 0.7) {
      indicators.push('信号置信度较高');
    }
    
    return indicators;
  }
}
