/**
 * Rule DSL - 语法解析器
 * Phase 8: Runtime Engine
 */

import {
  Token,
  TokenType,
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

export class ParseError extends Error {
  constructor(message: string, public token: Token) {
    super(`${message} at line ${token.line}, column ${token.column}`);
    this.name = 'ParseError';
  }
}

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ProgramNode {
    const rules: RuleNode[] = [];

    while (!this.isAtEnd()) {
      rules.push(this.parseRule());
    }

    return {
      type: 'program',
      rules
    };
  }

  private parseRule(): RuleNode {
    this.consume(TokenType.Rule, "Expect 'rule' keyword");
    
    const name = this.parseQuotedString() || this.consume(TokenType.Identifier, "Expect rule name").value;
    this.consume(TokenType.Lbrace, "Expect '{' before rule body");

    let description = '';
    let category = '';
    let priority = 'medium' as any;
    const conditions: ConditionNode[] = [];
    const effects: EffectNode[] = [];
    const metadata: Record<string, any> = {};

    while (!this.check(TokenType.Rbrace) && !this.isAtEnd()) {
      if (this.match(TokenType.Description)) {
        this.consume(TokenType.Colon, "Expect ':' after 'description'");
        description = this.parseQuotedString() || '';
        this.consumeOptional(TokenType.Semicolon);
      } else if (this.match(TokenType.Category)) {
        this.consume(TokenType.Colon, "Expect ':' after 'category'");
        category = this.parseQuotedString() || this.consume(TokenType.Identifier, "Expect category").value;
        this.consumeOptional(TokenType.Semicolon);
      } else if (this.match(TokenType.Priority)) {
        this.consume(TokenType.Colon, "Expect ':' after 'priority'");
        priority = this.consume(TokenType.Identifier, "Expect priority (critical, high, medium, low, informational)").value as any;
        this.consumeOptional(TokenType.Semicolon);
      } else if (this.match(TokenType.If)) {
        conditions.push(this.parseCondition());
      } else if (this.match(TokenType.Then)) {
        effects.push(this.parseEffect());
      } else {
        // Metadata
        const keyToken = this.consume(TokenType.Identifier, "Expect property name");
        this.consume(TokenType.Colon, "Expect ':' after property");
        metadata[keyToken.value] = this.parseLiteral().value;
        this.consumeOptional(TokenType.Semicolon);
      }
    }

    this.consume(TokenType.Rbrace, "Expect '}' after rule body");

    return {
      type: 'rule',
      name,
      description,
      category,
      priority,
      metadata,
      conditions,
      effects
    };
  }

  private parseCondition(): ConditionNode {
    const expression = this.parseExpression();
    this.consumeOptional(TokenType.Semicolon);

    return {
      type: 'condition',
      expression
    };
  }

  private parseEffect(): EffectNode {
    const effectType = this.consume(TokenType.Identifier, "Expect effect type (signal, probability, fortune, timing, confidence)").value as any;
    
    let action = 'set';
    if (this.match(TokenType.Plus, TokenType.Minus, TokenType.Star, TokenType.Div)) {
      if (this.previous().value === '+') {
        action = 'add';
      } else if (this.previous().value === '-') {
        action = 'subtract';
      } else if (this.previous().value === '*') {
        action = 'multiply';
      } else {
        action = 'divide';
      }
      this.consume(TokenType.Assign, "Expect '=' after operator");
    } else {
      this.consume(TokenType.Assign, "Expect '=' for effect assignment");
    }
    
    const value = this.parseExpression();
    this.consumeOptional(TokenType.Semicolon);

    return {
      type: 'effect',
      effectType,
      action,
      value
    };
  }

  private parseExpression(): ExpressionNode {
    return this.parseOr();
  }

  private parseOr(): ExpressionNode {
    let expr = this.parseAnd();

    while (this.match(TokenType.Or)) {
      const operator = '||';
      const right = this.parseAnd();
      expr = {
        type: 'binaryOp',
        operator,
        left: expr,
        right
      };
    }

    return expr;
  }

  private parseAnd(): ExpressionNode {
    let expr = this.parseEquality();

    while (this.match(TokenType.And)) {
      const operator = '&&';
      const right = this.parseEquality();
      expr = {
        type: 'binaryOp',
        operator,
        left: expr,
        right
      };
    }

    return expr;
  }

  private parseEquality(): ExpressionNode {
    let expr = this.parseComparison();

    while (this.match(TokenType.Eq, TokenType.Neq)) {
      const operator = this.previous().value as any;
      const right = this.parseComparison();
      expr = {
        type: 'binaryOp',
        operator,
        left: expr,
        right
      };
    }

    return expr;
  }

  private parseComparison(): ExpressionNode {
    let expr = this.parseTerm();

    while (this.match(TokenType.Gt, TokenType.Gte, TokenType.Lt, TokenType.Lte)) {
      const operator = this.previous().value as any;
      const right = this.parseTerm();
      expr = {
        type: 'binaryOp',
        operator,
        left: expr,
        right
      };
    }

    return expr;
  }

  private parseTerm(): ExpressionNode {
    let expr = this.parseFactor();

    while (this.match(TokenType.Plus, TokenType.Minus)) {
      const operator = this.previous().value as any;
      const right = this.parseFactor();
      expr = {
        type: 'binaryOp',
        operator,
        left: expr,
        right
      };
    }

    return expr;
  }

  private parseFactor(): ExpressionNode {
    let expr = this.parseUnary();

    while (this.match(TokenType.Mul, TokenType.Div)) {
      const operator = this.previous().value as any;
      const right = this.parseUnary();
      expr = {
        type: 'binaryOp',
        operator,
        left: expr,
        right
      };
    }

    return expr;
  }

  private parseUnary(): ExpressionNode {
    if (this.match(TokenType.Not, TokenType.Minus)) {
      const operator = this.previous().value as any;
      const operand = this.parseUnary();
      return {
        type: 'unaryOp',
        operator,
        operand
      };
    }

    return this.parseCall();
  }

  private parseCall(): ExpressionNode {
    let expr = this.parsePrimary();

    while (this.match(TokenType.Lparen)) {
      const args = this.parseArguments();
      this.consume(TokenType.Rparen, "Expect ')' after function arguments");
      expr = {
        type: 'call',
        callee: expr as IdentifierNode,
        arguments: args
      };
    }

    while (this.match(TokenType.Dot)) {
      const property = this.consume(TokenType.Identifier, "Expect property name after '.'").value;
      expr = {
        type: 'memberAccess',
        object: expr as IdentifierNode,
        property
      };
    }

    return expr;
  }

  private parseArguments(): ExpressionNode[] {
    const args: ExpressionNode[] = [];

    if (!this.check(TokenType.Rparen)) {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.Comma));
    }

    return args;
  }

  private parsePrimary(): ExpressionNode {
    if (this.match(TokenType.Boolean)) {
      return this.parseLiteral();
    }

    if (this.match(TokenType.Number)) {
      return this.parseLiteral();
    }

    if (this.match(TokenType.String)) {
      return this.parseLiteral();
    }

    if (this.match(TokenType.Null)) {
      return this.parseLiteral();
    }

    if (this.match(TokenType.Identifier)) {
      return {
        type: 'identifier',
        name: this.previous().value
      };
    }

    if (this.match(TokenType.Lparen)) {
      const expr = this.parseExpression();
      this.consume(TokenType.Rparen, "Expect ')' after grouping");
      return expr;
    }

    throw new ParseError("Expect expression", this.peek());
  }

  private parseLiteral(): LiteralNode {
    const token = this.previous();

    if (token.type === TokenType.Number) {
      return {
        type: 'literal',
        value: parseFloat(token.value)
      };
    }

    if (token.type === TokenType.Boolean) {
      return {
        type: 'literal',
        value: token.value === 'true'
      };
    }

    if (token.type === TokenType.Null) {
      return {
        type: 'literal',
        value: null
      };
    }

    return {
      type: 'literal',
      value: token.value
    };
  }

  private parseQuotedString(): string | null {
    if (this.match(TokenType.String)) {
      return this.previous().value;
    }
    return null;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();

    throw new ParseError(message, this.peek());
  }

  private consumeOptional(type: TokenType): Token | null {
    if (this.check(type)) {
      return this.advance();
    }
    return null;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.Eof;
  }
}
