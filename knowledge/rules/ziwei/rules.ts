/**
 * 紫微斗数规则库
 * 基于《紫微斗数全书》、《紫微斗数讲义》等经典
 */

import { createRule } from "@tianwen/rule-engine-core";

/**
 * 命宫规则
 */
export const mingGongRule = createRule()
  .name("命宫")
  .description("紫微斗数命宫")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "命宫章",
    page: 1,
  })
  .simpleCondition("system", "equals", "ziwei")
  .signalEffect("system.ziwei", 1, "positive")
  .build();

export const ziweiStarRule = createRule()
  .name("紫微独坐")
  .description("紫微独坐命宫，主贵")
  .category("ziwei")
  .priority("critical")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "紫微星系",
    page: 25,
  })
  .simpleCondition("mingGongStars.ziwei", "equals", true)
  .signalEffect("star.ziwei.mingGong", 1, "positive")
  .fortuneEffect("add", 25)
  .probabilityEffect("add", 0.18)
  .build();

export const tianDiRule = createRule()
  .name("天府独坐")
  .description("天府独坐命宫，主富")
  .category("ziwei")
  .priority("critical")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "天府星系",
    page: 38,
  })
  .simpleCondition("mingGongStars.tianfu", "equals", true)
  .signalEffect("star.tianfu.mingGong", 1, "positive")
  .fortuneEffect("add", 22)
  .probabilityEffect("add", 0.16)
  .build();

export const sunMoonRule = createRule()
  .name("日月并明")
  .description("太阳太阴同宫，主吉")
  .category("ziwei")
  .priority("critical")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数讲义",
    chapter: "日月章",
    page: 55,
  })
  .simpleCondition("mingGongStars.sunMoon", "equals", true)
  .signalEffect("star.sunMoon.mingGong", 1, "positive")
  .fortuneEffect("add", 20)
  .probabilityEffect("add", 0.15)
  .build();

/**
 * 财帛宫规则
 */
export const caiBoRule = createRule()
  .name("财帛宫")
  .description("财帛宫分析")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "财帛章",
    page: 78,
  })
  .simpleCondition("caiBoStars", "exists", true)
  .signalEffect("palace.caibo", 1, "neutral")
  .build();

export const tianCaiRule = createRule()
  .name("天财得地")
  .description("天财星入财帛宫")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "财帛章",
    page: 82,
  })
  .simpleCondition("caiBoStars.tiancai", "equals", true)
  .signalEffect("star.tiancai.caibo", 1, "positive")
  .fortuneEffect("add", 15)
  .probabilityEffect("add", 0.12)
  .build();

/**
 * 官禄宫规则
 */
export const guanLuRule = createRule()
  .name("官禄宫")
  .description("官禄宫分析")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "官禄章",
    page: 95,
  })
  .simpleCondition("guanLuStars", "exists", true)
  .signalEffect("palace.guanlu", 1, "neutral")
  .build();

export const tianShangRule = createRule()
  .name("天相得地")
  .description("天相星入官禄宫")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "官禄章",
    page: 102,
  })
  .simpleCondition("guanLuStars.tianxiang", "equals", true)
  .signalEffect("star.tianxiang.guanlu", 1, "positive")
  .fortuneEffect("add", 15)
  .probabilityEffect("add", 0.12)
  .build();

/**
 * 迁移宫规则
 */
export const qianYiRule = createRule()
  .name("迁移宫")
  .description("迁移宫分析")
  .category("ziwei")
  .priority("medium")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "迁移章",
    page: 118,
  })
  .simpleCondition("qianYiStars", "exists", true)
  .signalEffect("palace.qianyi", 1, "neutral")
  .build();

export const tianLiangRule = createRule()
  .name("天梁得地")
  .description("天梁星入迁移宫")
  .category("ziwei")
  .priority("medium")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "迁移章",
    page: 125,
  })
  .simpleCondition("qianYiStars.tianliang", "equals", true)
  .signalEffect("star.tianliang.qianyi", 1, "positive")
  .fortuneEffect("add", 10)
  .probabilityEffect("add", 0.07)
  .build();

/**
 * 夫妻宫规则
 */
export const fuQiRule = createRule()
  .name("夫妻宫")
  .description("夫妻宫分析")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "夫妻章",
    page: 140,
  })
  .simpleCondition("fuQiStars", "exists", true)
  .signalEffect("palace.fuqi", 1, "neutral")
  .build();

export const tianJiRule = createRule()
  .name("天机得地")
  .description("天机星入夫妻宫")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "夫妻章",
    page: 148,
  })
  .simpleCondition("fuQiStars.tianji", "equals", true)
  .signalEffect("star.tianji.fuqi", 1, "positive")
  .fortuneEffect("add", 12)
  .probabilityEffect("add", 0.09)
  .build();

/**
 * 子女宫规则
 */
export const ziNvRule = createRule()
  .name("子女宫")
  .description("子女宫分析")
  .category("ziwei")
  .priority("medium")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "子女章",
    page: 165,
  })
  .simpleCondition("ziNvStars", "exists", true)
  .signalEffect("palace.zinv", 1, "neutral")
  .build();

/**
 * 凶星规则
 */
export const huoJiRule = createRule()
  .name("火铃夹命")
  .description("火星铃星夹命宫")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数讲义",
    chapter: "凶星章",
    page: 185,
  })
  .simpleCondition("mingGongStars.fireBell", "equals", true)
  .signalEffect("star.fireBell.mingGong", 1, "negative")
  .fortuneEffect("subtract", 18)
  .probabilityEffect("subtract", 0.12)
  .build();

export const shaTouRule = createRule()
  .name("煞星入命")
  .description("七杀破军贪狼入命宫")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "杀破狼章",
    page: 200,
  })
  .simpleCondition("mingGongStars.shapo", "equals", true)
  .signalEffect("star.shapo.mingGong", 1, "negative")
  .fortuneEffect("subtract", 15)
  .probabilityEffect("subtract", 0.1)
  .build();

/**
 * 四化规则
 */
export const huaKeRule = createRule()
  .name("化科")
  .description("化科入命宫")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "四化章",
    page: 225,
  })
  .simpleCondition("huaKe.mingGong", "equals", true)
  .signalEffect("huake.mingGong", 1, "positive")
  .fortuneEffect("add", 15)
  .probabilityEffect("add", 0.1)
  .build();

export const huaLuRule = createRule()
  .name("化禄")
  .description("化禄入财帛宫")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "四化章",
    page: 232,
  })
  .simpleCondition("huaLu.caiBo", "equals", true)
  .signalEffect("hualu.caibo", 1, "positive")
  .fortuneEffect("add", 18)
  .probabilityEffect("add", 0.13)
  .build();

export const huaQuanRule = createRule()
  .name("化权")
  .description("化权入官禄宫")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "四化章",
    page: 240,
  })
  .simpleCondition("huaQuan.guanLu", "equals", true)
  .signalEffect("huaquan.guanlu", 1, "positive")
  .fortuneEffect("add", 16)
  .probabilityEffect("add", 0.11)
  .build();

export const huaJiRule = createRule()
  .name("化忌")
  .description("化忌入命宫")
  .category("ziwei")
  .priority("high")
  .source({
    id: "ziwei",
    name: "紫微斗数",
    type: "classic",
    classic: "紫微斗数全书",
    chapter: "四化章",
    page: 250,
  })
  .simpleCondition("huaJi.mingGong", "equals", true)
  .signalEffect("huaji.mingGong", 1, "negative")
  .fortuneEffect("subtract", 20)
  .probabilityEffect("subtract", 0.13)
  .build();

/**
 * 紫微斗数规则列表
 */
export const ziweiRules = [
  mingGongRule,
  ziweiStarRule,
  tianDiRule,
  sunMoonRule,
  caiBoRule,
  tianCaiRule,
  guanLuRule,
  tianShangRule,
  qianYiRule,
  tianLiangRule,
  fuQiRule,
  tianJiRule,
  ziNvRule,
  huoJiRule,
  shaTouRule,
  huaKeRule,
  huaLuRule,
  huaQuanRule,
  huaJiRule,
];

export default ziweiRules;
