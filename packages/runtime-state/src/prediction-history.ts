/**
 * Prediction History - 预测历史记录
 */

import {
  StorageAdapter,
  PredictionHistory,
  PredictionRecord,
  PredictionFilter,
} from "./types";

export class PredictionHistoryImpl implements PredictionHistory {
  private storage: StorageAdapter;
  private prefix: string;
  private counterKey: string;

  constructor(storage: StorageAdapter, prefix: string = "pred:") {
    this.storage = storage;
    this.prefix = prefix;
    this.counterKey = `${prefix}counter`;
  }

  async save(prediction: Omit<PredictionRecord, "id">): Promise<string> {
    const id = (await this.storage.get<number>(this.counterKey)) || 0;
    const newId = id + 1;

    const record: PredictionRecord = {
      ...prediction,
      id: `pred-${newId}`,
    };

    const key = `${this.prefix}${record.id}`;
    await this.storage.set(key, record);
    await this.storage.set(this.counterKey, newId);

    const indexKey = `${this.prefix}index:timestamp`;
    await this.storage.listPush(indexKey, record.id);
    await this.storage.expire(indexKey, 86400 * 30);

    return record.id;
  }

  async get(id: string): Promise<PredictionRecord | null> {
    const key = `${this.prefix}${id}`;
    return this.storage.get<PredictionRecord>(key);
  }

  async query(filter: PredictionFilter): Promise<PredictionRecord[]> {
    const indexKey = `${this.prefix}index:timestamp`;
    const allIds = await this.storage.listRange(indexKey, 0, -1);

    const results: PredictionRecord[] = [];
    let offset = filter.offset || 0;
    let limit = filter.limit || 100;

    for (const id of allIds) {
      if (results.length >= limit) break;
      if (offset > 0) {
        offset--;
        continue;
      }

      const record = await this.get(id);
      if (!record) continue;

      if (filter.startTime && record.timestamp < filter.startTime) continue;
      if (filter.endTime && record.timestamp > filter.endTime) continue;
      if (filter.system && record.metadata?.system !== filter.system) continue;

      results.push(record);
    }

    return results;
  }

  async delete(id: string): Promise<void> {
    const key = `${this.prefix}${id}`;
    await this.storage.delete(key);
  }
}
