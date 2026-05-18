/**
 * 融合引擎常量
 */

export enum FusionStrategy {
  WEIGHTED_AVERAGE = 'weighted_average',
  CONFIDENCE_BASED = 'confidence_based',
  CONSENSUS = 'consensus',
  HIERARCHICAL = 'hierarchical',
  RESONANCE_WEIGHTED = 'resonance_weighted'
}

export const FUSION_STRATEGY_LABELS: Record<FusionStrategy, string> = {
  [FusionStrategy.WEIGHTED_AVERAGE]: '加权平均',
  [FusionStrategy.CONFIDENCE_BASED]: '置信度优先',
  [FusionStrategy.CONSENSUS]: '共识机制',
  [FusionStrategy.HIERARCHICAL]: '层级融合',
  [FusionStrategy.RESONANCE_WEIGHTED]: '共振加权'
};
