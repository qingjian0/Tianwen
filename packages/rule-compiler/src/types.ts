/**
 * Rule Compiler - 类型定义
 */

import {
  ProgramNode,
  RuleDefinitionNode,
  ExpressionNode,
} from "@tianwen/rule-dsl";

export interface CompiledRule {
  ruleId: string;
  name: string;
  priority: number;
  category: string;
  compileFn: CompiledFunction;
  predicate: PredicateFunction;
  effect: EffectFunction;
}

export type CompiledFunction = (context: Record<string, any>) => any;
export type PredicateFunction = (context: Record<string, any>) => boolean;
export type EffectFunction = (
  context: Record<string, any>,
) => Record<string, any>;

export interface CompiledProgram {
  rules: CompiledRule[];
  constants: Record<string, any>;
  hotRules: Map<string, CompiledRule>;
  compilationTime: number;
}

export interface OptimizationResult {
  type: string;
  original: string;
  optimized: string;
  improvement: number;
}

export interface CompilationStats {
  totalRules: number;
  compiledRules: number;
  optimizations: OptimizationResult[];
  compilationTime: number;
  cacheHits: number;
}
