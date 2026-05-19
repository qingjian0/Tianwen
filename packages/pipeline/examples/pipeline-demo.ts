/**
 * Pipeline 完整使用示例
 * Phase 6: 端到端推演演示
 */

import { TianwenPipeline, PredictionInput } from '../src';

async function runDemo() {
  console.log('=== 天问推演流水线演示 ===\n');

  // 1. 创建 Pipeline 实例
  const pipeline = new TianwenPipeline({
    enableCache: true,
    enableConflictResolution: true,
    enableMultiSystemFusion: false,
    maxExecutionTimeMs: 30000,
    rules: {
      enabled: true,
      categories: ['meihua', 'liuyao']
    },
    interpretation: {
      enabled: true,
      style: 'detailed',
      includeTrace: true
    }
  });

  // 2. 准备输入
  const input: PredictionInput = {
    question: '今日财运如何？',
    category: 'wealth',
    system: 'meihua',
    mode: 'single',
    timestamp: new Date()
  };

  console.log('输入:', input);
  console.log();

  // 3. 执行推演
  console.log('开始推演...\n');
  const result = await pipeline.execute(input);

  // 4. 输出结果
  console.log('=== 推演结果 ===\n');
  console.log('成功:', result.success);
  console.log('错误:', result.errors.length > 0 ? result.errors : '无');
  console.log('警告:', result.warnings.length > 0 ? result.warnings : '无');
  console.log();

  if (result.success) {
    const output = result.output;

    console.log('【摘要】', output.summary);
    console.log();

    console.log('【概率分析】');
    console.log(`  成功概率: ${Math.round(output.probability.success * 100)}%`);
    console.log(`  失败概率: ${Math.round(output.probability.failure * 100)}%`);
    console.log(`  置信度: ${Math.round(output.probability.confidence * 100)}%`);
    console.log();

    console.log('【吉凶判定】');
    console.log(`  等级: ${output.fortune.level}`);
    console.log(`  描述: ${output.fortune.description}`);
    console.log();

    console.log('【关键信号】');
    output.signals.slice(0, 5).forEach(signal => {
      const mark = signal.polarity === 'positive' ? '✓' : signal.polarity === 'negative' ? '✗' : '~';
      console.log(`  ${mark} ${signal.description} (${signal.strength})`);
    });
    console.log();

    console.log('【应用规则】');
    output.appliedRules.slice(0, 5).forEach(rule => {
      console.log(`  * ${rule.name} (${rule.priority})`);
      console.log(`    来源: ${rule.source}`);
      console.log(`    置信度: ${Math.round(rule.confidence * 100)}%`);
    });
    console.log();

    if (output.knowledgeReferences.length > 0) {
      console.log('【知识引用】');
      output.knowledgeReferences.forEach(ref => {
        console.log(`  - ${ref.title}${ref.chapter ? ` (${ref.chapter})` : ''}`);
      });
      console.log();
    }

    console.log('【行动建议】');
    output.actionableSuggestions.forEach((suggestion, i) => {
      console.log(`  ${i + 1}. ${suggestion}`);
    });
    console.log();

    console.log('【计算轨迹】');
    output.calculationTrace.forEach((step, i) => {
      console.log(`  ${i + 1}. [${step.stage}] ${step.action}`);
      console.log(`     结果: ${step.result}`);
      console.log(`     耗时: ${step.duration}ms`);
    });
  }

  console.log('\n=== 演示完成 ===');
}

// 运行演示
runDemo().catch(console.error);
