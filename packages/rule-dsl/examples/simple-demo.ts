/**
 * 简单示例
 */

import { RuleDSL } from '../src';

const simpleRule = `
rule greeting {
    description: "简单测试规则";
    category: test;
    priority: medium;
    if a > b;
    if c == true;
    then fortune += 10;
    then signal = "条件满足";
}
`;

const context = {
  a: 100,
  b: 50,
  c: true
};

console.log('简单示例\n');
console.log('执行:', simpleRule);
console.log('上下文:', JSON.stringify(context));
console.log();

const result = RuleDSL.execute(simpleRule, context);
console.log('结果:', result);
