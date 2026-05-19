/**
 * Rule Knowledge Graph 真实测试
 */

import { RuleKnowledgeGraph } from '../src/rule-knowledge-graph';

describe('RuleKnowledgeGraph', () => {
  let graph: RuleKnowledgeGraph;

  beforeEach(() => {
    graph = new RuleKnowledgeGraph();
  });

  test('should add and retrieve rules', () => {
    const rule = graph.addRule({
      ruleId: 'bazi_rule_001',
      name: '日主强旺',
      category: 'bazi',
      properties: { wuxing: '木', strength: 0.8 },
      confidence: 0.9,
    });

    expect(rule.nodeId).toBeDefined();
    expect(rule.ruleId).toBe('bazi_rule_001');
  });

  test('should create relations between rules', () => {
    const rule1 = graph.addRule({
      ruleId: 'rule_1',
      name: 'Rule 1',
      category: 'bazi',
      properties: {},
      confidence: 0.8,
    });

    const rule2 = graph.addRule({
      ruleId: 'rule_2',
      name: 'Rule 2',
      category: 'bazi',
      properties: {},
      confidence: 0.7,
    });

    const relation = graph.addRelation('rule_1', 'rule_2', 'supports', 0.8);

    expect(relation).not.toBeNull();
    expect(relation!.relationType).toBe('supports');
  });

  test('should query by category', () => {
    graph.addRule({ ruleId: 'r1', name: 'R1', category: 'bazi', properties: {}, confidence: 0.8 });
    graph.addRule({ ruleId: 'r2', name: 'R2', category: 'bazi', properties: {}, confidence: 0.7 });
    graph.addRule({ ruleId: 'r3', name: 'R3', category: 'meihua', properties: {}, confidence: 0.9 });

    const result = graph.query({ category: 'bazi' });

    expect(result.nodes.length).toBe(2);
  });

  test('should find semantic relations', () => {
    graph.addRule({
      ruleId: 'r1',
      name: '木行强',
      category: 'wuxing',
      properties: { element: '木', strength: 0.9 },
      confidence: 0.8,
    });

    graph.addRule({
      ruleId: 'r2',
      name: '木行旺',
      category: 'wuxing',
      properties: { element: '木', prosperity: 0.85 },
      confidence: 0.75,
    });

    const relations = graph.findSemanticRelations('r1');

    expect(relations.length).toBeGreaterThan(0);
    expect(relations[0].semanticSimilarity).toBeGreaterThan(0);
  });

  test('should calculate weighted relations', () => {
    graph.addRule({ ruleId: 'r1', name: 'R1', category: 'c', properties: {}, confidence: 0.8 });
    graph.addRule({ ruleId: 'r2', name: 'R2', category: 'c', properties: {}, confidence: 0.7 });

    graph.addRelation('r1', 'r2', 'supports', 0.9);

    const weighted = graph.findWeightedRelations('r1');

    expect(weighted.length).toBe(1);
    expect(weighted[0].reinforcement).toBeGreaterThan(0);
  });

  test('should find contradiction path', () => {
    graph.addRule({ ruleId: 'r1', name: 'R1', category: 'c', properties: {}, confidence: 0.8 });
    graph.addRule({ ruleId: 'r2', name: 'R2', category: 'c', properties: {}, confidence: 0.7 });
    graph.addRule({ ruleId: 'r3', name: 'R3', category: 'c', properties: {}, confidence: 0.6 });

    graph.addRelation('r1', 'r2', 'contradicts', 0.9);
    graph.addRelation('r2', 'r3', 'supports', 0.8);

    const path = graph.findContradictionPath('r1', 'r2');

    expect(path).not.toBeNull();
    expect(path!.contradictionPoints.length).toBe(1);
    expect(path!.resolutionStrategy).toBeDefined();
  });

  test('should find reinforcement path', () => {
    graph.addRule({ ruleId: 'r1', name: 'R1', category: 'c', properties: {}, confidence: 0.8 });
    graph.addRule({ ruleId: 'r2', name: 'R2', category: 'c', properties: {}, confidence: 0.9 });
    graph.addRule({ ruleId: 'r3', name: 'R3', category: 'c', properties: {}, confidence: 0.7 });

    graph.addRelation('r1', 'r2', 'supports', 0.9);
    graph.addRelation('r2', 'r3', 'refines', 0.8);

    const path = graph.findReinforcementPath('r1', 'r3');

    expect(path).not.toBeNull();
    expect(path!.totalReinforcement).toBeGreaterThan(0);
    expect(path!.path.length).toBeGreaterThanOrEqual(2);
  });

  test('should get subgraph around a rule', () => {
    graph.addRule({ ruleId: 'center', name: 'Center', category: 'c', properties: {}, confidence: 0.9 });
    graph.addRule({ ruleId: 'r1', name: 'R1', category: 'c', properties: {}, confidence: 0.8 });
    graph.addRule({ ruleId: 'r2', name: 'R2', category: 'c', properties: {}, confidence: 0.7 });
    graph.addRule({ ruleId: 'far', name: 'Far', category: 'c', properties: {}, confidence: 0.6 });

    graph.addRelation('center', 'r1', 'supports', 0.8);
    graph.addRelation('center', 'r2', 'supports', 0.7);
    graph.addRelation('r1', 'r2', 'supports', 0.6);

    const subgraph = graph.getSubgraph('center', 2);

    expect(subgraph.nodes.length).toBeGreaterThanOrEqual(3);
  });

  test('should calculate graph statistics', () => {
    graph.addRule({ ruleId: 'r1', name: 'R1', category: 'c', properties: {}, confidence: 0.8 });
    graph.addRule({ ruleId: 'r2', name: 'R2', category: 'c', properties: {}, confidence: 0.7 });
    graph.addRule({ ruleId: 'r3', name: 'R3', category: 'c', properties: {}, confidence: 0.6 });

    graph.addRelation('r1', 'r2', 'supports', 0.9);
    graph.addRelation('r2', 'r3', 'contradicts', 0.8);

    const stats = graph.getStatistics();

    expect(stats.totalNodes).toBe(3);
    expect(stats.totalRelations).toBe(2);
    expect(stats.relationTypes.supports).toBe(1);
    expect(stats.relationTypes.contradicts).toBe(1);
  });

  test('should remove rule and clean up relations', () => {
    graph.addRule({ ruleId: 'r1', name: 'R1', category: 'c', properties: {}, confidence: 0.8 });
    graph.addRule({ ruleId: 'r2', name: 'R2', category: 'c', properties: {}, confidence: 0.7 });

    graph.addRelation('r1', 'r2', 'supports', 0.8);

    const removed = graph.removeRule('r1');

    expect(removed).toBe(true);

    const weighted = graph.findWeightedRelations('r2');
    expect(weighted.length).toBe(0);
  });
});
