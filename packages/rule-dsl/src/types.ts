/**
 * Rule DSL - 类型定义
 * Phase 8: Runtime Engine
 */

export type LiteralValue = string | number | boolean | null;

export interface LiteralNode {
  type: 'literal';
  value: LiteralValue;
}

export interface IdentifierNode {
  type: 'identifier';
  name: string;
}

export interface MemberAccessNode {
  type: 'memberAccess';
  object: IdentifierNode;
  property: string;
}

export interface BinaryOpNode {
  type: 'binaryOp';
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | '&&' | '||' | '+' | '-' | '*' | '/';
  left: ExpressionNode;
  right: ExpressionNode;
}

export interface UnaryOpNode {
  type: 'unaryOp';
  operator: '!' | '-';
  operand: ExpressionNode;
}

export interface CallExpressionNode {
  type: 'call';
  callee: IdentifierNode;
  arguments: ExpressionNode[];
}

export type ExpressionNode =
  | LiteralNode
  | IdentifierNode
  | MemberAccessNode
  | BinaryOpNode
  | UnaryOpNode
  | CallExpressionNode;

export interface ConditionNode {
  type: 'condition';
  expression: ExpressionNode;
}

export interface EffectNode {
  type: 'effect';
  effectType: 'signal' | 'probability' | 'fortune' | 'timing' | 'confidence';
  action: string;
  value: ExpressionNode;
  description?: string;
}

export interface RuleNode {
  type: 'rule';
  name: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  metadata?: Record<string, any>;
  conditions: ConditionNode[];
  effects: EffectNode[];
}

export interface ProgramNode {
  type: 'program';
  rules: RuleNode[];
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export enum TokenType {
  Identifier = 'identifier',
  Number = 'number',
  String = 'string',
  Boolean = 'boolean',
  Null = 'null',
  
  If = 'if',
  Then = 'then',
  Rule = 'rule',
  Priority = 'priority',
  Category = 'category',
  Description = 'description',
  
  And = '&&',
  Or = '||',
  Not = '!',
  Eq = '==',
  Neq = '!=',
  Gt = '>',
  Lt = '<',
  Gte = '>=',
  Lte = '<=',
  Plus = '+',
  Minus = '-',
  Mul = '*',
  Div = '/',
  Assign = '=',
  
  Lparen = '(',
  Rparen = ')',
  Lbrace = '{',
  Rbrace = '}',
  Lbracket = '[',
  Rbracket = ']',
  Colon = ':',
  Semicolon = ';',
  Comma = ',',
  Dot = '.',
  
  Eof = 'eof',
  Unknown = 'unknown'
}
