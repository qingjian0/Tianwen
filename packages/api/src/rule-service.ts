/**
 * 规则服务 - 规则查询与管理
 */

import { allRules, rulesByCategory, getRuleCount } from '@/knowledge/rules';
import { Rule, RuleCondition, RuleEffect } from '@tianwen/rule-engine-core';
import {
  ApiResponse,
  RuleResponse,
  RuleInfo,
  RuleQuery
} from './types';

export class RuleService {
  private rules: Rule[];
  private rulesMap: Map<string, Rule>;

  constructor() {
    this.rules = allRules;
    this.rulesMap = new Map();
    
    for (const rule of this.rules) {
      this.rulesMap.set(rule.metadata.id, rule);
    }
  }

  async getRules(query: RuleQuery): Promise<ApiResponse<RuleResponse>> {
    let filtered = [...this.rules];

    if (query.category) {
      filtered = filtered.filter(r => r.metadata.category === query.category);
    }

    if (query.priority) {
      filtered = filtered.filter(r => r.metadata.priority === query.priority);
    }

    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      filtered = filtered.filter(r => 
        r.metadata.name.toLowerCase().includes(keyword) ||
        r.metadata.description.toLowerCase().includes(keyword)
      );
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    const ruleInfos = items.map(rule => this.convertToRuleInfo(rule));

    return {
      success: true,
      data: {
        items: ruleInfos,
        total: filtered.length
      },
      timestamp: new Date().toISOString(),
      requestId: `rule_${Date.now()}`
    };
  }

  async getRuleById(id: string): Promise<ApiResponse<RuleInfo>> {
    const rule = this.rulesMap.get(id);

    if (!rule) {
      return {
        success: false,
        error: 'Rule not found',
        timestamp: new Date().toISOString(),
        requestId: id
      };
    }

    return {
      success: true,
      data: this.convertToRuleInfo(rule),
      timestamp: new Date().toISOString(),
      requestId: id
    };
  }

  async getCategories(): Promise<ApiResponse<{ categories: string[]; counts: Record<string, number> }>> {
    const counts = getRuleCount();
    const categories = Object.keys(rulesByCategory);

    return {
      success: true,
      data: {
        categories,
        counts: {
          meihua: counts.meihua,
          liuyao: counts.liuyao,
          universal: counts.universal,
          bazi: counts.bazi,
          qimen: counts.qimen,
          ziwei: counts.ziwei
        }
      },
      timestamp: new Date().toISOString(),
      requestId: `cat_${Date.now()}`
    };
  }

  async getRulesByCategory(category: string): Promise<ApiResponse<RuleInfo[]>> {
    const rules = rulesByCategory[category];

    if (!rules) {
      return {
        success: false,
        error: 'Category not found',
        timestamp: new Date().toISOString(),
        requestId: `cat_${category}`
      };
    }

    const ruleInfos = rules.map(rule => this.convertToRuleInfo(rule));

    return {
      success: true,
      data: ruleInfos,
      timestamp: new Date().toISOString(),
      requestId: `cat_${category}`
    };
  }

  private convertToRuleInfo(rule: Rule): RuleInfo {
    return {
      id: rule.metadata.id,
      name: rule.metadata.name,
      description: rule.metadata.description,
      category: rule.metadata.category,
      priority: rule.metadata.priority,
      source: {
        name: rule.metadata.source.name,
        chapter: rule.metadata.source.chapter,
        page: rule.metadata.source.page
      },
      conditions: rule.conditions.map(c => this.convertCondition(c)),
      effects: rule.effects.map(e => this.convertEffect(e)),
      confidence: rule.confidence || 0.8
    };
  }

  private convertCondition(condition: RuleCondition): any {
    if ('type' in condition && condition.type === 'simple') {
      return {
        field: condition.field,
        operator: condition.operator,
        value: condition.value
      };
    }
    return { type: 'complex', description: '组合条件' };
  }

  private convertEffect(effect: RuleEffect): any {
    return {
      type: effect.type,
      action: effect.action || 'set',
      value: effect.value
    };
  }
}
