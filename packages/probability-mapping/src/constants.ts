import { SignalPolarity, SignalStrength } from "@tianwen/signal-system";

// 默认映射配置
export const DEFAULT_MAPPING_CONFIG = {
  baseProbability: 0.5,
  positiveMultiplier: 1.15,
  negativeMultiplier: 0.85,
  strengthWeights: { high: 1.2, medium: 1.0, low: 0.7 },
  confidenceThreshold: 0.6,
};

// 极性到分数权重
export const POLARITY_SCORE_WEIGHTS: Record<SignalPolarity, number> = {
  positive: 0.35,
  neutral: 0,
  negative: -0.35,
  unstable: -0.15,
};

// 强度权重
export const STRENGTH_WEIGHTS: Record<SignalStrength, number> = {
  high: 1.3,
  medium: 1.0,
  low: 0.7,
};

// 置信度因子
export const CONFIDENCE_FACTOR = 0.1;
