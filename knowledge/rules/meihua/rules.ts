import { createRule } from '@tianwen/rule-engine-core';

// 梅花易数规则库

// 体用比和规则
export const tiyongBiheRule = createRule()
  .name('体用比和')
  .description('体卦与用卦五行相同，诸事顺遂，吉利')
  .category('meihua')
  .priority('high')
  .source({
    id: 'meihua-classic',
    name: '梅花易数',
    type: 'classic',
    classic: '梅花易数',
    chapter: '体用篇'
  })
  .simpleCondition('tiyong.relation', 'equals', 'bihe')
  .probabilityEffect('add', 0.25, '比和主吉')
  .fortuneEffect('add', 20, '体用比和')
  .signalEffect('meihua_tiyong_bihe', 'add', '体用比和信号')
  .build();

// 用生体规则
export const yongshengTiRule = createRule()
  .name('用生体')
  .description('用卦五行生体卦五行，有助力，得外人相助')
  .category('meihua')
  .priority('high')
  .source({
    id: 'meihua-classic',
    name: '梅花易数',
    type: 'classic',
    classic: '梅花易数',
    chapter: '体用篇'
  })
  .simpleCondition('tiyong.relation', 'equals', 'yongshengti')
  .probabilityEffect('add', 0.2, '用生体主吉')
  .fortuneEffect('add', 15, '用生体')
  .signalEffect('meihua_yongsheng_ti', 'add', '用生体信号')
  .build();

// 体生用规则
export const tishengYongRule = createRule()
  .name('体生用')
  .description('体卦五行生用卦五行，主耗损，需谨慎行事')
  .category('meihua')
  .priority('medium')
  .source({
    id: 'meihua-classic',
    name: '梅花易数',
    type: 'classic',
    classic: '梅花易数',
    chapter: '体用篇'
  })
  .simpleCondition('tiyong.relation', 'equals', 'tishengyong')
  .probabilityEffect('subtract', 0.15, '体生用主耗损')
  .fortuneEffect('subtract', 10, '体生用')
  .signalEffect('meihua_tisheng_yong', 'add', '体生用信号')
  .build();

// 体克用规则
export const tikeYongRule = createRule()
  .name('体克用')
  .description('体卦五行克用卦五行，主能成功，但需付出努力')
  .category('meihua')
  .priority('medium')
  .source({
    id: 'meihua-classic',
    name: '梅花易数',
    type: 'classic',
    classic: '梅花易数',
    chapter: '体用篇'
  })
  .simpleCondition('tiyong.relation', 'equals', 'tikeyong')
  .probabilityEffect('add', 0.15, '体克用主可成功')
  .fortuneEffect('add', 10, '体克用')
  .signalEffect('meihua_tike_yong', 'add', '体克用信号')
  .build();

// 用克体规则
export const yongkeTiRule = createRule()
  .name('用克体')
  .description('用卦五行克体卦五行，主不利，需谨慎，防凶险')
  .category('meihua')
  .priority('critical')
  .source({
    id: 'meihua-classic',
    name: '梅花易数',
    type: 'classic',
    classic: '梅花易数',
    chapter: '体用篇'
  })
  .simpleCondition('tiyong.relation', 'equals', 'yongketi')
  .probabilityEffect('subtract', 0.3, '用克体主凶')
  .fortuneEffect('subtract', 25, '用克体')
  .signalEffect('meihua_yongke_ti', 'add', '用克体信号')
  .build();

// 动爻规则
export const dongyaoRule = createRule()
  .name('动爻分析')
  .description('动爻主变化，动爻多则变化复杂')
  .category('meihua')
  .priority('medium')
  .source({
    id: 'meihua-classic',
    name: '梅花易数',
    type: 'classic',
    classic: '梅花易数',
    chapter: '动爻篇'
  })
  .simpleCondition('dongyaoCount', 'greaterThan', 2)
  .probabilityEffect('subtract', 0.1, '动爻多主变化复杂')
  .confidenceEffect('subtract', 0.1, '变化多端，难以精准判断')
  .build();

// 变卦规则
export const bianguaRule = createRule()
  .name('变卦分析')
  .description('变卦主结果，结合本卦综合判断')
  .category('meihua')
  .priority('medium')
  .source({
    id: 'meihua-classic',
    name: '梅花易数',
    type: 'classic',
    classic: '梅花易数',
    chapter: '变卦篇'
  })
  .simpleCondition('hasBiangua', 'isTrue')
  .signalEffect('meihua_has_biangua', 'add', '有变卦')
  .build();

export const meihuaRules = [
  tiyongBiheRule,
  yongshengTiRule,
  tishengYongRule,
  tikeYongRule,
  yongkeTiRule,
  dongyaoRule,
  bianguaRule
];

export default meihuaRules;
