import { Rule, RuleExecutionResult, RuleMatchResult, RuleContext, RuleSource } from '@tianwen/rule-engine-core';
import { Signal } from '@tianwen/signal-system';
import { ProbabilityScore } from '@tianwen/probability-engine';
import { FortuneLevel } from '@tianwen/fortune-engine';

// 规则引用
export interface RuleReference {
  ruleId: string;
  ruleName: string;
  source: RuleSource;
  category: string;
  priority: string;
  matchedConditions: string[];
  appliedEffects: string[];
}

// 信号引用
export interface SignalReference {
  signal: Signal;
  sourceRuleId?: string;
  sourceRuleName?: string;
}

// 知识引用
export interface KnowledgeReference {
  type: 'classic' | 'modern' | 'commentary';
  title: string;
  author?: string;
  chapter?: string;
  page?: number;
  quote?: string;
  url?: string;
}

// 规则解释结果
export interface RuleBasedInterpretation {
  summary: string;
  detailedAnalysis: string;
  keySignals: SignalReference[];
  appliedRules: RuleReference[];
  skippedRules: RuleReference[];
  knowledgeReferences: KnowledgeReference[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
  };
  opportunityAssessment: {
    level: 'low' | 'medium' | 'high' | 'excellent';
    factors: string[];
  };
  timingAdvice: string[];
  actionableSuggestions: string[];
  overallConfidence: number;
  calculationTrail: string[];
}

/**
 * 基于规则的解释生成器
 */
export class RuleBasedInterpreter {
  private maxRulesToShow = 10;
  private maxSignalsToShow = 15;

  constructor(options?: { maxRulesToShow?: number; maxSignalsToShow?: number }) {
    if (options?.maxRulesToShow) this.maxRulesToShow = options.maxRulesToShow;
    if (options?.maxSignalsToShow) this.maxSignalsToShow = options.maxSignalsToShow;
  }

  /**
   * 生成规则解释
   */
  generateInterpretation(
    ruleExecutionResults: RuleExecutionResult[],
    signals: Signal[],
    probabilityScore: ProbabilityScore,
    fortuneLevel: FortuneLevel,
    context?: RuleContext
  ): RuleBasedInterpretation {
    const appliedRules = ruleExecutionResults.filter(r => r.executed && r.matched && r.appliedEffects.length > 0);
    const skippedRules = ruleExecutionResults.filter(r => !r.executed || !r.matched || r.skippedEffects.length > 0);

    const ruleReferences = this.buildRuleReferences(appliedRules).slice(0, this.maxRulesToShow);
    const skippedRuleReferences = this.buildRuleReferences(skippedRules).slice(0, this.maxRulesToShow);
    const signalReferences = this.buildSignalReferences(signals, appliedRules).slice(0, this.maxSignalsToShow);
    const knowledgeReferences = this.extractKnowledgeReferences(appliedRules);
    const overallConfidence = this.calculateOverallConfidence(appliedRules, probabilityScore);

    const { summary, detailedAnalysis } = this.generateAnalysisText(
      ruleReferences,
      signalReferences,
      probabilityScore,
      fortuneLevel
    );

    const riskAssessment = this.assessRisks(signalReferences, probabilityScore);
    const opportunityAssessment = this.assessOpportunities(signalReferences, probabilityScore);
    const timingAdvice = this.generateTimingAdvice(signals, context);
    const actionableSuggestions = this.generateActionableSuggestions(
      signalReferences,
      ruleReferences,
      fortuneLevel
    );
    const calculationTrail = this.buildCalculationTrail(
      ruleExecutionResults,
      probabilityScore,
      fortuneLevel
    );

    return {
      summary,
      detailedAnalysis,
      keySignals: signalReferences,
      appliedRules: ruleReferences,
      skippedRules: skippedRuleReferences,
      knowledgeReferences,
      riskAssessment,
      opportunityAssessment,
      timingAdvice,
      actionableSuggestions,
      overallConfidence,
      calculationTrail
    };
  }

  /**
   * 构建规则引用
   */
  private buildRuleReferences(results: RuleExecutionResult[]): RuleReference[] {
    return results.map(result => ({
      ruleId: result.rule.metadata.id,
      ruleName: result.rule.metadata.name,
      source: result.rule.metadata.source,
      category: result.rule.metadata.category,
      priority: result.rule.metadata.priority,
      matchedConditions: result.appliedEffects.map(e => e.description || e.id),
      appliedEffects: result.appliedEffects.map(e => `${e.type}: ${e.action} ${e.value}`)
    }));
  }

  /**
   * 构建信号引用
   */
  private buildSignalReferences(signals: Signal[], rules: RuleExecutionResult[]): SignalReference[] {
    const ruleSignals = new Map<string, { name: string; id: string }>();

    for (const rule of rules) {
      for (const effect of rule.appliedEffects) {
        if (effect.type === 'signal' && effect.signalId) {
          ruleSignals.set(effect.signalId, {
            id: rule.rule.metadata.id,
            name: rule.rule.metadata.name
          });
        }
      }
    }

    return signals.map(signal => {
      const ruleInfo = ruleSignals.get(signal.id);
      return {
        signal,
        sourceRuleId: ruleInfo?.id,
        sourceRuleName: ruleInfo?.name
      };
    });
  }

  /**
   * 提取知识引用
   */
  private extractKnowledgeReferences(rules: RuleExecutionResult[]): KnowledgeReference[] {
    const references: KnowledgeReference[] = [];
    const seenTitles = new Set<string>();

    for (const result of rules) {
      const source = result.rule.metadata.source;
      const referencesMeta = result.rule.metadata.references || [];

      for (const ref of referencesMeta) {
        const key = `${ref.title}-${ref.chapter || ''}-${ref.page || ''}`;
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          references.push({
            type: ref.type,
            title: ref.title,
            author: ref.author,
            chapter: ref.chapter,
            page: ref.page,
            quote: ref.text,
            url: ref.url
          });
        }
      }

      if (source.classic) {
        const key = `${source.classic}-${source.chapter || ''}`;
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          references.push({
            type: source.type as any,
            title: source.classic,
            author: source.author,
            chapter: source.chapter,
            page: source.page
          });
        }
      }
    }

    return references;
  }

  /**
   * 计算总体置信度
   */
  private calculateOverallConfidence(
    rules: RuleExecutionResult[],
    probabilityScore: ProbabilityScore
  ): number {
    if (rules.length === 0) return probabilityScore.confidence;

    const ruleConfidence = rules.reduce((sum, rule) => {
      return sum + (rule.rule.confidence || 0.8);
    }, 0) / rules.length;

    return (ruleConfidence * 0.6 + probabilityScore.confidence * 0.4);
  }

  /**
   * 生成分析文本
   */
  private generateAnalysisText(
    ruleReferences: RuleReference[],
    signalReferences: SignalReference[],
    probabilityScore: ProbabilityScore,
    fortuneLevel: FortuneLevel
  ): { summary: string; detailedAnalysis: string } {
    const positiveSignals = signalReferences.filter(s => s.signal.polarity === 'positive').length;
    const negativeSignals = signalReferences.filter(s => s.signal.polarity === 'negative').length;
    const successProbability = Math.round(probabilityScore.successProbability * 100);

    const summary = `根据 ${ruleReferences.length} 条规则分析，本卦 ${fortuneLevel === 'greatFortune' ? '大吉' : fortuneLevel === 'fortune' ? '吉' : fortuneLevel === 'neutral' ? '平' : fortuneLevel === 'warning' ? '凶' : '大凶'}，成功概率约 ${successProbability}%。共获得 ${positiveSignals} 个积极信号，${negativeSignals} 个消极信号。`;

    const detailedAnalysis = this.buildDetailedAnalysis(
      ruleReferences,
      signalReferences,
      probabilityScore,
      fortuneLevel
    );

    return { summary, detailedAnalysis };
  }

  /**
   * 构建详细分析
   */
  private buildDetailedAnalysis(
    ruleReferences: RuleReference[],
    signalReferences: SignalReference[],
    probabilityScore: ProbabilityScore,
    fortuneLevel: FortuneLevel
  ): string {
    const paragraphs: string[] = [];

    if (ruleReferences.length > 0) {
      const ruleNames = ruleReferences.map(r => r.ruleName).join('、');
      paragraphs.push(`本次推演应用了以下核心规则：${ruleNames}。`);
    }

    const positiveSignals = signalReferences.filter(s => s.signal.polarity === 'positive');
    if (positiveSignals.length > 0) {
      const signalDescriptions = positiveSignals
        .map(s => s.signal.description)
        .filter(Boolean)
        .join('；');
      if (signalDescriptions) {
        paragraphs.push(`积极信号显示：${signalDescriptions}。`);
      }
    }

    const negativeSignals = signalReferences.filter(s => s.signal.polarity === 'negative');
    if (negativeSignals.length > 0) {
      const signalDescriptions = negativeSignals
        .map(s => s.signal.description)
        .filter(Boolean)
        .join('；');
      if (signalDescriptions) {
        paragraphs.push(`需要注意的是：${signalDescriptions}。`);
      }
    }

    if (probabilityScore.volatility > 0.5) {
      paragraphs.push(`局势存在较大变数，不确定性为 ${Math.round((1 - probabilityScore.confidence) * 100)}%。`);
    }

    return paragraphs.join('\n\n');
  }

  /**
   * 评估风险
   */
  private assessRisks(
    signalReferences: SignalReference[],
    probabilityScore: ProbabilityScore
  ): RuleBasedInterpretation['riskAssessment'] {
    const negativeSignals = signalReferences.filter(s => s.signal.polarity === 'negative');
    const factors: string[] = [];

    for (const sigRef of negativeSignals) {
      if (sigRef.signal.description) {
        factors.push(sigRef.signal.description);
      }
    }

    const riskLevel = probabilityScore.volatility > 0.7
      ? 'critical'
      : (negativeSignals.length > 3 || probabilityScore.failureProbability > 0.6)
        ? 'high'
        : negativeSignals.length > 0
          ? 'medium'
          : 'low';

    return {
      level: riskLevel,
      factors
    };
  }

  /**
   * 评估机遇
   */
  private assessOpportunities(
    signalReferences: SignalReference[],
    probabilityScore: ProbabilityScore
  ): RuleBasedInterpretation['opportunityAssessment'] {
    const positiveSignals = signalReferences.filter(s => s.signal.polarity === 'positive');
    const factors: string[] = [];

    for (const sigRef of positiveSignals) {
      if (sigRef.signal.description) {
        factors.push(sigRef.signal.description);
      }
    }

    const opportunityLevel = probabilityScore.successProbability > 0.8
      ? 'excellent'
      : probabilityScore.successProbability > 0.6
        ? 'high'
        : positiveSignals.length > 0
          ? 'medium'
          : 'low';

    return {
      level: opportunityLevel,
      factors
    };
  }

  /**
   * 生成时间建议
   */
  private generateTimingAdvice(signals: Signal[], context?: RuleContext): string[] {
    const advice: string[] = [];

    const timingSignals = signals.filter(s => s.timing);
    if (timingSignals.length > 0) {
      for (const signal of timingSignals) {
        if (signal.timing) {
          advice.push(signal.timing);
        }
      }
    } else {
      advice.push('应根据本月月令日辰，选择合适时机行动');
      advice.push('动则有变，静则守常');
    }

    return advice;
  }

  /**
   * 生成可操作建议
   */
  private generateActionableSuggestions(
    signalReferences: SignalReference[],
    ruleReferences: RuleReference[],
    fortuneLevel: FortuneLevel
  ): string[] {
    const suggestions: string[] = [];

    if (fortuneLevel === 'greatFortune' || fortuneLevel === 'fortune') {
      suggestions.push('宜积极进取，把握机遇');
      suggestions.push('宜进行重要决策');
    } else if (fortuneLevel === 'warning' || fortuneLevel === 'danger') {
      suggestions.push('宜守不宜攻，谨慎行事');
      suggestions.push('宜待时观望，不可冒进');
    } else {
      suggestions.push('宜稳中求进，平衡发展');
    }

    const negativeSignals = signalReferences.filter(s => s.signal.polarity === 'negative');
    if (negativeSignals.length > 0) {
      suggestions.push('建议提前防范风险，制定备选方案');
    }

    const positiveSignals = signalReferences.filter(s => s.signal.polarity === 'positive');
    if (positiveSignals.length > 0) {
      suggestions.push('建议扩大有利因素，强化优势');
    }

    return suggestions;
  }

  /**
   * 构建计算轨迹
   */
  private buildCalculationTrail(
    ruleExecutionResults: RuleExecutionResult[],
    probabilityScore: ProbabilityScore,
    fortuneLevel: FortuneLevel
  ): string[] {
    const trail: string[] = [];

    trail.push(`开始推演 - 载入 ${ruleExecutionResults.length} 条规则`);

    const appliedRules = ruleExecutionResults.filter(r => r.executed && r.matched);
    trail.push(`匹配成功 ${appliedRules.length} 条规则`);

    for (const result of appliedRules.slice(0, 8)) {
      trail.push(`→ 规则 "${result.rule.metadata.name}" (${result.rule.metadata.priority}): 应用 ${result.appliedEffects.length} 个效果`);
    }

    trail.push(`概率计算: 成功 ${Math.round(probabilityScore.successProbability * 100)}%, 失败 ${Math.round(probabilityScore.failureProbability * 100)}%`);
    trail.push(`吉凶判定: ${this.getFortuneDescription(fortuneLevel)}`);

    return trail;
  }

  private getFortuneDescription(level: FortuneLevel): string {
    const descriptions: Record<FortuneLevel, string> = {
      greatFortune: '大吉',
      fortune: '吉',
      neutral: '平',
      warning: '凶',
      danger: '大凶'
    };
    return descriptions[level] || '平';
  }
}
