
/**
 * Chrono Engine 性能基准测试
 */

import { ChronoEngine, ChronoEngineOptimized } from "./index";

// 基准测试函数
export function runBenchmark() {
  console.log("🚀 开始 Chrono Engine 性能基准测试...\n");
  
  const iterations = 10000;
  const testDate = new Date();
  const testCoords = { latitude: 39.9, longitude: 116.4 };
  
  // 测试1: 原始 ChronoEngine
  console.log(`\n1. 测试原始 ChronoEngine (${iterations.toLocaleString()} 次)...`);
  const start1 = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    ChronoEngine.at(testDate, testCoords, true);
  }
  
  const time1 = performance.now() - start1;
  
  // 测试2: 优化版 ChronoEngineOptimized (首次调用，缓存未命中)
  console.log(`\n2. 测试 ChronoEngineOptimized (冷启动，缓存未命中) (${iterations.toLocaleString()} 次)...`);
  ChronoEngineOptimized.clearCache();
  const start2 = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    ChronoEngineOptimized.at(testDate, testCoords, true);
  }
  
  const time2 = performance.now() - start2;
  
  // 测试3: 优化版 ChronoEngineOptimized (缓存命中)
  console.log(`\n3. 测试 ChronoEngineOptimized (缓存命中) (${iterations.toLocaleString()} 次)...`);
  const start3 = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    ChronoEngineOptimized.at(testDate, testCoords, true);
  }
  
  const time3 = performance.now() - start3;
  
  // 打印结果
  console.log("\n" + "=".repeat(60));
  console.log("📊 性能测试结果");
  console.log("=".repeat(60));
  
  console.log(`\n原始 ChronoEngine:`);
  console.log(`  总耗时: ${time1.toFixed(2)} ms`);
  console.log(`  平均: ${(time1 / iterations).toFixed(4)} ms/次`);
  console.log(`  速率: ${Math.round(iterations / (time1 / 1000)).toLocaleString()} 次/秒`);
  
  console.log(`\nChronoEngineOptimized (冷启动):`);
  console.log(`  总耗时: ${time2.toFixed(2)} ms`);
  console.log(`  平均: ${(time2 / iterations).toFixed(4)} ms/次`);
  console.log(`  对比原始: ${(time2 / time1 * 100).toFixed(1)}% (${time1 - time2 > 0 ? "更快" : "更慢"})`);
  
  console.log(`\nChronoEngineOptimized (缓存命中):`);
  console.log(`  总耗时: ${time3.toFixed(2)} ms`);
  console.log(`  平均: ${(time3 / iterations).toFixed(4)} ms/次`);
  console.log(`  对比原始: ${(time3 / time1 * 100).toFixed(1)}% (${time1 - time3 > 0 ? "更快" : "更慢"})`);
  console.log(`  加速比: ${(time1 / time3).toFixed(1)}x`);
  
  console.log("\n" + "=".repeat(60));
  console.log("✅ 基准测试完成！");
  
  return {
    original: time1,
    optimizedCold: time2,
    optimizedHot: time3,
    speedup: time1 / time3,
  };
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runBenchmark();
}
