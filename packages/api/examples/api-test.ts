/**
 * API 测试示例
 */

import { PredictionService } from '../src/prediction-service';
import { RuleService } from '../src/rule-service';

async function testPredictionApi() {
  console.log('=== 测试预测 API ===\n');

  const service = new PredictionService();

  const request = {
    question: '今日财运如何？',
    category: 'wealth',
    system: 'meihua',
    mode: 'single'
  };

  console.log('请求:', request);
  console.log();

  const result = await service.predict(request);

  if (result.success) {
    console.log('✅ 预测成功!');
    console.log('预测ID:', result.data?.predictionId);
    console.log('摘要:', result.data?.summary);
    console.log('成功概率:', Math.round((result.data?.probability.success || 0) * 100) + '%');
    console.log('吉凶:', result.data?.fortune.level);
    console.log();
    
    console.log('=== 应用规则 ===');
    result.data?.appliedRules.forEach((rule: any, i: number) => {
      console.log(`${i + 1}. ${rule.name} (${rule.priority})`);
      console.log(`   来源: ${rule.source}`);
      console.log(`   置信度: ${Math.round(rule.confidence * 100)}%`);
    });
    console.log();

    console.log('=== 计算轨迹 ===');
    result.data?.calculationTrace.forEach((step: any) => {
      console.log(`[${step.stage}] ${step.action} - ${step.result} (${step.duration}ms)`);
    });
  } else {
    console.log('❌ 预测失败:', result.error);
  }

  console.log('\n=== 健康检查 ===');
  const health = await service.healthCheck();
  console.log(JSON.stringify(health, null, 2));
}

async function testRuleApi() {
  console.log('\n=== 测试规则 API ===\n');

  const service = new RuleService();

  console.log('=== 获取所有分类 ===');
  const categories = await service.getCategories();
  console.log(JSON.stringify(categories, null, 2));
  console.log();

  console.log('=== 获取八字规则 ===');
  const baziRules = await service.getRulesByCategory('bazi');
  console.log(`找到 ${baziRules.data?.length} 条八字规则`);
  baziRules.data?.slice(0, 3).forEach((rule: any) => {
    console.log(`- ${rule.name}: ${rule.description}`);
    console.log(`  来源: ${rule.source.name} (${rule.source.chapter})`);
  });
  console.log();

  console.log('=== 获取奇门规则 ===');
  const qimenRules = await service.getRulesByCategory('qimen');
  console.log(`找到 ${qimenRules.data?.length} 条奇门规则`);
  console.log();

  console.log('=== 获取紫微规则 ===');
  const ziweiRules = await service.getRulesByCategory('ziwei');
  console.log(`找到 ${ziweiRules.data?.length} 条紫微规则`);
}

async function runAllTests() {
  try {
    await testPredictionApi();
    await testRuleApi();
    console.log('\n✅ 所有测试完成!');
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

runAllTests();
