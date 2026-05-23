/**
 * Metrics Collector - 运行时指标收集
 */

import { RuntimeMetrics } from "./types";

export class MetricsCollector {
  private metrics: RuntimeMetrics[] = [];
  private executionTimes: number[] = [];
  private totalExecutions: number = 0;

  recordExecution(duration: number): void {
    this.executionTimes.push(duration);
    this.totalExecutions++;

    if (this.executionTimes.length > 1000) {
      this.executionTimes.shift();
    }
  }

  collect(): RuntimeMetrics {
    const averageExecutionTime =
      this.executionTimes.length > 0
        ? this.executionTimes.reduce((a, b) => a + b, 0) /
          this.executionTimes.length
        : 0;

    return {
      timestamp: Date.now(),
      activeExecutions: 0,
      totalExecutions: this.totalExecutions,
      averageExecutionTime,
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCpuUsage(),
    };
  }

  private getMemoryUsage(): number {
    if (typeof process !== "undefined" && process.memoryUsage) {
      return process.memoryUsage().heapUsed / 1024 / 1024;
    }
    return 0;
  }

  private getCpuUsage(): number {
    return 0;
  }

  getHistory(count: number = 100): RuntimeMetrics[] {
    return this.metrics.slice(-count);
  }

  clear(): void {
    this.metrics = [];
  }
}
