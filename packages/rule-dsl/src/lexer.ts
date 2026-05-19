/**
 * Rule DSL - 词法分析器
 * Phase 8: Runtime Engine
 */

import { Token, TokenType } from './types';

export class Lexer {
  private input: string;
  private pos: number = 0;
  private line: number = 1;
  private column: number = 1;

  private static KEYWORDS: Record<string, TokenType> = {
    'rule': TokenType.Rule,
    'if': TokenType.If,
    'then': TokenType.Then,
    'priority': TokenType.Priority,
    'category': TokenType.Category,
    'description': TokenType.Description,
    'true': TokenType.Boolean,
    'false': TokenType.Boolean,
    'null': TokenType.Null,
    'critical': TokenType.Identifier,
    'high': TokenType.Identifier,
    'medium': TokenType.Identifier,
    'low': TokenType.Identifier,
    'informational': TokenType.Identifier
  };

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (!this.isEof()) {
      this.skipWhitespace();

      if (this.isEof()) {
        break;
      }

      const char = this.currentChar();

      if (char === '/' && this.peek() === '/') {
        this.skipLineComment();
        continue;
      }

      if (char === '/' && this.peek() === '*') {
        this.skipBlockComment();
        continue;
      }

      if (char === '"' || char === "'") {
        tokens.push(this.readString());
        continue;
      }

      if (this.isDigit(char)) {
        tokens.push(this.readNumber());
        continue;
      }

      if (this.isIdentifierStart(char)) {
        tokens.push(this.readIdentifier());
        continue;
      }

      const symbolToken = this.readSymbol();
      if (symbolToken) {
        tokens.push(symbolToken);
        continue;
      }

      // Unknown character
      tokens.push(this.createToken(TokenType.Unknown, char));
      this.advance();
    }

    tokens.push(this.createToken(TokenType.Eof, ''));
    return tokens;
  }

  private readString(): Token {
    const startLine = this.line;
    const startCol = this.column;
    const quote = this.currentChar();
    this.advance();

    let value = '';
    while (!this.isEof() && this.currentChar() !== quote) {
      if (this.currentChar() === '\\') {
        this.advance();
        value += this.readEscape();
      } else {
        value += this.currentChar();
        this.advance();
      }
    }

    if (this.currentChar() === quote) {
      this.advance();
    }

    return {
      type: TokenType.String,
      value,
      line: startLine,
      column: startCol
    };
  }

  private readEscape(): string {
    if (this.isEof()) return '';
    const char = this.currentChar();
    this.advance();

    const escapes: Record<string, string> = {
      'n': '\n',
      't': '\t',
      'r': '\r',
      '\\': '\\',
      '"': '"',
      "'": "'"
    };

    return escapes[char] || char;
  }

  private readNumber(): Token {
    const startLine = this.line;
    const startCol = this.column;
    let value = '';

    while (!this.isEof() && this.isDigit(this.currentChar())) {
      value += this.currentChar();
      this.advance();
    }

    if (!this.isEof() && this.currentChar() === '.') {
      value += this.currentChar();
      this.advance();

      while (!this.isEof() && this.isDigit(this.currentChar())) {
        value += this.currentChar();
        this.advance();
      }
    }

    return {
      type: TokenType.Number,
      value,
      line: startLine,
      column: startCol
    };
  }

  private readIdentifier(): Token {
    const startLine = this.line;
    const startCol = this.column;
    let value = '';

    while (!this.isEof() && this.isIdentifierPart(this.currentChar())) {
      value += this.currentChar();
      this.advance();
    }

    const keywordType = Lexer.KEYWORDS[value];
    if (keywordType) {
      if (keywordType === TokenType.Boolean || keywordType === TokenType.Null) {
        return this.createToken(keywordType, value, startLine, startCol);
      }
      return this.createToken(keywordType, value, startLine, startCol);
    }

    return {
      type: TokenType.Identifier,
      value,
      line: startLine,
      column: startCol
    };
  }

  private readSymbol(): Token | null {
    const startLine = this.line;
    const startCol = this.column;
    const char = this.currentChar();

    const twoChars = char + (this.peek() || '');

    const twoCharSymbols: Record<string, TokenType> = {
      '==': TokenType.Eq,
      '!=': TokenType.Neq,
      '>=': TokenType.Gte,
      '<=': TokenType.Lte,
      '&&': TokenType.And,
      '||': TokenType.Or
    };

    if (twoCharSymbols[twoChars]) {
      this.advance(2);
      return this.createToken(twoCharSymbols[twoChars], twoChars, startLine, startCol);
    }

    const singleCharSymbols: Record<string, TokenType> = {
      '!': TokenType.Not,
      '>': TokenType.Gt,
      '<': TokenType.Lt,
      '+': TokenType.Plus,
      '-': TokenType.Minus,
      '*': TokenType.Mul,
      '/': TokenType.Div,
      '=': TokenType.Assign,
      '(': TokenType.Lparen,
      ')': TokenType.Rparen,
      '{': TokenType.Lbrace,
      '}': TokenType.Rbrace,
      '[': TokenType.Lbracket,
      ']': TokenType.Rbracket,
      ':': TokenType.Colon,
      ';': TokenType.Semicolon,
      ',': TokenType.Comma,
      '.': TokenType.Dot
    };

    if (singleCharSymbols[char]) {
      this.advance();
      return this.createToken(singleCharSymbols[char], char, startLine, startCol);
    }

    return null;
  }

  private skipWhitespace(): void {
    while (!this.isEof() && this.isWhitespace(this.currentChar())) {
      this.advance();
    }
  }

  private skipLineComment(): void {
    while (!this.isEof() && this.currentChar() !== '\n') {
      this.advance();
    }
  }

  private skipBlockComment(): void {
    this.advance(2);
    while (!this.isEof()) {
      if (this.currentChar() === '*' && this.peek() === '/') {
        this.advance(2);
        break;
      }
      this.advance();
    }
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  private isIdentifierStart(char: string): boolean {
    return /[a-zA-Z_]/.test(char);
  }

  private isIdentifierPart(char: string): boolean {
    return /[a-zA-Z0-9_]/.test(char);
  }

  private currentChar(): string {
    return this.input[this.pos] || '';
  }

  private peek(offset: number = 1): string {
    return this.input[this.pos + offset] || '';
  }

  private advance(count: number = 1): void {
    for (let i = 0; i < count && !this.isEof(); i++) {
      if (this.input[this.pos] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.pos++;
    }
  }

  private isEof(): boolean {
    return this.pos >= this.input.length;
  }

  private createToken(type: TokenType, value: string, line?: number, col?: number): Token {
    return {
      type,
      value,
      line: line || this.line,
      column: col || this.column
    };
  }
}
