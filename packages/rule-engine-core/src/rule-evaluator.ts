import {
  Rule,
  RuleCondition,
  RuleContext,
  RuleMatchResult,
  RuleExecutionResult,
  RuleEngineConfig,
  RuleEffect
} from './types';
import {
  DEFAULT_RULE_ENGINE_CONFIG,
  WUXING_OPERATIONS,
  DIZHI_HE,
  DIZHI_CHONG,
  DIZHI_XING
} from './constants';

// 条件评估器
export class ConditionEvaluator {
  private context: RuleContext;

  constructor(context: RuleContext) {
    this.context = context;
  }

  // 评估单个条件
  evaluate(condition: RuleCondition): boolean {
    switch (condition.type) {
      case 'simple':
        return this.evaluateSimpleCondition(condition);
      case 'and':
        return this.evaluateAndCondition(condition);
      case 'or':
        return this.evaluateOrCondition(condition);
      case 'not':
        return this.evaluateNotCondition(condition);
      case 'nested':
        return this.evaluateNestedCondition(condition);
      default:
        throw new Error(`Unknown condition type: ${condition.type}`);
    }
  }

  // 评估简单条件
  private evaluateSimpleCondition(condition: RuleCondition): boolean {
    if (!condition.field || !condition.operator) {
      return true;
    }

    const fieldValue = this.getFieldValue(condition.field);
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'notEquals':
        return fieldValue !== condition.value;
      case 'greaterThan':
        return fieldValue > condition.value;
      case 'lessThan':
        return fieldValue < condition.value;
      case 'greaterOrEqual':
        return fieldValue >= condition.value;
      case 'lessOrEqual':
        return fieldValue <= condition.value;
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'notContains':
        return !String(fieldValue).includes(String(condition.value));
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'notIn':
        return !Array.isArray(condition.value) || !condition.value.includes(fieldValue);
      case 'startsWith':
        return String(fieldValue).startsWith(String(condition.value));
      case 'endsWith':
        return String(fieldValue).endsWith(String(condition.value));
      case 'matches':
        return new RegExp(condition.value).test(String(fieldValue));
      case 'isTrue':
        return fieldValue === true;
      case 'isFalse':
        return fieldValue === false;
      case 'isNull':
        return fieldValue === null || fieldValue === undefined;
      case 'isNotNull':
        return fieldValue !== null && fieldValue !== undefined;
      case 'wuxingSheng':
        return this.evaluateWuxingSheng(fieldValue, condition.value);
      case 'wuxingKe':
        return this.evaluateWuxingKe(fieldValue, condition.value);
      case 'wuxingBihe':
        return fieldValue === condition.value;
      case 'ganzhiHe':
        return this.evaluateGanzhiHe(fieldValue, condition.value);
      case 'ganzhiChong':
        return this.evaluateGanzhiChong(fieldValue, condition.value);
      case 'ganzhiXing':
        return this.evaluateGanzhiXing(fieldValue, condition.value);
      default:
        throw new Error(`Unknown operator: ${condition.operator}`);
    }
  }

  // 评估 AND 条件
  private evaluateAndCondition(condition: RuleCondition): boolean {
    if (!condition.conditions || condition.conditions.length === 0) {
      return true;
    }
    return condition.conditions.every(c => this.evaluate(c));
  }

  // 评估 OR 条件
  private evaluateOrCondition(condition: RuleCondition): boolean {
    if (!condition.conditions || condition.conditions.length === 0) {
      return false;
    }
    return condition.conditions.some(c => this.evaluate(c));
  }

  // 评估 NOT 条件
  private evaluateNotCondition(condition: RuleCondition): boolean {
    if (!condition.conditions || condition.conditions.length === 0) {
      return false;
    }
    return !condition.conditions.some(c => this.evaluate(c));
  }

  // 评估嵌套条件
  private evaluateNestedCondition(condition: RuleCondition): boolean {
    if (!condition.conditions || condition.conditions.length === 0) {
      return true;
    }
    return condition.conditions.every(c => this.evaluate(c));
  }

  // 获取字段值
  private getFieldValue(fieldPath: string): any {
    const parts = fieldPath.split('.');
    let value: any = this.context.data;
    
    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = value[part];
    }
    
    return value;
  }

  // 评估五行生
  private evaluateWuxingSheng(from: string, to: string): boolean {
    return WUXING_OPERATIONS.sheng[from as keyof typeof WUXING_OPERATIONS.sheng] === to;
  }

  // 评估五行克
  private evaluateWuxingKe(from: string, to: string): boolean {
    return WUXING_OPERATIONS.ke[from as keyof typeof WUXING_OPERATIONS.ke] === to;
  }

  // 评估干支合
  private evaluateGanzhiHe(a: string, b: string): boolean {
    return DIZHI_HE[a as keyof typeof DIZHI_HE] === b || DIZHI_HE[b as keyof typeof DIZHI_HE] === a;
  }

  // 评估干支冲
  private evaluateGanzhiChong(a: string, b: string): boolean {
    return DIZHI_CHONG[a as keyof typeof DIZHI_CHONG] === b || DIZHI_CHONG[b as keyof typeof DIZHI_CHONG] === a;
  }

  // 评估干支刑
  private evaluateGanzhiXing(a: string, b: string): boolean {
    const xingValues = DIZHI_XING[a as keyof typeof DIZHI_XING];
    if (Array.isArray(xingValues)) {
      return xingValues.includes(b);
    }
    return xingValues === b;
  }

  // 获取满足的条件
  getMatchingConditions(condition: RuleCondition): RuleCondition[] {
    const matches: RuleCondition[] = [];
    this.collectMatchingConditions(condition, matches);
    return matches;
  }

  private collectMatchingConditions(condition: RuleCondition, matches: RuleCondition[]): void {
    if (this.evaluate(condition)) {
      matches.push(condition);
    }
    
    if (condition.conditions) {
      for (const subCondition of condition.conditions) {
        this.collectMatchingConditions(subCondition, matches);
      }
    }
  }

  // 计算匹配得分
  calculateMatchScore(condition: RuleCondition): number {
    const conditions = this.countConditions(condition);
    const matchingConditions = this.getMatchingConditions(condition).length;
    
    if (conditions === 0) return 1.0;
    return matchingConditions / conditions;
  }

  private countConditions(condition: RuleCondition): number {
    let count = condition.type === 'simple' ? 1 : 0;
    
    if (condition.conditions) {
      count += condition.conditions.reduce((sum, c) => sum + this.countConditions(c), 0);
    }
    
    return count;
  }
}

// 效果应用器
export class EffectApplier {
  private context: RuleContext;
  private result: any;

  constructor(context: RuleContext, initialResult: any = {}) {
    this.context = context;
    this.result = initialResult;
  }

  // 应用单个效果
  applyEffect(effect: RuleEffect): boolean {
    try {
      switch (effect.type) {
        case 'signal':
          return this.applySignalEffect(effect);
        case 'probability':
          return this.applyProbabilityEffect(effect);
        case 'fortune':
          return this.applyFortuneEffect(effect);
        case 'timing':
          return this.applyTimingEffect(effect);
        case 'confidence':
          return this.applyConfidenceEffect(effect);
        case 'priority':
          return this.applyPriorityEffect(effect);
        default:
          throw new Error(`Unknown effect type: ${effect.type}`);
      }
    } catch (error) {
      console.error(`Failed to apply effect ${effect.id}:`, error);
      return false;
    }
  }

  // 应用信号效果
  private applySignalEffect(effect: RuleEffect): boolean {
    if (!this.result.signals) this.result.signals = [];
    
    if (effect.action === 'set') {
      this.result.signals = [effect.signalId || effect.value];
    } else {
      this.result.signals.push(effect.signalId || effect.value);
    }
    
    return true;
  }

  // 应用概率效果
  private applyProbabilityEffect(effect: RuleEffect): boolean {
    if (this.result.probability === undefined) {
      this.result.probability = 0.5;
    }
    
    const value = typeof effect.value === 'number' ? effect.value : parseFloat(String(effect.value));
    
    switch (effect.action) {
      case 'add':
        this.result.probability += value;
        break;
      case 'subtract':
        this.result.probability -= value;
        break;
      case 'multiply':
        this.result.probability *= value;
        break;
      case 'divide':
        if (value !== 0) {
          this.result.probability /= value;
        }
        break;
      case 'set':
        this.result.probability = value;
        break;
    }
    
    // 限制在 0-1 范围内
    this.result.probability = Math.max(0, Math.min(1, this.result.probability));
    
    return true;
  }

  // 应用吉凶效果
  private applyFortuneEffect(effect: RuleEffect): boolean {
    if (this.result.fortune === undefined) {
      this.result.fortune = 0;
    }
    
    const value = typeof effect.value === 'number' ? effect.value : parseFloat(String(effect.value));
    
    switch (effect.action) {
      case 'add':
        this.result.fortune += value;
        break;
      case 'subtract':
        this.result.fortune -= value;
        break;
      case 'multiply':
        this.result.fortune *= value;
        break;
      case 'divide':
        if (value !== 0) {
          this.result.fortune /= value;
        }
        break;
      case 'set':
        this.result.fortune = value;
        break;
    }
    
    return true;
  }

  // 应用时间效果
  private applyTimingEffect(effect: RuleEffect): boolean {
    if (!this.result.timing) this.result.timing = {};
    
    const value = typeof effect.value === 'number' ? effect.value : parseFloat(String(effect.value));
    
    switch (effect.action) {
      case 'set':
        this.result.timing[effect.target] = effect.value;
        break;
      case 'add':
        this.result.timing[effect.target] = (this.result.timing[effect.target] || 0) + value;
        break;
      default:
        this.result.timing[effect.target] = effect.value;
    }
    
    return true;
  }

  // 应用置信度效果
  private applyConfidenceEffect(effect: RuleEffect): boolean {
    if (this.result.confidence === undefined) {
      this.result.confidence = 0.8;
    }
    
    const value = typeof effect.value === 'number' ? effect.value : parseFloat(String(effect.value));
    
    switch (effect.action) {
      case 'add':
        this.result.confidence += value;
        break;
      case 'subtract':
        this.result.confidence -= value;
        break;
      case 'multiply':
        this.result.confidence *= value;
        break;
      case 'set':
        this.result.confidence = value;
        break;
    }
    
    this.result.confidence = Math.max(0, Math.min(1, this.result.confidence));
    
    return true;
  }

  // 应用优先级效果
  private applyPriorityEffect(effect: RuleEffect): boolean {
    if (!this.result.priority) this.result.priority = [];
    this.result.priority.push(effect.value);
    return true;
  }

  // 获取结果
  getResult(): any {
    return { ...this.result };
  }
}

// 规则引擎
export class RuleEngine {
  private rules: Rule[] = [];
  private config: RuleEngineConfig;

  constructor(config: Partial<RuleEngineConfig> = {}) {
    this.config = { ...DEFAULT_RULE_ENGINE_CONFIG, ...config };
  }

  // 添加规则
  addRule(rule: Rule): void {
    this.rules.push(rule);
  }

  // 添加多条规则
  addRules(rules: Rule[]): void {
    this.rules.push(...rules);
  }

  // 清除所有规则
  clearRules(): void {
    this.rules = [];
  }

  // 获取所有规则
  getRules(): Rule[] {
    return [...this.rules];
  }

  // 获取活跃规则
  getActiveRules(): Rule[] {
    return this.rules.filter(rule => rule.metadata.status === 'active');
  }

  // 按类别获取规则
  getRulesByCategory(category: string): Rule[] {
    return this.rules.filter(rule => rule.metadata.category === category);
  }

  // 匹配规则
  matchRules(context: RuleContext): RuleMatchResult[] {
    const start = Date.now();
    const results: RuleMatchResult[] = [];
    const activeRules = this.getActiveRules();
    const evaluator = new ConditionEvaluator(context);

    for (const rule of activeRules) {
      const ruleStart = Date.now();
      const matchedConditions = evaluator.getMatchingConditions(rule.conditions);
      const matched = evaluator.evaluate(rule.conditions);
      const matchScore = evaluator.calculateMatchScore(rule.conditions);
      const totalConditions = evaluator['countConditions'](rule.conditions);

      results.push({
        rule,
        matched,
        matchedConditions,
        conditionsSatisfied: matchedConditions.length,
        totalConditions,
        matchScore,
        executionTimeMs: Date.now() - ruleStart
      });
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  // 执行规则
  executeRules(context: RuleContext): RuleExecutionResult[] {
    const start = Date.now();
    const matchResults = this.matchRules(context);
    const executionResults: RuleExecutionResult[] = [];

    for (const matchResult of matchResults) {
      if (!matchResult.matched) continue;
      
      const ruleStart = Date.now();
      const applier = new EffectApplier(context);
      const appliedEffects: RuleEffect[] = [];
      const skippedEffects: RuleEffect[] = [];
      const errors: string[] = [];
      const warnings: string[] = [];

      for (const effect of matchResult.rule.effects) {
        try {
          if (applier.applyEffect(effect)) {
            appliedEffects.push(effect);
          } else {
            skippedEffects.push(effect);
          }
        } catch (error) {
          errors.push(`Effect ${effect.id} failed: ${error}`);
        }
      }

      executionResults.push({
        rule: matchResult.rule,
        executed: true,
        matched: matchResult.matched,
        appliedEffects,
        skippedEffects,
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
        executionTimeMs: Date.now() - ruleStart
      });
    }

    return executionResults;
  }

  // 执行并获取结果
  executeAndGetResult(context: RuleContext): any {
    const applier = new EffectApplier(context);
    const matchResults = this.matchRules(context);

    for (const matchResult of matchResults) {
      if (!matchResult.matched) continue;

      for (const effect of matchResult.rule.effects) {
        applier.applyEffect(effect);
      }
    }

    return applier.getResult();
  }
}
