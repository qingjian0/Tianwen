/**
 * 共振引擎类型定义
 */

import { z } from 'zod';
import { ResonanceType } from './constants';
import { Signal, SignalSource } from '@tianwen/signal-system';

export interface ResonanceResult {
  type: ResonanceType;
  score: number;
  confidence: number;
  label: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export const ResonanceResultSchema = z.object({
  type: z.nativeEnum(ResonanceType),
  score: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  label: z.string(),
  description: z.string(),
  timestamp: z.date(),
  metadata: z.record(z.unknown()).optional()
});

export interface SignalComparison {
  sourceA: SignalSource;
  sourceB: SignalSource;
  signalsA: Signal[];
  signalsB: Signal[];
  resonance: ResonanceResult;
}

export interface ResonanceAnalysis {
  overall: ResonanceResult;
  comparisons: SignalComparison[];
  harmonySignals: Signal[];
  conflictSignals: Signal[];
  recommendations: string[];
}
