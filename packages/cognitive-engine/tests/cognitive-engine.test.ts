/**
 * Cognitive Engine 真实测试
 */

import { CognitiveEngine } from '../src/cognitive-engine';

describe('CognitiveEngine', () => {
  let engine: CognitiveEngine;

  beforeEach(() => {
    engine = new CognitiveEngine();
  });

  test('should execute reasoning chain with signals', async () => {
    const context = {
      input: { timestamp: Date.now(), question: '测试问题' },
      signals: [
        { type: 'moving_line', value: 5, weight: 0.8, wuxing: '木' },
        { type: 'hexagram_signal', value: '乾', weight: 0.7, element: '金' },
        { type: 'wuxing_signal', value: '火', weight: 0.6 },
      ],
      rules: [{ id: 'rule1' }],
    };

    const result = await engine.execute(context);

    expect(result.success).toBe(true);
    expect(result.trace).toBeDefined();
    expect(result.trace.rootSignals.length).toBe(3);
    expect(result.conclusions.length).toBeGreaterThanOrEqual(0);
    expect(result.executionTime).toBeGreaterThan(0);
  });

  test('should detect wuxing contradictions', async () => {
    const context = {
      input: { timestamp: Date.now() },
      signals: [
        { type: 'wuxing_signal', value: '木', weight: 0.8 },
        { type: 'wuxing_signal', value: '金', weight: 0.7 },
      ],
      rules: [],
    };

    const result = await engine.execute(context);

    expect(result.trace.contradictions.length).toBeGreaterThan(0);
  });

  test('should perform symbolic reasoning', async () => {
    const context = {
      input: { timestamp: Date.now() },
      signals: [
        { type: 'ganzhi', tiangan: '甲', weight: 0.8 },
        { type: 'ganzhi', dizhi: '寅', weight: 0.7 },
        { type: 'wuxing', wuxing: '木', weight: 0.9 },
      ],
      rules: [],
    };

    const result = await engine.execute(context);

    const reasoningNodes = Array.from(result.trace.nodes.values()).filter(
      n => n.type === 'symbolic_reasoning'
    );
    expect(reasoningNodes.length).toBeGreaterThan(0);
  });

  test('should propagate temporal information', async () => {
    const context = {
      input: { timestamp: Date.now() },
      signals: [
        { type: 'wuxing', wuxing: '木', weight: 0.8 },
        { type: 'wuxing', wuxing: '火', weight: 0.7 },
        { type: 'wuxing', wuxing: '土', weight: 0.6 },
      ],
      rules: [],
    };

    const result = await engine.execute(context);

    const temporalNodes = Array.from(result.trace.nodes.values()).filter(
      n => n.type === 'temporal_propagation'
    );
    expect(temporalNodes.length).toBeGreaterThan(0);
  });

  test('should generate event hypotheses', async () => {
    const context = {
      input: { timestamp: Date.now() },
      signals: [
        { type: 'wuxing', wuxing: '木', weight: 0.8 },
        { type: 'wuxing', wuxing: '火', weight: 0.7 },
      ],
      rules: [],
    };

    const result = await engine.execute(context);

    const hypothesisNodes = Array.from(result.trace.nodes.values()).filter(
      n => n.type === 'event_hypothesis'
    );
    expect(hypothesisNodes.length).toBeGreaterThan(0);
    
    for (const node of hypothesisNodes) {
      expect(node.content.scenarios).toBeDefined();
      expect(node.content.scenarios.length).toBeGreaterThan(0);
    }
  });

  test('should inherit from historical states', async () => {
    const pastState = {
      stateId: 'past_1',
      properties: new Map([['previous_conclusion', 'positive']]),
      confidence: 0.7,
      timestamp: Date.now() - 10000,
    };

    const context = {
      input: { timestamp: Date.now() },
      signals: [{ type: 'wuxing', wuxing: '木', weight: 0.8 }],
      rules: [],
      temporal: {
        pastStates: [pastState],
        currentState: pastState,
        predictions: [],
      },
    };

    const result = await engine.execute(context);

    const temporalNodes = Array.from(result.trace.nodes.values()).filter(
      n => n.type === 'temporal_propagation' && n.metadata?.inheritance
    );
    expect(temporalNodes.length).toBeGreaterThan(0);
  });

  test('should update confidence through propagation', async () => {
    const context = {
      input: { timestamp: Date.now() },
      signals: [
        { type: 'wuxing', wuxing: '木', weight: 0.9 },
        { type: 'wuxing', wuxing: '火', weight: 0.8 },
        { type: 'wuxing', wuxing: '土', weight: 0.7 },
      ],
      rules: [],
    };

    const result = await engine.execute(context);

    for (const node of result.trace.nodes.values()) {
      if (node.metadata?.weight !== undefined) {
        expect(node.metadata.weight).toBeGreaterThan(0);
        expect(node.metadata.weight).toBeLessThanOrEqual(1);
      }
    }
  });

  test('should handle empty signals gracefully', async () => {
    const context = {
      input: { timestamp: Date.now() },
      signals: [],
      rules: [],
    };

    const result = await engine.execute(context);

    expect(result.success).toBe(true);
    expect(result.trace.rootSignals.length).toBe(0);
  });

  test('should resolve contradictions by hierarchy', async () => {
    const context = {
      input: { timestamp: Date.now() },
      signals: [
        { type: 'wuxing', wuxing: '木', weight: 0.8 },
        { type: 'wuxing', wuxing: '金', weight: 0.6 },
        { type: 'wuxing', wuxing: '水', weight: 0.9 },
      ],
      rules: [],
    };

    const result = await engine.execute(context);

    expect(result.trace.contradictions.length).toBeGreaterThan(0);
  });
});
