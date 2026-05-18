/**
 * 推演上下文管理器
 */

import { PredictionContext, PredictionInput } from './types';
import { PredictionCategory, PredictionMode } from './constants';
import { WeightCalculator } from '@tianwen/weight-system';
import { SignalSource } from '@tianwen/signal-system';

export class PredictionContextManager {
  /**
   * 创建推演上下文
   */
  static create(input: PredictionInput): PredictionContext {
    const id = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id,
      question: input.question,
      category: input.category || PredictionCategory.GENERAL,
      systems: input.systems || [SignalSource.MEIHUA],
      timestamp: new Date(),
      userContext: input.userContext,
      weightConfig: input.weightConfig
        ? { ...WeightCalculator.createDefaultConfig(), ...input.weightConfig }
        : WeightCalculator.createDefaultConfig(),
      mode: input.mode || PredictionMode.SINGLE_SYSTEM,
      metadata: {}
    };
  }

  /**
   * 验证上下文
   */
  static validate(context: PredictionContext): boolean {
    if (!context.question.trim()) {
      return false;
    }
    if (context.systems.length === 0) {
      return false;
    }
    return true;
  }

  /**
   * 更新上下文
   */
  static update(
    context: PredictionContext,
    updates: Partial<PredictionContext>
  ): PredictionContext {
    return {
      ...context,
      ...updates,
      timestamp: new Date()
    };
  }

  /**
   * 添加元数据
   */
  static addMetadata(
    context: PredictionContext,
    key: string,
    value: unknown
  ): PredictionContext {
    return {
      ...context,
      metadata: {
        ...context.metadata,
        [key]: value
      }
    };
  }
}
