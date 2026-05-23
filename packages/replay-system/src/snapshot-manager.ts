/**
 * Snapshot Manager - 快照管理器
 */

import { Snapshot } from "./types";

export class SnapshotManager {
  private snapshots: Map<string, Snapshot> = new Map();
  private sessionSnapshots: Map<string, Set<string>> = new Map();

  createSnapshot(
    sessionId: string,
    frameIndex: number,
    context: Record<string, any>,
    data: any,
  ): Snapshot {
    const snapshotId = this.generateId();

    const snapshot: Snapshot = {
      snapshotId,
      sessionId,
      timestamp: Date.now(),
      frameIndex,
      context: this.deepClone(context),
      data: this.deepClone(data),
    };

    this.snapshots.set(snapshotId, snapshot);

    if (!this.sessionSnapshots.has(sessionId)) {
      this.sessionSnapshots.set(sessionId, new Set());
    }
    this.sessionSnapshots.get(sessionId)!.add(snapshotId);

    return snapshot;
  }

  getSnapshot(snapshotId: string): Snapshot | undefined {
    return this.snapshots.get(snapshotId);
  }

  getSessionSnapshots(sessionId: string): Snapshot[] {
    const snapshotIds = this.sessionSnapshots.get(sessionId);
    if (!snapshotIds) return [];

    return Array.from(snapshotIds)
      .map((id) => this.snapshots.get(id))
      .filter((s): s is Snapshot => s !== undefined)
      .sort((a, b) => a.frameIndex - b.frameIndex);
  }

  deleteSessionSnapshots(sessionId: string): void {
    const snapshotIds = this.sessionSnapshots.get(sessionId);
    if (snapshotIds) {
      for (const id of snapshotIds) {
        this.snapshots.delete(id);
      }
      this.sessionSnapshots.delete(sessionId);
    }
  }

  private generateId(): string {
    return `snap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
