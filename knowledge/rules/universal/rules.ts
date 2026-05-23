import { createRule } from "@tianwen/rule-engine-core";

// 通用规则库

// 吉凶评分映射规则
export const fortuneLevelRule = createRule()
  .name("吉凶等级映射")
  .description("根据吉凶分数映射到相应等级")
  .category("universal")
  .priority("medium")
  .source({
    id: "universal",
    name: "通用规则",
    type: "custom",
  })
  .simpleCondition("fortuneScore", "greaterThan", 80)
  .signalEffect("fortune_great", "add", "大吉")
  .build();

export const universalRules = [fortuneLevelRule];

export default universalRules;
