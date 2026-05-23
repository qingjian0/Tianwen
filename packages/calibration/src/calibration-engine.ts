/**
 * Calibration Engine - 概率校准引擎
 */

import {
  RuleCalibrationData,
  CalibrationConfig,
  CalibrationResult,
} from "./types";

const DEFAULT_CONFIG: CalibrationConfig = {
  learningRate: 0.1,
  minConfidence: 0.1,
  maxConfidence: 0.99,
  decayFactor: 0.99,
};

export class CalibrationEngine {
  private config: CalibrationConfig;
  private calibrationData: Map<string, RuleCalibrationData> = new Map();

  constructor(config: Partial<CalibrationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  recordOutcome(ruleId: string, predicted: boolean, actual: boolean) {
    let data = this.calibrationData.get(ruleId);
    if (!data) {
      data = {
        ruleId,
        totalMatches: 0,
        correctMatches: 0,
        incorrectMatches: 0,
        historicalConfidence: 0.5,
        currentConfidence: 0.5,
      };
    }

    data.totalMatches++;
    if (predicted === actual) {
      data.correctMatches++;
    } else {
      data.incorrectMatches++;
    }

    this.calibrationData.set(ruleId, data);
  }

  calibrate(): CalibrationResult {
    const adjustedRules: Array<{
      ruleId: string;
      oldConfidence: number;
      newConfidence: number;
    }> = [];
    let totalAccuracy = 0;
    let count = 0;

    for (const data of this.calibrationData.values()) {
      const oldConfidence = data.currentConfidence;
      const accuracy =
        data.totalMatches > 0 ? data.correctMatches / data.totalMatches : 0.5;

      const adjustment = (accuracy - oldConfidence) * this.config.learningRate;
      let newConfidence = oldConfidence + adjustment;

      newConfidence = Math.max(
        this.config.minConfidence,
        Math.min(this.config.maxConfidence, newConfidence),
      );

      data.historicalConfidence =
        data.historicalConfidence * this.config.decayFactor +
        oldConfidence * (1 - this.config.decayFactor);
      data.currentConfidence = newConfidence;

      adjustedRules.push({
        ruleId: data.ruleId,
        oldConfidence,
        newConfidence,
      });

      totalAccuracy += accuracy;
      count++;
    }

    return {
      overallAccuracy: count > 0 ? totalAccuracy / count : 0.5,
      adjustedRules,
    };
  }

  getConfidence(ruleId: string): number {
    const data = this.calibrationData.get(ruleId);
    return data ? data.currentConfidence : 0.5;
  }

  getCalibrationData(ruleId: string): RuleCalibrationData | undefined {
    return this.calibrationData.get(ruleId);
  }

  getAllCalibrationData(): RuleCalibrationData[] {
    return Array.from(this.calibrationData.values());
  }

  reset() {
    this.calibrationData.clear();
  }
}
