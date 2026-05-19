/**
 * Rule DSL - 入口
 * Phase 8: Runtime Engine
 */

export * from './types';
export * from './lexer';
export * from './parser';
export * from './interpreter';

import { Lexer } from './lexer';
import { Parser } from './parser';
import { Interpreter, Context } from './interpreter';

export class RuleDSL {
  static parse(input: string) {
    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    return parser.parse();
  }

  static execute(input: string, context: Context) {
    const program = this.parse(input);
    const interpreter = new Interpreter(context);
    return interpreter.interpretProgram(program);
  }

  static interpret(program: any, context: Context) {
    const interpreter = new Interpreter(context);
    return interpreter.interpretProgram(program);
  }
}
