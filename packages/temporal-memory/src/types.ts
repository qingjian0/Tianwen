/**
 * Temporal Memory System - 类型定义
 */

export interface TimelineState {
  stateId: string;
  userId: string;
  timestamp: number;
  type: "prediction" | "event" | "milestone" | "reflection";
  content: any;
  properties: Record<string, any>;
  confidence: number;
  previousStateId?: string;
  nextStateId?: string;
}

export interface TimelineSnapshot {
  snapshotId: string;
  userId: string;
  stateIds: string[];
  timestamp: number;
  summary: string;
  keyEvents: string[];
}

export interface TemporalQuery {
  userId: string;
  eventType?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
  offset?: number;
  includeProperties?: string[];
}

export interface TimelineEvent {
  eventId: string;
  userId: string;
  timestamp: number;
  type: string;
  content: any;
  sourceStateId?: string;
  relatedEventIds: string[];
}

export interface EventContinuity {
  previousEvent?: TimelineEvent;
  currentEvent: TimelineEvent;
  nextEvent?: TimelineEvent;
  continuity: number;
  relationship: string;
}

export interface StateInheritance {
  inheritedProperties: Record<string, any>;
  inheritanceStrength: number;
  sourceStates: string[];
}

export interface HistoricalResonance {
  pattern: string;
  occurrences: number;
  lastOccurrence: number;
  averageConfidence: number;
  resonanceStrength: number;
}

export interface TemporalPrediction {
  predictedEvent: TimelineEvent;
  confidence: number;
  basedOnPattern: string;
  expectedTimeframe: string;
}

export interface TimelineQueryResult {
  states: TimelineState[];
  snapshots: TimelineSnapshot[];
  events: TimelineEvent[];
  statistics: {
    totalStates: number;
    eventTypes: Record<string, number>;
    averageConfidence: number;
    timeRange: { start: number; end: number };
  };
}
