import { Wuxing, Bagua } from '@tianwen/metaphysics-types';

// 规则来源类型
export interface RuleSource {
  id: string;
  name: string;
  type: 'classic' | 'modern' | 'school' | 'custom';
  school?: string;
  classic?: string;
  chapter?: string;
  page?: number;
  author?: string;
  year?: number;
  weight?: number;
  confidence?: number;
}

// 规则条件操作符
export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterOrEqual'
  | 'lessOrEqual'
  | 'contains'
  | 'notContains'
  | 'in'
  | 'notIn'
  | 'startsWith'
  | 'endsWith'
  | 'matches'
  | 'isTrue'
  | 'isFalse'
  | 'isNull'
  | 'isNotNull'
  | 'exists'
  | 'notExists'
  | 'wuxingSheng'
  | 'wuxingKe'
  | 'wuxingBihe'
  | 'ganzhiHe'
  | 'ganzhiChong'
  | 'ganzhiXing';

// 规则条件
export interface RuleCondition {
  id: string;
  type: 'simple' | 'and' | 'or' | 'not' | 'nested';
  field?: string;
  operator?: ConditionOperator;
  value?: any;
  conditions?: RuleCondition[];
  description?: string;
}

// 规则效果类型
export type EffectType =
  | 'signal'
  | 'probability'
  | 'fortune'
  | 'timing'
  | 'confidence'
  | 'priority';

// 规则效果
export interface RuleEffect {
  id: string;
  type: EffectType;
  action: 'add' | 'subtract' | 'multiply' | 'divide' | 'set';
  target: string;
  value: number | string;
  description?: string;
  signalId?: string;
}

// 规则类别
export type RuleCategory =
  | 'meihua'
  | 'liuyao'
  | 'qimen'
  | 'bazi'
  | 'ziwei'
  | 'universal'
  | 'custom';

// 规则优先级
export type RulePriority =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'informational';

// 规则状态
export type RuleStatus = 'active' | 'inactive' | 'deprecated' | 'testing';

// 规则元数据
export interface RuleMetadata {
  id: string;
  name: string;
  description: string;
  category: RuleCategory;
  subcategory?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
  tags?: string[];
  status: RuleStatus;
  priority: RulePriority;
  source: RuleSource;
  examples?: RuleExample[];
  references?: RuleReference[];
  notes?: string;
}

// 规则示例
export interface RuleExample {
  id: string;
  description: string;
  input: any;
  expectedOutput: any;
  explanation?: string;
}

// 规则引用
export interface RuleReference {
  id: string;
  type: 'classic' | 'modern' | 'commentary';
  title: string;
  author?: string;
  chapter?: string;
  page?: number;
  text?: string;
  url?: string;
}

// 规则定义
export interface Rule {
  metadata: RuleMetadata;
  conditions: RuleCondition;
  effects: RuleEffect[];
  weight?: number;
  confidence?: number;
  mutuallyExclusive?: string[];
  dependsOn?: string[];
  overrides?: string[];
}

// 规则匹配结果
export interface RuleMatchResult {
  rule: Rule;
  matched: boolean;
  matchedConditions: RuleCondition[];
  conditionsSatisfied: number;
  totalConditions: number;
  matchScore: number;
  executionTimeMs: number;
}

// 规则执行结果
export interface RuleExecutionResult {
  rule: Rule;
  executed: boolean;
  matched: boolean;
  appliedEffects: RuleEffect[];
  skippedEffects: RuleEffect[];
  errors?: string[];
  warnings?: string[];
  executionTimeMs: number;
}

// 规则引擎配置
export interface RuleEngineConfig {
  maxRulesToExecute: number;
  stopOnFirstMatch: boolean;
  defaultConfidence: number;
  defaultPriorityWeight: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
  enableConflictResolution: boolean;
  enableRuleLogging: boolean;
  strictMode: boolean;
}

// 规则上下文
export interface RuleContext {
  data: any;
  timestamp: Date;
  locale?: string;
  userContext?: any;
  systemContext?: any;
}
