/**
 * Execution Context Store - 执行上下文存储
 */

import { StorageAdapter, ExecutionContextStore } from './types';

export class ExecutionContextStoreImpl implements ExecutionContextStore {
  private storage: StorageAdapter;
  private prefix: string;

  constructor(storage: StorageAdapter, prefix: string = 'ctx:') {
    this.storage = storage;
    this.prefix = prefix;
  }

  async save(executionId: string, context: Record<string, any>): Promise<void> {
    const key = `${this.prefix}${executionId}`;
    await this.storage.set(key, {
      executionId,
      context,
      savedAt: Date.now(),
    });
  }

  async load(executionId: string): Promise<Record<string, any> | null> {
    const key = `${this.prefix}${executionId}`;
    const record = await this.storage.get<any>(key);
    return record?.context ?? null;
  }

  async delete(executionId: string): Promise<void> {
    const key = `${this.prefix}${executionId}`;
    await this.storage.delete(key);
  }

  async list(): Promise<string[]> {
    const keys = await this.storage.keys(`${this.prefix}*`);
    return keys.map(key => key.replace(this.prefix, ''));
  }
}
