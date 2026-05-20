/**
 * Pipeline 常量定义
 */

// 默认 Pipeline 配置
export const DEFAULT_PIPELINE_CONFIG = {
  enableCache: true,
  enableConflictResolution: true,
  enableMultiSystemFusion: false,
  maxExecutionTimeMs: 30000
};

// 阶段顺序
export const PIPELINE_STAGE_ORDER: string[] = [
  'input',
  'chrono',
  'divination',
  'signal',
  'rule',
  'conflict',
  'probability',
  'fortune',
  'timing',
  'interpretation',
  'output'
];

// 阶段超时（毫秒）
export const STAGE_TIMEOUTS: Record<string, number> = {
  input: 1000,
  chrono: 2000,
  divination: 5000,
  signal: 3000,
  rule: 5000,
  conflict: 2000,
  probability: 1000,
  fortune: 1000,
  timing: 2000,
  interpretation: 3000,
  output: 1000
};

// 阶段重试次数
export const STAGE_RETRIES: Record<string, number> = {
  input: 0,
  chrono: 1,
  divination: 2,
  signal: 1,
  rule: 1,
  conflict: 0,
  probability: 0,
  fortune: 0,
  timing: 1,
  interpretation: 2,
  output: 0
};

// 系统优先级
export const SYSTEM_PRIORITIES: Record<string, number> = {
  meihua: 1.0,
  liuyao: 1.1,
  qimen: 1.2,
  bazi: 1.3,
  ziwei: 1.4,
  liuren: 1.5,
  huangji: 1.6,
  xiaochengtu: 0.9,
  cegui: 1.5,
  huangli: 0.5
};

// 默认权重
export const DEFAULT_WEIGHTS = {
  meihua: 0.3,
  liuyao: 0.3,
  qimen: 0.2,
  bazi: 0.2,
  ziwei: 0.0,
  liuren: 0.0,
  huangji: 0.0,
  xiaochengtu: 0.0,
  cegui: 0.0,
  huangli: 0.0
};

// 吉凶分数范围
export const FORTUNE_LEVELS = {
  greatFortune: { min: 80, max: 100, label: '大吉' },
  fortune: { min: 60, max: 79, label: '吉' },
  neutral: { min: 40, max: 59, label: '平' },
  warning: { min: 20, max: 39, label: '凶' },
  danger: { min: 0, max: 19, label: '大凶' }
};

// 概率映射
export const PROBABILITY_MAPPING = {
  greatFortune: { min: 0.75, max: 0.95 },
  fortune: { min: 0.60, max: 0.74 },
  neutral: { min: 0.40, max: 0.59 },
  warning: { min: 0.20, max: 0.39 },
  danger: { min: 0.05, max: 0.19 }
};
