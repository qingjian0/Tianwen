/**
 * Calibration Engine - 规则置信度校准
 * 实现贝叶斯更新和自适应权重调整
 */

import {
  CalibrationConfig,
  RuleCalibration,
  CalibrationResult,
  CalibrationReport,
  PredictionOutcome,
} from './types';

const DEFAULT_CONFIG: CalibrationConfig = {
  learningRate: 0.1,
  minConfidence: 0.1,
  maxConfidence: 0.99,
  decayFactor: 0.98,
  convergenceThreshold: 0.01,
};

export class CalibrationEngine {
  private config: CalibrationConfig;
  private calibrations: Map<string, RuleCalibration> = new Map();
  private outcomes: PredictionOutcome[] = [];

  constructor(config: Partial<CalibrationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  recordOutcome(outcome: PredictionOutcome): void {
    this.outcomes.push(outcome);

    let calibration = this.calibrations.get(outcome.ruleId);
    if (!calibration) {
      calibration = this.createCalibration(outcome.ruleId);
      this.calibrations.set(outcome.ruleId, calibration);
    }

    calibration.totalEvaluations++;
    
    if (outcome.correct) {
      calibration.correctOutcomes++;
    } else {
      calibration.incorrectOutcomes++;
    }

    calibration.lastUpdated = Date.now();
    this.updateConfidence(calibration);
  }

  private createCalibration(ruleId: string): RuleCalibration {
    return {
      ruleId,
      totalEvaluations: 0,
      correctOutcomes: 0,
      incorrectOutcomes: 0,
      currentConfidence: 0.5,
      historicalConfidence: 0.5,
      lastUpdated: Date.now(),
    };
  }

  private updateConfidence(calibration: RuleCalibration): void {
    if (calibration.totalEvaluations < 5) {
      return;
    }

    const accuracy = calibration.correctOutcomes / calibration.totalEvaluations;
    const error = accuracy - calibration.currentConfidence;
    const adjustment = error * this.config.learningRate;

    calibration.historicalConfidence = 
      calibration.historicalConfidence * this.config.decayFactor + 
      calibration.currentConfidence * (1 - this.config.decayFactor);

    let newConfidence = calibration.currentConfidence + adjustment;
    newConfidence = Math.max(
      this.config.minConfidence,
      Math.min(this.config.maxConfidence, newConfidence)
    );

    calibration.currentConfidence = newConfidence;
  }

  calibrate(): CalibrationReport {
    const results: CalibrationResult[] = [];

    for (const calibration of this.calibrations.values()) {
      if (calibration.totalEvaluations < 3) continue;

      const accuracy = calibration.correctOutcomes / calibration.totalEvaluations;
      const oldConfidence = calibration.currentConfidence;

      this.updateConfidence(calibration);

      results.push({
        ruleId: calibration.ruleId,
        oldConfidence,
        newConfidence: calibration.currentConfidence,
        accuracy,
        adjustment: calibration.currentConfidence - oldConfidence,
      });
    }

    const overallAccuracy = results.length > 0
      ? results.reduce((sum, r) => sum + r.accuracy, 0) / results.length
      : 0;

    return {
      timestamp: Date.now(),
      overallAccuracy,
      totalRules: this.calibrations.size,
      calibratedRules: results.length,
      results,
    };
  }

  getConfidence(ruleId: string): number {
    const calibration = this.calibrations.get(ruleId);
    return calibration?.currentConfidence ?? 0.5;
  }

  getCalibration(ruleId: string): RuleCalibration | undefined {
    return this.calibrations.get(ruleId);
  }

  getAllCalibrations(): RuleCalibration[] {
    return Array.from(this.calibrations.values());
  }

  getOutcomes(ruleId?: string): PredictionOutcome[] {
    if (ruleId) {
      return this.outcomes.filter(o => o.ruleId === ruleId);
    }
    return [...this.outcomes];
  }

  reset(): void {
    this.calibrations.clear();
    this.outcomes = [];
  }

  setConfidence(ruleId: string, confidence: number): void {
    let calibration = this.calibrations.get(ruleId);
    if (!calibration) {
      calibration = this.createCalibration(ruleId);
      this.calibrations.set(ruleId, calibration);
    }
    
    calibration.currentConfidence = Math.max(
      this.config.minConfidence,
      Math.min(this.config.maxConfidence, confidence)
    );
  }

  applyBayesianUpdate(
    ruleId: string,
    priorConfidence: number,
    evidence: { success: number; total: number }
  ): number {
    const alpha = evidence.success + 1;
    const beta = evidence.total - evidence.success + 1;
    
    const posteriorMean = alpha / (alpha + beta);
    
    return this.config.learningRate * posteriorMean + 
           (1 - this.config.learningRate) * priorConfidence;
  }
}
