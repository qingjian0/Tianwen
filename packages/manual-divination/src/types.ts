/**
 * 手动起卦系统类型定义
 */

export type DivinationMethod =
  | 'time'           // 时间起卦
  | 'number'         // 数字起卦
  | 'coin'           // 铜钱起卦（三枚铜钱）
  | 'yarrow'         // 蓍草起卦（大衍之数）
  | 'manual-yin-yang' // 手动点阴阳
  | 'manual-changes'  // 手动指定动爻
  | 'specify-hexagram' // 指定本卦
  | 'specify-changed'  // 指定变卦
  | 'specify-complex'; // 指定错综互

export interface CoinResult {
  coin1: 2 | 3; // 2=阴, 3=阳
  coin2: 2 | 3;
  coin3: 2 | 3;
  sum: 6 | 7 | 8 | 9; // 6=老阴, 7=少阳, 8=少阴, 9=老阳
}

export interface YarrowStep {
  step: number;
  stalksLeft: number;
  stalksRight: number;
  remainder: number;
}

export interface YarrowResult {
  steps: YarrowStep[];
  result: 6 | 7 | 8 | 9;
}

export interface ManualDivinationConfig {
  method: DivinationMethod;
  system: 'meihua' | 'liuyao';
}

export interface DivinationStep {
  type: string;
  description: string;
  stepNumber: number;
  totalSteps: number;
  userInputRequired: boolean;
}

export interface ManualDivinationState {
  currentStep: number;
  steps: DivinationStep[];
  collectedData: Record<string, any>;
  completed: boolean;
  result?: any;
}
