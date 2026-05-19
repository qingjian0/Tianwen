/**
 * Runtime State - 类型定义
 */

export interface StorageAdapter {
  initialize(): Promise<void>;
  close(): Promise<void>;
  
  // Key-Value operations
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  keys(pattern?: string): Promise<string[]>;

  // List operations
  listPush(key: string, ...values: any[]): Promise<number>;
  listRange(key: string, start: number, stop: number): Promise<any[]>;
  listLength(key: string): Promise<number>;

  // Hash operations
  hashSet(key: string, field: string, value: any): Promise<void>;
  hashGet(key: string, field: string): Promise<any | null>;
  hashGetAll(key: string): Promise<Record<string, any>>;
  hashDelete(key: string, field: string): Promise<void>;

  // TTL operations
  expire(key: string, seconds: number): Promise<void>;
  ttl(key: string): Promise<number>;
}

export interface ExecutionContextStore {
  save(executionId: string, context: Record<string, any>): Promise<void>;
  load(executionId: string): Promise<Record<string, any> | null>;
  delete(executionId: string): Promise<void>;
  list(): Promise<string[]>;
}

export interface RuleCache {
  get(ruleId: string): Promise<any | null>;
  set(ruleId: string, rule: any): Promise<void>;
  invalidate(pattern?: string): Promise<void>;
  stats(): Promise<{ size: number; hits: number; misses: number }>;
}

export interface PredictionHistory {
  save(prediction: PredictionRecord): Promise<string>;
  get(id: string): Promise<PredictionRecord | null>;
  query(filter: PredictionFilter): Promise<PredictionRecord[]>;
  delete(id: string): Promise<void>;
}

export interface PredictionRecord {
  id: string;
  timestamp: number;
  input: any;
  output: any;
  context: Record<string, any>;
  executionDuration: number;
  metadata: Record<string, any>;
}

export interface PredictionFilter {
  startTime?: number;
  endTime?: number;
  system?: string;
  limit?: number;
  offset?: number;
}
