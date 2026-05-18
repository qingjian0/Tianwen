/**
 * 推演数据结构Zod验证Schema
 */

import { z } from 'zod';

// TimeWindow Schema
export const TimeWindowSchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
  strength: z.number().min(0).max(100),
  description: z.string(),
});

// SystemAnalysis Schema
export const SystemAnalysisSchema = z.object({
  systemName: z.string(),
  favorable: z.array(z.string()),
  unfavorable: z.array(z.string()),
  signals: z.record(z.any()),
  confidence: z.number().min(0).max(100),
});

// PredictionResult Schema
export const PredictionResultSchema = z.object({
  id: z.string().uuid(),
  question: z.string().min(1),
  systems: z.array(z.string()).min(1),
  timestamp: z.coerce.date(),
  summary: z.string(),
  probability: z.number().min(0).max(100),
  risk: z.number().min(0).max(100),
  resonance: z.number().min(0).max(100),
  timing: z.array(TimeWindowSchema),
  suggestions: z.array(z.string()),
  analyses: z.array(SystemAnalysisSchema),
  rawData: z.record(z.any()).optional(),
});

// PredictionInput Schema
export const PredictionInputSchema = z.object({
  question: z.string().min(1),
  systems: z.array(z.string()).min(1),
  context: z.record(z.any()).optional(),
  timestamp: z.coerce.date().optional(),
});
