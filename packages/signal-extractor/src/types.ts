import { Signal } from '@tianwen/signal-system';
import { MeihuaResult } from '@tianwen/meihua';
import { LiuYaoResult } from '@tianwen/liuyao';
import { BaZiResult } from '@tianwen/bazi-engine';

// 统一术数结果类型
export type DivinationResult = MeihuaResult | LiuYaoResult | BaZiResult;

// 提取配置
export interface ExtractionConfig {
  includeTiming: boolean;
  includeRelationships: boolean;
  includeStrength: boolean;
  includeWarnings: boolean;
}

// 提取结果
export interface ExtractedSignals {
  system: 'meihua' | 'liuyao' | 'bazi';
  signals: Signal[];
  keyFindings: string[];
  timingHints?: {
    favorable: string[];
    unfavorable: string[];
  };
  summary: string;
}
