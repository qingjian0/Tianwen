/**
 * Rule DSL - 规则定义语言包
 */

export * from "./types";
export { Lexer } from "./lexer";
export { Parser } from "./parser";
export { Interpreter } from "./interpreter";

import { Parser } from "./parser";
import { Interpreter } from "./interpreter";
import { ExecutionContext, ExecutionResult } from "./types";

export class RuleDSL {
  static parse(source: string) {
    const parser = new Parser(source);
    return parser.parse();
  }

  static execute(
    source: string,
    context: ExecutionContext = {},
  ): ExecutionResult {
    const parser = new Parser(source);
    const program = parser.parse();
    const interpreter = new Interpreter(context);
    return interpreter.interpretProgram(program);
  }
}
