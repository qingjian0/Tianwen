/**
 * 时间引擎类型定义
 */

import { z } from "zod";
import { TimeStrength, TimeHorizon } from "./constants";

export interface TimingWindow {
  id: string;
  start: Date;
  end: Date;
  strength: number;
  strengthLevel: TimeStrength;
  horizon: TimeHorizon;
  description?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export const TimingWindowSchema = z.object({
  id: z.string(),
  start: z.date(),
  end: z.date(),
  strength: z.number().min(0).max(1),
  strengthLevel: z.nativeEnum(TimeStrength),
  horizon: z.nativeEnum(TimeHorizon),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export interface TimingAnalysis {
  currentWindow: TimingWindow;
  upcomingWindows: TimingWindow[];
  historicalPatterns?: string[];
  recommendations: string[];
}

export interface TimingFactors {
  currentPosition: number;
  trendDirection: number;
  momentum: number;
  cyclePhase: number;
}
