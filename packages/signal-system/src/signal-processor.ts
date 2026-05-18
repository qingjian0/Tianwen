/**
 * 信号处理器
 */

import { Signal, SignalAnalysisResult } from './types';
import { SignalPolarity, POLARITY_WEIGHTS } from './constants';
import { SignalValidator } from './signal-validator';

export class SignalProcessor {
  /**
   * 分析一组信号
   */
  static analyze(signals: Signal[]): SignalAnalysisResult {
    const validSignals = signals.filter((s) => SignalValidator.isValid(s));

    const positiveSignals = validSignals.filter((s) => s.polarity === SignalPolarity.POSITIVE);
    const negativeSignals = validSignals.filter((s) => s.polarity === SignalPolarity.NEGATIVE);
    const neutralSignals = validSignals.filter((s) => s.polarity === SignalPolarity.NEUTRAL);
    const unstableSignals = validSignals.filter((s) => s.polarity === SignalPolarity.UNSTABLE);

    const totalSignals = validSignals.length;
    const totalStrength = validSignals.reduce((sum, s) => sum + s.strength, 0);
    const averageStrength = totalSignals > 0 ? totalStrength / totalSignals : 0;

    const netPolarity = validSignals.reduce((sum, s) => {
      return sum + POLARITY_WEIGHTS[s.polarity] * s.strength;
    }, 0);

    let dominantPolarity = SignalPolarity.NEUTRAL;
    if (positiveSignals.length > negativeSignals.length && positiveSignals.length > neutralSignals.length) {
      dominantPolarity = SignalPolarity.POSITIVE;
    } else if (negativeSignals.length > positiveSignals.length && negativeSignals.length > neutralSignals.length) {
      dominantPolarity = SignalPolarity.NEGATIVE;
    } else if (unstableSignals.length > 0) {
      dominantPolarity = SignalPolarity.UNSTABLE;
    }

    const averageConfidence = totalSignals > 0
      ? validSignals.reduce((sum, s) => sum + s.confidence, 0) / totalSignals
      : 0;

    return {
      totalSignals,
      positiveSignals,
      negativeSignals,
      neutralSignals,
      unstableSignals,
      averageStrength,
      netPolarity,
      dominantPolarity,
      confidence: averageConfidence
    };
  }

  /**
   * 按极性过滤信号
   */
  static filterByPolarity(signals: Signal[], polarity: SignalPolarity): Signal[] {
    return signals.filter((s) => s.polarity === polarity);
  }

  /**
   * 按来源过滤信号
   */
  static filterBySource(signals: Signal[], source: string): Signal[] {
    return signals.filter((s) => s.source === source);
  }

  /**
   * 按强度排序信号
   */
  static sortByStrength(signals: Signal[], ascending = false): Signal[] {
    return [...signals].sort((a, b) =>
      ascending ? a.strength - b.strength : b.strength - a.strength
    );
  }
}
