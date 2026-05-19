/**
 * 更简单的演示
 */

import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

const simpleRule = `
rule test {
    if x == true;
    if y > 5;
    then z = 10;
}
`;

// 1. 词法分析
const lexer = new Lexer(simpleRule);
const tokens = lexer.tokenize();
console.log("Tokens:", tokens.map(t => `[${t.type}: ${t.value}]"));

// 2. 语法分析
const parser = new Parser(simpleRule);
const ast = parser.parse();
console.log("\\nAST:", JSON.stringify(ast, null, 2));

// 3. 解释执行
const interpreter = new Interpreter({ x: true, y: 10, z: 0 });
const result = interpreter.interpretProgram(ast);
console.log("\\nExecution Result:", result);
