/**
 * 信号系统类型定义
 */

import { z } from "zod";
import { SignalPolarity, SignalStrength, SignalSource } from "./constants";

export interface Signal {
  id: string;
  source: SignalSource;
  polarity: SignalPolarity;
  strength: number;
  timing: {
    start?: Date;
    end?: Date;
  };
  confidence: number;
  description?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export const SignalSchema = z.object({
  id: z.string(),
  source: z.nativeEnum(SignalSource),
  polarity: z.nativeEnum(SignalPolarity),
  strength: z.number().min(0).max(1),
  timing: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }),
  confidence: z.number().min(0).max(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export interface SignalBatch {
  signals: Signal[];
  source: SignalSource;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface SignalAnalysisResult {
  totalSignals: number;
  positiveSignals: Signal[];
  negativeSignals: Signal[];
  neutralSignals: Signal[];
  unstableSignals: Signal[];
  averageStrength: number;
  netPolarity: number;
  dominantPolarity: SignalPolarity;
  confidence: number;
}
