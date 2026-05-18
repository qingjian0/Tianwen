/**
 * Prompt 编排器常量
 */

export enum PromptLayer {
  CORE = 'core',
  SYSTEM = 'system',
  INTERPRETATION = 'interpretation',
  RISK = 'risk',
  TIMING = 'timing'
}

export enum OutputMode {
  CONCISE = 'concise',
  DETAILED = 'detailed',
  ANALYTICAL = 'analytical',
  NARRATIVE = 'narrative'
}

export const PROMPT_LAYER_LABELS: Record<PromptLayer, string> = {
  [PromptLayer.CORE]: '核心指令',
  [PromptLayer.SYSTEM]: '系统说明',
  [PromptLayer.INTERPRETATION]: '解释要求',
  [PromptLayer.RISK]: '风险提示',
  [PromptLayer.TIMING]: '时间分析'
};
