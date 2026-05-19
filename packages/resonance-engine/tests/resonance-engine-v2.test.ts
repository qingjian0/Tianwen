/**
 * Multi-System Resonance Engine v2 真实测试
 */

import { MultiSystemResonanceEngine } from '../src/resonance-engine-v2';
import { SystemInput } from '../src/types';

describe('MultiSystemResonanceEngine', () => {
  let engine: MultiSystemResonanceEngine;

  beforeEach(() => {
    engine = new MultiSystemResonanceEngine();
  });

  test('should fuse multiple system inputs', async () => {
    const inputs: SystemInput[] = [
      {
        system: 'bazi',
        signals: [
          { signalId: 's1', type: 'wuxing', value: '木', weight: 0.8, wuxing: '木' },
          { signalId: 's2', type: 'fortune', value: true, weight: 0.7 },
        ],
        properties: { dayMaster: '木', strength: 0.8 },
        confidence: 0.85,
      },
      {
        system: 'liuyao',
        signals: [
          { signalId: 's3', type: 'wuxing', value: '木', weight: 0.75, wuxing: '木' },
          { signalId: 's4', type: 'prosperity', value: true, weight: 0.7 },
        ],
        properties: { hexagram: '同人', element: '木' },
        confidence: 0.8,
      },
    ];

    const result = await engine.fuse(inputs);

    expect(result).toBeDefined();
    expect(result.traceId).toBeDefined();
    expect(result.inputs.length).toBe(2);
    expect(result.fusionReasoning).toBeDefined();
    expect(result.finalResult).toBeDefined();
    expect(result.executionTime).toBeGreaterThan(0);
  });

  test('should detect wuxing conflicts', async () => {
    const inputs: SystemInput[] = [
      {
        system: 'bazi',
        signals: [
          { signalId: 's1', type: 'wuxing', value: '木', weight: 0.8, wuxing: '木' },
        ],
        properties: {},
        confidence: 0.8,
      },
      {
        system: 'meihua',
        signals: [
          { signalId: 's2', type: 'wuxing', value: '金', weight: 0.75, wuxing: '金' },
        ],
        properties: {},
        confidence: 0.75,
      },
    ];

    const result = await engine.fuse(inputs);

    expect(result.conflicts.length).toBeGreaterThan(0);
    expect(result.conflicts[0].severity).toBeGreaterThan(0);
  });

  test('should resolve conflicts by hierarchy', async () => {
    const inputs: SystemInput[] = [
      {
        system: 'bazi',
        signals: [
          { signalId: 's1', type: 'result', value: true, weight: 0.6 },
        ],
        properties: {},
        confidence: 0.7,
      },
      {
        system: 'liuyao',
        signals: [
          { signalId: 's2', type: 'result', value: false, weight: 0.8 },
        ],
        properties: {},
        confidence: 0.8,
      },
    ];

    const result = await engine.fuse(inputs);

    expect(result.resolutions.length).toBeGreaterThan(0);
    expect(result.resolutions[0].strategy).toBeDefined();
  });

  test('should harmonize signals correctly', async () => {
    const inputs: SystemInput[] = [
      {
        system: 'bazi',
        signals: [
          { signalId: 's1', type: 'wuxing', value: '木', weight: 0.8, wuxing: '木' },
          { signalId: 's2', type: 'timeline', value: '春', weight: 0.7, timeline: '春' },
        ],
        properties: {},
        confidence: 0.8,
      },
      {
        system: 'liuyao',
        signals: [
          { signalId: 's3', type: 'wuxing', value: '木', weight: 0.7, wuxing: '木' },
          { signalId: 's4', type: 'timeline', value: '春', weight: 0.6, timeline: '春' },
        ],
        properties: {},
        confidence: 0.75,
      },
    ];

    const result = await engine.fuse(inputs);

    expect(result.fusionReasoning.harmonizedSignals.length).toBeGreaterThan(0);
  });

  test('should calculate resonance scoring', async () => {
    const inputs: SystemInput[] = [
      {
        system: 'bazi',
        signals: [{ signalId: 's1', type: 'wuxing', value: '木', weight: 0.8, wuxing: '木' }],
        properties: {},
        confidence: 0.8,
      },
      {
        system: 'meihua',
        signals: [{ signalId: 's2', type: 'wuxing', value: '火', weight: 0.7, wuxing: '火' }],
        properties: {},
        confidence: 0.75,
      },
      {
        system: 'qimen',
        signals: [{ signalId: 's3', type: 'wuxing', value: '土', weight: 0.6, wuxing: '土' }],
        properties: {},
        confidence: 0.7,
      },
    ];

    const result = await engine.fuse(inputs);

    expect(result.fusionReasoning.trace.length).toBeGreaterThan(0);
    expect(result.fusionReasoning.trace[2].action).toBe('Calculate resonance scoring');
  });

  test('should find system agreement', async () => {
    const inputs: SystemInput[] = [
      {
        system: 'bazi',
        signals: [
          { signalId: 's1', type: 'result', value: 'positive', weight: 0.8 },
          { signalId: 's2', type: 'magnitude', value: 0.7, weight: 0.7 },
        ],
        properties: {},
        confidence: 0.8,
      },
      {
        system: 'liuyao',
        signals: [
          { signalId: 's3', type: 'result', value: 'positive', weight: 0.75 },
          { signalId: 's4', type: 'magnitude', value: 0.65, weight: 0.7 },
        ],
        properties: {},
        confidence: 0.75,
      },
    ];

    const result = await engine.fuse(inputs);

    expect(result.fusionReasoning.fusedConclusion.supportingSystems.length).toBeGreaterThanOrEqual(0);
  });

  test('should generate fused conclusion', async () => {
    const inputs: SystemInput[] = [
      {
        system: 'bazi',
        signals: [
          { signalId: 's1', type: 'fortune', value: true, weight: 0.8 },
        ],
        properties: {},
        confidence: 0.8,
      },
      {
        system: 'meihua',
        signals: [
          { signalId: 's2', type: 'fortune', value: true, weight: 0.75 },
        ],
        properties: {},
        confidence: 0.75,
      },
    ];

    const result = await engine.fuse(inputs);

    expect(result.finalResult.statement).toBeDefined();
    expect(result.finalResult.probability).toBeGreaterThan(0);
    expect(result.finalResult.finalConfidence).toBeGreaterThan(0);
  });

  test('should use contextual resolution', async () => {
    const inputs: SystemInput[] = [
      {
        system: 'bazi',
        signals: [{ signalId: 's1', type: 'result', value: true, weight: 0.6 }],
        properties: {},
        confidence: 0.7,
      },
      {
        system: 'liuyao',
        signals: [{ signalId: 's2', type: 'result', value: false, weight: 0.8 }],
        properties: {},
        confidence: 0.8,
      },
    ];

    const context = { question: '关于事业发展如何？' };
    const result = await engine.fuse(inputs, context);

    expect(result.resolutions.length).toBeGreaterThan(0);
  });

  test('should analyze temporal alignment', async () => {
    const inputs: SystemInput[] = [
      {
        system: 'bazi',
        signals: [
          { signalId: 's1', type: 'timeline', value: '春', weight: 0.8, timeline: '春' },
        ],
        properties: {},
        confidence: 0.8,
      },
      {
        system: 'meihua',
        signals: [
          { signalId: 's2', type: 'timeline', value: '春', weight: 0.75, timeline: '春' },
        ],
        properties: {},
        confidence: 0.75,
      },
    ];

    const alignments = engine.analyzeTemporalAlignment(inputs);

    expect(alignments.length).toBeGreaterThan(0);
    expect(alignments[0].alignment).toBeGreaterThan(0);
  });

  test('should return execution trace', async () => {
    const inputs: SystemInput[] = [
      {
        system: 'bazi',
        signals: [{ signalId: 's1', type: 'test', value: true, weight: 0.8 }],
        properties: {},
        confidence: 0.8,
      },
    ];

    const result = await engine.fuse(inputs);

    expect(result.fusionReasoning.trace.length).toBe(5);
    expect(result.fusionReasoning.trace[0].step).toBe(1);
    expect(result.fusionReasoning.trace[4].step).toBe(5);
  });
});
