/**
 * Temporal Memory System 真实测试
 */

import { TemporalMemory } from '../src/temporal-memory';

describe('TemporalMemory', () => {
  let memory: TemporalMemory;
  const userId = 'test_user_1';

  beforeEach(async () => {
    memory = new TemporalMemory();
  });

  test('should save and retrieve state', async () => {
    const state = {
      stateId: 'state_1',
      userId,
      timestamp: Date.now(),
      type: 'prediction' as const,
      content: { result: 'positive' },
      properties: { fortune: 80, confidence: 0.8 },
      confidence: 0.8,
    };

    await memory.saveState(state);

    const result = await memory.queryTimeline({ userId, limit: 10 });
    expect(result.states.length).toBe(1);
    expect(result.states[0].stateId).toBe('state_1');
  });

  test('should chain states with previous/next references', async () => {
    const state1 = {
      stateId: 'state_1',
      userId,
      timestamp: Date.now() - 2000,
      type: 'prediction' as const,
      content: { result: 'neutral' },
      properties: { fortune: 50 },
      confidence: 0.5,
    };

    const state2 = {
      stateId: 'state_2',
      userId,
      timestamp: Date.now(),
      type: 'prediction' as const,
      content: { result: 'positive' },
      properties: { fortune: 70 },
      confidence: 0.7,
      previousStateId: 'state_1',
    };

    await memory.saveState(state1);
    await memory.saveState(state2);

    const result = await memory.queryTimeline({ userId });
    expect(result.states.length).toBe(2);

    const retrieved1 = result.states.find(s => s.stateId === 'state_1');
    const retrieved2 = result.states.find(s => s.stateId === 'state_2');
    expect(retrieved2?.previousStateId).toBe('state_1');
  });

  test('should query by time range', async () => {
    const now = Date.now();
    const state1 = {
      stateId: 'state_1',
      userId,
      timestamp: now - 100000,
      type: 'prediction' as const,
      content: {},
      properties: {},
      confidence: 0.8,
    };

    const state2 = {
      stateId: 'state_2',
      userId,
      timestamp: now - 50000,
      type: 'prediction' as const,
      content: {},
      properties: {},
      confidence: 0.6,
    };

    const state3 = {
      stateId: 'state_3',
      userId,
      timestamp: now,
      type: 'prediction' as const,
      content: {},
      properties: {},
      confidence: 0.9,
    };

    await memory.saveState(state1);
    await memory.saveState(state2);
    await memory.saveState(state3);

    const result = await memory.queryTimeline({
      userId,
      startTime: now - 60000,
      endTime: now,
    });

    expect(result.states.length).toBe(2);
  });

  test('should inherit state from history', async () => {
    const state1 = {
      stateId: 'state_1',
      userId,
      timestamp: Date.now() - 3000,
      type: 'prediction' as const,
      content: {},
      properties: { baseProperty: 50 },
      confidence: 0.7,
    };

    const state2 = {
      stateId: 'state_2',
      userId,
      timestamp: Date.now() - 2000,
      type: 'prediction' as const,
      content: {},
      properties: { baseProperty: 60 },
      confidence: 0.75,
      previousStateId: 'state_1',
    };

    const state3 = {
      stateId: 'state_3',
      userId,
      timestamp: Date.now(),
      type: 'prediction' as const,
      content: {},
      properties: { baseProperty: 70 },
      confidence: 0.8,
      previousStateId: 'state_2',
    };

    await memory.saveState(state1);
    await memory.saveState(state2);
    await memory.saveState(state3);

    const inheritance = await memory.inheritState('state_3', 3);

    expect(inheritance.sourceStates.length).toBeGreaterThanOrEqual(2);
    expect(inheritance.inheritanceStrength).toBeGreaterThan(0);
    expect(inheritance.inheritedProperties.baseProperty).toBeDefined();
  });

  test('should find historical resonance', async () => {
    const now = Date.now();

    for (let i = 0; i < 5; i++) {
      const state = {
        stateId: `state_${i}`,
        userId,
        timestamp: now - (365 - i) * 24 * 60 * 60 * 1000,
        type: 'prediction' as const,
        content: {},
        properties: { pattern: 'high_fortune' },
        confidence: 0.7 + i * 0.05,
      };
      await memory.saveState(state);
    }

    const resonances = await memory.findResonance(userId, { pattern: 'high_fortune' });

    expect(resonances.length).toBeGreaterThan(0);
    expect(resonances[0].occurrences).toBeGreaterThanOrEqual(2);
  });

  test('should predict next event', async () => {
    const now = Date.now();

    for (let i = 0; i < 3; i++) {
      const state = {
        stateId: `state_${i}`,
        userId,
        timestamp: now - (3 - i) * 24 * 60 * 60 * 1000,
        type: 'prediction' as const,
        content: {},
        properties: { fortune: 50 + i * 10 },
        confidence: 0.7 + i * 0.05,
      };
      await memory.saveState(state);
    }

    const prediction = await memory.predictNext(userId);

    expect(prediction).not.toBeNull();
    expect(prediction!.confidence).toBeGreaterThan(0);
    expect(prediction!.basedOnPattern).toBeDefined();
  });

  test('should get event continuity', async () => {
    await memory.saveEvent({
      eventId: 'event_1',
      userId,
      timestamp: Date.now() - 2000,
      type: 'prediction',
      content: { first: true },
    });

    await memory.saveEvent({
      eventId: 'event_2',
      userId,
      timestamp: Date.now() - 1000,
      type: 'prediction',
      content: { second: true },
      sourceStateId: 'state_1',
    });

    await memory.saveEvent({
      eventId: 'event_3',
      userId,
      timestamp: Date.now(),
      type: 'prediction',
      content: { third: true },
      sourceStateId: 'state_2',
    });

    const continuity = await memory.getEventContinuity('event_2');

    expect(continuity).not.toBeNull();
    expect(continuity!.currentEvent.eventId).toBe('event_2');
    expect(continuity!.relationship).toBe('sequential');
    expect(continuity!.continuity).toBeGreaterThan(0);
  });

  test('should create snapshot', async () => {
    const state1 = {
      stateId: 'state_1',
      userId,
      timestamp: Date.now() - 1000,
      type: 'prediction' as const,
      content: {},
      properties: { fortune: 80 },
      confidence: 0.8,
    };

    const state2 = {
      stateId: 'state_2',
      userId,
      timestamp: Date.now(),
      type: 'prediction' as const,
      content: {},
      properties: { fortune: 85 },
      confidence: 0.85,
      previousStateId: 'state_1',
    };

    await memory.saveState(state1);
    await memory.saveState(state2);

    const snapshot = await memory.createSnapshot(userId, 'Recent high fortune predictions');

    expect(snapshot).toBeDefined();
    expect(snapshot.snapshotId).toBeDefined();
    expect(snapshot.summary).toBe('Recent high fortune predictions');
  });
});
