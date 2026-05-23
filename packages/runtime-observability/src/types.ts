/**
 * Runtime Observability - 类型定义
 */

export interface RuntimeMetrics {
  timestamp: number;
  activeExecutions: number;
  totalExecutions: number;
  averageExecutionTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface NodeTiming {
  nodeId: string;
  nodeType: string;
  duration: number;
  startTime: number;
  endTime: number;
  status: "completed" | "failed" | "skipped";
}

export interface RuleHitStats {
  ruleId: string;
  hits: number;
  misses: number;
  totalExecutionTime: number;
  averageExecutionTime: number;
  lastHit: number;
}

export interface ExecutionTrace {
  traceId: string;
  timestamp: number;
  nodes: NodeTiming[];
  totalDuration: number;
  context: Record<string, any>;
  result: any;
}

export interface FlamegraphNode {
  name: string;
  value: number;
  children: FlamegraphNode[];
}

export interface EventTimeline {
  eventId: string;
  timestamp: number;
  event: string;
  data: any;
  duration?: number;
}
