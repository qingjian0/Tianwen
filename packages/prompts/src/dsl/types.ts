/**
 * Prompt DSL 类型定义
 */

export interface PromptDSL {
  question: string;
  systems: string[];
  weights: Record<string, number>;
  focus: string[];
  timing?: {
    start?: Date;
    end?: Date;
  };
  style?: "conservative" | "balanced" | "aggressive";
  outputMode?: "concise" | "detailed" | "narrative";
}

export type PromptStyle = "conservative" | "balanced" | "aggressive";
export type OutputMode = "concise" | "detailed" | "narrative";
