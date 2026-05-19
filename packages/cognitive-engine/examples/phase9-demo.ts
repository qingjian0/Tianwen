/**
 * Phase 9 - 完整整合演示
 * 展示所有术数系统及 Phase 9 新组件
 */

import { MeihuaEngine } from '@tianwen/meihua';
import { LiuyaoEngine } from '@tianwen/liuyao';
import { BaziEngine } from '@tianwen/bazi-engine';
import { QimenEngine } from '@tianwen/qimen';
import { ZiweiEngine } from '@tianwen/ziwei';
import { CognitiveEngine } from '../src/cognitive-engine';
import { TemporalMemory } from '@tianwen/temporal-memory';
import { RuleKnowledgeGraph } from '@tianwen/rule-knowledge-graph';
import { MultiSystemResonanceEngine } from '@tianwen/resonance-engine';

console.log('='.repeat(60));
console.log('天问系统 Phase 9 - 完整整合演示');
console.log('='.repeat(60));

async function main() {
  console.log('\n1. 术数系统演示');
  console.log('-'.repeat(60));

  const meihuaEngine = new MeihuaEngine();
  const meihuaResult = meihuaEngine.divinateByTime();
  console.log('梅花易数:', meihuaResult.interpretation);

  const liuyaoEngine = new LiuyaoEngine();
  const liuyaoResult = liuyaoEngine.divinateByNumber(1, 2, 3);
  console.log('六爻:', liuyaoResult.benGua.name);

  const baziEngine = new BaziEngine();
  const baziResult = baziEngine.calculate(new Date(), '男');
  console.log('八字:', baziResult.ganzhi.year, baziResult.ganzhi.month,
    baziResult.ganzhi.day, baziResult.ganzhi.hour);

  const qimenEngine = new QimenEngine();
  const qimenResult = qimenEngine.calculate(new Date());
  console.log('奇门:', qimenResult.zhiFu.star, qimenResult.zhiShi.door);

  const ziweiEngine = new ZiweiEngine();
  const ziweiResult = ziweiEngine.calculate(new Date(), '男');
  console.log('紫微:', ziweiResult.mainPalace.name, ziweiResult.mainPalace.mainStars[0]);

  console.log('\n2. Phase 9 认知系统演示');
  console.log('-'.repeat(60));

  const cognitiveEngine = new CognitiveEngine();
  const cognitiveResult = await cognitiveEngine.execute({
    input: { question: '测试', timestamp: Date.now() },
    signals: [
      { type: 'wuxing', value: '木', weight: 0.8, wuxing: '木' },
      { type: 'wuxing', value: '火', weight: 0.7, wuxing: '火' },
      { type: 'tiangan', value: '甲', weight: 0.6 }
    ],
    rules: []
  });

  console.log('认知推理:', cognitiveResult.trace.nodes.size, '节点');
  console.log('推理结论:', cognitiveResult.finalState);

  console.log('\n3. 时间记忆系统演示');
  console.log('-'.repeat(60));

  const temporalMemory = new TemporalMemory();
  await temporalMemory.saveState({
    stateId: 'test-1',
    userId: 'demo-user',
    timestamp: Date.now() - 86400000,
    type: 'prediction',
    content: { system: 'meihua', result: 'positive' },
    properties: { fortune: 85, test: 'success' },
    confidence: 0.8
  });

  const historyResult = await temporalMemory.queryTimeline({ userId: 'demo-user' });
  console.log('历史记录:', historyResult.states.length, '条');

  console.log('\n4. 规则知识图谱演示');
  console.log('-'.repeat(60));

  const ruleGraph = new RuleKnowledgeGraph();
  const rule1 = ruleGraph.addRule({
    ruleId: 'rule-wealth',
    name: '财星旺盛',
    category: 'bazi',
    properties: { element: 'wood', strength: 'high' },
    confidence: 0.85
  });

  ruleGraph.addRelation(rule1.ruleId, 'rule-opportunity', 'supports', 0.9);

  const graphStats = ruleGraph.getStatistics();
  console.log('知识图谱:', graphStats.totalNodes, '节点', graphStats.totalRelations, '关系');

  console.log('\n5. 多系统共振引擎演示');
  console.log('-'.repeat(60));

  const resonanceEngine = new MultiSystemResonanceEngine();

  const resonanceResult = await resonanceEngine.fuse([
    {
      system: 'bazi',
      signals: [{ signalId: 's1', type: 'wuxing', value: '木', weight: 0.8, wuxing: '木' }],
      properties: {},
      confidence: 0.8
    },
    {
      system: 'liuyao',
      signals: [{ signalId: 's2', type: 'wuxing', value: '火', weight: 0.75, wuxing: '火' }],
      properties: {},
      confidence: 0.75
    }
  ], { question: '事业发展如何？' });

  console.log('多系统结论:', resonanceResult.finalResult.interpretation);
  console.log('融合置信度:', resonanceResult.fusionReasoning.confidence);

  console.log('\n' + '='.repeat(60));
  console.log('Phase 9 完整整合演示完成！');
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('演示执行失败:', err);
});
