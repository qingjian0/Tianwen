/**
 * 共振引擎常量
 */

export enum ResonanceType {
  HARMONY = "harmony",
  CONFLICT = "conflict",
  AMPLIFICATION = "amplification",
  SUPPRESSION = "suppression",
  NEUTRAL = "neutral",
}

export const RESONANCE_LABELS: Record<ResonanceType, string> = {
  [ResonanceType.HARMONY]: "和谐共振",
  [ResonanceType.CONFLICT]: "冲突矛盾",
  [ResonanceType.AMPLIFICATION]: "放大增强",
  [ResonanceType.SUPPRESSION]: "抑制抵消",
  [ResonanceType.NEUTRAL]: "中性无共振",
};

export const RESONANCE_THRESHOLDS = {
  HIGH: 0.7,
  MEDIUM: 0.4,
  LOW: 0.2,
};
