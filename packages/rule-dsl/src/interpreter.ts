/**
 * Rule DSL - 解释器
 * Phase 8: Runtime Engine
 */

import {
  ExpressionNode,
  LiteralNode,
  IdentifierNode,
  MemberAccessNode,
  BinaryOpNode,
  UnaryOpNode,
  CallExpressionNode,
  ConditionNode,
  EffectNode,
  RuleNode,
  ProgramNode
} from './types';

export type Context = Record<string, any>;

export interface ExecutionResult {
  success: boolean;
  effects: AppliedEffect[];
  errors: string[];
}

export interface AppliedEffect {
  type: 'signal' | 'probability' | 'fortune' | 'timing' | 'confidence';
  action: string;
  value: any;
}

export class Interpreter {
  private context: Context;
  private builtins: Record<string, (...args: any[]) => any>;

  constructor(context: Context = {}) {
    this.context = context;
    this.builtins = {
      // 五行生克
      wuxingSheng: (a: string, b: string) => {
        const sheng: Record<string, string> = {
          '木': '火',
          '火': '土',
          '土': '金',
          '金': '水',
          '水': '木'
        };
        return sheng[a] === b;
      },
      wuxingKe: (a: string, b: string) => {
        const ke: Record<string, string> = {
          '木': '土',
          '土': '水',
          '水': '火',
          '火': '金',
          '金': '木'
        };
        return ke[a] === b;
      },
      // 干支关系
      ganHe: (a: string, b: string) => {
        const he: Record<string, string> = {
          '甲': '己', '己': '甲',
          '乙': '庚', '庚': '乙',
          '丙': '辛', '辛': '丙',
          '丁': '壬', '壬': '丁',
          '戊': '癸', '癸': '戊'
        };
        return he[a] === b;
      },
      zhiHe: (a: string, b: string) => {
        const he: Record<string, string> = {
          '子': '丑', '丑': '子',
          '寅': '亥', '亥': '寅',
          '卯': '戌', '戌': '卯',
          '辰': '酉', '酉': '辰',
          '巳': '申', '申': '巳',
          '午': '未', '未': '午'
        };
        return he[a] === b;
      },
      zhiChong: (a: string, b: string) => {
        const chong: Record<string, string> = {
          '子': '午', '午': '子',
          '丑': '未', '未': '丑',
          '寅': '申', '申': '寅',
          '卯': '酉', '酉': '卯',
          '辰': '戌', '戌': '辰',
          '巳': '亥', '亥': '巳'
        };
        return chong[a] === b;
      },
      min: Math.min,
      max: Math.max,
      sum: (...args: number[]) => args.reduce((a, b) => a + b, 0),
      avg: (...args: number[]) => args.reduce((a, b) => a + b, 0) / args.length
    };
  }

  interpretProgram(program: ProgramNode): ExecutionResult {
    const effects: AppliedEffect[] = [];
    const errors: string[] = [];

    for (const rule of program.rules) {
      try {
        const result = this.interpretRule(rule);
        if (result.success) {
          effects.push(...result.effects);
        }
      } catch (err) {
        errors.push(err instanceof Error ? err.message : String(err));
      }
    }

    return {
      success: errors.length === 0,
      effects,
      errors
    };
  }

  interpretRule(rule: RuleNode): ExecutionResult {
    const effects: AppliedEffect[] = [];
    const errors: string[] = [];

    try {
      const allConditionsSatisfied = rule.conditions.every(condition => {
        try {
          const result = this.interpretCondition(condition);
          return Boolean(result);
        } catch (err) {
          errors.push(err instanceof Error ? err.message : String(err));
          return false;
        }
      });

      if (allConditionsSatisfied) {
        for (const effect of rule.effects) {
          try {
            const appliedEffect = this.interpretEffect(effect);
            effects.push(appliedEffect);
          } catch (err) {
            errors.push(err instanceof Error ? err.message : String(err));
          }
        }
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }

    return {
      success: errors.length === 0,
      effects,
      errors
    };
  }

  interpretCondition(condition: ConditionNode): any {
    return this.interpretExpression(condition.expression);
  }

  interpretEffect(effect: EffectNode): AppliedEffect {
    const value = this.interpretExpression(effect.value);

    return {
      type: effect.effectType,
      action: effect.action,
      value
    };
  }

  interpretExpression(expr: ExpressionNode): any {
    switch (expr.type) {
      case 'literal':
        return (expr as LiteralNode).value;

      case 'identifier':
        return this.resolveIdentifier((expr as IdentifierNode).name);

      case 'memberAccess':
        return this.resolveMemberAccess(expr as MemberAccessNode);

      case 'binaryOp':
        return this.interpretBinaryOp(expr as BinaryOpNode);

      case 'unaryOp':
        return this.interpretUnaryOp(expr as UnaryOpNode);

      case 'call':
        return this.interpretCall(expr as CallExpressionNode);

      default:
        throw new Error(`Unknown expression type: ${expr.type}`);
    }
  }

  private resolveIdentifier(name: string): any {
    if (name in this.builtins) {
      return this.builtins[name];
    }
    if (name in this.context) {
      return this.context[name];
    }
    throw new Error(`Undefined identifier: ${name}`);
  }

  private resolveMemberAccess(expr: MemberAccessNode): any {
    let obj: any;
    if (expr.object.type === 'identifier') {
      obj = this.resolveIdentifier((expr.object as IdentifierNode).name);
    } else {
      obj = this.interpretExpression(expr.object);
    }

    if (obj === null || obj === undefined) {
      throw new Error(`Cannot access property '${expr.property}' of null/undefined`);
    }

    if (!(expr.property in obj)) {
      throw new Error(`Property '${expr.property}' does not exist on object`);
    }

    return obj[expr.property];
  }

  private interpretBinaryOp(expr: BinaryOpNode): any {
    const left = this.interpretExpression(expr.left);
    const right = this.interpretExpression(expr.right);

    switch (expr.operator) {
      case '==':
        return left === right;
      case '!=':
        return left !== right;
      case '>':
        return left > right;
      case '<':
        return left < right;
      case '>=':
        return left >= right;
      case '<=':
        return left <= right;
      case '&&':
        return Boolean(left) && Boolean(right);
      case '||':
        return Boolean(left) || Boolean(right);
      case '+':
        return Number(left) + Number(right);
      case '-':
        return Number(left) - Number(right);
      case '*':
        return Number(left) * Number(right);
      case '/':
        return Number(left) / Number(right);
      default:
        throw new Error(`Unknown binary operator: ${expr.operator}`);
    }
  }

  private interpretUnaryOp(expr: UnaryOpNode): any {
    const operand = this.interpretExpression(expr.operand);

    switch (expr.operator) {
      case '!':
        return !Boolean(operand);
      case '-':
        return -Number(operand);
      default:
        throw new Error(`Unknown unary operator: ${expr.operator}`);
    }
  }

  private interpretCall(expr: CallExpressionNode): any {
    let fn: any;
    if (expr.callee.type === 'identifier') {
      fn = this.resolveIdentifier(expr.callee.name);
    } else {
      throw new Error('Only identifier functions are supported');
    }

    if (typeof fn !== 'function') {
      throw new Error(`${expr.callee.name} is not a function`);
    }

    const args = expr.arguments.map(arg => this.interpretExpression(arg));
    return fn(...args);
  }

  setContext(context: Context): void {
    this.context = context;
  }

  updateContext(updates: Context): void {
    this.context = { ...this.context, ...updates };
  }

  getContext(): Context {
    return { ...this.context };
  }
}
