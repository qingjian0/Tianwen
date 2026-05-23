import {
  Rule,
  RuleMatchResult,
  RuleExecutionResult,
  RuleContext,
  RuleEngineConfig,
} from "./types";
import {
  DEFAULT_RULE_ENGINE_CONFIG,
  RULE_PRIORITY_WEIGHTS,
  CLASSIC_SOURCE_WEIGHTS,
  SCHOOL_WEIGHTS,
  DEFAULT_SOURCE_WEIGHTS,
} from "./constants";

// 冲突类型
export type ConflictType =
  | "signal_conflict" // 信号冲突（正 vs 负）
  | "probability_conflict" // 概率调整方向冲突
  | "fortune_conflict" // 吉凶调整方向冲突
  | "mutually_exclusive" // 互斥规则
  | "dependency_issue" // 依赖规则不满足
  | "override_relation"; // 覆盖关系

// 冲突详情
export interface Conflict {
  type: ConflictType;
  rules: string[];
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

// 冲突解决策略
export type ResolutionStrategy =
  | "priority_based" // 基于优先级
  | "source_weight_based" // 基于来源权重
  | "confidence_based" // 基于置信度
  | "consensus_based" // 基于共识
  | "user_override" // 用户自定义覆盖
  | "cancel_all"; // 取消所有冲突规则

// 冲突解决结果
export interface ConflictResolutionResult {
  originalMatches: RuleMatchResult[];
  resolvedMatches: RuleMatchResult[];
  conflicts: Conflict[];
  resolvedConflicts: Conflict[];
  skippedRuleIds: string[];
  appliedStrategy: ResolutionStrategy;
  resolutionDetails: string[];
}

// 规则依赖图
export interface DependencyGraph {
  nodes: Map<string, Rule>;
  edges: Map<string, string[]>; // ruleId -> dependencies[]
  reverseEdges: Map<string, string[]>; // ruleId -> dependents[]
}

/**
 * 规则冲突解决器
 */
export class RuleConflictResolver {
  private config: RuleEngineConfig;

  constructor(config: Partial<RuleEngineConfig> = {}) {
    this.config = { ...DEFAULT_RULE_ENGINE_CONFIG, ...config };
  }

  /**
   * 检测规则冲突
   */
  detectConflicts(matches: RuleMatchResult[]): Conflict[] {
    const conflicts: Conflict[] = [];
    const matchedRules = matches.filter((m) => m.matched);

    if (matchedRules.length < 2) return conflicts;

    // 1. 检测信号冲突
    this.detectSignalConflicts(matchedRules, conflicts);

    // 2. 检测概率冲突
    this.detectProbabilityConflicts(matchedRules, conflicts);

    // 3. 检测吉凶冲突
    this.detectFortuneConflicts(matchedRules, conflicts);

    // 4. 检测互斥规则
    this.detectMutuallyExclusiveConflicts(matchedRules, conflicts);

    // 5. 检测依赖问题
    this.detectDependencyConflicts(matchedRules, conflicts);

    return conflicts;
  }

  /**
   * 检测信号冲突
   */
  private detectSignalConflicts(
    matches: RuleMatchResult[],
    conflicts: Conflict[],
  ): void {
    const positiveSignals = new Set<string>();
    const negativeSignals = new Set<string>();
    const ruleSignals = new Map<
      string,
      { type: "positive" | "negative"; rule: Rule }
    >();

    for (const match of matches) {
      for (const effect of match.rule.effects) {
        if (effect.type === "signal") {
          const isPositive = this.isSignalPositive(effect);
          if (isPositive) {
            positiveSignals.add(effect.signalId || effect.value.toString());
            ruleSignals.set(match.rule.metadata.id, {
              type: "positive",
              rule: match.rule,
            });
          } else {
            negativeSignals.add(effect.signalId || effect.value.toString());
            ruleSignals.set(match.rule.metadata.id, {
              type: "negative",
              rule: match.rule,
            });
          }
        }
      }
    }

    const positiveRuleIds = Array.from(ruleSignals.entries())
      .filter(([_, { type }]) => type === "positive")
      .map(([id]) => id);
    const negativeRuleIds = Array.from(ruleSignals.entries())
      .filter(([_, { type }]) => type === "negative")
      .map(([id]) => id);

    if (positiveRuleIds.length > 0 && negativeRuleIds.length > 0) {
      conflicts.push({
        type: "signal_conflict",
        rules: [...positiveRuleIds, ...negativeRuleIds],
        description: "部分规则产生积极信号，部分规则产生消极信号",
        severity: "medium",
      });
    }
  }

  /**
   * 检测概率冲突
   */
  private detectProbabilityConflicts(
    matches: RuleMatchResult[],
    conflicts: Conflict[],
  ): void {
    const increasingRules = matches.filter((match) =>
      match.rule.effects.some(
        (e) =>
          e.type === "probability" &&
          (e.action === "add" || e.action === "multiply") &&
          typeof e.value === "number" &&
          e.value > 0,
      ),
    );

    const decreasingRules = matches.filter((match) =>
      match.rule.effects.some(
        (e) =>
          e.type === "probability" &&
          (e.action === "subtract" ||
            e.action === "divide" ||
            (e.action === "multiply" &&
              typeof e.value === "number" &&
              e.value < 1)),
      ),
    );

    if (increasingRules.length > 0 && decreasingRules.length > 0) {
      conflicts.push({
        type: "probability_conflict",
        rules: [
          ...increasingRules.map((r) => r.rule.metadata.id),
          ...decreasingRules.map((r) => r.rule.metadata.id),
        ],
        description: "部分规则增加概率，部分规则降低概率",
        severity: "medium",
      });
    }
  }

  /**
   * 检测吉凶冲突
   */
  private detectFortuneConflicts(
    matches: RuleMatchResult[],
    conflicts: Conflict[],
  ): void {
    const increasingRules = matches.filter((match) =>
      match.rule.effects.some(
        (e) =>
          e.type === "fortune" &&
          (e.action === "add" || e.action === "multiply") &&
          typeof e.value === "number" &&
          e.value > 0,
      ),
    );

    const decreasingRules = matches.filter((match) =>
      match.rule.effects.some(
        (e) =>
          e.type === "fortune" &&
          (e.action === "subtract" ||
            (e.action === "multiply" &&
              typeof e.value === "number" &&
              e.value < 1)),
      ),
    );

    if (increasingRules.length > 0 && decreasingRules.length > 0) {
      conflicts.push({
        type: "fortune_conflict",
        rules: [
          ...increasingRules.map((r) => r.rule.metadata.id),
          ...decreasingRules.map((r) => r.rule.metadata.id),
        ],
        description: "部分规则增加吉凶分，部分规则降低吉凶分",
        severity: "medium",
      });
    }
  }

  /**
   * 检测互斥规则
   */
  private detectMutuallyExclusiveConflicts(
    matches: RuleMatchResult[],
    conflicts: Conflict[],
  ): void {
    const matchedRuleIds = new Set(matches.map((m) => m.rule.metadata.id));

    for (const match of matches) {
      const rule = match.rule;
      if (rule.mutuallyExclusive && rule.mutuallyExclusive.length > 0) {
        const conflictingIds = rule.mutuallyExclusive.filter((id) =>
          matchedRuleIds.has(id),
        );
        if (conflictingIds.length > 0) {
          conflicts.push({
            type: "mutually_exclusive",
            rules: [rule.metadata.id, ...conflictingIds],
            description: `规则 ${rule.metadata.name} 与规则 ${conflictingIds.join(", ")} 互斥`,
            severity: "high",
          });
        }
      }
    }
  }

  /**
   * 检测依赖问题
   */
  private detectDependencyConflicts(
    matches: RuleMatchResult[],
    conflicts: Conflict[],
  ): void {
    const matchedRuleIds = new Set(matches.map((m) => m.rule.metadata.id));

    for (const match of matches) {
      const rule = match.rule;
      if (rule.dependsOn && rule.dependsOn.length > 0) {
        const missingDeps = rule.dependsOn.filter(
          (id) => !matchedRuleIds.has(id),
        );
        if (missingDeps.length > 0) {
          conflicts.push({
            type: "dependency_issue",
            rules: [rule.metadata.id],
            description: `规则 ${rule.metadata.name} 缺少依赖规则: ${missingDeps.join(", ")}`,
            severity: "low",
          });
        }
      }
    }
  }

  /**
   * 解决规则冲突
   */
  resolveConflicts(
    matches: RuleMatchResult[],
    strategy: ResolutionStrategy = "priority_based",
  ): ConflictResolutionResult {
    const conflicts = this.detectConflicts(matches);
    const resolvedConflicts: Conflict[] = [];
    const skippedRuleIds: string[] = [];
    const resolutionDetails: string[] = [];

    let resolvedMatches = [...matches];

    for (const conflict of conflicts) {
      const resolution = this.resolveSingleConflict(
        conflict,
        resolvedMatches,
        strategy,
      );
      if (resolution) {
        resolvedConflicts.push(conflict);
        skippedRuleIds.push(...resolution.skippedRuleIds);
        resolvedMatches = resolution.remainingMatches;
        resolutionDetails.push(resolution.details);
      }
    }

    return {
      originalMatches: matches,
      resolvedMatches,
      conflicts,
      resolvedConflicts,
      skippedRuleIds,
      appliedStrategy: strategy,
      resolutionDetails,
    };
  }

  /**
   * 解决单个冲突
   */
  private resolveSingleConflict(
    conflict: Conflict,
    matches: RuleMatchResult[],
    strategy: ResolutionStrategy,
  ): {
    skippedRuleIds: string[];
    remainingMatches: RuleMatchResult[];
    details: string;
  } | null {
    const conflictRuleIds = new Set(conflict.rules);
    const conflictMatches = matches.filter((m) =>
      conflictRuleIds.has(m.rule.metadata.id),
    );

    if (conflictMatches.length === 0) return null;

    let skippedRuleIds: string[] = [];
    let remainingMatches = [...matches];
    let details = "";

    switch (strategy) {
      case "priority_based":
        ({ skippedRuleIds, remainingMatches, details } = this.resolveByPriority(
          conflictMatches,
          matches,
        ));
        break;
      case "source_weight_based":
        ({ skippedRuleIds, remainingMatches, details } =
          this.resolveBySourceWeight(conflictMatches, matches));
        break;
      case "confidence_based":
        ({ skippedRuleIds, remainingMatches, details } =
          this.resolveByConfidence(conflictMatches, matches));
        break;
      case "consensus_based":
        ({ skippedRuleIds, remainingMatches, details } =
          this.resolveByConsensus(conflictMatches, matches));
        break;
      case "cancel_all":
        skippedRuleIds = conflictMatches.map((m) => m.rule.metadata.id);
        remainingMatches = matches.filter(
          (m) => !conflictRuleIds.has(m.rule.metadata.id),
        );
        details = "取消了所有冲突规则";
        break;
      default:
        return null;
    }

    return { skippedRuleIds, remainingMatches, details };
  }

  /**
   * 基于优先级解决冲突
   */
  private resolveByPriority(
    conflictMatches: RuleMatchResult[],
    allMatches: RuleMatchResult[],
  ): {
    skippedRuleIds: string[];
    remainingMatches: RuleMatchResult[];
    details: string;
  } {
    const sorted = [...conflictMatches].sort((a, b) => {
      const aWeight = RULE_PRIORITY_WEIGHTS[a.rule.metadata.priority];
      const bWeight = RULE_PRIORITY_WEIGHTS[b.rule.metadata.priority];
      return bWeight - aWeight;
    });

    const winner = sorted[0];
    const skippedRuleIds = sorted.slice(1).map((m) => m.rule.metadata.id);
    const remainingMatches = allMatches.filter(
      (m) => !skippedRuleIds.includes(m.rule.metadata.id),
    );

    return {
      skippedRuleIds,
      remainingMatches,
      details: `保留优先级最高的规则: ${winner.rule.metadata.name} (${winner.rule.metadata.priority})，跳过: ${skippedRuleIds.join(", ")}`,
    };
  }

  /**
   * 基于来源权重解决冲突
   */
  private resolveBySourceWeight(
    conflictMatches: RuleMatchResult[],
    allMatches: RuleMatchResult[],
  ): {
    skippedRuleIds: string[];
    remainingMatches: RuleMatchResult[];
    details: string;
  } {
    const sorted = [...conflictMatches].sort((a, b) => {
      const aWeight = this.getSourceWeight(a.rule);
      const bWeight = this.getSourceWeight(b.rule);
      return bWeight - aWeight;
    });

    const winner = sorted[0];
    const skippedRuleIds = sorted.slice(1).map((m) => m.rule.metadata.id);
    const remainingMatches = allMatches.filter(
      (m) => !skippedRuleIds.includes(m.rule.metadata.id),
    );

    return {
      skippedRuleIds,
      remainingMatches,
      details: `保留来源权重最高的规则: ${winner.rule.metadata.name} (来源: ${winner.rule.metadata.source.name})，跳过: ${skippedRuleIds.join(", ")}`,
    };
  }

  /**
   * 基于置信度解决冲突
   */
  private resolveByConfidence(
    conflictMatches: RuleMatchResult[],
    allMatches: RuleMatchResult[],
  ): {
    skippedRuleIds: string[];
    remainingMatches: RuleMatchResult[];
    details: string;
  } {
    const sorted = [...conflictMatches].sort((a, b) => {
      const aConfidence = a.rule.confidence || this.config.defaultConfidence;
      const bConfidence = b.rule.confidence || this.config.defaultConfidence;
      return bConfidence - aConfidence;
    });

    const winner = sorted[0];
    const skippedRuleIds = sorted.slice(1).map((m) => m.rule.metadata.id);
    const remainingMatches = allMatches.filter(
      (m) => !skippedRuleIds.includes(m.rule.metadata.id),
    );

    return {
      skippedRuleIds,
      remainingMatches,
      details: `保留置信度最高的规则: ${winner.rule.metadata.name} (${Math.round((winner.rule.confidence || 0.8) * 100)}%)，跳过: ${skippedRuleIds.join(", ")}`,
    };
  }

  /**
   * 基于共识解决冲突
   */
  private resolveByConsensus(
    conflictMatches: RuleMatchResult[],
    allMatches: RuleMatchResult[],
  ): {
    skippedRuleIds: string[];
    remainingMatches: RuleMatchResult[];
    details: string;
  } {
    const ruleIds = conflictMatches.map((m) => m.rule.metadata.id);
    const skippedRuleIds: string[] = [];

    for (const match of conflictMatches) {
      if (match.rule.overrides && match.rule.overrides.length > 0) {
        const overriddenIds = match.rule.overrides.filter((id) =>
          ruleIds.includes(id),
        );
        skippedRuleIds.push(...overriddenIds);
      }
    }

    const uniqueSkippedIds = Array.from(new Set(skippedRuleIds));
    const remainingMatches = allMatches.filter(
      (m) => !uniqueSkippedIds.includes(m.rule.metadata.id),
    );

    return {
      skippedRuleIds: uniqueSkippedIds,
      remainingMatches,
      details: `根据覆盖关系处理，跳过规则: ${uniqueSkippedIds.join(", ") || "无"}`,
    };
  }

  /**
   * 获取来源权重
   */
  private getSourceWeight(rule: Rule): number {
    const source = rule.metadata.source;
    let weight = rule.weight || 1.0;

    // 来源类型权重
    weight *= DEFAULT_SOURCE_WEIGHTS[source.type] || 1.0;

    // 古籍权重
    if (source.classic && CLASSIC_SOURCE_WEIGHTS[source.classic]) {
      weight *= CLASSIC_SOURCE_WEIGHTS[source.classic];
    }

    // 流派权重
    if (source.school && SCHOOL_WEIGHTS[source.school]) {
      weight *= SCHOOL_WEIGHTS[source.school];
    }

    // 自定义权重
    if (source.weight) {
      weight *= source.weight;
    }

    return weight;
  }

  /**
   * 检查信号是否为积极
   */
  private isSignalPositive(effect: {
    signalId?: string;
    value: number | string;
  }): boolean {
    const signalId = effect.signalId || effect.value.toString();
    const lowerId = signalId.toLowerCase();

    const positiveKeywords = [
      "good",
      "great",
      "best",
      "fortune",
      "lucky",
      "success",
      "win",
      "positive",
      "better",
    ];
    const negativeKeywords = [
      "bad",
      "danger",
      "worst",
      "risk",
      "warning",
      "fail",
      "lose",
      "negative",
      "worse",
    ];

    for (const keyword of positiveKeywords) {
      if (lowerId.includes(keyword)) return true;
    }
    for (const keyword of negativeKeywords) {
      if (lowerId.includes(keyword)) return false;
    }

    return true; // 默认积极
  }

  /**
   * 构建依赖图
   */
  buildDependencyGraph(rules: Rule[]): DependencyGraph {
    const nodes = new Map<string, Rule>();
    const edges = new Map<string, string[]>();
    const reverseEdges = new Map<string, string[]>();

    for (const rule of rules) {
      nodes.set(rule.metadata.id, rule);

      if (rule.dependsOn) {
        edges.set(rule.metadata.id, rule.dependsOn);
        for (const dep of rule.dependsOn) {
          const dependents = reverseEdges.get(dep) || [];
          dependents.push(rule.metadata.id);
          reverseEdges.set(dep, dependents);
        }
      }

      if (rule.overrides) {
        for (const over of rule.overrides) {
          const dependents = reverseEdges.get(over) || [];
          dependents.push(rule.metadata.id);
          reverseEdges.set(over, dependents);
        }
      }
    }

    return { nodes, edges, reverseEdges };
  }
}
