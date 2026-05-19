/**
 * Phase 9 真实运行示例 - Cognitive Runtime OS
 */

import { CognitiveEngine } from '../src/cognitive-engine';
import { TemporalMemory } from '@tianwen/temporal-memory';
import { RuleKnowledgeGraph } from '@tianwen/rule-knowledge-graph';
import { MultiSystemResonanceEngine } from '@tianwen/resonance-engine-v2';

async function runCognitiveDemo() {
  console.log('=== Phase 9: Cognitive Runtime OS Demo ===\n');

  // 1. Cognitive Execution Engine Demo
  console.log('1. Cognitive Execution Engine');
  console.log('---');
  
  const cognitiveEngine = new CognitiveEngine();

  const context = {
    input: { timestamp: Date.now(), question: '事业发展如何？' },
    signals: [
      { type: 'wuxing', wuxing: '木', weight: 0.85 },
      { type: 'wuxing', wuxing: '火', weight: 0.75 },
      { type: 'tiangan', value: '甲', weight: 0.8 },
      { type: 'dizhi', value: '寅', weight: 0.7 },
      { type: 'timeline', timeline: '春', weight: 0.6 },
    ],
    rules: [
      { id: 'rule_wuxing_sheng' },
      { id: 'rule_tiangan_he' },
    ],
  };

  const cognitiveResult = await cognitiveEngine.execute(context);

  console.log('Cognitive Execution Result:');
  console.log(`  Success: ${cognitiveResult.success}`);
  console.log(`  Execution Time: ${cognitiveResult.executionTime.toFixed(2)} ms`);
  console.log(`  Nodes: ${cognitiveResult.trace.nodes.size}`);
  console.log(`  Edges: ${cognitiveResult.trace.edges.length}`);
  console.log(`  Contradictions: ${cognitiveResult.trace.contradictions.length}`);
  console.log(`  Conclusions: ${cognitiveResult.trace.conclusions.length}`);
  
  if (cognitiveResult.conclusions.length > 0) {
    const conclusion = cognitiveResult.trace.nodes.get(cognitiveResult.conclusions[0]);
    if (conclusion) {
      console.log(`  Final Narrative: ${conclusion.content.narrative}`);
    }
  }

  console.log('');

  // 2. Temporal Memory System Demo
  console.log('2. Temporal Memory System');
  console.log('---');

  const temporalMemory = new TemporalMemory();
  const userId = 'user_demo_1';

  const state1 = {
    stateId: 'state_1',
    userId,
    timestamp: Date.now() - 86400000 * 30,
    type: 'prediction' as const,
    content: { system: 'bazi', result: 'positive' },
    properties: { fortune: 75, category: 'career' },
    confidence: 0.8,
  };

  const state2 = {
    stateId: 'state_2',
    userId,
    timestamp: Date.now() - 86400000 * 15,
    type: 'prediction' as const,
    content: { system: 'meihua', result: 'positive' },
    properties: { fortune: 80, category: 'career' },
    confidence: 0.85,
    previousStateId: 'state_1',
  };

  const state3 = {
    stateId: 'state_3',
    userId,
    timestamp: Date.now(),
    type: 'prediction' as const,
    content: { system: 'liuyao', result: 'favorable' },
    properties: { fortune: 78, category: 'career' },
    confidence: 0.82,
    previousStateId: 'state_2',
  };

  await temporalMemory.saveState(state1);
  await temporalMemory.saveState(state2);
  await temporalMemory.saveState(state3);

  const inheritance = await temporalMemory.inheritState('state_3', 3);
  console.log('State Inheritance:');
  console.log(`  Source States: ${inheritance.sourceStates.length}`);
  console.log(`  Inheritance Strength: ${inheritance.inheritanceStrength.toFixed(3)}`);
  console.log(`  Inherited Properties: ${Object.keys(inheritance.inheritedProperties).join(', ')}`);

  const prediction = await temporalMemory.predictNext(userId);
  if (prediction) {
    console.log('Temporal Prediction:');
    console.log(`  Based on Pattern: ${prediction.basedOnPattern}`);
    console.log(`  Expected Timeframe: ${prediction.expectedTimeframe}`);
    console.log(`  Confidence: ${prediction.confidence.toFixed(3)}`);
  }

  console.log('');

  // 3. Rule Knowledge Graph Demo
  console.log('3. Rule Knowledge Graph');
  console.log('---');

  const knowledgeGraph = new RuleKnowledgeGraph();

  const rule1 = knowledgeGraph.addRule({
    ruleId: 'bazi_wealth_star',
    name: '财星旺盛',
    category: 'bazi',
    properties: { wuxing: '金', prosperity: 0.9 },
    confidence: 0.85,
  });

  const rule2 = knowledgeGraph.addRule({
    ruleId: 'bazi_official_star',
    name: '官星得地',
    category: 'bazi',
    properties: { wuxing: '水', authority: 0.8 },
    confidence: 0.8,
  });

  const rule3 = knowledgeGraph.addRule({
    ruleId: 'meihua_wood_element',
    name: '木行卦象',
    category: 'meihua',
    properties: { element: '木', growth: 0.85 },
    confidence: 0.82,
  });

  knowledgeGraph.addRelation(rule1.ruleId, rule2.ruleId, 'supports', 0.9);
  knowledgeGraph.addRelation(rule1.ruleId, rule3.ruleId, 'contradicts', 0.7);
  knowledgeGraph.addRelation(rule2.ruleId, rule3.ruleId, 'refines', 0.8);

  const subgraph = knowledgeGraph.getSubgraph(rule1.ruleId, 2);
  console.log('Rule Subgraph:');
  console.log(`  Nodes: ${subgraph.nodes.length}`);
  console.log(`  Relations: ${subgraph.relations.length}`);
  console.log(`  Density: ${subgraph.statistics.density.toFixed(3)}`);

  const semanticRels = knowledgeGraph.findSemanticRelations(rule1.ruleId);
  console.log(`  Semantic Relations: ${semanticRels.length}`);
  if (semanticRels.length > 0) {
    console.log(`  First Relation Similarity: ${semanticRels[0].semanticSimilarity.toFixed(3)}`);
  }

  console.log('');

  // 4. Multi-System Resonance Engine v2 Demo
  console.log('4. Multi-System Resonance Engine v2');
  console.log('---');

  const resonanceEngine = new MultiSystemResonanceEngine();

  const inputs = [
    {
      system: 'bazi' as const,
      signals: [
        { signalId: 'b1', type: 'wuxing', value: '木', weight: 0.85, wuxing: '木' },
        { signalId: 'b2', type: 'prosperity', value: '旺', weight: 0.8 },
      ],
      properties: { dayMaster: '木', strength: 0.85 },
      confidence: 0.85,
    },
    {
      system: 'meihua' as const,
      signals: [
        { signalId: 'm1', type: 'wuxing', value: '木', weight: 0.8, wuxing: '木' },
        { signalId: 'm2', type: 'growth', value: true, weight: 0.75 },
      ],
      properties: { element: '木', trend: 'rising' },
      confidence: 0.82,
    },
    {
      system: 'liuyao' as const,
      signals: [
        { signalId: 'l1', type: 'wuxing', value: '火', weight: 0.7, wuxing: '火' },
        { signalId: 'l2', type: 'outcome', value: 'mixed', weight: 0.75 },
      ],
      properties: { hexagram: '同人', element: '火' },
      confidence: 0.78,
    },
  ];

  const fusionResult = await resonanceEngine.fuse(inputs, { question: '事业发展如何？' });

  console.log('Fusion Result:');
  console.log(`  Conflicts Detected: ${fusionResult.conflicts.length}`);
  console.log(`  Resolutions Applied: ${fusionResult.resolutions.length}`);
  console.log(`  Harmonized Signals: ${fusionResult.fusionReasoning.harmonizedSignals.length}`);
  console.log(`  Fusion Confidence: ${fusionResult.fusionReasoning.confidence.toFixed(3)}`);
  console.log(`  Final Conclusion: ${fusionResult.finalResult.statement}`);
  console.log(`  Probability: ${(fusionResult.finalResult.probability * 100).toFixed(1)}%`);
  console.log(`  Supporting Systems: ${fusionResult.finalResult.supportingSystems.join(', ')}`);
  if (fusionResult.finalResult.contradictingSystems.length > 0) {
    console.log(`  Contradicting Systems: ${fusionResult.finalResult.contradictingSystems.join(', ')}`);
  }

  console.log('\n=== Phase 9 Demo Complete ===');
}

runCognitiveDemo().catch(console.error);
