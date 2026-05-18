/**
 * 吉凶引擎类型定义
 */

import { z } from 'zod';
import { FortuneLevel } from './constants';
import { Signal } from '@tianwen/signal-system';
import { ProbabilityScore } from '@tianwen/probability-engine';

export interface FortuneScore {
  level: FortuneLevel;
  score: number;
  confidence: number;
  label: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export const FortuneScoreSchema = z.object({
  level: z.nativeEnum(FortuneLevel),
  score: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  label: z.string(),
  description: z.string(),
  timestamp: z.date(),
  metadata: z.record(z.unknown()).optional()
});

export interface FortuneFactors {
  positiveSignalRatio: number;
  signalStrength: number;
  probabilityAlignment: number;
  timingSupport: number;
}

export interface FortuneAnalysis {
  score: FortuneScore;
  factors: FortuneFactors;
  contributingSignals: Signal[];
  warnings: string[];
  recommendations: string[];
}
