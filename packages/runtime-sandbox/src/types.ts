/**
 * Runtime Sandbox - 类型定义
 */

export interface SandboxConfig {
  maxMemoryMB: number;
  maxExecutionTimeMS: number;
  maxIterations: number;
  enableConsole: boolean;
  allowedGlobals: string[];
  forbiddenKeywords: string[];
}

export interface SandboxContext {
  [key: string]: any;
}

export interface SandboxResult {
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
}

export interface SandboxMetrics {
  memoryUsage: number;
  executionTime: number;
  iterations: number;
  violations: SandboxViolation[];
}

export interface SandboxViolation {
  type: 'memory' | 'time' | 'iteration' | 'forbidden' | 'undefined';
  message: string;
  timestamp: number;
}
