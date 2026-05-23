import { RulePriority, RuleEngineConfig } from "./types";

// 默认规则引擎配置
export const DEFAULT_RULE_ENGINE_CONFIG: RuleEngineConfig = {
  maxRulesToExecute: 100,
  stopOnFirstMatch: false,
  defaultConfidence: 0.8,
  defaultPriorityWeight: {
    critical: 1.5,
    high: 1.3,
    medium: 1.0,
    low: 0.7,
    informational: 0.5,
  },
  enableConflictResolution: true,
  enableRuleLogging: true,
  strictMode: false,
};

// 规则优先级权重
export const RULE_PRIORITY_WEIGHTS: Record<RulePriority, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  informational: 1,
};

// 来源权重预设 - 经典古籍
export const CLASSIC_SOURCE_WEIGHTS: Record<string, number> = {
  卜筮正宗: 1.5,
  增删卜易: 1.4,
  渊海子平: 1.4,
  滴天髓: 1.5,
  神峰通考: 1.3,
  三命通会: 1.4,
  梅花易数: 1.4,
  奇门遁甲统宗: 1.4,
  紫微斗数全书: 1.3,
};

// 流派权重预设
export const SCHOOL_WEIGHTS: Record<string, number> = {
  京房: 1.4,
  子平: 1.5,
  邵雍: 1.4,
  壬遁: 1.3,
  紫微: 1.3,
  河洛: 1.2,
  天星: 1.2,
};

// 默认来源权重
export const DEFAULT_SOURCE_WEIGHTS = {
  classic: 1.5,
  school: 1.3,
  modern: 1.1,
  custom: 1.0,
};

// 五行生克操作符
export const WUXING_OPERATIONS = {
  sheng: {
    木: "火",
    火: "土",
    土: "金",
    金: "水",
    水: "木",
  },
  ke: {
    木: "土",
    土: "水",
    水: "火",
    火: "金",
    金: "木",
  },
};

// 地支六合
export const DIZHI_HE = {
  子: "丑",
  丑: "子",
  寅: "亥",
  亥: "寅",
  卯: "戌",
  戌: "卯",
  辰: "酉",
  酉: "辰",
  巳: "申",
  申: "巳",
  午: "未",
  未: "午",
};

// 地支六冲
export const DIZHI_CHONG = {
  子: "午",
  午: "子",
  丑: "未",
  未: "丑",
  寅: "申",
  申: "寅",
  卯: "酉",
  酉: "卯",
  辰: "戌",
  戌: "辰",
  巳: "亥",
  亥: "巳",
};

// 地支相刑
export const DIZHI_XING = {
  子: "卯",
  卯: "子",
  寅: ["巳", "申"],
  巳: ["寅", "申"],
  申: ["寅", "巳"],
  丑: ["戌", "未"],
  戌: ["丑", "未"],
  未: ["丑", "戌"],
  辰: "辰",
  午: "午",
  酉: "酉",
  亥: "亥",
};
