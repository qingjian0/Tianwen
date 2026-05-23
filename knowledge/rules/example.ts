import { RuleEngine, RuleContext, createRule } from "@tianwen/rule-engine-core";
import allRules from "./index";

// 使用示例：规则引擎的完整应用

// 1. 创建规则引擎
const engine = new RuleEngine();

// 2. 加载规则
engine.addRules(allRules);

// 3. 创建推理上下文
const context: RuleContext = {
  data: {
    tiyong: {
      relation: "bihe", // 体用比和
      ti: { wuxing: "jin" },
      yong: { wuxing: "jin" },
    },
    dongyaoCount: 1,
    hasBiangua: true,
    fortuneScore: 85,
  },
  timestamp: new Date(),
};

// 4. 执行规则
const matchResults = engine.matchRules(context);
console.log("=== 匹配的规则 ===");
matchResults
  .filter((r) => r.matched)
  .forEach((r) => {
    console.log(
      `- ${r.rule.metadata.name}: 匹配度 ${Math.round(r.matchScore * 100)}%`,
    );
  });

// 5. 获取执行结果
const executionResult = engine.executeAndGetResult(context);
console.log("\n=== 执行结果 ===");
console.log("概率:", executionResult.probability);
console.log("吉凶:", executionResult.fortune);
console.log("信号:", executionResult.signals);
console.log("置信度:", executionResult.confidence);

// 6. 也可以单独创建规则
const customRule = createRule()
  .name("自定义规则")
  .description("示例规则")
  .category("custom")
  .priority("medium")
  .source({
    id: "custom",
    name: "自定义",
    type: "custom",
  })
  .simpleCondition("someField", "equals", "someValue")
  .probabilityEffect("add", 0.1)
  .build();

console.log("\n=== 规则定义示例 ===");
console.log("自定义规则:", customRule);

export default {
  engine,
  context,
  matchResults,
  executionResult,
};
