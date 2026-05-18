/**
 * 解释引擎常量
 */

export enum InterpretationTone {
  FORMAL = 'formal',
  FRIENDLY = 'friendly',
  ANALYTICAL = 'analytical',
  INSPIRATIONAL = 'inspirational'
}

export enum SuggestionType {
  ACTION = 'action',
  PRECAUTION = 'precaution',
  TIMING = 'timing',
  ATTITUDE = 'attitude'
}

export const TONE_LABELS: Record<InterpretationTone, string> = {
  [InterpretationTone.FORMAL]: '正式',
  [InterpretationTone.FRIENDLY]: '友好',
  [InterpretationTone.ANALYTICAL]: '分析',
  [InterpretationTone.INSPIRATIONAL]: '启发'
};
