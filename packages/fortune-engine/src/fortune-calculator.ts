/**
 * 吉凶计算器
 */

import { FortuneScore, FortuneFactors, FortuneAnalysis } from './types';
import {
  FortuneLevel,
  FORTUNE_THRESHOLDS,
  FORTUNE_LABELS,
  FORTUNE_DESCRIPTIONS
} from './constants';
import { Signal, SignalProcessor, SignalPolarity } from '@tianwen/signal-system';
import { ProbabilityScore } from '@tianwen/probability-engine';

export class FortuneCalculator {
  /**
   * 从信号计算吉凶
   */
  static calculateFromSignals(signals: Signal[]): FortuneScore {
    const analysis = SignalProcessor.analyze(signals);
    
    const positiveRatio = analysis.totalSignals > 0
      ? analysis.positiveSignals.length / analysis.totalSignals
      : 0.5;
    
    const weightedScore = (positiveRatio + analysis.netPolarity + 1) / 3;
    const score = Math.max(0, Math.min(1, weightedScore));
    
    const level = this.determineLevel(score);
    const confidence = analysis.confidence;

    return {
      level,
      score,
      confidence,
      label: FORTUNE_LABELS[level],
      description: FORTUNE_DESCRIPTIONS[level],
      timestamp: new Date()
    };
  }

  /**
   * 从概率分数计算吉凶
   */
  static calculateFromProbability(probability: ProbabilityScore): FortuneScore {
    const score = probability.successProbability;
    const level = this.determineLevel(score);

    return {
      level,
      score,
      confidence: probability.confidence,
      label: FORTUNE_LABELS[level],
      description: FORTUNE_DESCRIPTIONS[level],
      timestamp: new Date()
    };
  }

  /**
   * 确定吉凶等级
   */
  private static determineLevel(score: number): FortuneLevel {
    if (score >= FORTUNE_THRESHOLDS.GREAT_FORTUNE) return FortuneLevel.GREAT_FORTUNE;
    if (score >= FORTUNE_THRESHOLDS.FORTUNE) return FortuneLevel.FORTUNE;
    if (score >= FORTUNE_THRESHOLDS.NEUTRAL) return FortuneLevel.NEUTRAL;
    if (score >= FORTUNE_THRESHOLDS.WARNING) return FortuneLevel.WARNING;
    return FortuneLevel.DANGER;
  }
}
