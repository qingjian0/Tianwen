/**
 * Rule DSL 解释器
 */

import {
  ProgramNode,
  RuleDefinitionNode,
  ExpressionNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  IdentifierNode,
  MemberExpressionNode,
  CallExpressionNode,
  ExecutionContext,
  ExecutionResult,
} from "./types";

// 内置五行生克函数
const WUXING_RELATIONS: Record<string, string[]> = {
  木: ["火", "土"],
  火: ["土", "金"],
  土: ["金", "水"],
  金: ["水", "木"],
  水: ["木", "火"],
};

// 干支六合关系
const ZHI_HE: Record<string, string> = {
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

// 干支六冲关系
const ZHI_CHONG: Record<string, string> = {
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

export class Interpreter {
  private context: ExecutionContext;
  private effects: Record<string, any> = {};
  private builtInFunctions: Record<string, (...args: any[]) => any> = {};

  constructor(context: ExecutionContext = {}) {
    this.context = { ...context };
    this.initBuiltInFunctions();
  }

  private initBuiltInFunctions(): void {
    // 五行生克
    this.builtInFunctions["wuxingSheng"] = (
      sheng: string,
      shengZhe: string,
    ): boolean => {
      return WUXING_RELATIONS[sheng]?.[0] === shengZhe;
    };

    this.builtInFunctions["wuxingKe"] = (
      ke: string,
      keZhe: string,
    ): boolean => {
      return WUXING_RELATIONS[ke]?.[1] === keZhe;
    };

    // 干支关系
    this.builtInFunctions["zhiHe"] = (zhi1: string, zhi2: string): boolean => {
      return ZHI_HE[zhi1] === zhi2;
    };

    this.builtInFunctions["zhiChong"] = (
      zhi1: string,
      zhi2: string,
    ): boolean => {
      return ZHI_CHONG[zhi1] === zhi2;
    };

    // 工具函数
    this.builtInFunctions["includes"] = (arr: any[], item: any): boolean => {
      return Array.isArray(arr) && arr.includes(item);
    };

    this.builtInFunctions["length"] = (arr: any[]): number => {
      return Array.isArray(arr) ? arr.length : 0;
    };
  }

  interpretProgram(program: ProgramNode): ExecutionResult {
    let allMatched = true;
    const errors: string[] = [];

    for (const rule of program.rules) {
      const result = this.interpretRule(rule);
      if (!result.matched) {
        allMatched = false;
      }
      if (result.errors) {
        errors.push(...result.errors);
      }
    }

    return {
      success: errors.length === 0,
      matched: allMatched,
      effects: this.effects,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  interpretRule(rule: RuleDefinitionNode): ExecutionResult {
    let allConditionsMet = true;
    const errors: string[] = [];

    try {
      // 检查所有条件
      for (const ifStmt of rule.conditions) {
        const result = this.interpretExpression(ifStmt.condition);
        if (!result) {
          allConditionsMet = false;
          break;
        }
      }

      // 如果条件都满足，执行效果
      if (allConditionsMet) {
        for (const thenStmt of rule.effects) {
          this.interpretEffect(thenStmt.effect);
        }
      }

      return {
        success: true,
        matched: allConditionsMet,
        effects: this.effects,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      return {
        success: false,
        matched: false,
        effects: this.effects,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  private interpretEffect(expr: ExpressionNode): void {
    if (expr.type === "BinaryExpression") {
      const binExpr = expr as BinaryExpressionNode;

      // 处理赋值操作
      if (binExpr.operator === "=") {
        const left = binExpr.left;
        const right = this.interpretExpression(binExpr.right);
        this.assignValue(left, right);
        return;
      }

      // 处理复合赋值
      if (["+=", "-=", "*=", "/="].includes(binExpr.operator)) {
        const left = binExpr.left;
        const currentValue = this.interpretExpression(left);
        const rightValue = this.interpretExpression(binExpr.right);
        let newValue: any;

        switch (binExpr.operator) {
          case "+=":
            newValue = currentValue + rightValue;
            break;
          case "-=":
            newValue = currentValue - rightValue;
            break;
          case "*=":
            newValue = currentValue * rightValue;
            break;
          case "/=":
            newValue = currentValue / rightValue;
            break;
        }

        this.assignValue(left, newValue);
        return;
      }
    }

    // 如果不是赋值，只是执行表达式（虽然 effect 通常应该是赋值）
    this.interpretExpression(expr);
  }

  private assignValue(target: ExpressionNode, value: any): void {
    if (target.type === "Identifier") {
      const id = target as IdentifierNode;
      this.context[id.name] = value;
      this.effects[id.name] = value;
    } else if (target.type === "MemberExpression") {
      const member = target as MemberExpressionNode;
      const obj = this.interpretExpression(member.object);
      if (obj && typeof obj === "object") {
        obj[member.property.name] = value;
        this.effects[`${JSON.stringify(obj)}.${member.property.name}`] = value;
      }
    }
  }

  private interpretExpression(expr: ExpressionNode): any {
    switch (expr.type) {
      case "BinaryExpression":
        return this.interpretBinaryExpression(expr as BinaryExpressionNode);
      case "UnaryExpression":
        return this.interpretUnaryExpression(expr as UnaryExpressionNode);
      case "Identifier":
        return this.interpretIdentifier(expr as IdentifierNode);
      case "MemberExpression":
        return this.interpretMemberExpression(expr as MemberExpressionNode);
      case "CallExpression":
        return this.interpretCallExpression(expr as CallExpressionNode);
      case "NumberLiteral":
        return (expr as any).value;
      case "StringLiteral":
        return (expr as any).value;
      case "BooleanLiteral":
        return (expr as any).value;
      case "NullLiteral":
        return null;
      default:
        throw new Error(`Unknown expression type: ${expr.type}`);
    }
  }

  private interpretBinaryExpression(expr: BinaryExpressionNode): any {
    const left = this.interpretExpression(expr.left);
    const right = this.interpretExpression(expr.right);

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
      case "%":
        return left % right;
      default:
        throw new Error(`Unknown operator: ${expr.operator}`);
    }
  }

  private interpretUnaryExpression(expr: UnaryExpressionNode): any {
    const operand = this.interpretExpression(expr.operand);

    switch (expr.operator) {
      case "!":
        return !operand;
      case "-":
        return -operand;
      case "+":
        return +operand;
      default:
        throw new Error(`Unknown unary operator: ${expr.operator}`);
    }
  }

  private interpretIdentifier(expr: IdentifierNode): any {
    if (expr.name in this.context) {
      return this.context[expr.name];
    }
    if (expr.name in this.effects) {
      return this.effects[expr.name];
    }
    throw new Error(`Undefined variable: ${expr.name}`);
  }

  private interpretMemberExpression(expr: MemberExpressionNode): any {
    const obj = this.interpretExpression(expr.object);
    if (obj && typeof obj === "object") {
      return obj[expr.property.name];
    }
    return undefined;
  }

  private interpretCallExpression(expr: CallExpressionNode): any {
    const callee = expr.callee;
    if (callee.type !== "Identifier") {
      throw new Error("Only identifier function calls are supported");
    }

    const funcName = (callee as IdentifierNode).name;
    const args = expr.arguments.map((arg) => this.interpretExpression(arg));

    if (funcName in this.builtInFunctions) {
      return this.builtInFunctions[funcName](...args);
    }

    throw new Error(`Undefined function: ${funcName}`);
  }

  setContext(context: ExecutionContext): void {
    this.context = { ...context };
  }

  getContext(): ExecutionContext {
    return { ...this.context };
  }

  getEffects(): Record<string, any> {
    return { ...this.effects };
  }

  clearEffects(): void {
    this.effects = {};
  }
}
