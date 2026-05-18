/**
 * 预设 Prompt 模板
 */

import { PromptTemplate } from './types';

export const INVESTMENT_TEMPLATE: PromptTemplate = {
  id: 'investment',
  name: '投资决策',
  category: 'financial',
  description: '用于投资决策的推演模板',
  defaultSystems: ['奇门遁甲', '六爻'],
  defaultFocus: ['财运', '时机', '风险'],
  defaultStyle: 'conservative',
};

export const RELATIONSHIP_TEMPLATE: PromptTemplate = {
  id: 'relationship',
  name: '感情关系',
  category: 'life',
  description: '感情关系分析',
  defaultSystems: ['八字', '紫微斗数', '梅花易数'],
  defaultFocus: ['姻缘', '感情', '缘分'],
  defaultStyle: 'balanced',
};

export const CAREER_TEMPLATE: PromptTemplate = {
  id: 'career',
  name: '事业发展',
  category: 'life',
  description: '事业发展',
  defaultSystems: ['奇门遁甲', '八字'],
  defaultFocus: ['事业', '贵人', '机遇'],
  defaultStyle: 'balanced',
};

export const HEALTH_TEMPLATE: PromptTemplate = {
  id: 'health',
  name: '健康状况',
  category: 'health',
  description: '健康状况',
  defaultSystems: ['六爻', '梅花易数'],
  defaultFocus: ['健康', '平安'],
  defaultStyle: 'conservative',
};

export const DECISION_TEMPLATE: PromptTemplate = {
  id: 'decision',
  name: '重大决策',
  category: 'general',
  description: '重大决策',
  defaultSystems: ['奇门遁甲', '梅花易数', '六爻'],
  defaultFocus: ['利弊', '时机', '结果'],
  defaultStyle: 'balanced',
};

export const TIMING_TEMPLATE: PromptTemplate = {
  id: 'timing',
  name: '择时',
  category: 'general',
  description: '择时',
  defaultSystems: ['奇门遁甲', '六爻'],
  defaultFocus: ['时间', '窗口', '吉凶'],
  defaultStyle: 'conservative',
};

export const PRESETS = [
  INVESTMENT_TEMPLATE,
  RELATIONSHIP_TEMPLATE,
  CAREER_TEMPLATE,
  HEALTH_TEMPLATE,
  DECISION_TEMPLATE,
  TIMING_TEMPLATE,
];
