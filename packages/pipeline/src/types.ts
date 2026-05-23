/**
 * 天问推演流水线类型定义
 * Phase 6: Pipeline 整合核心
 */

import { RuleContext } from "@tianwen/rule-engine-core";
import { Signal } from "@tianwen/signal-system";
import { ProbabilityScore } from "@tianwen/probability-engine";
import { FortuneLevel } from "@tianwen/fortune-engine";

// 推演系统类型
export type DivinationSystem =
  | "meihua"
  | "liuyao"
  | "qimen"
  | "bazi"
  | "ziwei"
  | "liuren"
  | "huangji"
  | "xiaochengtu"
  | "cegui"
  | "huangli";

// 随机数输入模式
export type RandomSourceMode = "manual" | "auto" | "timestamp" | "digital";

// 随机数来源配置
export interface RandomSource {
  mode: RandomSourceMode;
  values?: number[];
  diceCount?: number;
  digitLength?: number;
  seed?: string;
}

// 事件时间
export interface EventTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
}

// 用户输入
export interface PredictionInput {
  question: string;
  category: string;
  systems: DivinationSystem[];
  mode: PredictionMode;
  timestamp?: Date;
  birth?: BirthInfo;
  eventTime?: EventTime;
  randomSource?: RandomSource;
  location?: Location;
  systemConfig?: Record<string, Record<string, any>>;
}

// 推演模式
export type PredictionMode = "single" | "fusion" | "compare" | "timeline";

// 出生信息
export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  gender: "male" | "female";
  calendar: "solar" | "lunar";
}

// 位置信息
export interface Location {
  longitude: number;
  latitude: number;
  timezone: string;
}

// 流水线阶段
export type PipelineStage =
  | "input"
  | "random"
  | "chrono"
  | "divination"
  | "signal"
  | "rule"
  | "conflict"
  | "probability"
  | "fortune"
  | "timing"
  | "interpretation"
  | "output";

// 阶段状态
export type StageStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "skipped";

// 阶段结果
export interface StageResult<T = any> {
  stage: PipelineStage;
  status: StageStatus;
  data?: T;
  error?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  metadata?: Record<string, any>;
}

// 流水线上下文
export interface PipelineContext {
  id: string;
  input: PredictionInput;
  currentStage: PipelineStage;
  stageResults: Map<PipelineStage, StageResult>;
  signals: Signal[];
  generatedRandom?: number[];
  ruleContext?: RuleContext;
  conflictResolution?: any;
  probabilityScore?: ProbabilityScore;
  fortuneLevel?: FortuneLevel;
  interpretation?: any;
  metadata: PipelineMetadata;
}

// 流水线元数据
export interface PipelineMetadata {
  version: string;
  createdAt: Date;
  completedAt?: Date;
  totalDuration?: number;
  system: string;
  userAgent?: string;
  cacheHit: boolean;
}

// 流水线配置
export interface PipelineConfig {
  enableCache: boolean;
  enableConflictResolution: boolean;
  enableMultiSystemFusion: boolean;
  maxExecutionTimeMs: number;
  stages: StageConfig[];
  rules?: {
    enabled: boolean;
    categories?: string[];
    strategy?: string;
  };
  interpretation?: {
    enabled: boolean;
    style?: "formal" | "casual" | "detailed";
    includeTrace?: boolean;
  };
}

// 阶段配置
export interface StageConfig {
  name: PipelineStage;
  enabled: boolean;
  timeout?: number;
  retries?: number;
  onError?: "skip" | "fail" | "continue";
}

// 流水线结果
export interface PipelineResult {
  success: boolean;
  context: PipelineContext;
  output: PredictionOutput;
  errors: string[];
  warnings: string[];
}

// 最终推演输出
export interface PredictionOutput {
  summary: string;
  probability: {
    success: number;
    failure: number;
    confidence: number;
  };
  fortune: {
    level: FortuneLevel;
    score: number;
    description: string;
  };
  timing: {
    favorable: string[];
    unfavorable: string[];
    optimal?: string;
  };
  signals: SignalOutput[];
  appliedRules: RuleOutput[];
  knowledgeReferences: KnowledgeReferenceOutput[];
  calculationTrace: TraceStep[];
  actionableSuggestions: string[];
}

// 信号输出
export interface SignalOutput {
  id: string;
  description: string;
  polarity: "positive" | "negative" | "neutral" | "unstable";
  strength: "high" | "medium" | "low";
  source: string;
  sourceRule?: string;
}

// 规则输出
export interface RuleOutput {
  id: string;
  name: string;
  category: string;
  priority: string;
  source: string;
  confidence: number;
  matched: boolean;
  effects: string[];
}

// 知识引用输出
export interface KnowledgeReferenceOutput {
  title: string;
  author?: string;
  chapter?: string;
  page?: number;
  quote?: string;
}

// 轨迹步骤
export interface TraceStep {
  stage: PipelineStage;
  timestamp: Date;
  action: string;
  result: string;
  duration: number;
}

// 冲突项
export interface ConflictItem {
  ruleA: string;
  ruleB: string;
  conflictType:
    | "Signal"
    | "Probability"
    | "Fortune"
    | "MutualExclusion"
    | "Dependency"
    | "Override";
  severity: number;
}

// 冲突解决结果
export interface ConflictResolutionResult {
  resolvedEffects: any[];
  appliedStrategy:
    | "Priority"
    | "SourceWeight"
    | "Confidence"
    | "Consensus"
    | "UserOverride";
  trace: string[];
  conflicts: ConflictItem[];
}
