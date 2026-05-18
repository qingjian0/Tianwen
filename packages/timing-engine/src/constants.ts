/**
 * 时间引擎常量
 */

export enum TimeStrength {
  PEAK = 'peak',
  RISING = 'rising',
  STABLE = 'stable',
  DECLINING = 'declining',
  COLLAPSE = 'collapse'
}

export enum TimeHorizon {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long'
}

export const TIME_HORIZON_DAYS: Record<TimeHorizon, number> = {
  [TimeHorizon.SHORT]: 7,
  [TimeHorizon.MEDIUM]: 30,
  [TimeHorizon.LONG]: 90
};

export const TIME_STRENGTH_LABELS: Record<TimeStrength, string> = {
  [TimeStrength.PEAK]: '鼎盛期',
  [TimeStrength.RISING]: '上升期',
  [TimeStrength.STABLE]: '稳定期',
  [TimeStrength.DECLINING]: '衰退期',
  [TimeStrength.COLLAPSE]: '崩溃期'
};
