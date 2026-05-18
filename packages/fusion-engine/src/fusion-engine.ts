/**
 * 融合引擎主类
 */

import { SystemResult, FusionResult } from './types';
import { FusionStrategy, FUSION_STRATEGY_LABELS } from './constants';
import { FusionStrategies } from './fusion-strategies';
import { Signal, SignalSource } from '@tianwen/signal-system';
import { WeightConfig, WeightCalculator } from '@tianwen/weight-system';
import { ProbabilityCalculator, ProbabilityAnalyzer } from '@tianwen/probability-engine';

export class FusionEngine {
  private weightConfig: WeightConfig;
  private defaultStrategy: FusionStrategy;

  constructor(
    weightConfig?: WeightConfig,
    defaultStrategy: FusionStrategy = FusionStrategy.WEIGHTED_AVERAGE
  ) {
    this.weightConfig = weightConfig || WeightCalculator.createDefaultConfig();
    this.defaultStrategy = defaultStrategy;
  }

  /**
   * 执行融合
   */
  async fuse(
    systemResults: SystemResult[],
    strategy?: FusionStrategy
  ): Promise<FusionResult> {
    const useStrategy = strategy || this.defaultStrategy;
    let result: FusionResult;

    switch (useStrategy) {
      case FusionStrategy.WEIGHTED_AVERAGE:
        result = FusionStrategies.weightedAverage(systemResults);
        break;
      case FusionStrategy.CONFIDENCE_BASED:
        result = FusionStrategies.confidenceBased(systemResults);
        break;
      case FusionStrategy.CONSENSUS:
        result = FusionStrategies.consensus(systemResults);
        break;
      case FusionStrategy.RESONANCE_WEIGHTED:
        result = FusionStrategies.resonanceWeighted(systemResults);
        break;
      default:
        result = FusionStrategies.weightedAverage(systemResults);
    }

    const probabilityScore = ProbabilityCalculator.calculateFromSignals(result.fusedSignals);
    result.overallProbability = probabilityScore;

    return result;
  }

  /**
   * 使用多种策略融合并选择最佳结果
   */
  async fuseWithMultipleStrategies(
    systemResults: SystemResult[],
    strategies: FusionStrategy[] = Object.values(FusionStrategy)
  ): Promise<{
    results: FusionResult[];
    best: FusionResult;
  }> {
    const results = await Promise.all(
      strategies.map(strategy => this.fuse(systemResults, strategy))
    );

    const best = results.reduce((currentBest, result) =>
      result.confidence > currentBest.confidence ? result : currentBest
    );

    return { results, best };
  }

  /**
   * 更新权重配置
   */
  updateWeightConfig(config: Partial<WeightConfig>): void {
    this.weightConfig = { ...this.weightConfig, ...config };
  }

  /**
   * 获取当前权重配置
   */
  getWeightConfig(): WeightConfig {
    return { ...this.weightConfig };
  }
}
