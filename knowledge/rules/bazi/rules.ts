/**
 * 八字规则库
 * 基于《滴天髓》、《渊海子平》、《三命通会》等经典古籍
 */

import { createRule } from '@tianwen/rule-engine-core';

/**
 * 日主强弱规则
 */
export const dayMasterStrengthRule = createRule()
  .name('日主强弱')
  .description('判断日主的强弱程度')
  .category('bazi')
  .priority('high')
  .source({
    id: 'ditiansui',
    name: '滴天髓',
    type: 'classic',
    classic: '滴天髓',
    chapter: '通神论',
    page: 15
  })
  .simpleCondition('dayMasterStrength', 'equals', 'strong')
  .signalEffect('dayMaster.strong', 1, 'positive')
  .fortuneEffect('add', 10)
  .probabilityEffect('add', 0.1)
  .build();

export const dayMasterWeakRule = createRule()
  .name('日主衰弱')
  .description('日主衰弱需要生扶')
  .category('bazi')
  .priority('high')
  .source({
    id: 'yuanhai',
    name: '渊海子平',
    type: 'classic',
    classic: '渊海子平',
    chapter: '论日主强弱',
    page: 45
  })
  .simpleCondition('dayMasterStrength', 'equals', 'weak')
  .signalEffect('dayMaster.weak', 1, 'negative')
  .fortuneEffect('subtract', 10)
  .probabilityEffect('subtract', 0.1)
  .build();

/**
 * 用神规则
 */
export const usefulGodStrongRule = createRule()
  .name('用神得地')
  .description('用神得地，吉')
  .category('bazi')
  .priority('critical')
  .source({
    id: 'sanninghui',
    name: '三命通会',
    type: 'classic',
    classic: '三命通会',
    chapter: '论用神',
    page: 120
  })
  .simpleCondition('usefulGodStrength', 'equals', 'strong')
  .signalEffect('usefulGod.strong', 1, 'positive')
  .fortuneEffect('add', 20)
  .probabilityEffect('add', 0.15)
  .build();

export const usefulGodWeakRule = createRule()
  .name('用神无力')
  .description('用神无力，凶')
  .category('bazi')
  .priority('critical')
  .source({
    id: 'ditiansui',
    name: '滴天髓',
    type: 'classic',
    classic: '滴天髓',
    chapter: '用神章',
    page: 38
  })
  .simpleCondition('usefulGodStrength', 'equals', 'weak')
  .signalEffect('usefulGod.weak', 1, 'negative')
  .fortuneEffect('subtract', 20)
  .probabilityEffect('subtract', 0.15)
  .build();

export const usefulGodAttackedRule = createRule()
  .name('用神受克')
  .description('用神受克，大凶')
  .category('bazi')
  .priority('critical')
  .source({
    id: 'yuanhai',
    name: '渊海子平',
    type: 'classic',
    classic: '渊海子平',
    chapter: '论克害',
    page: 78
  })
  .simpleCondition('usefulGodAttacked', 'equals', true)
  .signalEffect('usefulGod.attacked', 1, 'negative')
  .fortuneEffect('subtract', 30)
  .probabilityEffect('subtract', 0.2)
  .build();

/**
 * 十神规则
 */
export const wealthStarStrongRule = createRule()
  .name('财星得地')
  .description('财星得地，财运亨通')
  .category('bazi')
  .priority('high')
  .source({
    id: 'sanninghui',
    name: '三命通会',
    type: 'classic',
    classic: '三命通会',
    chapter: '论财星',
    page: 156
  })
  .simpleCondition('wealthStarStrength', 'equals', 'strong')
  .signalEffect('wealth.strong', 1, 'positive')
  .fortuneEffect('add', 15)
  .probabilityEffect('add', 0.12)
  .build();

export const officialStarStrongRule = createRule()
  .name('官星得地')
  .description('官星得地，事业有成')
  .category('bazi')
  .priority('high')
  .source({
    id: 'ditiansui',
    name: '滴天髓',
    type: 'classic',
    classic: '滴天髓',
    chapter: '官杀章',
    page: 52
  })
  .simpleCondition('officialStarStrength', 'equals', 'strong')
  .signalEffect('career.strong', 1, 'positive')
  .fortuneEffect('add', 15)
  .probabilityEffect('add', 0.12)
  .build();

export const foodStarStrongRule = createRule()
  .name('食神吐秀')
  .description('食神吐秀，才华出众')
  .category('bazi')
  .priority('high')
  .source({
    id: 'yuanhai',
    name: '渊海子平',
    type: 'classic',
    classic: '渊海子平',
    chapter: '论食伤',
    page: 98
  })
  .simpleCondition('foodStarStrength', 'equals', 'strong')
  .signalEffect('talent.strong', 1, 'positive')
  .fortuneEffect('add', 12)
  .probabilityEffect('add', 0.1)
  .build();

export const sealStarStrongRule = createRule()
  .name('印星得地')
  .description('印星得地，学业有成')
  .category('bazi')
  .priority('high')
  .source({
    id: 'sanninghui',
    name: '三命通会',
    type: 'classic',
    classic: '三命通会',
    chapter: '论印星',
    page: 134
  })
  .simpleCondition('sealStarStrength', 'equals', 'strong')
  .signalEffect('education.strong', 1, 'positive')
  .fortuneEffect('add', 12)
  .probabilityEffect('add', 0.1)
  .build();

/**
 * 格局规则
 */
export const prosperousWealthRule = createRule()
  .name('财格成局')
  .description('财星成格，富命')
  .category('bazi')
  .priority('critical')
  .source({
    id: 'ditiansui',
    name: '滴天髓',
    type: 'classic',
    classic: '滴天髓',
    chapter: '格局章',
    page: 67
  })
  .simpleCondition('pattern', 'equals', 'wealth')
  .signalEffect('pattern.wealth', 1, 'positive')
  .fortuneEffect('add', 25)
  .probabilityEffect('add', 0.18)
  .build();

export const prosperousOfficialRule = createRule()
  .name('官格成局')
  .description('官星成格，贵命')
  .category('bazi')
  .priority('critical')
  .source({
    id: 'yuanhai',
    name: '渊海子平',
    type: 'classic',
    classic: '渊海子平',
    chapter: '论格局',
    page: 112
  })
  .simpleCondition('pattern', 'equals', 'official')
  .signalEffect('pattern.official', 1, 'positive')
  .fortuneEffect('add', 25)
  .probabilityEffect('add', 0.18)
  .build();

/**
 * 合冲规则
 */
export const yearDayHeRule = createRule()
  .name('年日相合')
  .description('年日相合，祖上有荫')
  .category('bazi')
  .priority('medium')
  .source({
    id: 'sanninghui',
    name: '三命通会',
    type: 'classic',
    classic: '三命通会',
    chapter: '论合',
    page: 189
  })
  .simpleCondition('yearDayHe', 'equals', true)
  .signalEffect('relation.yearDay.he', 1, 'positive')
  .fortuneEffect('add', 8)
  .probabilityEffect('add', 0.06)
  .build();

export const dayHourHeRule = createRule()
  .name('日时相合')
  .description('日时相合，晚运吉祥')
  .category('bazi')
  .priority('medium')
  .source({
    id: 'ditiansui',
    name: '滴天髓',
    type: 'classic',
    classic: '滴天髓',
    chapter: '论合',
    page: 89
  })
  .simpleCondition('dayHourHe', 'equals', true)
  .signalEffect('relation.dayHour.he', 1, 'positive')
  .fortuneEffect('add', 8)
  .probabilityEffect('add', 0.06)
  .build();

export const yearMonthChongRule = createRule()
  .name('年月相冲')
  .description('年月相冲，早年动荡')
  .category('bazi')
  .priority('medium')
  .source({
    id: 'yuanhai',
    name: '渊海子平',
    type: 'classic',
    classic: '渊海子平',
    chapter: '论冲',
    page: 145
  })
  .simpleCondition('yearMonthChong', 'equals', true)
  .signalEffect('relation.yearMonth.chong', 1, 'negative')
  .fortuneEffect('subtract', 8)
  .probabilityEffect('subtract', 0.06)
  .build();

export const dayMonthChongRule = createRule()
  .name('日支相冲')
  .description('日支相冲，婚姻不顺')
  .category('bazi')
  .priority('high')
  .source({
    id: 'sanninghui',
    name: '三命通会',
    type: 'classic',
    classic: '三命通会',
    chapter: '论冲',
    page: 195
  })
  .simpleCondition('dayBranchChong', 'equals', true)
  .signalEffect('relation.dayBranch.chong', 1, 'negative')
  .fortuneEffect('subtract', 12)
  .probabilityEffect('subtract', 0.08)
  .build();

/**
 * 空亡规则
 */
export const dayBranchEmptyRule = createRule()
  .name('日支空亡')
  .description('日支空亡，内心空虚')
  .category('bazi')
  .priority('medium')
  .source({
    id: 'yuanhai',
    name: '渊海子平',
    type: 'classic',
    classic: '渊海子平',
    chapter: '论空亡',
    page: 167
  })
  .simpleCondition('dayBranchEmpty', 'equals', true)
  .signalEffect('empty.dayBranch', 1, 'negative')
  .fortuneEffect('subtract', 8)
  .probabilityEffect('subtract', 0.05)
  .build();

export const usefulGodEmptyRule = createRule()
  .name('用神空亡')
  .description('用神空亡，吉中带凶')
  .category('bazi')
  .priority('high')
  .source({
    id: 'ditiansui',
    name: '滴天髓',
    type: 'classic',
    classic: '滴天髓',
    chapter: '空亡章',
    page: 95
  })
  .simpleCondition('usefulGodEmpty', 'equals', true)
  .signalEffect('empty.usefulGod', 1, 'negative')
  .fortuneEffect('subtract', 15)
  .probabilityEffect('subtract', 0.1)
  .build();

/**
 * 刑害规则
 */
export const dayBranchPunishRule = createRule()
  .name('日支相刑')
  .description('日支相刑，性格矛盾')
  .category('bazi')
  .priority('medium')
  .source({
    id: 'sanninghui',
    name: '三命通会',
    type: 'classic',
    classic: '三命通会',
    chapter: '论刑',
    page: 210
  })
  .simpleCondition('dayBranchPunish', 'equals', true)
  .signalEffect('punish.dayBranch', 1, 'negative')
  .fortuneEffect('subtract', 6)
  .probabilityEffect('subtract', 0.04)
  .build();

/**
 * 八字规则列表
 */
export const baziRules = [
  dayMasterStrengthRule,
  dayMasterWeakRule,
  usefulGodStrongRule,
  usefulGodWeakRule,
  usefulGodAttackedRule,
  wealthStarStrongRule,
  officialStarStrongRule,
  foodStarStrongRule,
  sealStarStrongRule,
  prosperousWealthRule,
  prosperousOfficialRule,
  yearDayHeRule,
  dayHourHeRule,
  yearMonthChongRule,
  dayMonthChongRule,
  dayBranchEmptyRule,
  usefulGodEmptyRule,
  dayBranchPunishRule
];

export default baziRules;
