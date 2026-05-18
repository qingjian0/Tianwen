/**
 * 融合引擎类型定义
 */

import { z } from 'zod';
import { FusionStrategy } from './constants';
import { Signal, SignalSource } from '@tianwen/signal-system';
import { WeightConfig } from '@tianwen/weight-system';
import { ProbabilityScore } from '@tianwen/probability-engine';
import { ResonanceAnalysis } from '@tianwen/resonance-engine';

export interface SystemResult {
  source: SignalSource;
  signals: Signal[];
  probability?: ProbabilityScore;
  weight: number;
  confidence: number;
}

export const SystemResultSchema = z.object({
  source: z.nativeEnum(SignalSource),
  signals: z.array(z.any()),
  probability: z.any().optional(),
  weight: z.number(),
  confidence: z.number()
});

export interface FusionResult {
  strategy: FusionStrategy;
  fusedSignals: Signal[];
  overallProbability?: ProbabilityScore;
  confidence: number;
  contributions: Record<SignalSource, number>;
  resonanceAnalysis?: ResonanceAnalysis;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export const FusionResultSchema = z.object({
  strategy: z.nativeEnum(FusionStrategy),
  fusedSignals: z.array(z.any()),
  overallProbability: z.any().optional(),
  confidence: z.number(),
  contributions: z.record(z.number()),
  resonanceAnalysis: z.any().optional(),
  timestamp: z.date(),
  metadata: z.record(z.unknown()).optional()
});
