/**
 * 概率引擎常量
 */

export enum ProbabilityLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export const PROBABILITY_THRESHOLDS = {
  VERY_LOW: 0.2,
  LOW: 0.4,
  MEDIUM: 0.6,
  HIGH: 0.8,
  VERY_HIGH: 1.0
};

export const MIN_PROBABILITY = 0;
export const MAX_PROBABILITY = 1;
export const DEFAULT_PROBABILITY = 0.5;
