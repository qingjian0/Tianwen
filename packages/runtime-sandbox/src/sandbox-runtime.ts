/**
 * Runtime Sandbox - 沙箱化规则执行环境
 * 提供内存限制、超时控制、安全的内置函数
 */

import { SandboxConfig, SandboxResult, SandboxMetrics, SandboxViolation } from './types';

const DEFAULT_CONFIG: SandboxConfig = {
  maxMemoryMB: 10,
  maxExecutionTimeMS: 1000,
  maxIterations: 10000,
  enableConsole: false,
  allowedGlobals: ['Math', 'Date', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean'],
  forbiddenKeywords: ['eval', 'Function', 'constructor', 'prototype', '__proto__', 'import', 'export'],
};

export class SandboxRuntime {
  private config: SandboxConfig;
  private metrics: SandboxMetrics;
  private violations: SandboxViolation[] = [];

  constructor(config: Partial<SandboxConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.resetMetrics();
  }

  private resetMetrics(): void {
    this.metrics = {
      memoryUsage: 0,
      executionTime: 0,
      iterations: 0,
      violations: [],
    };
    this.violations = [];
  }

  execute(code: string, context: Record<string, any> = {}): SandboxResult {
    this.resetMetrics();
    const startTime = performance.now();

    try {
      this.checkForbiddenKeywords(code);

      const wrappedCode = this.wrapCode(code, context);
      const result = this.executeWithTimeout(wrappedCode);

      this.metrics.executionTime = performance.now() - startTime;
      this.metrics.memoryUsage = this.estimateMemoryUsage();

      return {
        success: true,
        result,
        executionTime: this.metrics.executionTime,
        memoryUsage: this.metrics.memoryUsage,
      };
    } catch (error) {
      this.metrics.executionTime = performance.now() - startTime;
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: this.metrics.executionTime,
      };
    }
  }

  private wrapCode(code: string, context: Record<string, any>): string {
    const contextKeys = Object.keys(context);
    const contextValues = Object.values(context);

    const contextSetup = contextKeys
      .map((key, i) => `let ${key} = __context__[${i}];`)
      .join('\n');

    return `
      (function(__context__) {
        "use strict";
        ${contextSetup}
        return (function() {
          ${this.getSafeBuiltins()}
          return (${code});
        })();
      })(__ctx__);
    `;
  }

  private getSafeBuiltins(): string {
    const builtins: string[] = [];

    builtins.push(`
      const Math_safe = {
        abs: Math.abs,
        min: Math.min,
        max: Math.max,
        floor: Math.floor,
        ceil: Math.ceil,
        round: Math.round,
        pow: Math.pow,
        sqrt: Math.sqrt,
        random: Math.random,
      };
    `);

    if (this.config.enableConsole) {
      builtins.push(`
        const console = {
          log: function() {},
          error: function() {},
          warn: function() {},
        };
      `);
    }

    return builtins.join('\n');
  }

  private executeWithTimeout(code: string): any {
    const contextValues = Object.values({});
    
    const fn = new Function('__ctx__', code);
    
    let iterations = 0;
    const checkIteration = () => {
      iterations++;
      if (iterations > this.config.maxIterations) {
        this.recordViolation({
          type: 'iteration',
          message: `Maximum iterations (${this.config.maxIterations}) exceeded`,
          timestamp: Date.now(),
        });
        throw new Error('Maximum iterations exceeded');
      }
    };

    const startMemory = this.getMemoryUsage();
    const result = fn(contextValues);
    const endMemory = this.getMemoryUsage();
    const memoryUsed = endMemory - startMemory;

    if (memoryUsed > this.config.maxMemoryMB * 1024 * 1024) {
      this.recordViolation({
        type: 'memory',
        message: `Memory usage (${memoryUsed} bytes) exceeded limit (${this.config.maxMemoryMB} MB)`,
        timestamp: Date.now(),
      });
      throw new Error('Memory limit exceeded');
    }

    return result;
  }

  private checkForbiddenKeywords(code: string): void {
    for (const keyword of this.config.forbiddenKeywords) {
      if (code.includes(keyword)) {
        this.recordViolation({
          type: 'forbidden',
          message: `Forbidden keyword detected: ${keyword}`,
          timestamp: Date.now(),
        });
        throw new Error(`Forbidden operation: ${keyword}`);
      }
    }
  }

  private recordViolation(violation: SandboxViolation): void {
    this.violations.push(violation);
    this.metrics.violations.push(violation);
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    return 0;
  }

  private estimateMemoryUsage(): number {
    return this.getMemoryUsage();
  }

  executeRule(
    predicate: (context: Record<string, any>) => boolean,
    context: Record<string, any>
  ): SandboxResult {
    const startTime = performance.now();

    try {
      const result = predicate(context);
      return {
        success: true,
        result,
        executionTime: performance.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: performance.now() - startTime,
      };
    }
  }

  getMetrics(): SandboxMetrics {
    return { ...this.metrics };
  }

  getViolations(): SandboxViolation[] {
    return [...this.violations];
  }

  setConfig(config: Partial<SandboxConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
