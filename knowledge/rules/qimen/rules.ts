/**
 * 奇门遁甲规则库
 * 基于《奇门遁甲秘笈大全》、《奇门遁甲详解》等经典
 */

import { createRule } from '@tianwen/rule-engine-core';

/**
 * 格局规则
 */
export const qiMenDunjiaRule = createRule()
  .name('奇门遁甲')
  .description('奇门遁甲起局')
  .category('qimen')
  .priority('high')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '总纲',
    page: 1
  })
  .simpleCondition('system', 'equals', 'qimen')
  .signalEffect('system.qimen', 1, 'positive')
  .build();

export const zhenFuRule = createRule()
  .name('值符得地')
  .description('值符得地，百事吉昌')
  .category('qimen')
  .priority('critical')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '值符章',
    page: 25
  })
  .simpleCondition('zhenFuStrength', 'equals', 'strong')
  .signalEffect('zhenfu.strong', 1, 'positive')
  .fortuneEffect('add', 20)
  .probabilityEffect('add', 0.15)
  .build();

export const zhenShiRule = createRule()
  .name('值使得地')
  .description('值使得地，行动顺遂')
  .category('qimen')
  .priority('critical')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '值使章',
    page: 38
  })
  .simpleCondition('zhenShiStrength', 'equals', 'strong')
  .signalEffect('zhenshi.strong', 1, 'positive')
  .fortuneEffect('add', 18)
  .probabilityEffect('add', 0.13)
  .build();

export const tianGanHeRule = createRule()
  .name('天干五合')
  .description('天干五合，贵人相助')
  .category('qimen')
  .priority('high')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲详解',
    chapter: '论合',
    page: 67
  })
  .simpleCondition('tianGanHe', 'equals', true)
  .signalEffect('relation.tianGan.he', 1, 'positive')
  .fortuneEffect('add', 12)
  .probabilityEffect('add', 0.09)
  .build();

export const diZhiChongRule = createRule()
  .name('地支相冲')
  .description('地支相冲，事多阻碍')
  .category('qimen')
  .priority('high')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '论冲',
    page: 89
  })
  .simpleCondition('diZhiChong', 'equals', true)
  .signalEffect('relation.diZhi.chong', 1, 'negative')
  .fortuneEffect('subtract', 15)
  .probabilityEffect('subtract', 0.1)
  .build();

/**
 * 九星规则
 */
export const tianPengStarRule = createRule()
  .name('天蓬星')
  .description('天蓬星为大凶之星')
  .category('qimen')
  .priority('medium')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '九星章',
    page: 105
  })
  .simpleCondition('currentStar', 'equals', 'tianpeng')
  .signalEffect('star.tianpeng', 1, 'negative')
  .fortuneEffect('subtract', 10)
  .probabilityEffect('subtract', 0.07)
  .build();

export const tianRongStarRule = createRule()
  .name('天任星')
  .description('天任星为吉庆之星')
  .category('qimen')
  .priority('medium')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '九星章',
    page: 108
  })
  .simpleCondition('currentStar', 'equals', 'tianren')
  .signalEffect('star.tianren', 1, 'positive')
  .fortuneEffect('add', 10)
  .probabilityEffect('add', 0.07)
  .build();

export const tianChongStarRule = createRule()
  .name('天冲星')
  .description('天冲星为动扰之星')
  .category('qimen')
  .priority('medium')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '九星章',
    page: 112
  })
  .simpleCondition('currentStar', 'equals', 'tianchong')
  .signalEffect('star.tianchong', 1, 'neutral')
  .build();

export const tianFuStarRule = createRule()
  .name('天辅星')
  .description('天辅星为文星')
  .category('qimen')
  .priority('medium')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '九星章',
    page: 115
  })
  .simpleCondition('currentStar', 'equals', 'tianfu')
  .signalEffect('star.tianfu', 1, 'positive')
  .fortuneEffect('add', 8)
  .probabilityEffect('add', 0.05)
  .build();

export const tianYinStarRule = createRule()
  .name('天英星')
  .description('天英星为火暴之星')
  .category('qimen')
  .priority('medium')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '九星章',
    page: 118
  })
  .simpleCondition('currentStar', 'equals', 'tianying')
  .signalEffect('star.tianying', 1, 'negative')
  .fortuneEffect('subtract', 8)
  .probabilityEffect('subtract', 0.05)
  .build();

/**
 * 八门规则
 */
export const shengMenRule = createRule()
  .name('生门')
  .description('生门为吉门，宜求财')
  .category('qimen')
  .priority('high')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '八门章',
    page: 135
  })
  .simpleCondition('currentGate', 'equals', 'sheng')
  .signalEffect('gate.sheng', 1, 'positive')
  .fortuneEffect('add', 15)
  .probabilityEffect('add', 0.1)
  .build();

export const kuMenRule = createRule()
  .name('休门')
  .description('休门为吉门，宜休息')
  .category('qimen')
  .priority('medium')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '八门章',
    page: 140
  })
  .simpleCondition('currentGate', 'equals', 'xiu')
  .signalEffect('gate.xiu', 1, 'positive')
  .fortuneEffect('add', 10)
  .probabilityEffect('add', 0.07)
  .build();

export const shengMenRule2 = createRule()
  .name('伤门')
  .description('伤门为凶门，主伤灾')
  .category('qimen')
  .priority('high')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '八门章',
    page: 145
  })
  .simpleCondition('currentGate', 'equals', 'shang')
  .signalEffect('gate.shang', 1, 'negative')
  .fortuneEffect('subtract', 15)
  .probabilityEffect('subtract', 0.1)
  .build();

export const duMenRule = createRule()
  .name('杜门')
  .description('杜门为平门，主阻隔')
  .category('qimen')
  .priority('medium')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '八门章',
    page: 150
  })
  .simpleCondition('currentGate', 'equals', 'du')
  .signalEffect('gate.du', 1, 'negative')
  .fortuneEffect('subtract', 8)
  .probabilityEffect('subtract', 0.05)
  .build();

export const jingMenRule = createRule()
  .name('景门')
  .description('景门为平门，主文书')
  .category('qimen')
  .priority('medium')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '八门章',
    page: 155
  })
  .simpleCondition('currentGate', 'equals', 'jing')
  .signalEffect('gate.jing', 1, 'neutral')
  .build();

export const siMenRule = createRule()
  .name('死门')
  .description('死门为凶门，主死亡')
  .category('qimen')
  .priority('high')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '八门章',
    page: 160
  })
  .simpleCondition('currentGate', 'equals', 'si')
  .signalEffect('gate.si', 1, 'negative')
  .fortuneEffect('subtract', 20)
  .probabilityEffect('subtract', 0.12)
  .build();

export const kuMenRule2 = createRule()
  .name('惊门')
  .description('惊门为凶门，主惊恐')
  .category('qimen')
  .priority('medium')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '八门章',
    page: 165
  })
  .simpleCondition('currentGate', 'equals', 'jing')
  .signalEffect('gate.jing2', 1, 'negative')
  .fortuneEffect('subtract', 10)
  .probabilityEffect('subtract', 0.06)
  .build();

export const kaiMenRule = createRule()
  .name('开门')
  .description('开门为吉门，宜开启')
  .category('qimen')
  .priority('high')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲秘笈大全',
    chapter: '八门章',
    page: 170
  })
  .simpleCondition('currentGate', 'equals', 'kai')
  .signalEffect('gate.kai', 1, 'positive')
  .fortuneEffect('add', 18)
  .probabilityEffect('add', 0.12)
  .build();

/**
 * 奇仪规则
 */
export const bingQiRule = createRule()
  .name('丙奇得地')
  .description('丙奇得地，百事可为')
  .category('qimen')
  .priority('high')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲详解',
    chapter: '三奇章',
    page: 195
  })
  .simpleCondition('qiStrength.bing', 'equals', 'strong')
  .signalEffect('qi.bing.strong', 1, 'positive')
  .fortuneEffect('add', 12)
  .probabilityEffect('add', 0.08)
  .build();

export const dingQiRule = createRule()
  .name('丁奇得地')
  .description('丁奇得地，万事如意')
  .category('qimen')
  .priority('high')
  .source({
    id: 'qimen',
    name: '奇门遁甲',
    type: 'classic',
    classic: '奇门遁甲详解',
    chapter: '三奇章',
    page: 200
  })
  .simpleCondition('qiStrength.ding', 'equals', 'strong')
  .signalEffect('qi.ding.strong', 1, 'positive')
  .fortuneEffect('add', 12)
  .probabilityEffect('add', 0.08)
  .build();

/**
 * 奇门规则列表
 */
export const qimenRules = [
  qiMenDunjiaRule,
  zhenFuRule,
  zhenShiRule,
  tianGanHeRule,
  diZhiChongRule,
  tianPengStarRule,
  tianRongStarRule,
  tianChongStarRule,
  tianFuStarRule,
  tianYinStarRule,
  shengMenRule,
  kuMenRule,
  shengMenRule2,
  duMenRule,
  jingMenRule,
  siMenRule,
  kuMenRule2,
  kaiMenRule,
  bingQiRule,
  dingQiRule
];

export default qimenRules;
