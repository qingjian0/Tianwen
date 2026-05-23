/**
 * Rule DSL 词法分析器
 */

import { Token, TokenType } from "./types";

const KEYWORDS: Record<string, TokenType> = {
  if: "IF",
  then: "THEN",
  rule: "RULE",
  category: "CATEGORY",
  description: "DESCRIPTION",
  priority: "PRIORITY",
  true: "BOOLEAN",
  false: "BOOLEAN",
  null: "NULL",
};

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  constructor(source: string) {
    this.source = source;
  }

  tokenize(): Token[] {
    while (this.position < this.source.length) {
      const char = this.source[this.position];

      if (/\s/.test(char)) {
        this.handleWhitespace(char);
      } else if (char === "/" && this.source[this.position + 1] === "/") {
        this.handleComment();
      } else if (char === "/" && this.source[this.position + 1] === "*") {
        this.handleMultilineComment();
      } else if (char === '"' || char === "'") {
        this.handleString(char);
      } else if (/\d/.test(char)) {
        this.handleNumber();
      } else if (/[a-zA-Z_]/.test(char)) {
        this.handleIdentifier();
      } else {
        this.handlePunctuation(char);
      }
    }

    this.addToken("EOF", "");
    return this.tokens;
  }

  private handleWhitespace(char: string): void {
    if (char === "\n") {
      this.line++;
      this.column = 1;
      this.addToken("NEWLINE", "\\n");
    } else if (char === "\r") {
      // 忽略
    } else {
      this.column++;
    }
    this.position++;
  }

  private handleComment(): void {
    while (
      this.position < this.source.length &&
      this.source[this.position] !== "\n"
    ) {
      this.position++;
    }
  }

  private handleMultilineComment(): void {
    this.position += 2;
    while (this.position < this.source.length) {
      if (
        this.source[this.position] === "*" &&
        this.source[this.position + 1] === "/"
      ) {
        this.position += 2;
        return;
      }
      if (this.source[this.position] === "\n") {
        this.line++;
        this.column = 1;
      }
      this.position++;
    }
  }

  private handleString(quote: string): void {
    const startColumn = this.column;
    this.position++;
    this.column++;
    let value = "";

    while (this.position < this.source.length) {
      const char = this.source[this.position];

      if (char === quote) {
        this.position++;
        this.column++;
        break;
      }

      if (char === "\\") {
        this.position++;
        this.column++;
        const next = this.source[this.position];
        switch (next) {
          case "n":
            value += "\n";
            break;
          case "t":
            value += "\t";
            break;
          case "r":
            value += "\r";
            break;
          default:
            value += next;
        }
      } else {
        value += char;
      }

      if (char === "\n") {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }

      this.position++;
    }

    this.tokens.push({
      type: "STRING",
      value,
      line: this.line,
      column: startColumn,
    });
  }

  private handleNumber(): void {
    const startColumn = this.column;
    let value = "";

    while (
      this.position < this.source.length &&
      /[\d.]/.test(this.source[this.position])
    ) {
      value += this.source[this.position];
      this.position++;
      this.column++;
    }

    this.tokens.push({
      type: "NUMBER",
      value,
      line: this.line,
      column: startColumn,
    });
  }

  private handleIdentifier(): void {
    const startColumn = this.column;
    let value = "";

    while (
      this.position < this.source.length &&
      /[a-zA-Z0-9_]/.test(this.source[this.position])
    ) {
      value += this.source[this.position];
      this.position++;
      this.column++;
    }

    const type = KEYWORDS[value] || "IDENTIFIER";
    this.tokens.push({
      type,
      value,
      line: this.line,
      column: startColumn,
    });
  }

  private handlePunctuation(char: string): void {
    const startColumn = this.column;

    // 处理两个字符的运算符
    const twoChars = char + (this.source[this.position + 1] || "");
    const twoCharTokens: Record<string, TokenType> = {
      "==": "EQ",
      "!=": "NEQ",
      "<=": "LTE",
      ">=": "GTE",
      "&&": "AND",
      "||": "OR",
      "+=": "PLUS_ASSIGN",
      "-=": "MINUS_ASSIGN",
      "*=": "MULTIPLY_ASSIGN",
      "/=": "DIVIDE_ASSIGN",
    };

    if (twoCharTokens[twoChars]) {
      this.tokens.push({
        type: twoCharTokens[twoChars],
        value: twoChars,
        line: this.line,
        column: startColumn,
      });
      this.position += 2;
      this.column += 2;
      return;
    }

    // 处理单字符的标点
    const singleCharTokens: Record<string, TokenType> = {
      "{": "LBRACE",
      "}": "RBRACE",
      "(": "LPAREN",
      ")": "RPAREN",
      "[": "LBRACKET",
      "]": "RBRACKET",
      ",": "COMMA",
      ":": "COLON",
      ";": "SEMICOLON",
      ".": "DOT",
      "+": "PLUS",
      "-": "MINUS",
      "*": "MULTIPLY",
      "/": "DIVIDE",
      "%": "MODULO",
      "=": "ASSIGN",
      "<": "LT",
      ">": "GT",
      "!": "NOT",
    };

    if (singleCharTokens[char]) {
      this.tokens.push({
        type: singleCharTokens[char],
        value: char,
        line: this.line,
        column: startColumn,
      });
      this.position++;
      this.column++;
    } else {
      throw new Error(
        `Unexpected character: ${char} at line ${this.line}, column ${this.column}`,
      );
    }
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
      line: this.line,
      column: this.column,
    });
  }
}
