/**
 * Replay Recorder - 录制器
 */

import {
  ReplaySession,
  ReplayFrame,
  ReplayRecorder,
  Snapshot,
} from './types';
import { DeterministicRandom } from './deterministic-random';

export class ReplayRecorderImpl implements ReplayRecorder {
  private sessions: Map<string, ReplaySession> = new Map();
  private currentSessionId: string | null = null;
  private frameSequence: number = 0;
  private deterministicRandom: DeterministicRandom;

  constructor(seed?: number) {
    this.deterministicRandom = new DeterministicRandom(seed || DeterministicRandom.fromTimestamp());
  }

  startSession(input: any, metadata: Record<string, any> = {}): string {
    this.currentSessionId = this.generateId();
    this.frameSequence = 0;

    const session: ReplaySession = {
      sessionId: this.currentSessionId,
      startTime: Date.now(),
      input,
      frames: [],
      finalContext: {},
      result: null,
      metadata: {
        ...metadata,
        randomSeed: this.deterministicRandom.seed,
      },
    };

    this.sessions.set(this.currentSessionId, session);
    return this.currentSessionId;
  }

  recordFrame(event: string, data: any, context: Record<string, any>): void {
    if (!this.currentSessionId) {
      throw new Error('No active session. Call startSession first.');
    }

    const session = this.sessions.get(this.currentSessionId)!;
    
    const frame: ReplayFrame = {
      frameId: this.generateId(),
      timestamp: Date.now(),
      sequence: this.frameSequence++,
      event,
      data,
      context: this.deepClone(context),
    };

    session.frames.push(frame);
  }

  endSession(result: any, finalContext: Record<string, any>): ReplaySession {
    if (!this.currentSessionId) {
      throw new Error('No active session. Call startSession first.');
    }

    const session = this.sessions.get(this.currentSessionId)!;
    session.endTime = Date.now();
    session.result = result;
    session.finalContext = this.deepClone(finalContext);

    this.currentSessionId = null;
    return session;
  }

  getSession(sessionId: string): ReplaySession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): ReplaySession[] {
    return Array.from(this.sessions.values());
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  getRandomSeed(): number {
    return this.deterministicRandom.seed;
  }
}
