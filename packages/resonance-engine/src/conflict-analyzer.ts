/**
 * 冲突分析器
 */

import { SignalComparison } from './types';
import { ResonanceType } from './constants';
import { Signal, SignalPolarity } from '@tianwen/signal-system';

export class ConflictAnalyzer {
  /**
   * 分析冲突的根本原因
   */
  static analyzeConflict(comparison: SignalComparison): {
    reason: string;
    severity: number;
    resolutionSuggestions: string[];
  } {
    const { signalsA, signalsB } = comparison;

    const polarityConflict = this.hasPolarityConflict(signalsA, signalsB);
    const strengthConflict = this.hasStrengthConflict(signalsA, signalsB);

    let reason = '信号存在差异';
    let severity = 0.5;

    if (polarityConflict && strengthConflict) {
      reason = '极性和强度均存在显著冲突';
      severity = 0.9;
    } else if (polarityConflict) {
      reason = '信号极性相反';
      severity = 0.7;
    } else if (strengthConflict) {
      reason = '信号强度差异较大';
      severity = 0.4;
    }

    const resolutionSuggestions = this.generateSuggestions(comparison, severity);

    return {
      reason,
      severity,
      resolutionSuggestions
    };
  }

  /**
   * 检查极性冲突
   */
  private static hasPolarityConflict(signalsA: Signal[], signalsB: Signal[]): boolean {
    const aPositive = signalsA.filter(s => s.polarity === SignalPolarity.POSITIVE).length;
    const bPositive = signalsB.filter(s => s.polarity === SignalPolarity.POSITIVE).length;
    
    const aRatio = signalsA.length > 0 ? aPositive / signalsA.length : 0.5;
    const bRatio = signalsB.length > 0 ? bPositive / signalsB.length : 0.5;
    
    return Math.abs(aRatio - bRatio) > 0.5;
  }

  /**
   * 检查强度冲突
   */
  private static hasStrengthConflict(signalsA: Signal[], signalsB: Signal[]): boolean {
    const avgStrengthA = signalsA.length > 0
      ? signalsA.reduce((sum, s) => sum + s.strength, 0) / signalsA.length
      : 0.5;
    const avgStrengthB = signalsB.length > 0
      ? signalsB.reduce((sum, s) => sum + s.strength, 0) / signalsB.length
      : 0.5;
    
    return Math.abs(avgStrengthA - avgStrengthB) > 0.4;
  }

  /**
   * 生成解决建议
   */
  private static generateSuggestions(
    comparison: SignalComparison,
    severity: number
  ): string[] {
    const suggestions: string[] = [];

    if (severity >= 0.7) {
      suggestions.push('建议收集更多数据重新分析');
      suggestions.push('考虑使用第三方系统验证');
    } else if (severity >= 0.4) {
      suggestions.push('权衡不同系统的权重');
      suggestions.push('关注信号的时间维度');
    }

    suggestions.push('综合考虑，避免依赖单一系统');

    return suggestions;
  }
}
