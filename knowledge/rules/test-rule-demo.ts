import {
  RuleEngine,
  createRule,
  RuleContext,
  ResolutionStrategy
} from '@tianwen/rule-engine-core';
import { meihuaRules, liuyaoRules, universalRules } from './index';
import { SignalExtractor } from '@tianwen/signal-extractor';
import { ProbabilityMapper } from '@tianwen/probability-mapping';
import { FortuneCalculator } from '@tianwen/fortune-engine';
import { RuleBasedInterpreter } from '@tianwen/interpretation-engine';

// 1. 创建规则引擎
console.log('=== 天问规则引擎演示 ===\n');

const engine = new RuleEngine();

// 2. 加载所有规则
console.log('加载规则...');
engine.addRules(meihuaRules);
engine.addRules(liuyaoRules);
engine.addRules(universalRules);
console.log(`共加载 ${engine.getRules().length} 条规则\n`);

// 3. 创建模拟的推演数据
const sampleContext: RuleContext = {
  data: {
    tiyong: {
      relation: 'yongshengti',
      ti: { name: '体卦', wuxing: 'jin' },
      yong: { name: '用卦', wuxing: 'tu' }
    },
    dongyaoCount: 1,
    hasBiangua: true,
    fortuneScore: 75,
    system: 'meihua',
    question: '今日财运如何',
    timestamp: new Date().toISOString()
  },
  timestamp: new Date()
};

console.log('推演上下文:');
console.log(`  问题: ${sampleContext.data.question}`);
console.log(`  系统: ${sampleContext.data.system}`);
console.log(`  体用关系: ${sampleContext.data.tiyong.relation}`);
console.log();

// 4. 匹配规则（包含冲突检测）
console.log('规则匹配...');
const matchResults = engine.matchRules(sampleContext);
const matchedRules = matchResults.filter(r => r.matched);
console.log(`匹配成功 ${matchedRules.length} 条规则`);

// 5. 检测冲突
const conflictResolver = engine['conflictResolver'];
const conflicts = conflictResolver.detectConflicts(matchResults);
if (conflicts.length > 0) {
  console.log(`检测到 ${conflicts.length} 个潜在冲突:`);
  conflicts.forEach(conflict => {
    console.log(`  - ${conflict.type}: ${conflict.description}`);
  });
} else {
  console.log('未检测到规则冲突');
}
console.log();

// 6. 执行规则（包含冲突处理）
console.log('执行规则（使用优先级策略）...');
const { result, conflictResolution } = engine.executeAndGetResultWithConflictResolution(
  sampleContext,
  ResolutionStrategy.PRIORITY_BASED
);

console.log('\n规则执行结果:');
console.log(`  概率: ${(result.probability * 100).toFixed(0)}%`);
console.log(`  吉凶分: ${result.fortune}`);
console.log(`  置信度: ${(result.confidence * 100).toFixed(0)}%`);
console.log(`  信号: ${result.signals?.join(', ') || '无'}`);

if (conflictResolution.skippedRuleIds.length > 0) {
  console.log(`  跳过规则: ${conflictResolution.skippedRuleIds.join(', ')}`);
}
console.log();

// 7. 模拟信号提取（实际会从术数计算结果提取）
console.log('信号提取...');
const mockSignals = [
  { id: 's1', source: 'meihua', polarity: 'positive', strength: 'high', confidence: 0.9, description: '用生体，得贵人相助' },
  { id: 's2', source: 'meihua', polarity: 'positive', strength: 'medium', confidence: 0.7, description: '变卦有利，结果圆满' },
  { id: 's3', source: 'timing', polarity: 'neutral', strength: 'low', confidence: 0.6, description: '月令有助' }
].map(s => ({ ...s, timing: null }));
console.log(`提取到 ${mockSignals.length} 个信号`);

// 8. 概率映射
console.log('概率映射计算...');
const probabilityMapper = new ProbabilityMapper();
const probMappingResult = probabilityMapper.mapSignals(mockSignals as any);
console.log(`  成功概率: ${(probMappingResult.probabilityScore.successProbability * 100).toFixed(0)}%`);
console.log(`  置信度: ${(probMappingResult.probabilityScore.confidence * 100).toFixed(0)}%`);
console.log();

// 9. 吉凶计算
console.log('吉凶计算...');
const fortuneCalc = new FortuneCalculator();
const fortuneLevel = result.fortune > 70 ? 'greatFortune' : result.fortune > 50 ? 'fortune' : result.fortune > 30 ? 'neutral' : 'warning';
console.log(`  吉凶等级: ${fortuneLevel}`);
console.log();

// 10. 规则解释生成
console.log('基于规则的解释生成...');
const interpreter = new RuleBasedInterpreter();
const executionResults = engine.executeRulesWithConflictResolution(sampleContext);

const interpretation = interpreter.generateInterpretation(
  executionResults,
  mockSignals as any,
  probMappingResult.probabilityScore,
  fortuneLevel as any,
  sampleContext
);

console.log('\n=== 解释结果 ===');
console.log('【摘要】', interpretation.summary);
console.log('\n【详细分析】', interpretation.detailedAnalysis);
console.log('\n【关键信号】');
interpretation.keySignals.slice(0, 5).forEach(sig => {
  const polarityMark = sig.signal.polarity === 'positive' ? '+' : sig.signal.polarity === 'negative' ? '-' : '~';
  console.log(`  ${polarityMark} ${sig.signal.description}`);
});
console.log('\n【应用规则】');
interpretation.appliedRules.slice(0, 5).forEach(rule => {
  console.log(`  * ${rule.ruleName} (${rule.priority})`);
  console.log(`    来源: ${rule.source.classic || rule.source.name}`);
});
if (interpretation.knowledgeReferences.length > 0) {
  console.log('\n【知识引用】');
  interpretation.knowledgeReferences.forEach(ref => {
    console.log(`  - ${ref.title}${ref.chapter ? ` (${ref.chapter})` : ''}`);
  });
}
console.log('\n【风险评估】');
console.log(`  等级: ${interpretation.riskAssessment.level}`);
console.log(`  因素: ${interpretation.riskAssessment.factors.join(', ') || '无'}`);
console.log('\n【机遇评估】');
console.log(`  等级: ${interpretation.opportunityAssessment.level}`);
console.log(`  因素: ${interpretation.opportunityAssessment.factors.join(', ') || '无'}`);
console.log('\n【行动建议】');
interpretation.actionableSuggestions.forEach(suggestion => {
  console.log(`  * ${suggestion}`);
});
console.log('\n【计算轨迹】');
interpretation.calculationTrail.forEach((trail, i) => {
  console.log(`  ${i + 1}. ${trail}`);
});
console.log();

console.log('=== 演示完成 ===');
console.log('\n核心能力展示:');
console.log('  ✓ 规则引擎与条件匹配');
console.log('  ✓ 规则冲突检测与解决');
console.log('  ✓ 来源权重与优先级');
console.log('  ✓ 规则引用与知识溯源');
console.log('  ✓ 基于规则的解释生成');
console.log('  ✓ 完整的计算轨迹');
