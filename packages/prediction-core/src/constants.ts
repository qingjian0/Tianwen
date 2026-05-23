/**
 * 推演核心常量
 */

export enum PredictionCategory {
  INVESTMENT = "investment",
  RELATIONSHIP = "relationship",
  CAREER = "career",
  HEALTH = "health",
  DECISION = "decision",
  TIMING = "timing",
  GENERAL = "general",
}

export enum PredictionMode {
  SINGLE_SYSTEM = "single_system",
  MULTI_SYSTEM = "multi_system",
  FUSION = "fusion",
}

export enum PipelineStage {
  INPUT = "input",
  PREPROCESSING = "preprocessing",
  SYSTEM_EXECUTION = "system_execution",
  FUSION = "fusion",
  PROBABILITY_SCORING = "probability_scoring",
  INTERPRETATION = "interpretation",
  COMPLETE = "complete",
}

export const PREDICTION_CATEGORIES = Object.values(PredictionCategory);
export const PREDICTION_MODES = Object.values(PredictionMode);
