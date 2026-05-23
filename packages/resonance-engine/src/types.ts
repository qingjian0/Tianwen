/**
 * Multi-System Resonance Engine v2 - 类型定义
 */

export type SystemType = "bazi" | "liuyao" | "meihua" | "qimen" | "ziwei";

export interface SystemInput {
  system: SystemType;
  signals: SystemSignal[];
  properties: Record<string, any>;
  confidence: number;
}

export interface SystemSignal {
  signalId: string;
  type: string;
  value: any;
  weight: number;
  wuxing?: string;
  timeline?: string;
}

export interface ConflictReasoning {
  conflictId: string;
  systemA: SystemType;
  systemB: SystemType;
  signalA: SystemSignal;
  signalB: SystemSignal;
  severity: number;
  source: string;
  resolution?: ConflictResolution;
}

export interface ConflictResolution {
  strategy: "hierarchical" | "temporal" | "weighting" | "contextual";
  winner: SystemType;
  loser: SystemType;
  confidence: number;
  reasoning: string;
}

export interface FusionReasoning {
  fusionId: string;
  inputSystems: SystemType[];
  harmonizedSignals: SystemSignal[];
  contradictions: ConflictReasoning[];
  fusedConclusion: FusedConclusion;
  confidence: number;
  trace: FusionTrace[];
}

export interface FusedConclusion {
  statement: string;
  probability: number;
  supportingSystems: SystemType[];
  contradictingSystems: SystemType[];
  finalConfidence: number;
}

export interface FusionTrace {
  step: number;
  action: string;
  systems: SystemType[];
  result: any;
  confidence: number;
}

export interface ResonanceTrace {
  traceId: string;
  timestamp: number;
  inputs: SystemInput[];
  conflicts: ConflictReasoning[];
  resolutions: ConflictResolution[];
  fusionReasoning: FusionReasoning;
  finalResult: FusedConclusion;
  executionTime: number;
}

export interface ResonanceContext {
  userId?: string;
  question?: string;
  historicalData?: any[];
  currentTime?: number;
}

export interface SystemHierarchy {
  system: SystemType;
  priority: number;
  weight: number;
}

export interface ResonanceScoring {
  harmony: number;
  conflict: number;
  neutral: number;
  total: number;
}

export interface SystemAgreement {
  systems: SystemType[];
  agreementLevel: number;
  supportingSignals: SystemSignal[];
}

export interface TemporalAlignment {
  system: SystemType;
  timeDimension: string;
  alignment: number;
  relevance: number;
}
