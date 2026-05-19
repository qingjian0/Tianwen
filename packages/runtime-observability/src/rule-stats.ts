/**
 * Rule Statistics - 规则统计
 */

import { RuleHitStats } from './types';

export class RuleStatistics {
  private stats: Map<string, RuleHitStats> = new Map();

  recordHit(ruleId: string, executionTime: number): void {
    let stats = this.stats.get(ruleId);
    if (!stats) {
      stats = {
        ruleId,
        hits: 0,
        misses: 0,
        totalExecutionTime: 0,
        averageExecutionTime: 0,
        lastHit: 0,
      };
      this.stats.set(ruleId, stats);
    }

    stats.hits++;
    stats.totalExecutionTime += executionTime;
    stats.averageExecutionTime = stats.totalExecutionTime / stats.hits;
    stats.lastHit = Date.now();
  }

  recordMiss(ruleId: string): void {
    let stats = this.stats.get(ruleId);
    if (!stats) {
      stats = {
        ruleId,
        hits: 0,
        misses: 0,
        totalExecutionTime: 0,
        averageExecutionTime: 0,
        lastHit: 0,
      };
      this.stats.set(ruleId, stats);
    }

    stats.misses++;
  }

  getStats(ruleId: string): RuleHitStats | undefined {
    return this.stats.get(ruleId);
  }

  getAllStats(): RuleHitStats[] {
    return Array.from(this.stats.values());
  }

  getTopRules(count: number = 10, sortBy: 'hits' | 'averageExecutionTime' = 'hits'): RuleHitStats[] {
    return Array.from(this.stats.values())
      .sort((a, b) => {
        if (sortBy === 'hits') {
          return b.hits - a.hits;
        } else {
          return a.averageExecutionTime - b.averageExecutionTime;
        }
      })
      .slice(0, count);
  }

  clear(): void {
    this.stats.clear();
  }
}
