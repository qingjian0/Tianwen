/**
 * Memory Storage Adapter - 内存存储适配器（开发用）
 */

import { StorageAdapter } from "./types";

export class MemoryStorageAdapter implements StorageAdapter {
  private store: Map<string, any> = new Map();
  private ttls: Map<string, number> = new Map();
  private hits: number = 0;
  private misses: number = 0;

  async initialize(): Promise<void> {
    this.store.clear();
    this.ttls.clear();
    this.hits = 0;
    this.misses = 0;
  }

  async close(): Promise<void> {
    // Nothing to close for memory storage
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.ttls.has(key)) {
      const expireTime = this.ttls.get(key)!;
      if (Date.now() > expireTime) {
        this.store.delete(key);
        this.ttls.delete(key);
        this.misses++;
        return null;
      }
    }

    const value = this.store.get(key);
    if (value === undefined) {
      this.misses++;
      return null;
    }

    this.hits++;
    return value as T;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
    this.ttls.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.store.has(key);
  }

  async keys(pattern?: string): Promise<string[]> {
    if (!pattern) {
      return Array.from(this.store.keys());
    }

    const regex = new RegExp(pattern.replace("*", ".*"));
    return Array.from(this.store.keys()).filter((key) => regex.test(key));
  }

  async listPush(key: string, ...values: any[]): Promise<number> {
    let list = this.store.get(key);
    if (!Array.isArray(list)) {
      list = [];
    }

    for (const value of values) {
      list.push(value);
    }

    this.store.set(key, list);
    return list.length;
  }

  async listRange(key: string, start: number, stop: number): Promise<any[]> {
    const list = this.store.get(key);
    if (!Array.isArray(list)) {
      return [];
    }

    return list.slice(start, stop === -1 ? undefined : stop + 1);
  }

  async listLength(key: string): Promise<number> {
    const list = this.store.get(key);
    return Array.isArray(list) ? list.length : 0;
  }

  async hashSet(key: string, field: string, value: any): Promise<void> {
    let hash = this.store.get(key);
    if (!hash || typeof hash !== "object") {
      hash = {};
    }

    hash[field] = value;
    this.store.set(key, hash);
  }

  async hashGet(key: string, field: string): Promise<any | null> {
    const hash = this.store.get(key);
    if (!hash || typeof hash !== "object") {
      return null;
    }

    return hash[field] ?? null;
  }

  async hashGetAll(key: string): Promise<Record<string, any>> {
    const hash = this.store.get(key);
    return hash && typeof hash === "object" ? hash : {};
  }

  async hashDelete(key: string, field: string): Promise<void> {
    const hash = this.store.get(key);
    if (hash && typeof hash === "object") {
      delete hash[field];
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    this.ttls.set(key, Date.now() + seconds * 1000);
  }

  async ttl(key: string): Promise<number> {
    const expireTime = this.ttls.get(key);
    if (!expireTime) {
      return -1;
    }

    const remaining = expireTime - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : -2;
  }

  getStats(): { size: number; hits: number; misses: number } {
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
    };
  }

  clear(): void {
    this.store.clear();
    this.ttls.clear();
  }
}
