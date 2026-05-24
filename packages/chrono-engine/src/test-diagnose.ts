#!/usr/bin/env tsx

import { ChronoEngine } from "./chronoEngine";
import { MeihuaEngine } from "@tianwen/meihua";

console.log("=== 天问系统诊断测试 ===\n");

// 1. 测试当前日期计算
const today = new Date();
console.log("当前日期:", today.toLocaleString());

const chronoData = ChronoEngine.now();
console.log("\n=== ChronoEngine 计算结果 ===");
console.log("公历:", chronoData.gregorian);
console.log("农历:", {
  年: chronoData.lunar.year,
  月: chronoData.lunar.month,
  日: chronoData.lunar.day,
  年干支: chronoData.lunar.yearGanZhi,
  月干支: chronoData.lunar.monthGanZhi,
  日干支: chronoData.lunar.dayGanZhi,
  时干支: chronoData.lunar.hourGanZhi,
  时辰: chronoData.shichen,
});

console.log("\n=== 梅花易数测试 ===");
const meihua = new MeihuaEngine();
const result = meihua.divinateByTime();
console.log("起卦方式:", result.method);
console.log("本卦:", result.benGua.name);
console.log("本卦 - 上卦:", result.benGua.shangGua, "下卦:", result.benGua.xiaGua);
console.log("互卦:", result.huGua?.name);
console.log("变卦:", result.bianGua?.name);
console.log("动爻:", result.dongYaoPositions);
console.log("体用关系:", result.tiYong);

console.log("\n=== 诊断完成 ===");
