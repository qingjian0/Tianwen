/**
 * 共振计算器
 */

import { ResonanceResult, SignalComparison, ResonanceAnalysis } from './types';
import { ResonanceType, RESONANCE_LABELS, RESONANCE_THRESHOLDS } from './constants';
import { Signal, SignalProcessor, SignalPolarity, SignalSource } from '@tianwen/signal-system';

export class ResonanceCalculator {
  /**
   * 计算两组信号之间的共振
   */
  static calculate(signalsA: Signal[], signalsB: Signal[]): ResonanceResult {
    const analysisA = SignalProcessor.analyze(signalsA);
    const analysisB = SignalProcessor.analyze(signalsB);

    const polarityAgreement = this.calculatePolarityAgreement(analysisA, analysisB);
    const strengthCorrelation = this.calculateStrengthCorrelation(analysisA, analysisB);
    const resonanceScore = (polarityAgreement + strengthCorrelation) / 2;

    const type = this.determineResonanceType(resonanceScore, analysisA, analysisB);
    const confidence = Math.min(analysisA.confidence, analysisB.confidence);

    return {
      type,
      score: resonanceScore,
      confidence,
      label: RESONANCE_LABELS[type],
      description: this.generateDescription(type, resonanceScore),
      timestamp: new Date()
    };
  }

  /**
   * 分析多组信号的总体共振
   */
  static analyzeMultiple(signalGroups: Record<SignalSource, Signal[]>): ResonanceAnalysis {
    const sources = Object.keys(signalGroups) as SignalSource[];
    const comparisons: SignalComparison[] = [];

    for (let i = 0; i < sources.length; i++) {
      for (let j = i + 1; j < sources.length; j++) {
        const sourceA = sources[i];
        const sourceB = sources[j];
        const resonance = this.calculate(signalGroups[sourceA], signalGroups[sourceB]);
        
        comparisons.push({
          sourceA,
          sourceB,
          signalsA: signalGroups[sourceA],
          signalsB: signalGroups[sourceB],
          resonance
        });
      }
    }

    const overall = this.calculateOverall(comparisons);
    const harmonySignals = this.extractHarmonySignals(comparisons);
    const conflictSignals = this.extractConflictSignals(comparisons);
    const recommendations = this.generateRecommendations(overall, comparisons);

    return {
      overall,
      comparisons,
      harmonySignals,
      conflictSignals,
      recommendations
    };
  }

  /**
   * 计算极性一致性
   */
  private static calculatePolarityAgreement(
    analysisA: ReturnType<typeof SignalProcessor.analyze>,
    analysisB: ReturnType<typeof SignalProcessor.analyze>
  ): number {
    const netA = analysisA.netPolarity;
    const netB = analysisB.netPolarity;
    return 1 - Math.abs(netA - netB) / 2;
  }

  /**
   * 计算强度相关性
   */
  private static calculateStrengthCorrelation(
    analysisA: ReturnType<typeof SignalProcessor.analyze>,
    analysisB: ReturnType<typeof SignalProcessor.analyze>
  ): number {
    return 1 - Math.abs(analysisA.averageStrength - analysisB.averageStrength);
  }

  /**
   * 确定共振类型
   */
  private static determineResonanceType(
    score: number,
    analysisA: ReturnType<typeof SignalProcessor.analyze>,
    analysisB: ReturnType<typeof SignalProcessor.analyze>
  ): ResonanceType {
    const bothPositive = analysisA.netPolarity > 0 && analysisB.netPolarity > 0;
    const bothNegative = analysisA.netPolarity < 0 && analysisB.netPolarity < 0;

    if (score >= RESONANCE_THRESHOLDS.HIGH) {
      return bothPositive || bothNegative ? ResonanceType.AMPLIFICATION : ResonanceType.HARMONY;
    } else if (score >= RESONANCE_THRESHOLDS.MEDIUM) {
      return ResonanceType.HARMONY;
    } else if (score <= RESONANCE_THRESHOLDS.LOW) {
      return ResonanceType.CONFLICT;
    } else {
      const oppositePolarity = (analysisA.netPolarity > 0 && analysisB.netPolarity < 0) ||
                             (analysisA.netPolarity < 0 && analysisB.netPolarity > 0);
      return oppositePolarity ? ResonanceType.SUPPRESSION : ResonanceType.NEUTRAL;
    }
  }

  /**
   * 生成描述
   */
  private static generateDescription(type: ResonanceType, score: number): string {
    switch (type) {
      case ResonanceType.HARMONY:
        return '多个系统信号和谐一致';
      case ResonanceType.CONFLICT:
        return '系统间存在明显冲突';
      case ResonanceType.AMPLIFICATION:
        return '信号互相放大增强';
      case ResonanceType.SUPPRESSION:
        return '信号相互抑制抵消';
      default:
        return '无明显共振关系';
    }
  }

  /**
   * 计算总体共振
   */
  private static calculateOverall(comparisons: SignalComparison[]): ResonanceResult {
    if (comparisons.length === 0) {
      return {
        type: ResonanceType.NEUTRAL,
        score: 0.5,
        confidence: 0,
        label: RESONANCE_LABELS[ResonanceType.NEUTRAL],
        description: '无信号组可比较',
        timestamp: new Date()
      };
    }

    const avgScore = comparisons.reduce((sum, c) => sum + c.resonance.score, 0) / comparisons.length;
    const avgConfidence = comparisons.reduce((sum, c) => sum + c.resonance.confidence, 0) / comparisons.length;
    
    const type = avgScore >= RESONANCE_THRESHOLDS.HIGH ? ResonanceType.HARMONY :
                 avgScore <= RESONANCE_THRESHOLDS.LOW ? ResonanceType.CONFLICT :
                 ResonanceType.NEUTRAL;

    return {
      type,
      score: avgScore,
      confidence: avgConfidence,
      label: RESONANCE_LABELS[type],
      description: this.generateDescription(type, avgScore),
      timestamp: new Date()
    };
  }

  /**
   * 提取和谐信号
   */
  private static extractHarmonySignals(comparisons: SignalComparison[]): Signal[] {
    const harmonyComparisons = comparisons.filter(c =>
      c.resonance.type === ResonanceType.HARMONY ||
      c.resonance.type === ResonanceType.AMPLIFICATION
    );
    return harmonyComparisons.flatMap(c => [...c.signalsA, ...c.signalsB]);
  }

  /**
   * 提取冲突信号
   */
  private static extractConflictSignals(comparisons: SignalComparison[]): Signal[] {
    const conflictComparisons = comparisons.filter(c =>
      c.resonance.type === ResonanceType.CONFLICT ||
      c.resonance.type === ResonanceType.SUPPRESSION
    );
    return conflictComparisons.flatMap(c => [...c.signalsA, ...c.signalsB]);
  }

  /**
   * 生成建议
   */
  private static generateRecommendations(
    overall: ResonanceResult,
    comparisons: SignalComparison[]
  ): string[] {
    const recommendations: string[] = [];

    if (overall.type === ResonanceType.HARMONY || overall.type === ResonanceType.AMPLIFICATION) {
      recommendations.push('多系统信号一致，可信度高');
    } else if (overall.type === ResonanceType.CONFLICT) {
      recommendations.push('系统间存在冲突，建议审慎决策');
    }

    const conflicts = comparisons.filter(c => c.resonance.type === ResonanceType.CONFLICT);
    if (conflicts.length > 0) {
      recommendations.push(`存在${conflicts.length}组系统冲突，需进一步分析`);
    }

    return recommendations;
  }
}
