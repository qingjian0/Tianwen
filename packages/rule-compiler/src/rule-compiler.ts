/**
 * Rule Compiler - 规则即时编译器
 * 将 DSL AST 编译为高性能 JavaScript 函数
 */

import {
  ProgramNode,
  RuleDefinitionNode,
  ExpressionNode,
  BinaryExpressionNode,
  IdentifierNode,
  CallExpressionNode,
} from "@tianwen/rule-dsl";
import {
  CompiledRule,
  CompiledProgram,
  PredicateFunction,
  EffectFunction,
  CompilationStats,
  OptimizationResult,
} from "./types";

export class RuleCompiler {
  private constantFoldingCache: Map<string, any> = new Map();
  private compiledRules: Map<string, CompiledRule> = new Map();
  private stats: CompilationStats = {
    totalRules: 0,
    compiledRules: 0,
    optimizations: [],
    compilationTime: 0,
    cacheHits: 0,
  };

  compileProgram(program: ProgramNode): CompiledProgram {
    const startTime = performance.now();
    const compiledRules: CompiledRule[] = [];
    const constants: Record<string, any> = {};

    for (const rule of program.rules) {
      const compiled = this.compileRule(rule);
      if (compiled) {
        compiledRules.push(compiled);
        this.compiledRules.set(rule.name, compiled);
      }
    }

    compiledRules.sort((a, b) => b.priority - a.priority);

    const hotRules = new Map<string, CompiledRule>();
    for (const rule of compiledRules.slice(0, 10)) {
      hotRules.set(rule.name, rule);
    }

    this.stats.compilationTime = performance.now() - startTime;
    this.stats.totalRules = program.rules.length;
    this.stats.compiledRules = compiledRules.length;

    return {
      rules: compiledRules,
      constants,
      hotRules,
      compilationTime: this.stats.compilationTime,
    };
  }

  compileRule(ruleNode: RuleDefinitionNode): CompiledRule | null {
    try {
      const predicate = this.compilePredicate(ruleNode);
      const effect = this.compileEffect(ruleNode);

      const priority = this.extractPriority(ruleNode);
      const category = this.extractCategory(ruleNode);

      const compileFn = (context: Record<string, any>) => {
        if (predicate(context)) {
          const updates = effect(context);
          return { matched: true, updates };
        }
        return { matched: false, updates: {} };
      };

      return {
        ruleId: ruleNode.name,
        name: ruleNode.name,
        priority,
        category,
        compileFn,
        predicate,
        effect,
      };
    } catch (error) {
      console.error(`Failed to compile rule ${ruleNode.name}:`, error);
      return null;
    }
  }

  private compilePredicate(ruleNode: RuleDefinitionNode): PredicateFunction {
    if (ruleNode.conditions.length === 0) {
      return () => true;
    }

    if (ruleNode.conditions.length === 1) {
      const condition = ruleNode.conditions[0].condition;
      return (context: Record<string, any>) => {
        return this.evaluateExpression(condition, context) as boolean;
      };
    }

    return (context: Record<string, any>) => {
      for (const ifStmt of ruleNode.conditions) {
        const result = this.evaluateExpression(ifStmt.condition, context);
        if (!result) {
          return false;
        }
      }
      return true;
    };
  }

  private compileEffect(ruleNode: RuleDefinitionNode): EffectFunction {
    if (ruleNode.effects.length === 0) {
      return () => ({});
    }

    return (context: Record<string, any>) => {
      const updates: Record<string, any> = {};

      for (const thenStmt of ruleNode.effects) {
        const effectResult = this.evaluateExpression(thenStmt.effect, context);
        if (
          effectResult &&
          typeof effectResult === "object" &&
          !Array.isArray(effectResult)
        ) {
          Object.assign(updates, effectResult);
        }
      }

      return updates;
    };
  }

  private evaluateExpression(
    expr: ExpressionNode,
    context: Record<string, any>,
  ): any {
    switch (expr.type) {
      case "BinaryExpression":
        return this.evaluateBinaryExpression(
          expr as BinaryExpressionNode,
          context,
        );
      case "Identifier":
        return context[(expr as IdentifierNode).name];
      case "NumberLiteral":
        return (expr as any).value;
      case "StringLiteral":
        return (expr as any).value;
      case "BooleanLiteral":
        return (expr as any).value;
      case "CallExpression":
        return this.evaluateCallExpression(expr as CallExpressionNode, context);
      default:
        return null;
    }
  }

  private evaluateBinaryExpression(
    expr: BinaryExpressionNode,
    context: Record<string, any>,
  ): any {
    const left = this.evaluateExpression(expr.left, context);
    const right = this.evaluateExpression(expr.right, context);

    switch (expr.operator) {
      case "==":
        return left === right;
      case "!=":
        return left !== right;
      case "<":
        return left < right;
      case ">":
        return left > right;
      case "<=":
        return left <= right;
      case ">=":
        return left >= right;
      case "&&":
        return left && right;
      case "||":
        return left || right;
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      default:
        return null;
    }
  }

  private evaluateCallExpression(
    expr: CallExpressionNode,
    context: Record<string, any>,
  ): any {
    const callee = expr.callee as IdentifierNode;
    const args = expr.arguments.map((arg) =>
      this.evaluateExpression(arg, context),
    );

    switch (callee.name) {
      case "wuxingSheng":
        return this.wuxingSheng(args[0], args[1]);
      case "wuxingKe":
        return this.wuxingKe(args[0], args[1]);
      case "zhiHe":
        return this.zhiHe(args[0], args[1]);
      case "zhiChong":
        return this.zhiChong(args[0], args[1]);
      default:
        return null;
    }
  }

  private wuxingSheng(wuxing: string, target: string): boolean {
    const relations: Record<string, string[]> = {
      木: ["火", "土"],
      火: ["土", "金"],
      土: ["金", "水"],
      金: ["水", "木"],
      水: ["木", "火"],
    };
    return relations[wuxing]?.[0] === target;
  }

  private wuxingKe(wuxing: string, target: string): boolean {
    const relations: Record<string, string[]> = {
      木: ["火", "土"],
      火: ["土", "金"],
      土: ["金", "水"],
      金: ["水", "木"],
      水: ["木", "火"],
    };
    return relations[wuxing]?.[1] === target;
  }

  private zhiHe(zhi1: string, zhi2: string): boolean {
    const he: Record<string, string> = {
      子: "丑",
      丑: "子",
      寅: "亥",
      亥: "寅",
      卯: "戌",
      戌: "卯",
      辰: "酉",
      酉: "辰",
      巳: "申",
      申: "巳",
      午: "未",
      未: "午",
    };
    return he[zhi1] === zhi2;
  }

  private zhiChong(zhi1: string, zhi2: string): boolean {
    const chong: Record<string, string> = {
      子: "午",
      午: "子",
      丑: "未",
      未: "丑",
      寅: "申",
      申: "寅",
      卯: "酉",
      酉: "卯",
      辰: "戌",
      戌: "辰",
      巳: "亥",
      亥: "巳",
    };
    return chong[zhi1] === zhi2;
  }

  private extractPriority(ruleNode: RuleDefinitionNode): number {
    for (const prop of ruleNode.properties) {
      if (prop.key === "priority") {
        const value = this.evaluateExpression(prop.value, {});
        if (typeof value === "number") return value;
        if (typeof value === "string") {
          const priorityMap: Record<string, number> = {
            critical: 100,
            high: 80,
            medium: 50,
            low: 20,
          };
          return priorityMap[value] || 50;
        }
      }
    }
    return 50;
  }

  private extractCategory(ruleNode: RuleDefinitionNode): string {
    for (const prop of ruleNode.properties) {
      if (prop.key === "category") {
        return this.evaluateExpression(prop.value, {}) as string;
      }
    }
    return "general";
  }

  getCompiledRule(name: string): CompiledRule | undefined {
    return this.compiledRules.get(name);
  }

  getStats(): CompilationStats {
    return { ...this.stats };
  }

  clearCache(): void {
    this.constantFoldingCache.clear();
    this.compiledRules.clear();
    this.stats = {
      totalRules: 0,
      compiledRules: 0,
      optimizations: [],
      compilationTime: 0,
      cacheHits: 0,
    };
  }
}
