/**
 * Cognitive Engine - 类型定义
 */

export type InferenceNodeType =
  | "signal"
  | "state_transition"
  | "symbolic_reasoning"
  | "temporal_propagation"
  | "event_hypothesis"
  | "confidence_update"
  | "contradiction"
  | "conclusion";

export interface InferenceNode {
  nodeId: string;
  type: InferenceNodeType;
  label: string;
  content: any;
  sources: string[];
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface InferenceEdge {
  edgeId: string;
  from: string;
  to: string;
  relation: "causes" | "supports" | "contradicts" | "temporal" | "derived";
  weight: number;
}

export interface InferenceTrace {
  traceId: string;
  timestamp: number;
  nodes: Map<string, InferenceNode>;
  edges: InferenceEdge[];
  rootSignals: string[];
  conclusions: string[];
  contradictions: Array<{ nodeA: string; nodeB: string; resolution?: string }>;
}

export interface SymbolicState {
  stateId: string;
  properties: Map<string, any>;
  previousStateId?: string;
  nextStateId?: string;
  confidence: number;
  timestamp: number;
}

export interface ReasoningContext {
  input: any;
  signals: any[];
  rules: any[];
  temporal?: TemporalContext;
}

export interface TemporalContext {
  pastStates: SymbolicState[];
  currentState: SymbolicState;
  predictions: SymbolicState[];
}

export interface ConfidenceUpdate {
  nodeId: string;
  oldConfidence: number;
  newConfidence: number;
  reason: string;
  propagation: boolean;
}

export interface ContradictionHandleResult {
  resolved: boolean;
  strategy: "hierarchical" | "temporal" | "weighting" | "none";
  winner?: string;
  loser?: string;
  resolution?: string;
}

export interface CognitiveExecutionResult {
  success: boolean;
  trace: InferenceTrace;
  finalState: SymbolicState;
  conclusions: any[];
  executionTime: number;
}
