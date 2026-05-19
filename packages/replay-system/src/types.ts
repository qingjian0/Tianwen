/**
 * Replay System - 类型定义
 */

export interface ReplayFrame {
  frameId: string;
  timestamp: number;
  sequence: number;
  event: string;
  data: any;
  context: Record<string, any>;
}

export interface ReplaySession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  input: any;
  frames: ReplayFrame[];
  finalContext: Record<string, any>;
  result: any;
  metadata: Record<string, any>;
}

export interface ReplayRecorder {
  startSession(input: any, metadata?: Record<string, any>): string;
  recordFrame(event: string, data: any, context: Record<string, any>): void;
  endSession(result: any, finalContext: Record<string, any>): ReplaySession;
  getSession(sessionId: string): ReplaySession | undefined;
}

export interface Snapshot {
  snapshotId: string;
  sessionId: string;
  timestamp: number;
  frameIndex: number;
  context: Record<string, any>;
  data: any;
}

export interface ReplayPlayer {
  replay(sessionId: string): Promise<any>;
  replayToFrame(sessionId: string, frameIndex: number): Promise<any>;
  getSnapshot(snapshotId: string): Snapshot | undefined;
}

export interface DeterministicRandom {
  seed: number;
  state: number;
  next(): number;
  nextRange(min: number, max: number): number;
}
