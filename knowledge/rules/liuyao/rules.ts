import { createRule } from '@tianwen/rule-engine-core';

// 六爻规则库

// 世爻旺相规则
export const shiyaoWangxiangRule = createRule()
  .name('世爻旺相')
  .description('世爻得月日生扶，主自身条件好，成事有望')
  .category('liuyao')
  .priority('high')
  .source({
    id: 'bushuizheng',
    name: '卜筮正宗',
    type: 'classic',
    classic: '卜筮正宗'
  })
  .simpleCondition('shiyao.wangxiang', 'isTrue')
  .probabilityEffect('add', 0.15, '世爻旺相主吉')
  .fortuneEffect('add', 12, '世爻旺相')
  .signalEffect('liuyao_shiyao_wangxiang', 'add', '世爻旺相信号')
  .build();

// 用神得地规则
export const yongshendediRule = createRule()
  .name('用神得地')
  .description('用神得月日生助或临月日，主成事有望')
  .category('liuyao')
  .priority('high')
  .source({
    id: 'bushuizheng',
    name: '卜筮正宗',
    type: 'classic',
    classic: '卜筮正宗'
  })
  .simpleCondition('yongshen.dedi', 'isTrue')
  .probabilityEffect('add', 0.2, '用神得地主吉')
  .fortuneEffect('add', 15, '用神得地')
  .signalEffect('liuyao_yongshen_dedi', 'add', '用神得地信号')
  .build();

// 用神受克规则
export const yongshenshoukeRule = createRule()
  .name('用神受克')
  .description('用神被月日或动爻克制，主不利')
  .category('liuyao')
  .priority('critical')
  .source({
    id: 'bushuizheng',
    name: '卜筮正宗',
    type: 'classic',
    classic: '卜筮正宗'
  })
  .simpleCondition('yongshen.shouke', 'isTrue')
  .probabilityEffect('subtract', 0.25, '用神受克主凶')
  .fortuneEffect('subtract', 20, '用神受克')
  .signalEffect('liuyao_yongshen_shouke', 'add', '用神受克信号')
  .build();

// 动爻化回头克规则
export const huantoukeRule = createRule()
  .name('动爻化回头克')
  .description('动爻化出变爻回头克制，主先成后败')
  .category('liuyao')
  .priority('high')
  .source({
    id: 'zengshanyibu',
    name: '增删卜易',
    type: 'classic',
    classic: '增删卜易'
  })
  .simpleCondition('dongyao.huantouke', 'isTrue')
  .probabilityEffect('subtract', 0.2, '化回头克主凶')
  .fortuneEffect('subtract', 18, '化回头克')
  .signalEffect('liuyao_huantouke', 'add', '化回头克信号')
  .build();

// 动爻化回头生规则
export const huantoushengRule = createRule()
  .name('动爻化回头生')
  .description('动爻化出变爻回头生助，主有助力')
  .category('liuyao')
  .priority('high')
  .source({
    id: 'zengshanyibu',
    name: '增删卜易',
    type: 'classic',
    classic: '增删卜易'
  })
  .simpleCondition('dongyao.huantousheng', 'isTrue')
  .probabilityEffect('add', 0.18, '化回头生主吉')
  .fortuneEffect('add', 15, '化回头生')
  .signalEffect('liuyao_huantousheng', 'add', '化回头生信号')
  .build();

export const liuyaoRules = [
  shiyaoWangxiangRule,
  yongshendediRule,
  yongshenshoukeRule,
  huantoukeRule,
  huantoushengRule
];

export default liuyaoRules;
