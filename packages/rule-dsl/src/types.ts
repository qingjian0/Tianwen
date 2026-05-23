/**
 * Rule DSL 类型定义
 */

export type TokenType =
  | "IDENTIFIER"
  | "NUMBER"
  | "STRING"
  | "BOOLEAN"
  | "NULL"
  | "LBRACE"
  | "RBRACE"
  | "LPAREN"
  | "RPAREN"
  | "LBRACKET"
  | "RBRACKET"
  | "COMMA"
  | "COLON"
  | "SEMICOLON"
  | "DOT"
  | "PLUS"
  | "MINUS"
  | "MULTIPLY"
  | "DIVIDE"
  | "MODULO"
  | "ASSIGN"
  | "PLUS_ASSIGN"
  | "MINUS_ASSIGN"
  | "MULTIPLY_ASSIGN"
  | "DIVIDE_ASSIGN"
  | "EQ"
  | "NEQ"
  | "LT"
  | "GT"
  | "LTE"
  | "GTE"
  | "AND"
  | "OR"
  | "NOT"
  | "IF"
  | "THEN"
  | "RULE"
  | "CATEGORY"
  | "DESCRIPTION"
  | "PRIORITY"
  | "EOF"
  | "NEWLINE";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

// AST 节点类型
export type ASTNodeType =
  | "Program"
  | "RuleDefinition"
  | "Property"
  | "IfStatement"
  | "ThenStatement"
  | "BinaryExpression"
  | "UnaryExpression"
  | "Identifier"
  | "MemberExpression"
  | "CallExpression"
  | "NumberLiteral"
  | "StringLiteral"
  | "BooleanLiteral"
  | "NullLiteral";

export interface ASTNode {
  type: ASTNodeType;
}

export interface ProgramNode extends ASTNode {
  type: "Program";
  rules: RuleDefinitionNode[];
}

export interface RuleDefinitionNode extends ASTNode {
  type: "RuleDefinition";
  name: string;
  properties: PropertyNode[];
  conditions: IfStatementNode[];
  effects: ThenStatementNode[];
}

export interface PropertyNode extends ASTNode {
  type: "Property";
  key: string;
  value: ExpressionNode;
}

export interface IfStatementNode extends ASTNode {
  type: "IfStatement";
  condition: ExpressionNode;
}

export interface ThenStatementNode extends ASTNode {
  type: "ThenStatement";
  effect: ExpressionNode;
}

export type ExpressionNode =
  | BinaryExpressionNode
  | UnaryExpressionNode
  | IdentifierNode
  | MemberExpressionNode
  | CallExpressionNode
  | NumberLiteralNode
  | StringLiteralNode
  | BooleanLiteralNode
  | NullLiteralNode;

export interface BinaryExpressionNode extends ASTNode {
  type: "BinaryExpression";
  operator:
    | "=="
    | "!="
    | "<"
    | ">"
    | "<="
    | ">="
    | "&&"
    | "||"
    | "+"
    | "-"
    | "*"
    | "/"
    | "%";
  left: ExpressionNode;
  right: ExpressionNode;
}

export interface UnaryExpressionNode extends ASTNode {
  type: "UnaryExpression";
  operator: "!" | "-" | "+";
  operand: ExpressionNode;
}

export interface IdentifierNode extends ASTNode {
  type: "Identifier";
  name: string;
}

export interface MemberExpressionNode extends ASTNode {
  type: "MemberExpression";
  object: ExpressionNode;
  property: IdentifierNode;
}

export interface CallExpressionNode extends ASTNode {
  type: "CallExpression";
  callee: ExpressionNode;
  arguments: ExpressionNode[];
}

export interface NumberLiteralNode extends ASTNode {
  type: "NumberLiteral";
  value: number;
}

export interface StringLiteralNode extends ASTNode {
  type: "StringLiteral";
  value: string;
}

export interface BooleanLiteralNode extends ASTNode {
  type: "BooleanLiteral";
  value: boolean;
}

export interface NullLiteralNode extends ASTNode {
  type: "NullLiteral";
  value: null;
}

// 执行上下文
export interface ExecutionContext {
  [key: string]: any;
}

// 执行结果
export interface ExecutionResult {
  success: boolean;
  effects: Record<string, any>;
  matched: boolean;
  errors?: string[];
}
