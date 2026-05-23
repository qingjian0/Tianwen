/**
 * Temporal Memory System - 长期时间记忆系统
 * 支持过去推演、当前推演、时间演化、状态继承、趋势变化
 */

import {
  TimelineState,
  TimelineSnapshot,
  TemporalQuery,
  TimelineEvent,
  EventContinuity,
  StateInheritance,
  HistoricalResonance,
  TemporalPrediction,
  TimelineQueryResult,
} from "./types";

export class TemporalMemory {
  private states: Map<string, TimelineState> = new Map();
  private userTimelines: Map<string, string[]> = new Map();
  private events: Map<string, TimelineEvent> = new Map();
  private snapshots: Map<string, TimelineSnapshot> = new Map();
  private stateIndex: Map<string, Set<string>> = new Map();

  async saveState(state: TimelineState): Promise<void> {
    const existingNext = this.states.get(state.stateId);
    if (existingNext?.previousStateId) {
      const previous = this.states.get(existingNext.previousStateId);
      if (previous) {
        previous.nextStateId = state.stateId;
      }
    }

    if (state.previousStateId) {
      const previous = this.states.get(state.previousStateId);
      if (previous) {
        previous.nextStateId = state.stateId;
      }
    }

    this.states.set(state.stateId, state);

    if (!this.userTimelines.has(state.userId)) {
      this.userTimelines.set(state.userId, []);
    }
    const timeline = this.userTimelines.get(state.userId)!;
    if (!timeline.includes(state.stateId)) {
      timeline.push(state.stateId);
    }

    this.indexState(state);
  }

  private indexState(state: TimelineState): void {
    if (!this.stateIndex.has(state.type)) {
      this.stateIndex.set(state.type, new Set());
    }
    this.stateIndex.get(state.type)!.add(state.stateId);

    for (const [key, value] of Object.entries(state.properties)) {
      const indexKey = `${key}:${JSON.stringify(value)}`;
      if (!this.stateIndex.has(indexKey)) {
        this.stateIndex.set(indexKey, new Set());
      }
      this.stateIndex.get(indexKey)!.add(state.stateId);
    }
  }

  async saveEvent(event: TimelineEvent): Promise<void> {
    this.events.set(event.eventId, event);
  }

  async createSnapshot(
    userId: string,
    summary: string,
  ): Promise<TimelineSnapshot> {
    const timeline = this.userTimelines.get(userId) || [];
    const snapshotId = `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const recentStates = timeline.slice(-10);
    const keyEvents = this.extractKeyEvents(recentStates);

    const snapshot: TimelineSnapshot = {
      snapshotId,
      userId,
      stateIds: recentStates,
      timestamp: Date.now(),
      summary,
      keyEvents,
    };

    this.snapshots.set(snapshotId, snapshot);
    return snapshot;
  }

  private extractKeyEvents(stateIds: string[]): string[] {
    const keyEvents: string[] = [];

    for (const stateId of stateIds) {
      const state = this.states.get(stateId);
      if (state && state.confidence > 0.7) {
        keyEvents.push(state.stateId);
      }
    }

    return keyEvents;
  }

  async queryTimeline(query: TemporalQuery): Promise<TimelineQueryResult> {
    let stateIds = this.userTimelines.get(query.userId) || [];

    if (query.eventType) {
      const typeIds = this.stateIndex.get(query.eventType) || new Set();
      stateIds = stateIds.filter((id) => typeIds.has(id));
    }

    if (query.startTime || query.endTime) {
      stateIds = stateIds.filter((id) => {
        const state = this.states.get(id);
        if (!state) return false;
        if (query.startTime && state.timestamp < query.startTime) return false;
        if (query.endTime && state.timestamp > query.endTime) return false;
        return true;
      });
    }

    const offset = query.offset || 0;
    const limit = query.limit || 50;
    const paginatedIds = stateIds.slice(offset, offset + limit);

    const states = paginatedIds
      .map((id) => this.states.get(id))
      .filter((s): s is TimelineState => s !== undefined);

    const events = await this.getEventsForStates(paginatedIds);

    const snapshots = Array.from(this.snapshots.values()).filter(
      (s) => s.userId === query.userId,
    );

    const statistics = this.calculateStatistics(states);

    return {
      states,
      snapshots,
      events,
      statistics,
    };
  }

  private async getEventsForStates(
    stateIds: string[],
  ): Promise<TimelineEvent[]> {
    const stateEvents: TimelineEvent[] = [];

    for (const stateId of stateIds) {
      const state = this.states.get(stateId);
      if (state) {
        for (const event of this.events.values()) {
          if (event.sourceStateId === stateId) {
            stateEvents.push(event);
          }
        }
      }
    }

    return stateEvents;
  }

  private calculateStatistics(
    states: TimelineState[],
  ): TimelineQueryResult["statistics"] {
    const eventTypes: Record<string, number> = {};
    let totalConfidence = 0;

    for (const state of states) {
      eventTypes[state.type] = (eventTypes[state.type] || 0) + 1;
      totalConfidence += state.confidence;
    }

    const timestamps = states.map((s) => s.timestamp).sort((a, b) => a - b);

    return {
      totalStates: states.length,
      eventTypes,
      averageConfidence:
        states.length > 0 ? totalConfidence / states.length : 0,
      timeRange: {
        start: timestamps[0] || 0,
        end: timestamps[timestamps.length - 1] || 0,
      },
    };
  }

  async getEventContinuity(eventId: string): Promise<EventContinuity | null> {
    const currentEvent = this.events.get(eventId);
    if (!currentEvent) return null;

    const allEvents = Array.from(this.events.values())
      .filter((e) => e.userId === currentEvent.userId)
      .sort((a, b) => a.timestamp - b.timestamp);

    const currentIndex = allEvents.findIndex((e) => e.eventId === eventId);

    const previousEvent =
      currentIndex > 0 ? allEvents[currentIndex - 1] : undefined;
    const nextEvent =
      currentIndex < allEvents.length - 1
        ? allEvents[currentIndex + 1]
        : undefined;

    let continuity = 0;
    let relationship = "isolated";

    if (previousEvent && nextEvent) {
      const timeDiff = nextEvent.timestamp - previousEvent.timestamp;
      if (timeDiff < 24 * 60 * 60 * 1000) {
        continuity = 0.8;
        relationship = "sequential";
      }
    } else if (previousEvent) {
      continuity = 0.5;
      relationship = "ending";
    } else if (nextEvent) {
      continuity = 0.5;
      relationship = "beginning";
    }

    return {
      previousEvent,
      currentEvent,
      nextEvent,
      continuity,
      relationship,
    };
  }

  async inheritState(
    stateId: string,
    depth: number = 3,
  ): Promise<StateInheritance> {
    const state = this.states.get(stateId);
    if (!state) {
      return {
        inheritedProperties: {},
        inheritanceStrength: 0,
        sourceStates: [],
      };
    }

    const sourceStates: TimelineState[] = [state];
    const visited = new Set<string>([stateId]);
    let currentStateId: string | undefined = state.previousStateId;

    while (
      currentStateId &&
      sourceStates.length < depth &&
      !visited.has(currentStateId)
    ) {
      const prevState = this.states.get(currentStateId);
      if (prevState) {
        sourceStates.push(prevState);
        visited.add(currentStateId);
        currentStateId = prevState.previousStateId;
      } else {
        break;
      }
    }

    const inheritedProperties: Record<string, any> = {};
    let totalConfidence = 0;

    for (let i = 0; i < sourceStates.length; i++) {
      const s = sourceStates[i];
      const weight = Math.pow(0.7, i);

      for (const [key, value] of Object.entries(s.properties)) {
        if (key !== "input" && key !== "signalCount") {
          inheritedProperties[key] = inheritedProperties[key] || [];
          inheritedProperties[key].push({ value, weight, stateId: s.stateId });
        }
      }

      totalConfidence += s.confidence * weight;
    }

    const aggregated: Record<string, any> = {};
    for (const [key, entries] of Object.entries(inheritedProperties)) {
      const arr = entries as Array<{
        value: any;
        weight: number;
        stateId: string;
      }>;
      const weightedSum = arr.reduce(
        (sum, e) =>
          sum + (typeof e.value === "number" ? e.value : 0) * e.weight,
        0,
      );
      const totalWeight = arr.reduce((sum, e) => sum + e.weight, 0);
      aggregated[key] =
        totalWeight > 0 ? weightedSum / totalWeight : arr[0].value;
    }

    return {
      inheritedProperties: aggregated,
      inheritanceStrength:
        sourceStates.length > 0 ? totalConfidence / sourceStates.length : 0,
      sourceStates: sourceStates.map((s) => s.stateId),
    };
  }

  async findResonance(
    userId: string,
    pattern: Partial<TimelineState["properties"]>,
  ): Promise<HistoricalResonance[]> {
    const timeline = this.userTimelines.get(userId) || [];
    const patternStates: TimelineState[] = [];

    for (const stateId of timeline) {
      const state = this.states.get(stateId);
      if (state && this.matchesPattern(state, pattern)) {
        patternStates.push(state);
      }
    }

    const resonances: Map<string, TimelineState[]> = new Map();

    for (let i = 0; i < patternStates.length; i++) {
      for (let j = i + 1; j < patternStates.length; j++) {
        const timeDiff =
          patternStates[j].timestamp - patternStates[i].timestamp;
        const cycleTime = 365 * 24 * 60 * 60 * 1000;

        if (Math.abs(timeDiff % cycleTime) < 7 * 24 * 60 * 60 * 1000) {
          const patternKey = `annual_${Math.floor(timeDiff / cycleTime)}`;
          if (!resonances.has(patternKey)) {
            resonances.set(patternKey, []);
          }
          resonances.get(patternKey)!.push(patternStates[i]);
          resonances.get(patternKey)!.push(patternStates[j]);
        }
      }
    }

    const results: HistoricalResonance[] = [];

    for (const [patternKey, states] of resonances.entries()) {
      const uniqueStates = [...new Set(states)];
      const avgConfidence =
        uniqueStates.reduce((sum, s) => sum + s.confidence, 0) /
        uniqueStates.length;

      results.push({
        pattern: patternKey,
        occurrences: uniqueStates.length,
        lastOccurrence: uniqueStates[uniqueStates.length - 1]?.timestamp || 0,
        averageConfidence: avgConfidence,
        resonanceStrength: uniqueStates.length * avgConfidence,
      });
    }

    return results.sort((a, b) => b.resonanceStrength - a.resonanceStrength);
  }

  private matchesPattern(
    state: TimelineState,
    pattern: Partial<TimelineState["properties"]>,
  ): boolean {
    for (const [key, value] of Object.entries(pattern)) {
      if (state.properties[key] !== value) {
        return false;
      }
    }
    return true;
  }

  async predictNext(
    userId: string,
    baseStateId?: string,
  ): Promise<TemporalPrediction | null> {
    const timeline = this.userTimelines.get(userId) || [];
    if (timeline.length < 3) return null;

    const recentStates = timeline
      .slice(-5)
      .map((id) => this.states.get(id))
      .filter(Boolean) as TimelineState[];

    const trend = this.analyzeTrend(recentStates);

    const lastState = recentStates[recentStates.length - 1];
    const nextTimestamp =
      lastState.timestamp + this.estimateTimeInterval(recentStates);

    const predictedConfidence = Math.min(0.9, lastState.confidence * 0.95);

    return {
      predictedEvent: {
        eventId: `predicted_${Date.now()}`,
        userId,
        timestamp: nextTimestamp,
        type: trend,
        content: { trend, confidence: predictedConfidence },
        relatedEventIds: recentStates.map((s) => s.stateId),
      },
      confidence: predictedConfidence,
      basedOnPattern: trend,
      expectedTimeframe: this.formatTimeframe(nextTimestamp - Date.now()),
    };
  }

  private analyzeTrend(states: TimelineState[]): string {
    if (states.length < 2) return "stable";

    let increasing = 0;
    let decreasing = 0;

    for (let i = 1; i < states.length; i++) {
      if (states[i].confidence > states[i - 1].confidence) {
        increasing++;
      } else if (states[i].confidence < states[i - 1].confidence) {
        decreasing++;
      }
    }

    if (increasing > decreasing) return "improving";
    if (decreasing > increasing) return "declining";
    return "stable";
  }

  private estimateTimeInterval(states: TimelineState[]): number {
    if (states.length < 2) return 30 * 24 * 60 * 60 * 1000;

    const intervals: number[] = [];
    for (let i = 1; i < states.length; i++) {
      intervals.push(states[i].timestamp - states[i - 1].timestamp);
    }

    return intervals.reduce((a, b) => a + b, 0) / intervals.length;
  }

  private formatTimeframe(milliseconds: number): string {
    const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
    if (days < 1) return "today";
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.floor(days / 7)} weeks`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  }

  async getTimeline(
    userId: string,
    limit: number = 50,
  ): Promise<TimelineState[]> {
    const stateIds = this.userTimelines.get(userId) || [];
    return stateIds
      .slice(-limit)
      .map((id) => this.states.get(id))
      .filter((s): s is TimelineState => s !== undefined);
  }

  async deleteUserData(userId: string): Promise<void> {
    const stateIds = this.userTimelines.get(userId) || [];

    for (const stateId of stateIds) {
      this.states.delete(stateId);
    }

    for (const event of this.events.values()) {
      if (event.userId === userId) {
        this.events.delete(event.eventId);
      }
    }

    for (const snapshot of this.snapshots.values()) {
      if (snapshot.userId === userId) {
        this.snapshots.delete(snapshot.snapshotId);
      }
    }

    this.userTimelines.delete(userId);
  }
}
