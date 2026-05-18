/**
 * 信号系统常量
 */

export enum SignalPolarity {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
  UNSTABLE = 'unstable'
}

export enum SignalStrength {
  WEAK = 0.2,
  MODERATE = 0.5,
  STRONG = 0.8,
  OVERWHELMING = 1.0
}

export enum SignalSource {
  MEIHUA = 'meihua',
  LIUYAO = 'liuyao',
  QIMEN = 'qimen',
  BAZI = 'bazi',
  ZIWEI = 'ziwei',
  FUSION = 'fusion'
}

export const POLARITY_WEIGHTS = {
  [SignalPolarity.POSITIVE]: 1,
  [SignalPolarity.NEGATIVE]: -1,
  [SignalPolarity.NEUTRAL]: 0,
  [SignalPolarity.UNSTABLE]: 0.5
};
