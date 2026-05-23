import { Signal } from "@tianwen/signal-system";
import { ProbabilityScore } from "@tianwen/probability-engine";

// 映射配置
export interface MappingConfig {
  baseProbability: number;
  positiveMultiplier: number;
  negativeMultiplier: number;
  strengthWeights: { high: number; medium: number; low: number };
  confidenceThreshold: number;
}

// 映射结果
export interface MappedProbability {
  probabilityScore: ProbabilityScore;
  contributingSignals: Signal[];
  reasoning: string;
  uncertaintyFactors: string[];
}
