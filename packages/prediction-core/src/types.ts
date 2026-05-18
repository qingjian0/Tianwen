/**
 * 推演核心类型定义
 */

import { z } from 'zod';
import { PredictionCategory, PredictionMode, PipelineStage } from './constants';
import { Signal, SignalSource } from '@tianwen/signal-system';
import { WeightConfig } from '@tianwen/weight-system';

export interface PredictionContext {
  id: string;
  question: string;
  category: PredictionCategory;
  systems: SignalSource[];
  timestamp: Date;
  userContext?: Record<string, unknown>;
  weightConfig: WeightConfig;
  mode: PredictionMode;
  metadata?: Record<string, unknown>;
}

export const PredictionContextSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: z.nativeEnum(PredictionCategory),
  systems: z.array(z.nativeEnum(SignalSource)),
  timestamp: z.date(),
  userContext: z.record(z.unknown()).optional(),
  weightConfig: z.any(),
  mode: z.nativeEnum(PredictionMode),
  metadata: z.record(z.unknown()).optional()
});

export interface PredictionOutput {
  id: string;
  contextId: string;
  summary: string;
  probability: number;
  fortuneLevel: string;
  timingWindows: TimingWindow[];
  keySignals: Signal[];
  risks: string[];
  opportunities: string[];
  suggestions: string[];
  confidence: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface TimingWindow {
  id: string;
  start: Date;
  end: Date;
  strength: number;
  description?: string;
  tags?: string[];
}

export const TimingWindowSchema = z.object({
  id: z.string(),
  start: z.date(),
  end: z.date(),
  strength: z.number().min(0).max(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export interface PipelineState {
  stage: PipelineStage;
  context?: PredictionContext;
  signals: Signal[];
  outputs?: PredictionOutput;
  errors: string[];
  warnings: string[];
}

export interface PredictionInput {
  question: string;
  category?: PredictionCategory;
  systems?: SignalSource[];
  mode?: PredictionMode;
  weightConfig?: Partial<WeightConfig>;
  userContext?: Record<string, unknown>;
}
