/**
 * Execution Graph - 类型定义
 */

export type NodeType =
  | 'chronology'
  | 'divination'
  | 'signal'
  | 'rule'
  | 'probability'
  | 'fortune'
  | 'interpretation';

export type NodeStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface ExecutionNode {
  id: string;
  type: NodeType;
  label: string;
  dependencies: string[];
  execute: (context: ExecutionContext) => Promise<any>;
  shouldExecute?: (context: ExecutionContext) => boolean;
}

export interface ExecutionContext {
  [key: string]: any;
}

export interface ExecutionResult {
  nodeId: string;
  status: NodeStatus;
  result?: any;
  error?: string;
  duration: number;
  timestamp: number;
}

export interface GraphExecutionResult {
  success: boolean;
  results: Map<string, ExecutionResult>;
  duration: number;
  finalContext: ExecutionContext;
}

export interface GraphSnapshot {
  executionId: string;
  timestamp: number;
  results: Array<ExecutionResult & { nodeId: string }>;
  context: ExecutionContext;
}
