/**
 * API 类型定义
 * 根据天问系统 API 设计文档 v1.0
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId: string;
}

export interface PredictionRequest {
  question: string;
  category: 'wealth' | 'career' | 'love' | 'market' | string;
  system: 'meihua' | 'liuyao' | 'bazi' | 'qimen' | 'ziwei' | 'fusion';
  mode: 'single' | 'batch';
  timestamp?: string;
  birthInfo?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    gender: 'male' | 'female';
    calendar: 'solar' | 'lunar';
  };
  options?: {
    enableCache?: boolean;
    enableConflictResolution?: boolean;
    includeTrace?: boolean;
  };
}

export interface PredictionResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  submittedAt: string;
  estimatedCompletion?: string;
  output?: PredictionOutput;
}

export interface PredictionOutput {
  summary: string;
  probability: {
    success: number;
    failure: number;
    confidence: number;
  };
  fortune: {
    level: '大吉' | '吉' | '中吉' | '平' | '小凶' | '凶' | '大凶';
    score: number;
    description: string;
  };
  timing: {
    favorable: string[];
    unfavorable: string[];
    optimal?: string;
  };
  signals: SignalData[];
  appliedRules: RuleData[];
  knowledgeReferences: KnowledgeReference[];
  calculationTrace: TraceStep[];
  actionableSuggestions: string[];
}

export interface SignalData {
  name: string;
  value: string;
  confidence: number;
  polarity?: 'positive' | 'negative' | 'neutral';
}

export interface RuleData {
  id: string;
  name: string;
  description: string;
  source?: string;
  priority?: number;
  matched?: boolean;
  effects?: string[];
}

export interface KnowledgeReference {
  source: string;
  chapter?: string;
  page?: number;
  author?: string;
  quote?: string;
}

export interface TraceStep {
  stage: string;
  result: string;
  timestamp?: string;
  duration?: number;
}

export interface HistoryQuery {
  page?: number;
  limit?: number;
  system?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface HistoryItem {
  id: string;
  question: string;
  system: string;
  category: string;
  status: string;
  summary?: string;
  fortuneLevel?: string;
  createdAt: string;
}

export interface RuleQuery {
  category?: string;
  priority?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface RuleResponse {
  items: RuleInfo[];
  total: number;
}

export interface RuleInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: string;
  source: {
    name: string;
    chapter?: string;
    page?: number;
  };
  conditions: ConditionInfo[];
  effects: EffectInfo[];
  confidence: number;
}

export interface ConditionInfo {
  field: string;
  operator: string;
  value: any;
}

export interface EffectInfo {
  type: string;
  action: string;
  value: any;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  services: {
    pipeline: boolean;
    ruleEngine: boolean;
    cache: boolean;
  };
  stats: {
    totalPredictions: number;
    totalRules: number;
    cacheHitRate: number;
  };
}

export interface VersionResponse {
  version: string;
  buildDate: string;
  phases: string[];
  modules: string[];
}

// WebSocket 消息类型
export interface WebSocketMessage {
  channel: 'predictions' | 'rules' | 'system';
  event: string;
  data: any;
  timestamp: string;
}

export interface ProgressUpdate {
  id: string;
  stage: string;
  progress: number;
  message?: string;
}

export interface CompletedUpdate {
  id: string;
  status: 'completed' | 'failed';
  outputUrl: string;
}

export interface SystemStatus {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  totalPredictions: number;
}

export interface WebSocketError {
  code: number;
  message: string;
}
