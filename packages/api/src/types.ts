/**
 * API 类型定义
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
  category: string;
  system: 'meihua' | 'liuyao' | 'qimen' | 'bazi' | 'ziwei' | 'fusion';
  mode: 'single' | 'fusion' | 'compare' | 'timeline';
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
  predictionId: string;
  summary: string;
  probability: {
    success: number;
    failure: number;
    confidence: number;
  };
  fortune: {
    level: 'greatFortune' | 'fortune' | 'neutral' | 'warning' | 'danger';
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
  createdAt: string;
}

export interface SignalData {
  id: string;
  description: string;
  polarity: 'positive' | 'negative' | 'neutral' | 'unstable';
  strength: 'high' | 'medium' | 'low';
  source: string;
}

export interface RuleData {
  id: string;
  name: string;
  category: string;
  priority: string;
  source: string;
  confidence: number;
  matched: boolean;
  effects: string[];
}

export interface KnowledgeReference {
  title: string;
  author?: string;
  chapter?: string;
  page?: number;
  quote?: string;
}

export interface TraceStep {
  stage: string;
  timestamp: string;
  action: string;
  result: string;
  duration: number;
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
  result: string;
  fortuneLevel: string;
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
