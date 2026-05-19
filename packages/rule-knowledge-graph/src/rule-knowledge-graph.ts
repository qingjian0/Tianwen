/**
 * Rule Knowledge Graph - 规则知识图谱
 * 实现真正的图结构，而非简单数组存储
 */

import {
  RuleNode,
  RuleRelation,
  RelationType,
  GraphQuery,
  SemanticRelation,
  WeightedRelation,
  ContradictionPath,
  ReinforcementPath,
  GraphTraversalResult,
} from './types';

export class RuleKnowledgeGraph {
  private nodes: Map<string, RuleNode> = new Map();
  private relations: RuleRelation[] = [];
  private adjacencyList: Map<string, Set<string>> = new Map();
  private reverseAdjacencyList: Map<string, Set<string>> = new Map();
  private relationIndex: Map<string, RuleRelation[]> = new Map();

  addRule(rule: Omit<RuleNode, 'nodeId' | 'createdAt' | 'updatedAt'>): RuleNode {
    const nodeId = `rule_node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const node: RuleNode = {
      ...rule,
      nodeId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.nodes.set(nodeId, node);
    this.adjacencyList.set(nodeId, new Set());
    this.reverseAdjacencyList.set(nodeId, new Set());

    return node;
  }

  addRelation(
    sourceRuleId: string,
    targetRuleId: string,
    relationType: RelationType,
    weight: number = 0.5,
    metadata?: Record<string, any>
  ): RuleRelation | null {
    const sourceNode = this.findNodeByRuleId(sourceRuleId);
    const targetNode = this.findNodeByRuleId(targetRuleId);

    if (!sourceNode || !targetNode) {
      return null;
    }

    const relationId = `relation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const relation: RuleRelation = {
      relationId,
      sourceRuleId,
      targetRuleId,
      relationType,
      weight,
      metadata,
    };

    this.relations.push(relation);
    this.adjacencyList.get(sourceNode.nodeId)!.add(targetNode.nodeId);
    this.reverseAdjacencyList.get(targetNode.nodeId)!.add(sourceNode.nodeId);

    if (!this.relationIndex.has(relationType)) {
      this.relationIndex.set(relationType, []);
    }
    this.relationIndex.get(relationType)!.push(relation);

    return relation;
  }

  private findNodeByRuleId(ruleId: string): RuleNode | undefined {
    for (const node of this.nodes.values()) {
      if (node.ruleId === ruleId) {
        return node;
      }
    }
    return undefined;
  }

  private findNodeByNodeId(nodeId: string): RuleNode | undefined {
    return this.nodes.get(nodeId);
  }

  query(query: GraphQuery): GraphTraversalResult {
    let filteredNodes = Array.from(this.nodes.values());

    if (query.ruleId) {
      filteredNodes = filteredNodes.filter(n => n.ruleId === query.ruleId);
    }

    if (query.category) {
      filteredNodes = filteredNodes.filter(n => n.category === query.category);
    }

    let filteredRelations = [...this.relations];

    if (query.relationType) {
      filteredRelations = filteredRelations.filter(
        r => r.relationType === query.relationType
      );
    }

    const paths: string[][] = [];
    const visited = new Set<string>();

    for (const node of filteredNodes) {
      if (query.maxDepth && query.maxDepth > 0) {
        const nodePaths = this.findAllPaths(node.nodeId, query.maxDepth, visited);
        paths.push(...nodePaths);
      }
    }

    const totalPossible = filteredNodes.length * filteredNodes.length;
    const density = totalPossible > 0 ? filteredRelations.length / totalPossible : 0;

    return {
      nodes: filteredNodes.slice(0, query.limit || 50),
      relations: filteredRelations.slice(0, query.limit || 100),
      paths: paths.slice(0, query.limit || 20),
      statistics: {
        totalNodes: filteredNodes.length,
        totalRelations: filteredRelations.length,
        avgWeight: filteredRelations.length > 0
          ? filteredRelations.reduce((sum, r) => sum + r.weight, 0) / filteredRelations.length
          : 0,
        density,
      },
    };
  }

  private findAllPaths(startNodeId: string, maxDepth: number, visited: Set<string>): string[][] {
    const paths: string[][] = [];

    const dfs = (currentId: string, path: string[], depth: number) => {
      if (depth > maxDepth) return;
      if (visited.has(currentId)) return;

      path.push(currentId);

      const neighbors = this.adjacencyList.get(currentId) || new Set();
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          dfs(neighborId, [...path], depth + 1);
        }
      }

      if (path.length > 1) {
        paths.push(path);
      }
    };

    dfs(startNodeId, [], 0);
    return paths;
  }

  findSemanticRelations(ruleId: string): SemanticRelation[] {
    const node = this.findNodeByRuleId(ruleId);
    if (!node) return [];

    const relations: SemanticRelation[] = [];

    const outgoing = this.adjacencyList.get(node.nodeId) || new Set();
    for (const targetNodeId of outgoing) {
      const targetNode = this.findNodeByNodeId(targetNodeId);
      if (targetNode) {
        relations.push({
          sourceId: node.ruleId,
          targetId: targetNode.ruleId,
          relationType: this.getRelationType(node.nodeId, targetNodeId),
          semanticSimilarity: this.calculateSemanticSimilarity(node, targetNode),
          evidence: this.findRelationEvidence(node.nodeId, targetNodeId),
        });
      }
    }

    const incoming = this.reverseAdjacencyList.get(node.nodeId) || new Set();
    for (const sourceNodeId of incoming) {
      const sourceNode = this.findNodeByNodeId(sourceNodeId);
      if (sourceNode) {
        relations.push({
          sourceId: sourceNode.ruleId,
          targetId: node.ruleId,
          relationType: this.getRelationType(sourceNodeId, node.nodeId),
          semanticSimilarity: this.calculateSemanticSimilarity(sourceNode, node),
          evidence: this.findRelationEvidence(sourceNodeId, node.nodeId),
        });
      }
    }

    return relations;
  }

  private getRelationType(sourceId: string, targetId: string): string {
    const relation = this.relations.find(
      r => this.findNodeByNodeId(r.sourceRuleId)?.nodeId === sourceId &&
           this.findNodeByNodeId(r.targetRuleId)?.nodeId === targetId
    );
    return relation?.relationType || 'unknown';
  }

  private calculateSemanticSimilarity(nodeA: RuleNode, nodeB: RuleNode): number {
    let similarity = 0;
    let factors = 0;

    if (nodeA.category === nodeB.category) {
      similarity += 0.4;
    }
    factors += 0.4;

    const keysA = Object.keys(nodeA.properties).sort();
    const keysB = Object.keys(nodeB.properties).sort();
    const commonKeys = keysA.filter(k => keysB.includes(k));
    if (commonKeys.length > 0) {
      const keyOverlap = commonKeys.length / Math.max(keysA.length, keysB.length);
      similarity += keyOverlap * 0.3;
    }
    factors += 0.3;

    const propSimilarity = this.calculatePropertySimilarity(nodeA.properties, nodeB.properties);
    similarity += propSimilarity * 0.3;
    factors += 0.3;

    return factors > 0 ? similarity / factors : 0;
  }

  private calculatePropertySimilarity(
    propsA: Record<string, any>,
    propsB: Record<string, any>
  ): number {
    const allKeys = new Set([...Object.keys(propsA), ...Object.keys(propsB)]);
    if (allKeys.size === 0) return 0;

    let totalSimilarity = 0;

    for (const key of allKeys) {
      const valA = propsA[key];
      const valB = propsB[key];

      if (valA === valB) {
        totalSimilarity += 1;
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        const diff = Math.abs(valA - valB);
        const max = Math.max(Math.abs(valA), Math.abs(valB));
        totalSimilarity += max > 0 ? 1 - diff / max : 1;
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        const distance = this.levenshteinDistance(valA, valB);
        const maxLen = Math.max(valA.length, valB.length);
        totalSimilarity += maxLen > 0 ? 1 - distance / maxLen : 1;
      }
    }

    return totalSimilarity / allKeys.size;
  }

  private levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  private findRelationEvidence(sourceId: string, targetId: string): string[] {
    const evidence: string[] = [];

    for (const relation of this.relations) {
      const sourceNode = this.findNodeByNodeId(relation.sourceRuleId);
      const targetNode = this.findNodeByNodeId(relation.targetRuleId);

      if (sourceNode?.nodeId === sourceId && targetNode?.nodeId === targetId) {
        evidence.push(`Relation type: ${relation.relationType}`);
        evidence.push(`Weight: ${relation.weight}`);
        if (relation.metadata) {
          for (const [key, value] of Object.entries(relation.metadata)) {
            evidence.push(`${key}: ${value}`);
          }
        }
      }
    }

    return evidence;
  }

  findWeightedRelations(ruleId: string): WeightedRelation[] {
    const node = this.findNodeByRuleId(ruleId);
    if (!node) return [];

    const weightedRelations: WeightedRelation[] = [];

    for (const relation of this.relations) {
      if (relation.sourceRuleId === ruleId || relation.targetRuleId === ruleId) {
        const reinforcement = this.calculateReinforcement(relation);

        weightedRelations.push({
          relationId: relation.relationId,
          weight: relation.weight,
          confidence: relation.weight * reinforcement,
          reinforcement,
        });
      }
    }

    return weightedRelations.sort((a, b) => b.confidence - a.confidence);
  }

  private calculateReinforcement(relation: RuleRelation): number {
    const sourceNode = this.findNodeByRuleId(relation.sourceRuleId);
    const targetNode = this.findNodeByRuleId(relation.targetRuleId);

    if (!sourceNode || !targetNode) return 0;

    let reinforcement = 1;

    if (relation.relationType === 'supports' || relation.relationType === 'refines') {
      reinforcement *= 1 + sourceNode.confidence * 0.5;
    } else if (relation.relationType === 'contradicts' || relation.relationType === 'conflicts_with') {
      reinforcement *= 0.5;
    }

    const incomingCount = (this.reverseAdjacencyList.get(sourceNode.nodeId) || new Set()).size;
    reinforcement *= 1 + Math.log(incomingCount + 1) * 0.1;

    return Math.min(2, reinforcement);
  }

  findContradictionPath(ruleAId: string, ruleBId: string): ContradictionPath | null {
    const nodeA = this.findNodeByRuleId(ruleAId);
    const nodeB = this.findNodeByRuleId(ruleBId);

    if (!nodeA || !nodeB) return null;

    const contradictionRelations = this.relations.filter(
      r => r.relationType === 'contradicts' || r.relationType === 'conflicts_with'
    );

    const contradictionPoints: ContradictionPath['contradictionPoints'] = [];

    for (const relation of contradictionRelations) {
      if (
        (relation.sourceRuleId === ruleAId && relation.targetRuleId === ruleBId) ||
        (relation.sourceRuleId === ruleBId && relation.targetRuleId === ruleAId)
      ) {
        contradictionPoints.push({
          ruleA: ruleAId,
          ruleB: ruleBId,
          severity: 1 - relation.weight,
        });
      }
    }

    const path = this.findShortestPath(nodeA.nodeId, nodeB.nodeId);

    if (path.length === 0) return null;

    return {
      path,
      contradictionPoints,
      resolutionStrategy: this.determineResolutionStrategy(contradictionPoints, path),
    };
  }

  private findShortestPath(startId: string, endId: string): string[] {
    const queue: Array<{ id: string; path: string[] }> = [{ id: startId, path: [startId] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { id, path } = queue.shift()!;

      if (id === endId) {
        return path;
      }

      if (visited.has(id)) continue;
      visited.add(id);

      const neighbors = this.adjacencyList.get(id) || new Set();
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          queue.push({ id: neighborId, path: [...path, neighborId] });
        }
      }
    }

    return [];
  }

  private determineResolutionStrategy(
    contradictions: ContradictionPath['contradictionPoints'],
    path: string[]
  ): string {
    if (contradictions.length === 0) return 'no_contradiction';

    const avgSeverity = contradictions.reduce((sum, c) => sum + c.severity, 0) / contradictions.length;

    if (avgSeverity > 0.7) return 'hierarchical';
    if (avgSeverity > 0.4) return 'weighting';
    return 'temporal';
  }

  findReinforcementPath(startRuleId: string, endRuleId: string): ReinforcementPath | null {
    const startNode = this.findNodeByRuleId(startRuleId);
    const endNode = this.findNodeByRuleId(endRuleId);

    if (!startNode || !endNode) return null;

    const path = this.findShortestPath(startNode.nodeId, endNode.nodeId);
    if (path.length === 0) return null;

    let totalReinforcement = 0;
    const strengtheningRules: string[] = [];

    for (let i = 0; i < path.length - 1; i++) {
      const sourceId = path[i];
      const targetId = path[i + 1];

      const relation = this.relations.find(r => {
        const source = this.findNodeByNodeId(r.sourceRuleId);
        const target = this.findNodeByNodeId(r.targetRuleId);
        return source?.nodeId === sourceId && target?.nodeId === targetId;
      });

      if (relation) {
        const reinforcement = this.calculateReinforcement(relation);
        totalReinforcement += reinforcement;

        if (reinforcement > 1.2) {
          strengtheningRules.push(relation.relationId);
        }
      }
    }

    return {
      path,
      totalReinforcement,
      strengtheningRules,
    };
  }

  getSubgraph(centerRuleId: string, depth: number = 2): GraphTraversalResult {
    const centerNode = this.findNodeByRuleId(centerRuleId);
    if (!centerNode) {
      return {
        nodes: [],
        relations: [],
        paths: [],
        statistics: { totalNodes: 0, totalRelations: 0, avgWeight: 0, density: 0 },
      };
    }

    const includedNodes = new Set<string>([centerNode.nodeId]);
    const includedRelations: RuleRelation[] = [];

    const bfs = (startId: string, currentDepth: number) => {
      if (currentDepth >= depth) return;

      const neighbors = this.adjacencyList.get(startId) || new Set();
      for (const neighborId of neighbors) {
        if (!includedNodes.has(neighborId)) {
          includedNodes.add(neighborId);
          bfs(neighborId, currentDepth + 1);
        }
      }

      const reverseNeighbors = this.reverseAdjacencyList.get(startId) || new Set();
      for (const neighborId of reverseNeighbors) {
        if (!includedNodes.has(neighborId)) {
          includedNodes.add(neighborId);
          bfs(neighborId, currentDepth + 1);
        }
      }
    };

    bfs(centerNode.nodeId, 0);

    for (const relation of this.relations) {
      const sourceNode = this.findNodeByNodeId(relation.sourceRuleId);
      const targetNode = this.findNodeByNodeId(relation.targetRuleId);

      if (sourceNode && targetNode &&
          includedNodes.has(sourceNode.nodeId) &&
          includedNodes.has(targetNode.nodeId)) {
        includedRelations.push(relation);
      }
    }

    const nodes = Array.from(includedNodes)
      .map(id => this.nodes.get(id))
      .filter((n): n is RuleNode => n !== undefined);

    return {
      nodes,
      relations: includedRelations,
      paths: [],
      statistics: {
        totalNodes: nodes.length,
        totalRelations: includedRelations.length,
        avgWeight: includedRelations.length > 0
          ? includedRelations.reduce((sum, r) => sum + r.weight, 0) / includedRelations.length
          : 0,
        density: nodes.length > 1 ? includedRelations.length / (nodes.length * (nodes.length - 1)) : 0,
      },
    };
  }

  getStatistics(): {
    totalNodes: number;
    totalRelations: number;
    relationTypes: Record<RelationType, number>;
    avgWeight: number;
    density: number;
  } {
    const relationTypes: Record<RelationType, number> = {
      supports: 0,
      contradicts: 0,
      refines: 0,
      supersedes: 0,
      derived_from: 0,
      triggered_by: 0,
      conflicts_with: 0,
    };

    for (const relation of this.relations) {
      relationTypes[relation.relationType]++;
    }

    return {
      totalNodes: this.nodes.size,
      totalRelations: this.relations.length,
      relationTypes,
      avgWeight: this.relations.length > 0
        ? this.relations.reduce((sum, r) => sum + r.weight, 0) / this.relations.length
        : 0,
      density: this.nodes.size > 1
        ? this.relations.length / (this.nodes.size * (this.nodes.size - 1))
        : 0,
    };
  }

  removeRule(ruleId: string): boolean {
    const node = this.findNodeByRuleId(ruleId);
    if (!node) return false;

    this.adjacencyList.delete(node.nodeId);
    this.reverseAdjacencyList.delete(node.nodeId);

    this.relations = this.relations.filter(
      r => r.sourceRuleId !== ruleId && r.targetRuleId !== ruleId
    );

    for (const [type, rels] of this.relationIndex.entries()) {
      this.relationIndex.set(
        type,
        rels.filter(r => r.sourceRuleId !== ruleId && r.targetRuleId !== ruleId)
      );
    }

    for (const neighbors of this.adjacencyList.values()) {
      neighbors.delete(node.nodeId);
    }

    for (const neighbors of this.reverseAdjacencyList.values()) {
      neighbors.delete(node.nodeId);
    }

    this.nodes.delete(node.nodeId);
    return true;
  }
}
