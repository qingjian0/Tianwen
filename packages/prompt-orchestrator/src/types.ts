/**
 * Prompt 编排器类型定义
 */

import { z } from "zod";
import { PromptLayer, OutputMode } from "./constants";
import { PredictionContext } from "@tianwen/prediction-core";
import { FusionResult } from "@tianwen/fusion-engine";
import { ProbabilityScore } from "@tianwen/probability-engine";

export interface PromptSection {
  layer: PromptLayer;
  content: string;
  priority: number;
}

export interface AssembledPrompt {
  sections: PromptSection[];
  fullText: string;
  context: PredictionContext;
  fusionResult?: FusionResult;
  outputMode: OutputMode;
  metadata?: Record<string, unknown>;
}

export interface PromptTemplate {
  id: string;
  name: string;
  layers: Partial<Record<PromptLayer, string>>;
  defaultMode: OutputMode;
  category: string;
}

export interface OrchestrationConfig {
  includeLayers: PromptLayer[];
  outputMode: OutputMode;
  maxLength?: number;
  tone?: "formal" | "friendly" | "analytical";
}
