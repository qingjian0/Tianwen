/**
 * Case Replay Engine
 */

import { TestCase, ReplayResult, ReplayReport } from "./types";
import { v4 as uuidv4 } from "uuid";

export class CaseReplayEngine {
  private testCases: Map<string, TestCase> = new Map();

  constructor() {}

  addTestCase(testCase: TestCase) {
    this.testCases.set(testCase.metadata.id, testCase);
  }

  async runReplay(
    testCase: TestCase,
    executeFn: (input: any) => Promise<any>,
  ): Promise<ReplayResult> {
    const start = performance.now();

    try {
      const actualOutput = await executeFn(testCase.input);
      const passed = this.verifyOutput(actualOutput, testCase.expectedOutput);

      return {
        caseId: testCase.metadata.id,
        passed,
        actualOutput,
        expectedOutput: testCase.expectedOutput,
        executionTime: performance.now() - start,
        errors: passed ? [] : ["Output did not match expected"],
      };
    } catch (error) {
      return {
        caseId: testCase.metadata.id,
        passed: false,
        executionTime: performance.now() - start,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  async runAll(executeFn: (input: any) => Promise<any>): Promise<ReplayReport> {
    const start = performance.now();
    const results: ReplayResult[] = [];

    for (const testCase of this.testCases.values()) {
      const result = await this.runReplay(testCase, executeFn);
      results.push(result);
    }

    const passed = results.filter((r) => r.passed).length;

    return {
      totalCases: this.testCases.size,
      passed,
      failed: this.testCases.size - passed,
      duration: performance.now() - start,
      results,
      metrics: {
        overallAccuracy: passed / this.testCases.size,
      },
    };
  }

  private verifyOutput(actual: any, expected: any): boolean {
    for (const key in expected) {
      if (!(key in actual)) return false;

      const actualVal = actual[key];
      const expectedVal = expected[key];

      if (typeof expectedVal === "number" && typeof actualVal === "number") {
        if (Math.abs(actualVal - expectedVal) > 0.1) return false;
      } else if (Array.isArray(expectedVal)) {
        if (!Array.isArray(actualVal)) return false;
        if (!expectedVal.every((v, i) => v === actualVal[i])) return false;
      } else if (expectedVal !== actualVal) {
        return false;
      }
    }

    return true;
  }

  clear() {
    this.testCases.clear();
  }

  getTestCase(id: string): TestCase | undefined {
    return this.testCases.get(id);
  }

  getAllTestCases(): TestCase[] {
    return Array.from(this.testCases.values());
  }
}
