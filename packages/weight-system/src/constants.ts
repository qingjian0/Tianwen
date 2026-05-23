/**
 * 权重系统常量
 */

export enum WeightType {
  SYSTEM = "system",
  CONTEXT = "context",
  TIMING = "timing",
  SIGNAL = "signal",
  DYNAMIC = "dynamic",
}

export enum SystemType {
  MEIHUA = "meihua",
  LIUYAO = "liuyao",
  QIMEN = "qimen",
  BAZI = "bazi",
  ZIWEI = "ziwei",
}

export const DEFAULT_SYSTEM_WEIGHTS: Record<SystemType, number> = {
  [SystemType.MEIHUA]: 1.0,
  [SystemType.LIUYAO]: 1.0,
  [SystemType.QIMEN]: 1.2,
  [SystemType.BAZI]: 1.1,
  [SystemType.ZIWEI]: 1.1,
};

export const MIN_WEIGHT = 0.1;
export const MAX_WEIGHT = 2.0;
export const DEFAULT_WEIGHT = 1.0;
