/**
 * Deterministic Random - 确定性随机数生成器
 * 确保同一 seed 产生完全相同的随机序列
 */

export class DeterministicRandom {
  private state: number;
  readonly seed: number;

  constructor(seed: number) {
    this.seed = seed;
    this.state = seed;
  }

  next(): number {
    // Mulberry32 算法
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextRange(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextBoolean(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  pick<T>(array: T[]): T {
    return array[this.nextRange(0, array.length - 1)];
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextRange(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  clone(): DeterministicRandom {
    const cloned = new DeterministicRandom(this.seed);
    cloned.state = this.state;
    return cloned;
  }

  reset(): void {
    this.state = this.seed;
  }

  static fromTimestamp(): number {
    return Date.now() % 1000000;
  }
}
