import {
  Rule,
  RuleMetadata,
  RuleCondition,
  RuleEffect,
  RuleSource,
  RulePriority,
  RuleCategory,
  ConditionOperator,
  RuleStatus,
} from "./types";
import { DEFAULT_RULE_ENGINE_CONFIG } from "./constants";

// 规则构建器
export class RuleBuilder {
  private rule: Partial<Rule> = {};

  constructor() {
    this.reset();
  }

  reset(): RuleBuilder {
    this.rule = {
      effects: [],
      weight: 1.0,
      confidence: DEFAULT_RULE_ENGINE_CONFIG.defaultConfidence,
    };
    return this;
  }

  // 设置元数据
  metadata(metadata: Partial<RuleMetadata>): RuleBuilder {
    this.rule.metadata = {
      ...(this.rule.metadata || {
        id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: "",
        description: "",
        category: "universal",
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
        priority: "medium",
        source: {
          id: "custom",
          name: "Custom",
          type: "custom",
        },
      }),
      ...metadata,
    };
    return this;
  }

  // 设置来源
  source(source: RuleSource): RuleBuilder {
    if (!this.rule.metadata) this.metadata({});
    if (this.rule.metadata) {
      this.rule.metadata.source = source;
    }
    return this;
  }

  // 设置规则名
  name(name: string): RuleBuilder {
    if (!this.rule.metadata) this.metadata({});
    if (this.rule.metadata) {
      this.rule.metadata.name = name;
    }
    return this;
  }

  // 设置描述
  description(description: string): RuleBuilder {
    if (!this.rule.metadata) this.metadata({});
    if (this.rule.metadata) {
      this.rule.metadata.description = description;
    }
    return this;
  }

  // 设置类别
  category(category: RuleCategory): RuleBuilder {
    if (!this.rule.metadata) this.metadata({});
    if (this.rule.metadata) {
      this.rule.metadata.category = category;
    }
    return this;
  }

  // 设置优先级
  priority(priority: RulePriority): RuleBuilder {
    if (!this.rule.metadata) this.metadata({});
    if (this.rule.metadata) {
      this.rule.metadata.priority = priority;
    }
    return this;
  }

  // 设置状态
  status(status: RuleStatus): RuleBuilder {
    if (!this.rule.metadata) this.metadata({});
    if (this.rule.metadata) {
      this.rule.metadata.status = status;
    }
    return this;
  }

  // 设置条件
  conditions(condition: RuleCondition): RuleBuilder {
    this.rule.conditions = condition;
    return this;
  }

  // 添加简单条件
  simpleCondition(
    field: string,
    operator: ConditionOperator,
    value: any,
    description?: string,
  ): RuleBuilder {
    const condition: RuleCondition = {
      id: `cond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "simple",
      field,
      operator,
      value,
      description,
    };
    if (!this.rule.conditions) {
      this.rule.conditions = condition;
    } else {
      // 如果已有条件，则合并为 AND
      this.andCondition(condition);
    }
    return this;
  }

  // 添加 AND 条件
  andCondition(...conditions: RuleCondition[]): RuleBuilder {
    if (!this.rule.conditions) {
      if (conditions.length === 1) {
        this.rule.conditions = conditions[0];
      } else {
        this.rule.conditions = {
          id: `and_${Date.now()}`,
          type: "and",
          conditions,
        };
      }
    } else {
      this.rule.conditions = {
        id: `and_${Date.now()}`,
        type: "and",
        conditions: [this.rule.conditions, ...conditions],
      };
    }
    return this;
  }

  // 添加 OR 条件
  orCondition(...conditions: RuleCondition[]): RuleBuilder {
    if (!this.rule.conditions) {
      if (conditions.length === 1) {
        this.rule.conditions = conditions[0];
      } else {
        this.rule.conditions = {
          id: `or_${Date.now()}`,
          type: "or",
          conditions,
        };
      }
    } else {
      this.rule.conditions = {
        id: `or_${Date.now()}`,
        type: "or",
        conditions: [this.rule.conditions, ...conditions],
      };
    }
    return this;
  }

  // 添加效果
  effect(effect: RuleEffect): RuleBuilder {
    if (!this.rule.effects) this.rule.effects = [];
    this.rule.effects.push(effect);
    return this;
  }

  // 添加信号效果
  signalEffect(
    signalId: string,
    action: "add" | "set",
    description?: string,
  ): RuleBuilder {
    return this.effect({
      id: `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "signal",
      action,
      target: "signals",
      value: signalId,
      signalId,
      description,
    });
  }

  // 添加概率效果
  probabilityEffect(
    action: "add" | "subtract" | "multiply" | "divide" | "set",
    value: number,
    description?: string,
  ): RuleBuilder {
    return this.effect({
      id: `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "probability",
      action,
      target: "probability",
      value,
      description,
    });
  }

  // 添加吉凶效果
  fortuneEffect(
    action: "add" | "subtract" | "multiply" | "divide" | "set",
    value: number,
    description?: string,
  ): RuleBuilder {
    return this.effect({
      id: `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "fortune",
      action,
      target: "fortune",
      value,
      description,
    });
  }

  // 添加置信度效果
  confidenceEffect(
    action: "add" | "subtract" | "multiply" | "divide" | "set",
    value: number,
    description?: string,
  ): RuleBuilder {
    return this.effect({
      id: `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "confidence",
      action,
      target: "confidence",
      value,
      description,
    });
  }

  // 设置权重
  weight(weight: number): RuleBuilder {
    this.rule.weight = weight;
    return this;
  }

  // 设置置信度
  confidence(confidence: number): RuleBuilder {
    this.rule.confidence = confidence;
    return this;
  }

  // 设置互斥规则
  mutuallyExclusive(...ruleIds: string[]): RuleBuilder {
    this.rule.mutuallyExclusive = ruleIds;
    return this;
  }

  // 设置依赖规则
  dependsOn(...ruleIds: string[]): RuleBuilder {
    this.rule.dependsOn = ruleIds;
    return this;
  }

  // 设置覆盖规则
  overrides(...ruleIds: string[]): RuleBuilder {
    this.rule.overrides = ruleIds;
    return this;
  }

  // 构建规则
  build(): Rule {
    if (!this.rule.metadata) {
      this.metadata({});
    }
    if (!this.rule.conditions) {
      throw new Error("Rule must have conditions");
    }
    if (!this.rule.effects || this.rule.effects.length === 0) {
      throw new Error("Rule must have at least one effect");
    }
    return this.rule as Rule;
  }
}

// 辅助函数创建规则构建器
export function createRule(): RuleBuilder {
  return new RuleBuilder();
}
