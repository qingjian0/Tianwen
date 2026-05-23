/**
 * 概率引擎类型定义
 */

import { z } from "zod";
import {
  ProbabilityLevel,
  MIN_PROBABILITY,
  MAX_PROBABILITY,
} from "./constants";
import { Signal } from "@tianwen/signal-system";

export interface ProbabilityScore {
  successProbability: number;
  failureProbability: number;
  uncertainty: number;
  volatility: number;
  confidence: number;
  level: ProbabilityLevel;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export const ProbabilityScoreSchema = z.object({
  successProbability: z.number().min(MIN_PROBABILITY).max(MAX_PROBABILITY),
  failureProbability: z.number().min(MIN_PROBABILITY).max(MAX_PROBABILITY),
  uncertainty: z.number().min(MIN_PROBABILITY).max(MAX_PROBABILITY),
  volatility: z.number().min(MIN_PROBABILITY).max(MAX_PROBABILITY),
  confidence: z.number().min(MIN_PROBABILITY).max(MAX_PROBABILITY),
  level: z.nativeEnum(ProbabilityLevel),
  timestamp: z.date(),
  metadata: z.record(z.unknown()).optional(),
});

export interface ProbabilityFactors {
  signalStrength: number;
  signalConsistency: number;
  timingAlignment: number;
  resonanceScore: number;
  historicalSimilarity?: number;
}

export interface ProbabilityAnalysis {
  score: ProbabilityScore;
  factors: ProbabilityFactors;
  contributingSignals: Signal[];
  riskIndicators: string[];
  opportunityIndicators: string[];
}
