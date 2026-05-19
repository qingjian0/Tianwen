/**
 * Rule DSL 完整示例
 */

import { RuleDSL } from '../src/index';

// 示例 1: 简单规则示例
const rule1 = `
rule dayMasterStrong {
    description: "日主强旺，得地得时";
    category: "bazi";
    priority: "high";
    
    if dayMasterStrength == "strong";
    if dayMasterWuxing == "木";
    if wuxingSheng(dayMasterWuxing, monthWuxing);
    
    then fortune = 80;
    then confidence += 0.3;
}
`;

// 示例 2: 多个条件与条件
const rule2 = `
rule wealthAndOfficer {
    description: "财官两旺";
    category: "bazi";
    
    if wealthStarVisible == true;
    if officerStarVisible == true;
    if zhiHe(dayBranch, yearBranch);
    
    then fortune += 15;
}
`;

console.log("=== 测试 Rule DSL ===");
console.log("\n--- 测试 1: 简单规则 ---");

const context1 = {
  dayMasterStrength: "strong",
  dayMasterWuxing: "木",
  monthWuxing: "火",
  fortune: 50,
  confidence: 0.5
};

const result1 = RuleDSL.execute(rule1, context1);
console.log("执行结果:", JSON.stringify(result1, null, 2)");
console.log("是否匹配:", result1.matched);
console.log("效果:", result1.effects);

console.log("\n--- 测试 2: 多个条件 ---");

const context2 = {
  wealthStarVisible: true,
  officerStarVisible: true,
  dayBranch: "子",
  yearBranch: "丑",
  fortune: 50
};

const result2 = RuleDSL.execute(rule2, context2);
console.log("执行结果:", JSON.stringify(result2, null, 2)");
console.log("是否匹配:", result2.matched);
console.log("效果:", result2.effects);

console.log("\n--- 测试 3: 不匹配的条件 ---");

const context3 = {
  dayMasterStrength: "weak",
  dayMasterWuxing: "木",
  monthWuxing: "金",
  fortune: 50,
  confidence: 0.5
};

const result3 = RuleDSL.execute(rule1, context3);
console.log("执行结果:", JSON.stringify(result3, null, 2)");
console.log("是否匹配:", result3.matched);
console.log("效果:", result3.effects);

console.log("\n=== 测试完成 ===");
