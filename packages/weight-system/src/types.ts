/**
 * 权重系统类型定义
 */

import { z } from "zod";
import { WeightType, SystemType, MIN_WEIGHT, MAX_WEIGHT } from "./constants";

export interface Weight {
  type: WeightType;
  key: string;
  value: number;
  description?: string;
  source?: string;
  timestamp?: Date;
}

export const WeightSchema = z.object({
  type: z.nativeEnum(WeightType),
  key: z.string(),
  value: z.number().min(MIN_WEIGHT).max(MAX_WEIGHT),
  description: z.string().optional(),
  source: z.string().optional(),
  timestamp: z.date().optional(),
});

export interface WeightConfig {
  systemWeights: Record<SystemType, number>;
  contextWeights: Record<string, number>;
  timingWeights: Record<string, number>;
  dynamicWeights: Record<string, number>;
}

export const WeightConfigSchema = z.object({
  systemWeights: z.record(
    z.nativeEnum(SystemType),
    z.number().min(MIN_WEIGHT).max(MAX_WEIGHT),
  ),
  contextWeights: z.record(z.number().min(MIN_WEIGHT).max(MAX_WEIGHT)),
  timingWeights: z.record(z.number().min(MIN_WEIGHT).max(MAX_WEIGHT)),
  dynamicWeights: z.record(z.number().min(MIN_WEIGHT).max(MAX_WEIGHT)),
});

export interface WeightedScore {
  value: number;
  weights: Weight[];
  totalWeight: number;
  normalizedScore: number;
}
