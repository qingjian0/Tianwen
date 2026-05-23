/**
 * Rule DSL 语法解析器
 */

import {
  Token,
  ProgramNode,
  RuleDefinitionNode,
  PropertyNode,
  IfStatementNode,
  ThenStatementNode,
  ExpressionNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  IdentifierNode,
  MemberExpressionNode,
  CallExpressionNode,
  NumberLiteralNode,
  StringLiteralNode,
  BooleanLiteralNode,
  NullLiteralNode,
} from "./types";
import { Lexer } from "./lexer";

export class Parser {
  private tokens: Token[] = [];
  private position: number = 0;

  constructor(source: string) {
    const lexer = new Lexer(source);
    this.tokens = lexer.tokenize().filter((t) => t.type !== "NEWLINE");
  }

  parse(): ProgramNode {
    const program: ProgramNode = {
      type: "Program",
      rules: [],
    };

    while (!this.isAtEnd()) {
      if (this.check("RULE")) {
        program.rules.push(this.parseRule());
      } else {
        this.advance();
      }
    }

    return program;
  }

  private parseRule(): RuleDefinitionNode {
    this.consume("RULE", "Expected 'rule' keyword");
    const nameToken = this.consume("IDENTIFIER", "Expected rule name");

    this.consume("LBRACE", "Expected '{' after rule name");

    const properties: PropertyNode[] = [];
    const conditions: IfStatementNode[] = [];
    const effects: ThenStatementNode[] = [];

    while (!this.check("RBRACE") && !this.isAtEnd()) {
      if (this.check("IF")) {
        conditions.push(this.parseIf());
      } else if (this.check("THEN")) {
        effects.push(this.parseThen());
      } else if (
        this.check("CATEGORY") ||
        this.check("DESCRIPTION") ||
        this.check("PRIORITY")
      ) {
        properties.push(this.parseProperty());
      } else {
        this.advance();
      }
    }

    this.consume("RBRACE", "Expected '}' after rule body");

    return {
      type: "RuleDefinition",
      name: nameToken.value,
      properties,
      conditions,
      effects,
    };
  }

  private parseProperty(): PropertyNode {
    const key = this.advance();
    this.consume("COLON", "Expected ':' after property key");
    const value = this.parseExpression();
    if (this.check("SEMICOLON")) {
      this.advance();
    }

    return {
      type: "Property",
      key: key.value,
      value,
    };
  }

  private parseIf(): IfStatementNode {
    this.consume("IF", "Expected 'if' keyword");
    const condition = this.parseExpression();
    if (this.check("SEMICOLON")) {
      this.advance();
    }

    return {
      type: "IfStatement",
      condition,
    };
  }

  private parseThen(): ThenStatementNode {
    this.consume("THEN", "Expected 'then' keyword");
    const effect = this.parseEffect();
    if (this.check("SEMICOLON")) {
      this.advance();
    }

    return {
      type: "ThenStatement",
      effect,
    };
  }

  private parseEffect(): ExpressionNode {
    // 支持 assignment 和 compound assignment
    const left = this.parsePrimary();

    if (
      this.check("ASSIGN") ||
      this.check("PLUS_ASSIGN") ||
      this.check("MINUS_ASSIGN") ||
      this.check("MULTIPLY_ASSIGN") ||
      this.check("DIVIDE_ASSIGN")
    ) {
      const operator = this.advance();
      const right = this.parseExpression();

      return {
        type: "BinaryExpression",
        operator:
          operator.type === "ASSIGN"
            ? "="
            : operator.type === "PLUS_ASSIGN"
              ? "+="
              : operator.type === "MINUS_ASSIGN"
                ? "-="
                : operator.type === "MULTIPLY_ASSIGN"
                  ? "*="
                  : "/=",
        left,
        right,
      } as unknown as BinaryExpressionNode;
    }

    return left;
  }

  private parseExpression(): ExpressionNode {
    return this.parseOr();
  }

  private parseOr(): ExpressionNode {
    let left = this.parseAnd();

    while (this.check("OR")) {
      const operator = this.advance();
      const right = this.parseAnd();
      left = {
        type: "BinaryExpression",
        operator: "||",
        left,
        right,
      };
    }

    return left;
  }

  private parseAnd(): ExpressionNode {
    let left = this.parseEquality();

    while (this.check("AND")) {
      const operator = this.advance();
      const right = this.parseEquality();
      left = {
        type: "BinaryExpression",
        operator: "&&",
        left,
        right,
      };
    }

    return left;
  }

  private parseEquality(): ExpressionNode {
    let left = this.parseComparison();

    while (this.check("EQ") || this.check("NEQ")) {
      const operator = this.advance();
      const right = this.parseComparison();
      left = {
        type: "BinaryExpression",
        operator: operator.type === "EQ" ? "==" : "!=",
        left,
        right,
      };
    }

    return left;
  }

  private parseComparison(): ExpressionNode {
    let left = this.parseTerm();

    while (
      this.check("LT") ||
      this.check("GT") ||
      this.check("LTE") ||
      this.check("GTE")
    ) {
      const operator = this.advance();
      const right = this.parseTerm();
      left = {
        type: "BinaryExpression",
        operator:
          operator.type === "LT"
            ? "<"
            : operator.type === "GT"
              ? ">"
              : operator.type === "LTE"
                ? "<="
                : ">=",
        left,
        right,
      };
    }

    return left;
  }

  private parseTerm(): ExpressionNode {
    let left = this.parseFactor();

    while (this.check("PLUS") || this.check("MINUS")) {
      const operator = this.advance();
      const right = this.parseFactor();
      left = {
        type: "BinaryExpression",
        operator: operator.type === "PLUS" ? "+" : "-",
        left,
        right,
      };
    }

    return left;
  }

  private parseFactor(): ExpressionNode {
    let left = this.parseUnary();

    while (
      this.check("MULTIPLY") ||
      this.check("DIVIDE") ||
      this.check("MODULO")
    ) {
      const operator = this.advance();
      const right = this.parseUnary();
      left = {
        type: "BinaryExpression",
        operator:
          operator.type === "MULTIPLY"
            ? "*"
            : operator.type === "DIVIDE"
              ? "/"
              : "%",
        left,
        right,
      };
    }

    return left;
  }

  private parseUnary(): ExpressionNode {
    if (this.check("NOT") || this.check("MINUS") || this.check("PLUS")) {
      const operator = this.advance();
      const operand = this.parseUnary();
      return {
        type: "UnaryExpression",
        operator:
          operator.type === "NOT" ? "!" : operator.type === "MINUS" ? "-" : "+",
        operand,
      };
    }

    return this.parseCallMember();
  }

  private parseCallMember(): ExpressionNode {
    let expr = this.parsePrimary();

    while (true) {
      if (this.check("LPAREN")) {
        expr = this.parseCall(expr);
      } else if (this.check("DOT")) {
        this.advance();
        const property = this.consume(
          "IDENTIFIER",
          "Expected property name after '.'",
        );
        expr = {
          type: "MemberExpression",
          object: expr,
          property: {
            type: "Identifier",
            name: property.value,
          },
        };
      } else {
        break;
      }
    }

    return expr;
  }

  private parseCall(callee: ExpressionNode): ExpressionNode {
    this.consume("LPAREN", "Expected '(' after function name");
    const args: ExpressionNode[] = [];

    if (!this.check("RPAREN")) {
      do {
        args.push(this.parseExpression());
      } while (this.check("COMMA") && this.advance());
    }

    this.consume("RPAREN", "Expected ')' after function arguments");

    return {
      type: "CallExpression",
      callee,
      arguments: args,
    };
  }

  private parsePrimary(): ExpressionNode {
    if (this.check("BOOLEAN")) {
      const token = this.advance();
      return {
        type: "BooleanLiteral",
        value: token.value === "true",
      };
    }

    if (this.check("NULL")) {
      this.advance();
      return {
        type: "NullLiteral",
        value: null,
      };
    }

    if (this.check("NUMBER")) {
      const token = this.advance();
      return {
        type: "NumberLiteral",
        value: parseFloat(token.value),
      };
    }

    if (this.check("STRING")) {
      const token = this.advance();
      return {
        type: "StringLiteral",
        value: token.value,
      };
    }

    if (this.check("IDENTIFIER")) {
      const token = this.advance();
      return {
        type: "Identifier",
        name: token.value,
      };
    }

    if (this.check("LPAREN")) {
      this.advance();
      const expr = this.parseExpression();
      this.consume("RPAREN", "Expected ')' after expression");
      return expr;
    }

    throw new Error(
      `Unexpected token: ${this.peek().value} at line ${this.peek().line}`,
    );
  }

  // 辅助方法
  private consume(type: string, message: string): Token {
    if (this.check(type as any)) {
      return this.advance();
    }
    throw new Error(`${message} at line ${this.peek().line}`);
  }

  private check(type: any): boolean {
    if (this.isAtEnd()) {
      return false;
    }
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.position++;
    }
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === "EOF";
  }

  private peek(): Token {
    return this.tokens[this.position];
  }

  private previous(): Token {
    return this.tokens[this.position - 1];
  }
}
