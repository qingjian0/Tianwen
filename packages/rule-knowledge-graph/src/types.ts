/**
 * Rule Knowledge Graph - 类型定义
 */

export interface RuleNode {
  nodeId: string;
  ruleId: string;
  name: string;
  category: string;
  properties: Record<string, any>;
  confidence: number;
  createdAt: number;
  updatedAt: number;
}

export type RelationType =
  | "supports"
  | "contradicts"
  | "refines"
  | "supersedes"
  | "derived_from"
  | "triggered_by"
  | "conflicts_with";

export interface RuleRelation {
  relationId: string;
  sourceRuleId: string;
  targetRuleId: string;
  relationType: RelationType;
  weight: number;
  metadata?: Record<string, any>;
}

export interface RuleKnowledgeGraph {
  nodes: Map<string, RuleNode>;
  relations: RuleRelation[];
  adjacencyList: Map<string, Set<string>>;
  reverseAdjacencyList: Map<string, Set<string>>;
}

export interface GraphQuery {
  ruleId?: string;
  relationType?: RelationType;
  category?: string;
  maxDepth?: number;
  limit?: number;
}

export interface SemanticRelation {
  sourceId: string;
  targetId: string;
  relationType: string;
  semanticSimilarity: number;
  evidence: string[];
}

export interface WeightedRelation {
  relationId: string;
  weight: number;
  confidence: number;
  reinforcement: number;
}

export interface ContradictionPath {
  path: string[];
  contradictionPoints: Array<{
    ruleA: string;
    ruleB: string;
    severity: number;
  }>;
  resolutionStrategy?: string;
}

export interface ReinforcementPath {
  path: string[];
  totalReinforcement: number;
  strengtheningRules: string[];
}

export interface GraphTraversalResult {
  nodes: RuleNode[];
  relations: RuleRelation[];
  paths: string[][];
  statistics: {
    totalNodes: number;
    totalRelations: number;
    avgWeight: number;
    density: number;
  };
}
