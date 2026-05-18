/**
 * 融合策略实现
 */

import { SystemResult, FusionResult } from './types';
import { FusionStrategy, FUSION_STRATEGY_LABELS } from './constants';
import { Signal, SignalProcessor, SignalPolarity } from '@tianwen/signal-system';
import { WeightCalculator } from '@tianwen/weight-system';
import { ProbabilityCalculator } from '@tianwen/probability-engine';
import { ResonanceCalculator } from '@tianwen/resonance-engine';

export class FusionStrategies {
  /**
   * 加权平均融合
   */
  static weightedAverage(systemResults: SystemResult[]): FusionResult {
    const totalWeight = systemResults.reduce((sum, r) => sum + r.weight, 0);
    
    const allSignals = systemResults.flatMap(r =>
      r.signals.map(s => ({
        ...s,
        strength: s.strength * (r.weight / totalWeight)
      }))
    );

    const contributions = systemResults.reduce((acc, r) => {
      acc[r.source] = r.weight / totalWeight;
      return acc;
    }, {} as Record<SignalSource, number>);

    const overallConfidence = systemResults.reduce((sum, r) =>
      sum + r.confidence * (r.weight / totalWeight), 0
    );

    return {
      strategy: FusionStrategy.WEIGHTED_AVERAGE,
      fusedSignals: allSignals,
      confidence: overallConfidence,
      contributions,
      timestamp: new Date()
    };
  }

  /**
   * 置信度优先融合
   */
  static confidenceBased(systemResults: SystemResult[]): FusionResult {
    const sortedResults = [...systemResults].sort((a, b) => b.confidence - a.confidence);
    const topResults = sortedResults.slice(0, Math.max(2, Math.ceil(sortedResults.length / 2)));
    
    const totalConfidence = topResults.reduce((sum, r) => sum + r.confidence, 0);
    
    const allSignals = topResults.flatMap(r =>
      r.signals.map(s => ({
        ...s,
        strength: s.strength * (r.confidence / totalConfidence)
      }))
    );

    const contributions = systemResults.reduce((acc, r) => {
      acc[r.source] = topResults.includes(r) ? r.confidence / totalConfidence : 0;
      return acc;
    }, {} as Record<SignalSource, number>);

    return {
      strategy: FusionStrategy.CONFIDENCE_BASED,
      fusedSignals: allSignals,
      confidence: topResults[0]?.confidence || 0,
      contributions,
      timestamp: new Date()
    };
  }

  /**
   * 共识融合
   */
  static consensus(systemResults: SystemResult[]): FusionResult {
    const allSignals = systemResults.flatMap(r => r.signals);
    const analysis = SignalProcessor.analyze(allSignals);

    const consensusSignals = allSignals.filter(s => {
      if (analysis.dominantPolarity === SignalPolarity.POSITIVE) {
        return s.polarity === SignalPolarity.POSITIVE;
      } else if (analysis.dominantPolarity === SignalPolarity.NEGATIVE) {
        return s.polarity === SignalPolarity.NEGATIVE;
      }
      return true;
    });

    const contributions = systemResults.reduce((acc, r) => {
      const matchingSignals = r.signals.filter(s => consensusSignals.includes(s)).length;
      acc[r.source] = r.signals.length > 0 ? matchingSignals / r.signals.length : 0;
      return acc;
    }, {} as Record<SignalSource, number>);

    return {
      strategy: FusionStrategy.CONSENSUS,
      fusedSignals: consensusSignals,
      confidence: analysis.confidence,
      contributions,
      timestamp: new Date()
    };
  }

  /**
   * 共振加权融合
   */
  static resonanceWeighted(systemResults: SystemResult[]): FusionResult {
    const signalGroups = systemResults.reduce((acc, r) => {
      acc[r.source] = r.signals;
      return acc;
    }, {} as Record<SignalSource, Signal[]>);

    const resonanceAnalysis = ResonanceCalculator.analyzeMultiple(signalGroups);
    
    const harmonicWeights = systemResults.map(r => {
      const hasHarmony = resonanceAnalysis.harmonySignals.some(s =>
        r.signals.includes(s)
      );
      return hasHarmony ? r.weight * 1.5 : r.weight;
    });

    const totalWeight = harmonicWeights.reduce((sum, w) => sum + w, 0);
    
    const allSignals = systemResults.flatMap((r, i) =>
      r.signals.map(s => ({
        ...s,
        strength: s.strength * (harmonicWeights[i] / totalWeight)
      }))
    );

    const contributions = systemResults.reduce((acc, r, i) => {
      acc[r.source] = harmonicWeights[i] / totalWeight;
      return acc;
    }, {} as Record<SignalSource, number>);

    return {
      strategy: FusionStrategy.RESONANCE_WEIGHTED,
      fusedSignals: allSignals,
      resonanceAnalysis,
      confidence: resonanceAnalysis.overall.confidence,
      contributions,
      timestamp: new Date()
    };
  }
}
