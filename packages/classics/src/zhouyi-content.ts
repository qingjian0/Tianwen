/**
 * 周易古籍内容
 */

import { ClassicContent, SchoolOfInterpretation } from './types';

export const ZHOUYI_INTERPRETATION_SCHOOLS: SchoolOfInterpretation[] = [
  {
    id: 'classical',
    name: '古典派',
    category: 'classical',
    description: '传统周易解读，以孔子《易传》为基础'
  },
  {
    id: 'image-number',
    name: '象数派',
    category: 'image-number',
    description: '侧重象数和卦爻象解读'
  },
  {
    id: 'philosophical',
    name: '义理派',
    category: 'philosophical',
    description: '侧重哲学和道德义理的阐释'
  },
  {
    id: 'jingfang',
    name: '京房派',
    category: 'jingfang',
    description: '京房纳甲体系解读'
  }
];

export const QIAN_GUA_VERSES = [
  {
    id: 'qian-line-1',
    number: 1,
    original: '初九：潜龙，勿用。',
    vernacular: '龙潜于深渊，不宜有所行动。',
    commentary: '阳气潜藏，静待时机。',
    lineAnnotations: [
      {
        lineNumber: 1,
        original: '《象》曰：潜龙勿用，阳在下也。',
        vernacular: '象辞说：潜龙勿用，因为阳气在下位。',
        commentary: '阳气初升，力量尚弱，故需潜藏。',
        interpretations: {
          'classical': '初爻居下，阳气未盛，故曰潜龙。',
          'image-number': '初九属阳居下，龙德而隐。',
          'philosophical': '君子藏器于身，待时而动。'
        }
      }
    ]
  },
  {
    id: 'qian-line-2',
    number: 2,
    original: '九二：见龙在田，利见大人。',
    vernacular: '龙出现在田野，利于见到大人（君子）。',
    commentary: '阳气升腾，德泽广施。',
    lineAnnotations: [
      {
        lineNumber: 2,
        original: '《象》曰：见龙在田，德施普也。',
        vernacular: '象辞说：龙出现在田野，是德泽普施的象征。',
        commentary: '阳气上升，君子之德开始显现。',
        interpretations: {
          'classical': '居中得正，德业日新。',
          'image-number': '二处中位，利见有德之人。',
          'philosophical': '学而时习，德被四方。'
        }
      }
    ]
  }
];

export const ZHOUYI_CONTENT: ClassicContent = {
  metadata: {
    id: 'zhouyi',
    name: '周易',
    author: '文王 (传)',
    dynasty: '西周',
    category: 'zhouyi',
    tags: ['群经之首', '经典'],
    description: '中国最古老的占卜和哲学经典'
  },
  versions: {
    'original': {
      title: '周易原文',
      chapters: [
        {
          id: 'qian',
          title: '乾卦第一',
          verses: QIAN_GUA_VERSES
        }
      ]
    },
    'vernacular': {
      title: '周易白话版',
      chapters: []
    }
  },
  rules: ['qian-rule-1', 'qian-rule-2']
};
