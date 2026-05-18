/**
 * 吉凶引擎常量
 */

export enum FortuneLevel {
  GREAT_FORTUNE = 'great_fortune',
  FORTUNE = 'fortune',
  NEUTRAL = 'neutral',
  WARNING = 'warning',
  DANGER = 'danger'
}

export const FORTUNE_THRESHOLDS = {
  GREAT_FORTUNE: 0.8,
  FORTUNE: 0.6,
  NEUTRAL: 0.4,
  WARNING: 0.2,
  DANGER: 0
};

export const FORTUNE_LABELS: Record<FortuneLevel, string> = {
  [FortuneLevel.GREAT_FORTUNE]: '大吉',
  [FortuneLevel.FORTUNE]: '吉',
  [FortuneLevel.NEUTRAL]: '平',
  [FortuneLevel.WARNING]: '凶',
  [FortuneLevel.DANGER]: '大凶'
};

export const FORTUNE_DESCRIPTIONS: Record<FortuneLevel, string> = {
  [FortuneLevel.GREAT_FORTUNE]: '运势极佳，诸事顺遂',
  [FortuneLevel.FORTUNE]: '运势良好，宜积极行动',
  [FortuneLevel.NEUTRAL]: '运势平稳，宜静观其变',
  [FortuneLevel.WARNING]: '运势不佳，需谨慎行事',
  [FortuneLevel.DANGER]: '运势极差，宜规避风险'
};
