/**
 * 权重计算器
 */

import { Weight, WeightConfig, WeightedScore } from './types';
import { SystemType, DEFAULT_SYSTEM_WEIGHTS } from './constants';
import { WeightValidator } from './weight-validator';

export class WeightCalculator {
  /**
   * 创建默认权重配置
   */
  static createDefaultConfig(): WeightConfig {
    return {
      systemWeights: { ...DEFAULT_SYSTEM_WEIGHTS },
      contextWeights: {},
      timingWeights: {},
      dynamicWeights: {}
    };
  }

  /**
   * 计算加权分数
   */
  static calculateWeightedScore(
    values: number[],
    weights: number[]
  ): WeightedScore {
    if (values.length !== weights.length) {
      throw new Error('Values and weights length mismatch');
    }

    const validWeights = weights.map((w) => WeightValidator.normalize(w));
    const totalWeight = validWeights.reduce((sum, w) => sum + w, 0);

    if (totalWeight === 0) {
      return {
        value: 0,
        weights: [],
        totalWeight: 0,
        normalizedScore: 0
      };
    }

    const weightedSum = values.reduce((sum, value, index) => {
      return sum + value * validWeights[index];
    }, 0);

    const weightedScore = weightedSum / totalWeight;

    const weightObjects: Weight[] = validWeights.map((weight, index) => ({
      type: 'dynamic',
      key: `weight_${index}`,
      value: weight
    }));

    return {
      value: weightedScore,
      weights: weightObjects,
      totalWeight,
      normalizedScore: weightedScore
    };
  }

  /**
   * 融合系统权重
   */
  static mergeSystemWeights(
    baseConfig: WeightConfig,
    overrides: Partial<Record<SystemType, number>>
  ): WeightConfig {
    return {
      ...baseConfig,
      systemWeights: {
        ...baseConfig.systemWeights,
        ...Object.entries(overrides).reduce((acc, [key, value]) => {
          acc[key as SystemType] = WeightValidator.normalize(value);
          return acc;
        }, {} as Record<SystemType, number>)
      }
    };
  }

  /**
   * 计算综合权重
   */
  static computeCombinedWeight(
    baseWeight: number,
    modifiers: number[]
  ): number {
    let combined = baseWeight;
    modifiers.forEach((mod) => {
      combined *= mod;
    });
    return WeightValidator.normalize(combined);
  }

  /**
   * 标准化权重集合
   */
  static normalizeWeights(weights: number[]): number[] {
    const total = weights.reduce((sum, w) => sum + w, 0);
    if (total === 0) return weights.map(() => 1 / weights.length);
    return weights.map((w) => w / total);
  }
}
