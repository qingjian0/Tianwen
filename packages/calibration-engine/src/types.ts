/**
 * Calibration Engine - 类型定义
 */

export interface RuleCalibration {
  ruleId: string;
  totalEvaluations: number;
  correctOutcomes: number;
  incorrectOutcomes: number;
  currentConfidence: number;
  historicalConfidence: number;
  lastUpdated: number;
}

export interface CalibrationResult {
  ruleId: string;
  oldConfidence: number;
  newConfidence: number;
  accuracy: number;
  adjustment: number;
}

export interface CalibrationReport {
  timestamp: number;
  overallAccuracy: number;
  totalRules: number;
  calibratedRules: number;
  results: CalibrationResult[];
}

export interface PredictionOutcome {
  predictionId: string;
  timestamp: number;
  ruleId: string;
  predictedValue: any;
  actualOutcome: any;
  correct: boolean;
}

export interface CalibrationConfig {
  learningRate: number;
  minConfidence: number;
  maxConfidence: number;
  decayFactor: number;
  convergenceThreshold: number;
}
