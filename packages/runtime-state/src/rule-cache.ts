/**
 * Rule Cache - 规则缓存
 */

import { StorageAdapter, RuleCache } from './types';

export class RuleCacheImpl implements RuleCache {
  private storage: StorageAdapter;
  private prefix: string;
  private hits: number = 0;
  private misses: number = 0;

  constructor(storage: StorageAdapter, prefix: string = 'rule:') {
    this.storage = storage;
    this.prefix = prefix;
  }

  async get(ruleId: string): Promise<any | null> {
    const key = `${this.prefix}${ruleId}`;
    const result = await this.storage.get(key);
    
    if (result) {
      this.hits++;
      return result;
    } else {
      this.misses++;
      return null;
    }
  }

  async set(ruleId: string, rule: any): Promise<void> {
    const key = `${this.prefix}${ruleId}`;
    await this.storage.set(key, {
      rule,
      cachedAt: Date.now(),
    });
  }

  async invalidate(pattern?: string): Promise<void> {
    if (pattern) {
      const keys = await this.storage.keys(`${this.prefix}${pattern}`);
      for (const key of keys) {
        await this.storage.delete(key);
      }
    } else {
      const keys = await this.storage.keys(`${this.prefix}*`);
      for (const key of keys) {
        await this.storage.delete(key);
      }
    }
  }

  async stats(): Promise<{ size: number; hits: number; misses: number }> {
    const keys = await this.storage.keys(`${this.prefix}*`);
    return {
      size: keys.length,
      hits: this.hits,
      misses: this.misses,
    };
  }
}
