/**
 * 权重验证器
 */

import { z } from 'zod';
import { Weight, WeightSchema, WeightConfig, WeightConfigSchema } from './types';
import { MIN_WEIGHT, MAX_WEIGHT, DEFAULT_WEIGHT } from './constants';

export class WeightValidator {
  /**
   * 验证单个权重
   */
  static validate(weight: unknown): Weight {
    return WeightSchema.parse(weight);
  }

  /**
   * 安全验证
   */
  static isValid(weight: unknown): weight is Weight {
    return WeightSchema.safeParse(weight).success;
  }

  /**
   * 验证权重配置
   */
  static validateConfig(config: unknown): WeightConfig {
    return WeightConfigSchema.parse(config);
  }

  /**
   * 标准化权重值
   */
  static normalize(weight: number): number {
    return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight));
  }

  /**
   * 验证权重范围
   */
  static isValidValue(value: number): boolean {
    return value >= MIN_WEIGHT && value <= MAX_WEIGHT;
  }
}
