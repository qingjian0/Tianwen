/**
 * Calibration Engine - 类型定义
 */

export interface RuleCalibrationData {
  ruleId: string;
  totalMatches: number;
  correctMatches: number;
  incorrectMatches: number;
  historicalConfidence: number;
  currentConfidence: number;
}

export interface CalibrationConfig {
  learningRate: number;
  minConfidence: number;
  maxConfidence: number;
  decayFactor: number;
}

export interface CalibrationResult {
  overallAccuracy: number;
  adjustedRules: Array<{
    ruleId: string;
    oldConfidence: number;
    newConfidence: number;
  }>;
}
