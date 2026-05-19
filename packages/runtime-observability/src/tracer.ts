/**
 * Execution Tracer - 执行追踪器
 */

import { ExecutionTrace, NodeTiming } from './types';

export class ExecutionTracer {
  private traces: Map<string, ExecutionTrace> = new Map();
  private activeTraces: Map<string, NodeTiming[]> = new Map();

  startTrace(traceId: string): void {
    this.activeTraces.set(traceId, []);
  }

  recordNode(timing: NodeTiming): void {
    const activeTimings = this.activeTraces.get(timing.nodeId.split('-')[0]);
    if (activeTimings) {
      activeTimings.push(timing);
    }
  }

  endTrace(traceId: string, result: any, context: Record<string, any>): ExecutionTrace {
    const timings = this.activeTraces.get(traceId) || [];
    this.activeTraces.delete(traceId);

    const totalDuration = timings.reduce((sum, t) => sum + t.duration, 0);

    const trace: ExecutionTrace = {
      traceId,
      timestamp: Date.now(),
      nodes: timings,
      totalDuration,
      context,
      result,
    };

    this.traces.set(traceId, trace);
    return trace;
  }

  getTrace(traceId: string): ExecutionTrace | undefined {
    return this.traces.get(traceId);
  }

  getRecentTraces(count: number = 100): ExecutionTrace[] {
    return Array.from(this.traces.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }

  clear(): void {
    this.traces.clear();
    this.activeTraces.clear();
  }
}
