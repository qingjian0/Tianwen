/**
 * 信号验证器
 */

import { z } from 'zod';
import { Signal, SignalSchema } from './types';
import { SignalPolarity, SignalStrength } from './constants';

export class SignalValidator {
  /**
   * 验证单个信号
   */
  static validate(signal: unknown): Signal {
    return SignalSchema.parse(signal);
  }

  /**
   * 安全验证，返回布尔值
   */
  static isValid(signal: unknown): signal is Signal {
    return SignalSchema.safeParse(signal).success;
  }

  /**
   * 验证信号强度是否在有效范围内
   */
  static isValidStrength(strength: number): boolean {
    return strength >= 0 && strength <= 1;
  }

  /**
   * 标准化信号强度
   */
  static normalizeStrength(strength: number): number {
    return Math.max(0, Math.min(1, strength));
  }

  /**
   * 标准化置信度
   */
  static normalizeConfidence(confidence: number): number {
    return Math.max(0, Math.min(1, confidence));
  }
}
