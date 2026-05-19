/**
 * Rule DSL 演示
 * Phase 8: Runtime Engine
 */

import { RuleDSL } from '../src';

const dslCode = `
// 八字规则示例
rule dayMasterStrong {
    description: "日主得地，富贵可期";
    category: bazi;
    priority: critical;
    source: "渊海子平";
    if dayMasterStrength == "strong";
    if wuxingSheng(dayMasterWuxing, yearGanWuxing);
    then fortune += 15;
    then signal = "日主得地";
    then confidence = 0.85;
}

rule wealthStarStrong {
    description: "财星得用，财运亨通";
    category: bazi;
    priority: high;
    if wealthStarStrength == "strong";
    if wuxingKe(wealthStarWuxing, officerStarWuxing) == false;
    then fortune += 10;
    then signal = "财星得用";
    then probability = 0.8;
}

rule dayHourHarmony {
    description: "日时相合，晚运吉祥";
    category: bazi;
    priority: medium;
    if zhiHe(dayZhi, hourZhi);
    then fortune += 8;
    then timing = "有利姻缘";
}
`;

console.log('=== Rule DSL 演示\n');

const context = {
  dayMasterStrength: 'strong',
  dayMasterWuxing: '木',
  yearGanWuxing: '水',
  wealthStarStrength: 'strong',
  wealthStarWuxing: '土',
  officerStarWuxing: '木',
  dayZhi: '子',
  hourZhi: '丑'
};

console.log('执行上下文:', JSON.stringify(context, null, 2));

console.log();

try {
  console.log('1. 解析 DSL...');
  const program = RuleDSL.parse(dslCode);
  console.log('解析成功，规则数:', program.rules.length);

  console.log();

  console.log('2. 执行规则...');
  const result = RuleDSL.interpret(program, context);

  console.log('执行结果:');
  console.log('- 成功:', result.success);
  console.log('- 应用效果:', result.effects);
  console.log('- 错误:', result.errors);
  console.log();

  console.log('=== 应用效果详情:');
  result.effects.forEach((effect, index) => {
    console.log(`  ${index + 1}. ${effect.type} - ${effect.action}:`, effect.value);
  });
} catch (error) {
  console.error('执行失败:', error);
}
