/**
 * Cognitive Execution Engine - 认知推理引擎
 * 实现真正的推理链执行系统，而非简单 if/else rule matching
 */

import {
  InferenceNode,
  InferenceEdge,
  InferenceTrace,
  SymbolicState,
  ReasoningContext,
  ConfidenceUpdate,
  ContradictionHandleResult,
  CognitiveExecutionResult,
  InferenceNodeType,
} from './types';

export class CognitiveEngine {
  private traces: Map<string, InferenceTrace> = new Map();
  private states: Map<string, SymbolicState> = new Map();
  private currentTraceId: string | null = null;

  async execute(context: ReasoningContext): Promise<CognitiveExecutionResult> {
    const startTime = performance.now();
    const traceId = this.generateTraceId();
    this.currentTraceId = traceId;

    const trace: InferenceTrace = {
      traceId,
      timestamp: Date.now(),
      nodes: new Map(),
      edges: [],
      rootSignals: [],
      conclusions: [],
      contradictions: [],
    };

    const initialState = this.createInitialState(context);
    trace.nodes.set(initialState.stateId, {
      nodeId: initialState.stateId,
      type: 'state_transition',
      label: 'Initial State',
      content: context.input,
      sources: [],
      timestamp: Date.now(),
    });

    const signalNodes = await this.extractSignals(context, trace);
    trace.rootSignals = signalNodes.map(n => n.nodeId);

    const reasoningNodes = await this.performSymbolicReasoning(signalNodes, trace);

    const temporalNodes = await this.propagateTemporal(signalNodes, reasoningNodes, context, trace);

    const hypothesisNodes = await this.generateEventHypotheses(temporalNodes, trace);

    const conflictResults = await this.handleContradictions(trace);

    const confidenceUpdates = await this.updateConfidence(trace);

    const conclusions = await this.deriveConclusions(trace);

    trace.conclusions = conclusions.map(c => c.nodeId);

    this.traces.set(traceId, trace);
    this.states.set(initialState.stateId, initialState);

    const finalState = this.deriveFinalState(trace);

    this.currentTraceId = null;

    return {
      success: conflictResults.resolved || trace.contradictions.length === 0,
      trace,
      finalState,
      conclusions,
      executionTime: performance.now() - startTime,
    };
  }

  private createInitialState(context: ReasoningContext): SymbolicState {
    const stateId = this.generateStateId();
    const properties = new Map<string, any>();

    properties.set('input', context.input);
    properties.set('signalCount', context.signals?.length || 0);
    properties.set('ruleCount', context.rules?.length || 0);

    return {
      stateId,
      properties,
      confidence: 1.0,
      timestamp: Date.now(),
    };
  }

  private async extractSignals(
    context: ReasoningContext,
    trace: InferenceTrace
  ): Promise<InferenceNode[]> {
    const signalNodes: InferenceNode[] = [];
    const signals = context.signals || [];

    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i];
      const nodeId = `signal_${i}_${Date.now()}`;

      const node: InferenceNode = {
        nodeId,
        type: 'signal',
        label: `Signal ${i + 1}`,
        content: signal,
        sources: [],
        timestamp: Date.now(),
        metadata: {
          index: i,
          weight: signal.weight || 0.5,
        },
      };

      trace.nodes.set(nodeId, node);
      signalNodes.push(node);

      trace.edges.push({
        edgeId: `edge_${nodeId}_to_state`,
        from: nodeId,
        to: Array.from(trace.nodes.keys())[0],
        relation: 'causes',
        weight: signal.weight || 0.5,
      });
    }

    return signalNodes;
  }

  private async performSymbolicReasoning(
    signalNodes: InferenceNode[],
    trace: InferenceTrace
  ): Promise<InferenceNode[]> {
    const reasoningNodes: InferenceNode[] = [];

    const symbolMap = this.buildSymbolicMap(signalNodes);

    for (const [symbol, relatedSignals] of symbolMap.entries()) {
      if (relatedSignals.length < 2) continue;

      const nodeId = `reasoning_${symbol}_${Date.now()}`;
      const reasoningContent = this.deriveSymbolicRelation(symbol, relatedSignals);

      const node: InferenceNode = {
        nodeId,
        type: 'symbolic_reasoning',
        label: `Symbolic reasoning: ${symbol}`,
        content: reasoningContent,
        sources: relatedSignals.map(s => s.nodeId),
        timestamp: Date.now(),
        metadata: {
          symbol,
          relatedCount: relatedSignals.length,
          relationType: reasoningContent.relation,
        },
      };

      trace.nodes.set(nodeId, node);
      reasoningNodes.push(node);

      for (const signal of relatedSignals) {
        trace.edges.push({
          edgeId: `edge_${signal.nodeId}_to_${nodeId}`,
          from: signal.nodeId,
          to: nodeId,
          relation: 'supports',
          weight: 0.8,
        });
      }
    }

    return reasoningNodes;
  }

  private buildSymbolicMap(signalNodes: InferenceNode[]): Map<string, InferenceNode[]> {
    const symbolMap = new Map<string, InferenceNode[]>();

    for (const signal of signalNodes) {
      const symbols = this.extractSymbols(signal.content);
      
      for (const symbol of symbols) {
        if (!symbolMap.has(symbol)) {
          symbolMap.set(symbol, []);
        }
        symbolMap.get(symbol)!.push(signal);
      }
    }

    return symbolMap;
  }

  private extractSymbols(content: any): string[] {
    const symbols: string[] = [];
    
    if (typeof content === 'string') {
      const matches = content.match(/[天干地支五行八卦]/g);
      if (matches) {
        symbols.push(...matches);
      }
    } else if (typeof content === 'object' && content !== null) {
      if (content.type) symbols.push(content.type);
      if (content.element) symbols.push(content.element);
      if (content.wuxing) symbols.push(content.wuxing);
    }

    return symbols;
  }

  private deriveSymbolicRelation(
    symbol: string,
    signals: InferenceNode[]
  ): { relation: string; confidence: number; derived: any } {
    const signalContents = signals.map(s => s.content);
    
    let relation = 'unknown';
    let confidence = 0.5;
    let derived: any = {};

    if (symbol.match(/[木火土金水]/)) {
      relation = 'wuxing_relation';
      derived = { element: symbol, wuxing: true };
      confidence = this.calculateWuxingConfidence(signalContents);
    } else if (symbol.match(/[甲乙丙丁戊己庚辛壬癸]/)) {
      relation = 'tiangan_relation';
      derived = { tiangan: symbol };
      confidence = 0.7;
    } else if (symbol.match(/[子丑寅卯辰巳午未申酉戌亥]/)) {
      relation = 'dizhi_relation';
      derived = { dizhi: symbol };
      confidence = 0.7;
    }

    return { relation, confidence, derived };
  }

  private calculateWuxingConfidence(contents: any[]): number {
    let supportiveCount = 0;
    
    for (const content of contents) {
      if (content.wuxing || content.element) {
        supportiveCount++;
      }
    }

    return Math.min(0.95, 0.5 + supportiveCount * 0.1);
  }

  private async propagateTemporal(
    signalNodes: InferenceNode[],
    reasoningNodes: InferenceNode[],
    context: ReasoningContext,
    trace: InferenceTrace
  ): Promise<InferenceNode[]> {
    const temporalNodes: InferenceNode[] = [];
    const sourceNodes = [...signalNodes, ...reasoningNodes];

    const wuxingSequence = this.extractWuxingSequence(sourceNodes);
    
    if (wuxingSequence.length > 0) {
      const nodeId = `temporal_${Date.now()}`;
      
      const temporalPropagation = this.propagateThroughWuxingCycle(wuxingSequence);

      const node: InferenceNode = {
        nodeId,
        type: 'temporal_propagation',
        label: 'Temporal Propagation',
        content: temporalPropagation,
        sources: sourceNodes.map(n => n.nodeId),
        timestamp: Date.now(),
        metadata: {
          sequence: wuxingSequence,
          propagationDepth: wuxingSequence.length,
        },
      };

      trace.nodes.set(nodeId, node);
      temporalNodes.push(node);

      for (const sourceNode of sourceNodes) {
        trace.edges.push({
          edgeId: `edge_${sourceNode.nodeId}_to_${nodeId}`,
          from: sourceNode.nodeId,
          to: nodeId,
          relation: 'temporal',
          weight: 0.6,
        });
      }
    }

    if (context.temporal) {
      const historicalNode = await this.inheritFromHistory(context.temporal, sourceNodes, trace);
      if (historicalNode) {
        temporalNodes.push(historicalNode);
      }
    }

    return temporalNodes;
  }

  private extractWuxingSequence(nodes: InferenceNode[]): string[] {
    const sequence: string[] = [];

    for (const node of nodes) {
      const symbols = this.extractSymbols(node.content);
      for (const symbol of symbols) {
        if (['木', '火', '土', '金', '水'].includes(symbol)) {
          sequence.push(symbol);
        }
      }
    }

    return sequence;
  }

  private propagateThroughWuxingCycle(sequence: string[]): {
    cycle: string[];
    relationships: Array<{ from: string; to: string; type: string }>;
    propagatedState: any;
  } {
    const wuxingCycle = ['木', '火', '土', '金', '水'];
    const relationships: Array<{ from: string; to: string; type: string }> = [];

    for (let i = 0; i < sequence.length - 1; i++) {
      const current = sequence[i];
      const next = sequence[i + 1];
      const relationType = this.getWuxingRelation(current, next, wuxingCycle);
      
      relationships.push({ from: current, to: next, type: relationType });
    }

    return {
      cycle: sequence,
      relationships,
      propagatedState: {
        totalEnergy: sequence.length * 10,
        balance: this.calculateWuxingBalance(sequence),
        direction: this.determineWuxingDirection(sequence),
      },
    };
  }

  private getWuxingRelation(from: string, to: string, cycle: string[]): string {
    const fromIdx = cycle.indexOf(from);
    const toIdx = cycle.indexOf(to);

    const nextIdx = (fromIdx + 1) % cycle.length;
    if (toIdx === nextIdx) return 'sheng';

    const prevIdx = (fromIdx - 1 + cycle.length) % cycle.length;
    if (toIdx === prevIdx) return 'ke';

    return 'neutral';
  }

  private calculateWuxingBalance(sequence: string[]): number {
    const counts = new Map<string, number>();
    for (const s of sequence) {
      counts.set(s, (counts.get(s) || 0) + 1);
    }

    const values = Array.from(counts.values());
    const max = Math.max(...values);
    const min = Math.min(...values);

    return 1 - (max - min) / (sequence.length || 1);
  }

  private determineWuxingDirection(sequence: string[]): string {
    if (sequence.length < 2) return 'neutral';

    const wuxingCycle = ['木', '火', '土', '金', '水'];
    let shengCount = 0;

    for (let i = 0; i < sequence.length - 1; i++) {
      const current = sequence[i];
      const next = sequence[i + 1];
      const nextIdx = (wuxingCycle.indexOf(current) + 1) % 5;
      if (wuxingCycle[nextIdx] === next) shengCount++;
    }

    return shengCount > sequence.length / 2 ? 'expanding' : 'contracting';
  }

  private async inheritFromHistory(
    temporal: any,
    sourceNodes: InferenceNode[],
    trace: InferenceTrace
  ): Promise<InferenceNode | null> {
    if (!temporal.pastStates || temporal.pastStates.length === 0) {
      return null;
    }

    const nodeId = `inheritance_${Date.now()}`;

    const inheritance = {
      inheritedFrom: temporal.pastStates.length,
      inheritedProperties: this.extractInheritableProperties(temporal.pastStates),
      resonance: this.calculateHistoricalResonance(temporal.pastStates, sourceNodes),
    };

    const node: InferenceNode = {
      nodeId,
      type: 'temporal_propagation',
      label: 'Historical Inheritance',
      content: inheritance,
      sources: temporal.pastStates.map((s: SymbolicState) => s.stateId),
      timestamp: Date.now(),
      metadata: { inheritance },
    };

    trace.nodes.set(nodeId, node);

    for (const sourceNode of sourceNodes) {
      trace.edges.push({
        edgeId: `edge_history_${sourceNode.nodeId}`,
        from: sourceNode.nodeId,
        to: nodeId,
        relation: 'temporal',
        weight: inheritance.resonance,
      });
    }

    return node;
  }

  private extractInheritableProperties(pastStates: SymbolicState[]): string[] {
    const properties = new Set<string>();

    for (const state of pastStates) {
      for (const key of state.properties.keys()) {
        if (!['input', 'signalCount'].includes(key)) {
          properties.add(key);
        }
      }
    }

    return Array.from(properties);
  }

  private calculateHistoricalResonance(
    pastStates: SymbolicState[],
    currentNodes: InferenceNode[]
  ): number {
    let totalResonance = 0;

    for (const state of pastStates) {
      for (const node of currentNodes) {
        if (this.hasPropertyResonance(state, node.content)) {
          totalResonance += state.confidence;
        }
      }
    }

    return pastStates.length > 0 
      ? totalResonance / (pastStates.length * currentNodes.length)
      : 0;
  }

  private hasPropertyResonance(state: SymbolicState, content: any): boolean {
    for (const [key, value] of state.properties.entries()) {
      if (typeof value === 'object' && JSON.stringify(value) === JSON.stringify(content)) {
        return true;
      }
    }
    return false;
  }

  private async generateEventHypotheses(
    temporalNodes: InferenceNode[],
    trace: InferenceTrace
  ): Promise<InferenceNode[]> {
    const hypothesisNodes: InferenceNode[] = [];

    for (const temporalNode of temporalNodes) {
      const content = temporalNode.content;

      if (content.propagatedState) {
        const probabilityDistribution = this.generateProbabilityDistribution(content);

        const nodeId = `hypothesis_${temporalNode.nodeId}_${Date.now()}`;

        const node: InferenceNode = {
          nodeId,
          type: 'event_hypothesis',
          label: 'Event Hypothesis',
          content: probabilityDistribution,
          sources: [temporalNode.nodeId],
          timestamp: Date.now(),
          metadata: {
            baseProbability: probabilityDistribution.baseProbability,
            confidence: probabilityDistribution.confidence,
          },
        };

        trace.nodes.set(nodeId, node);

        trace.edges.push({
          edgeId: `edge_${temporalNode.nodeId}_to_${nodeId}`,
          from: temporalNode.nodeId,
          to: nodeId,
          relation: 'derived',
          weight: 0.7,
        });

        hypothesisNodes.push(node);
      }
    }

    return hypothesisNodes;
  }

  private generateProbabilityDistribution(content: any): {
    baseProbability: number;
    scenarios: Array<{ scenario: string; probability: number; conditions: string[] }>;
    confidence: number;
  } {
    const scenarios: Array<{ scenario: string; probability: number; conditions: string[] }> = [];

    if (content.propagatedState) {
      const { balance, direction, totalEnergy } = content.propagatedState;

      scenarios.push({
        scenario: 'favorable',
        probability: balance * (totalEnergy / 100),
        conditions: ['balance > 0.5', 'energy > 30'],
      });

      scenarios.push({
        scenario: 'challenging',
        probability: (1 - balance) * (1 - totalEnergy / 100),
        conditions: ['balance < 0.5', 'energy < 30'],
      });

      scenarios.push({
        scenario: 'neutral',
        probability: Math.abs(balance - 0.5) * 0.5,
        conditions: ['balance around 0.5'],
      });
    }

    const totalProb = scenarios.reduce((sum, s) => sum + s.probability, 0);
    for (const scenario of scenarios) {
      scenario.probability = totalProb > 0 ? scenario.probability / totalProb : 1 / scenarios.length;
    }

    return {
      baseProbability: scenarios.length > 0 ? scenarios[0].probability : 0.5,
      scenarios,
      confidence: content.propagatedState?.balance || 0.5,
    };
  }

  private async handleContradictions(trace: InferenceTrace): Promise<ContradictionHandleResult> {
    const contradictions: Array<{ nodeA: string; nodeB: string }> = [];

    const nodes = Array.from(trace.nodes.values());
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (this.areNodesContradictory(nodes[i], nodes[j])) {
          contradictions.push({
            nodeA: nodes[i].nodeId,
            nodeB: nodes[j].nodeId,
          });
        }
      }
    }

    if (contradictions.length === 0) {
      return { resolved: true, strategy: 'none' };
    }

    trace.contradictions = contradictions.map(c => ({
      ...c,
      resolution: this.resolveContradiction(c, trace),
    }));

    const hierarchical = this.resolveByHierarchy(contradictions, trace);
    if (hierarchical.resolved) {
      return hierarchical;
    }

    return { resolved: false, strategy: 'none', ...contradictions[0] };
  }

  private areNodesContradictory(nodeA: InferenceNode, nodeB: InferenceNode): boolean {
    if (nodeA.type === 'signal' && nodeB.type === 'signal') {
      const contentA = nodeA.content;
      const contentB = nodeB.content;

      if (typeof contentA === 'object' && typeof contentB === 'object') {
        if (contentA.wuxing && contentB.wuxing) {
          const cycle = ['木', '火', '土', '金', '水'];
          const idxA = cycle.indexOf(contentA.wuxing);
          const idxB = cycle.indexOf(contentB.wuxing);

          const keIdx = (idxA + 1) % 5;
          if (keIdx === idxB) return true;

          const oppositeIdx = (idxA + 2) % 5;
          if (oppositeIdx === idxB) return true;
        }
      }
    }

    return false;
  }

  private resolveContradiction(
    contradiction: { nodeA: string; nodeB: string },
    trace: InferenceTrace
  ): string {
    const nodeA = trace.nodes.get(contradiction.nodeA);
    const nodeB = trace.nodes.get(contradiction.nodeB);

    if (!nodeA || !nodeB) return 'unknown';

    if ((nodeA.metadata?.weight || 0.5) > (nodeB.metadata?.weight || 0.5)) {
      return `Node ${nodeA.nodeId} wins due to higher weight`;
    }

    if (nodeA.sources.length > nodeB.sources.length) {
      return `Node ${nodeA.nodeId} wins due to more supporting sources`;
    }

    if (nodeA.timestamp > nodeB.timestamp) {
      return `Node ${nodeA.nodeId} wins due to recency`;
    }

    return 'No clear resolution';
  }

  private resolveByHierarchy(
    contradictions: Array<{ nodeA: string; nodeB: string }>,
    trace: InferenceTrace
  ): ContradictionHandleResult {
    const priorityOrder: InferenceNodeType[] = [
      'state_transition',
      'temporal_propagation',
      'symbolic_reasoning',
      'event_hypothesis',
      'signal',
      'confidence_update',
      'contradiction',
      'conclusion',
    ];

    for (const contradiction of contradictions) {
      const nodeA = trace.nodes.get(contradiction.nodeA);
      const nodeB = trace.nodes.get(contradiction.nodeB);

      if (!nodeA || !nodeB) continue;

      const priorityA = priorityOrder.indexOf(nodeA.type);
      const priorityB = priorityOrder.indexOf(nodeB.type);

      if (priorityA < priorityB) {
        return {
          resolved: true,
          strategy: 'hierarchical',
          winner: nodeA.nodeId,
          loser: nodeB.nodeId,
          resolution: `Node ${nodeA.type} takes precedence over ${nodeB.type}`,
        };
      } else if (priorityB < priorityA) {
        return {
          resolved: true,
          strategy: 'hierarchical',
          winner: nodeB.nodeId,
          loser: nodeA.nodeId,
          resolution: `Node ${nodeB.type} takes precedence over ${nodeA.type}`,
        };
      }
    }

    return { resolved: false, strategy: 'hierarchical' };
  }

  private async updateConfidence(trace: InferenceTrace): Promise<ConfidenceUpdate[]> {
    const updates: ConfidenceUpdate[] = [];
    const nodes = Array.from(trace.nodes.values());

    for (const node of nodes) {
      let newConfidence = node.metadata?.weight || 0.5;

      for (const edge of trace.edges) {
        if (edge.to === node.nodeId && edge.relation === 'supports') {
          const sourceNode = trace.nodes.get(edge.from);
          if (sourceNode) {
            newConfidence *= sourceNode.metadata?.weight || 0.5;
          }
        }
      }

      newConfidence = Math.min(0.99, Math.max(0.01, newConfidence));

      updates.push({
        nodeId: node.nodeId,
        oldConfidence: node.metadata?.weight || 0.5,
        newConfidence,
        reason: 'Propagation from supporting nodes',
        propagation: true,
      });

      node.metadata = { ...node.metadata, weight: newConfidence };
    }

    return updates;
  }

  private async deriveConclusions(trace: InferenceTrace): Promise<InferenceNode[]> {
    const conclusions: InferenceNode[] = [];
    const hypothesisNodes = Array.from(trace.nodes.values()).filter(
      n => n.type === 'event_hypothesis'
    );

    if (hypothesisNodes.length === 0) return conclusions;

    const aggregated = this.aggregateHypotheses(hypothesisNodes);

    const nodeId = `conclusion_${Date.now()}`;

    const conclusion: InferenceNode = {
      nodeId,
      type: 'conclusion',
      label: 'Final Conclusion',
      content: aggregated,
      sources: hypothesisNodes.map(n => n.nodeId),
      timestamp: Date.now(),
      metadata: {
        aggregatedProbability: aggregated.probability,
        confidence: aggregated.confidence,
        supportingNodes: hypothesisNodes.length,
      },
    };

    trace.nodes.set(nodeId, conclusion);
    conclusions.push(conclusion);

    for (const hypothesis of hypothesisNodes) {
      trace.edges.push({
        edgeId: `edge_${hypothesis.nodeId}_to_conclusion`,
        from: hypothesis.nodeId,
        to: nodeId,
        relation: 'supports',
        weight: hypothesis.metadata?.weight || 0.5,
      });
    }

    return conclusions;
  }

  private aggregateHypotheses(hypothesisNodes: InferenceNode[]): {
    probability: number;
    scenarios: Record<string, number>;
    confidence: number;
    narrative: string;
  } {
    const scenarios: Record<string, number> = {};
    let totalConfidence = 0;
    let totalWeight = 0;

    for (const node of hypothesisNodes) {
      const content = node.content;
      if (content.scenarios) {
        for (const scenario of content.scenarios) {
          scenarios[scenario.scenario] = (scenarios[scenario.scenario] || 0) + scenario.probability;
        }
      }

      totalConfidence += (node.metadata?.confidence || 0.5) * (node.metadata?.weight || 0.5);
      totalWeight += node.metadata?.weight || 0.5;
    }

    const avgConfidence = totalWeight > 0 ? totalConfidence / totalWeight : 0.5;
    const probability = Object.values(scenarios)[0] || 0.5;

    const dominantScenario = Object.entries(scenarios).sort((a, b) => b[1] - a[1])[0];

    return {
      probability,
      scenarios,
      confidence: avgConfidence,
      narrative: `Based on ${hypothesisNodes.length} hypotheses, the most likely outcome is ${dominantScenario[0]} with ${(dominantScenario[1] * 100).toFixed(1)}% probability.`,
    };
  }

  private deriveFinalState(trace: InferenceTrace): SymbolicState {
    const stateId = this.generateStateId();
    const properties = new Map<string, any>();

    const conclusionNodes = Array.from(trace.nodes.values()).filter(
      n => n.type === 'conclusion'
    );

    if (conclusionNodes.length > 0) {
      const finalConclusion = conclusionNodes[conclusionNodes.length - 1];
      properties.set('conclusion', finalConclusion.content);
      properties.set('probability', finalConclusion.metadata?.aggregatedProbability);
    }

    properties.set('nodeCount', trace.nodes.size);
    properties.set('edgeCount', trace.edges.length);
    properties.set('contradictionCount', trace.contradictions.length);

    return {
      stateId,
      properties,
      confidence: conclusionNodes[0]?.metadata?.confidence || 0.5,
      timestamp: Date.now(),
    };
  }

  getTrace(traceId: string): InferenceTrace | undefined {
    return this.traces.get(traceId);
  }

  getAllTraces(): InferenceTrace[] {
    return Array.from(this.traces.values());
  }

  getState(stateId: string): SymbolicState | undefined {
    return this.states.get(stateId);
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateStateId(): string {
    return `state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
