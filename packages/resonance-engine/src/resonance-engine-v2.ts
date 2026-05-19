/**
 * Multi-System Resonance Engine v2 - 多术数融合推理引擎
 * 实现真正的冲突推理、融合推理，而非简单加权平均
 */

import {
  SystemInput,
  SystemSignal,
  ConflictReasoning,
  ConflictResolution,
  FusionReasoning,
  FusedConclusion,
  ResonanceTrace,
  ResonanceContext,
  SystemHierarchy,
  ResonanceScoring,
  SystemAgreement,
  TemporalAlignment,
  SystemType,
} from './types';

export class MultiSystemResonanceEngine {
  private systemHierarchy: SystemHierarchy[] = [
    { system: 'bazi', priority: 1, weight: 1.0 },
    { system: 'liuyao', priority: 2, weight: 0.9 },
    { system: 'meihua', priority: 3, weight: 0.85 },
    { system: 'qimen', priority: 4, weight: 0.8 },
    { system: 'ziwei', priority: 5, weight: 0.75 },
  ];

  async fuse(
    inputs: SystemInput[],
    context?: ResonanceContext
  ): Promise<ResonanceTrace> {
    const startTime = performance.now();
    const traceId = `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const conflicts = this.detectConflicts(inputs);

    const resolutions = this.resolveConflicts(conflicts, context);

    const fusionReasoning = await this.performFusion(inputs, conflicts, resolutions);

    const finalResult = this.deriveFinalConclusion(fusionReasoning);

    const trace: ResonanceTrace = {
      traceId,
      timestamp: Date.now(),
      inputs,
      conflicts,
      resolutions,
      fusionReasoning,
      finalResult,
      executionTime: performance.now() - startTime,
    };

    return trace;
  }

  private detectConflicts(inputs: SystemInput[]): ConflictReasoning[] {
    const conflicts: ConflictReasoning[] = [];

    for (let i = 0; i < inputs.length; i++) {
      for (let j = i + 1; j < inputs.length; j++) {
        const inputA = inputs[i];
        const inputB = inputs[j];

        const systemConflicts = this.findConflictsBetweenSystems(inputA, inputB);

        conflicts.push(...systemConflicts);
      }
    }

    return conflicts;
  }

  private findConflictsBetweenSystems(
    inputA: SystemInput,
    inputB: SystemInput
  ): ConflictReasoning[] {
    const conflicts: ConflictReasoning[] = [];

    for (const signalA of inputA.signals) {
      for (const signalB of inputB.signals) {
        if (this.areSignalsContradictory(signalA, signalB)) {
          const severity = this.calculateConflictSeverity(signalA, signalB);

          conflicts.push({
            conflictId: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            systemA: inputA.system,
            systemB: inputB.system,
            signalA,
            signalB,
            severity,
            source: this.determineConflictSource(signalA, signalB),
          });
        }
      }
    }

    return conflicts;
  }

  private areSignalsContradictory(signalA: SystemSignal, signalB: SystemSignal): boolean {
    if (signalA.wuxing && signalB.wuxing) {
      const cycle = ['木', '火', '土', '金', '水'];
      const idxA = cycle.indexOf(signalA.wuxing);
      const idxB = cycle.indexOf(signalB.wuxing);

      if (idxA === -1 || idxB === -1) return false;

      const keIdx = (idxA + 1) % 5;
      if (keIdx === idxB) return true;

      const oppositeIdx = (idxA + 2) % 5;
      if (oppositeIdx === idxB) return true;
    }

    if (signalA.timeline && signalB.timeline) {
      const cycle = ['春', '夏', '秋', '冬'];
      const idxA = cycle.indexOf(signalA.timeline);
      const idxB = cycle.indexOf(signalB.timeline);

      if (idxA !== -1 && idxB !== -1) {
        const nextIdx = (idxA + 1) % 4;
        if (nextIdx === idxB) return true;
      }
    }

    if (typeof signalA.value === 'boolean' && typeof signalB.value === 'boolean') {
      return signalA.value !== signalB.value;
    }

    if (typeof signalA.value === 'string' && typeof signalB.value === 'string') {
      return signalA.value !== signalB.value && signalA.type === signalB.type;
    }

    return false;
  }

  private calculateConflictSeverity(signalA: SystemSignal, signalB: SystemSignal): number {
    let severity = 0.5;

    if (signalA.wuxing && signalB.wuxing) {
      severity += 0.2;
    }

    severity += Math.abs(signalA.weight - signalB.weight) * 0.3;

    return Math.min(1, Math.max(0, severity));
  }

  private determineConflictSource(signalA: SystemSignal, signalB: SystemSignal): string {
    if (signalA.wuxing && signalB.wuxing) {
      return 'wuxing_contradiction';
    }
    if (signalA.timeline && signalB.timeline) {
      return 'temporal_contradiction';
    }
    if (signalA.type === signalB.type) {
      return `type_${signalA.type}_contradiction`;
    }
    return 'general_contradiction';
  }

  private resolveConflicts(
    conflicts: ConflictReasoning[],
    context?: ResonanceContext
  ): ConflictResolution[] {
    const resolutions: ConflictResolution[] = [];

    for (const conflict of conflicts) {
      const resolution = this.resolveSingleConflict(conflict, context);
      conflict.resolution = resolution;
      resolutions.push(resolution);
    }

    return resolutions;
  }

  private resolveSingleConflict(
    conflict: ConflictReasoning,
    context?: ResonanceContext
  ): ConflictResolution {
    const hierarchyA = this.getSystemHierarchy(conflict.systemA);
    const hierarchyB = this.getSystemHierarchy(conflict.systemB);

    if (hierarchyA.priority < hierarchyB.priority) {
      return {
        strategy: 'hierarchical',
        winner: conflict.systemA,
        loser: conflict.systemB,
        confidence: hierarchyA.weight,
        reasoning: `${conflict.systemA} takes precedence over ${conflict.systemB} due to system priority`,
      };
    } else if (hierarchyB.priority < hierarchyA.priority) {
      return {
        strategy: 'hierarchical',
        winner: conflict.systemB,
        loser: conflict.systemA,
        confidence: hierarchyB.weight,
        reasoning: `${conflict.systemB} takes precedence over ${conflict.systemA} due to system priority`,
      };
    }

    if (conflict.resolution === undefined && conflict.severity > 0.7) {
      return {
        strategy: 'weighting',
        winner: conflict.signalA.weight > conflict.signalB.weight ? conflict.systemA : conflict.systemB,
        loser: conflict.signalA.weight > conflict.signalB.weight ? conflict.systemB : conflict.systemA,
        confidence: Math.max(conflict.signalA.weight, conflict.signalB.weight),
        reasoning: 'Conflict resolved by signal weight',
      };
    }

    if (context?.question) {
      return {
        strategy: 'contextual',
        winner: this.determineContextualWinner(conflict, context.question),
        loser: this.determineContextualLoser(conflict, context.question),
        confidence: 0.6,
        reasoning: 'Conflict resolved by contextual relevance',
      };
    }

    return {
      strategy: 'temporal',
      winner: conflict.systemA,
      loser: conflict.systemB,
      confidence: 0.5,
      reasoning: 'Default resolution by order',
    };
  }

  private getSystemHierarchy(system: SystemType): SystemHierarchy {
    return (
      this.systemHierarchy.find(h => h.system === system) || {
        system,
        priority: 99,
        weight: 0.5,
      }
    );
  }

  private determineContextualWinner(conflict: ConflictReasoning, question: string): SystemType {
    const questionLower = question.toLowerCase();

    if (questionLower.includes('事业') || questionLower.includes('工作')) {
      return conflict.systemA === 'bazi' ? conflict.systemA : conflict.systemB;
    }

    if (questionLower.includes('感情') || questionLower.includes('婚姻')) {
      return conflict.systemA === 'liuyao' ? conflict.systemA : conflict.systemB;
    }

    if (questionLower.includes('投资') || questionLower.includes('财运')) {
      return conflict.systemA === 'meihua' ? conflict.systemA : conflict.systemB;
    }

    return conflict.systemA;
  }

  private determineContextualLoser(conflict: ConflictReasoning, question: string): SystemType {
    return conflict.winner === conflict.systemA ? conflict.systemB : conflict.systemA;
  }

  private async performFusion(
    inputs: SystemInput[],
    conflicts: ConflictReasoning[],
    resolutions: ConflictResolution[]
  ): Promise<FusionReasoning> {
    const trace: FusionReasoning['trace'] = [];

    trace.push({
      step: 1,
      action: 'Initialize fusion',
      systems: inputs.map(i => i.system),
      result: { systemsCount: inputs.length },
      confidence: 1.0,
    });

    const harmonizedSignals = this.harmonizeSignals(inputs, conflicts);

    trace.push({
      step: 2,
      action: 'Harmonize signals',
      systems: inputs.map(i => i.system),
      result: { harmonizedCount: harmonizedSignals.length },
      confidence: 0.9,
    });

    const scoring = this.calculateResonanceScoring(inputs, conflicts);

    trace.push({
      step: 3,
      action: 'Calculate resonance scoring',
      systems: inputs.map(i => i.system),
      result: scoring,
      confidence: scoring.harmony / scoring.total,
    });

    const agreement = this.findSystemAgreement(inputs);

    trace.push({
      step: 4,
      action: 'Find system agreement',
      systems: agreement.systems,
      result: { agreementLevel: agreement.agreementLevel },
      confidence: agreement.agreementLevel,
    });

    const fusedConclusion = this.generateFusedConclusion(inputs, conflicts, scoring, agreement);

    trace.push({
      step: 5,
      action: 'Generate fused conclusion',
      systems: inputs.map(i => i.system),
      result: fusedConclusion,
      confidence: fusedConclusion.finalConfidence,
    });

    const fusionConfidence = this.calculateFusionConfidence(inputs, conflicts, scoring);

    return {
      fusionId: `fusion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      inputSystems: inputs.map(i => i.system),
      harmonizedSignals,
      contradictions: conflicts,
      fusedConclusion,
      confidence: fusionConfidence,
      trace,
    };
  }

  private harmonizeSignals(inputs: SystemInput[], conflicts: ConflictReasoning[]): SystemSignal[] {
    const allSignals: SystemSignal[] = [];
    const conflictMap = new Map<string, SystemType>();

    for (const conflict of conflicts) {
      if (conflict.resolution) {
        conflictMap.set(conflict.signalA.signalId, conflict.resolution.winner);
        conflictMap.set(conflict.signalB.signalId, conflict.resolution.winner);
      }
    }

    for (const input of inputs) {
      for (const signal of input.signals) {
        const winner = conflictMap.get(signal.signalId);

        if (!winner || winner === input.system) {
          allSignals.push({
            ...signal,
            weight: winner ? signal.weight * 1.1 : signal.weight,
          });
        }
      }
    }

    return allSignals;
  }

  private calculateResonanceScoring(inputs: SystemInput[], conflicts: ConflictReasoning[]): ResonanceScoring {
    let harmony = 0;
    let conflict = 0;
    let neutral = 0;
    let total = 0;

    for (let i = 0; i < inputs.length; i++) {
      for (let j = i + 1; j < inputs.length; j++) {
        const inputA = inputs[i];
        const inputB = inputs[j];

        const hasConflict = conflicts.some(
          c =>
            (c.systemA === inputA.system && c.systemB === inputB.system) ||
            (c.systemA === inputB.system && c.systemB === inputA.system)
        );

        const agreement = this.checkSystemAgreement(inputA, inputB);

        if (hasConflict) {
          conflict++;
        } else if (agreement > 0.7) {
          harmony++;
        } else {
          neutral++;
        }

        total++;
      }
    }

    return { harmony, conflict, neutral, total };
  }

  private checkSystemAgreement(inputA: SystemInput, inputB: SystemInput): number {
    let agreementScore = 0;
    let comparisons = 0;

    for (const signalA of inputA.signals) {
      for (const signalB of inputB.signals) {
        if (signalA.type === signalB.type) {
          comparisons++;

          if (signalA.wuxing === signalB.wuxing) {
            agreementScore += 1;
          } else if (signalA.timeline === signalB.timeline) {
            agreementScore += 1;
          } else if (signalA.value === signalB.value) {
            agreementScore += 1;
          } else if (typeof signalA.value === 'number' && typeof signalB.value === 'number') {
            const diff = Math.abs(signalA.value - signalB.value);
            if (diff < 0.2) {
              agreementScore += 1;
            }
          }
        }
      }
    }

    return comparisons > 0 ? agreementScore / comparisons : 0;
  }

  private findSystemAgreement(inputs: SystemInput[]): SystemAgreement {
    const systems = inputs.map(i => i.system);
    let totalAgreement = 0;
    let comparisons = 0;

    for (let i = 0; i < inputs.length; i++) {
      for (let j = i + 1; j < inputs.length; j++) {
        totalAgreement += this.checkSystemAgreement(inputs[i], inputs[j]);
        comparisons++;
      }
    }

    const agreementLevel = comparisons > 0 ? totalAgreement / comparisons : 0;

    const supportingSignals: SystemSignal[] = [];
    for (const input of inputs) {
      for (const signal of input.signals) {
        let isSupporting = true;

        for (const otherInput of inputs) {
          if (otherInput.system === input.system) continue;

          const hasConflict = otherInput.signals.some(otherSignal =>
            this.areSignalsContradictory(signal, otherSignal)
          );

          if (hasConflict) {
            isSupporting = false;
            break;
          }
        }

        if (isSupporting) {
          supportingSignals.push(signal);
        }
      }
    }

    return {
      systems,
      agreementLevel,
      supportingSignals,
    };
  }

  private generateFusedConclusion(
    inputs: SystemInput[],
    conflicts: ConflictReasoning[],
    scoring: ResonanceScoring,
    agreement: SystemAgreement
  ): FusedConclusion {
    const supportingSystems: SystemType[] = [];
    const contradictingSystems: SystemType[] = [];

    for (const input of inputs) {
      const hasMajorConflict = conflicts.some(
        c =>
          (c.systemA === input.system || c.systemB === input.system) &&
          c.severity > 0.7 &&
          c.resolution?.winner !== input.system
      );

      if (hasMajorConflict) {
        contradictingSystems.push(input.system);
      } else {
        supportingSystems.push(input.system);
      }
    }

    const harmonyRatio = scoring.total > 0 ? scoring.harmony / scoring.total : 0.5;
    const conflictRatio = scoring.total > 0 ? scoring.conflict / scoring.total : 0;
    const probability = Math.max(0.1, Math.min(0.9, harmonyRatio * 0.8 + agreement.agreementLevel * 0.2));

    const adjustedProbability = probability * (1 - conflictRatio * 0.5);

    let statement = '';
    if (adjustedProbability > 0.7) {
      statement = '多系统共振显示积极信号，倾向于支持该判断';
    } else if (adjustedProbability > 0.4) {
      statement = '多系统存在分歧，结果需谨慎对待';
    } else {
      statement = '多系统显示负面信号，需要特别注意';
    }

    if (contradictingSystems.length > 0) {
      statement += `（${contradictingSystems.join('、')}系统持不同意见）`;
    }

    const finalConfidence = this.calculateFinalConfidence(
      inputs,
      agreement.agreementLevel,
      adjustedProbability
    );

    return {
      statement,
      probability: adjustedProbability,
      supportingSystems,
      contradictingSystems,
      finalConfidence,
    };
  }

  private calculateFusionConfidence(
    inputs: SystemInput[],
    scoring: ResonanceScoring,
    agreement: SystemAgreement
  ): number {
    const systemConfidence = inputs.reduce((sum, i) => sum + i.confidence, 0) / inputs.length;
    const harmonyBonus = scoring.total > 0 ? (scoring.harmony / scoring.total) * 0.2 : 0;

    return Math.min(0.99, systemConfidence * 0.6 + agreement.agreementLevel * 0.3 + harmonyBonus);
  }

  private calculateFinalConfidence(
    inputs: SystemInput[],
    agreementLevel: number,
    probability: number
  ): number {
    const avgSystemConfidence =
      inputs.reduce((sum, i) => sum + i.confidence, 0) / inputs.length;

    const consensusBonus = agreementLevel > 0.8 ? 0.1 : agreementLevel > 0.5 ? 0.05 : 0;

    return Math.min(
      0.99,
      avgSystemConfidence * 0.5 + probability * 0.3 + agreementLevel * 0.2 + consensusBonus
    );
  }

  private deriveFinalConclusion(fusionReasoning: FusionReasoning): FusedConclusion {
    return fusionReasoning.fusedConclusion;
  }

  analyzeTemporalAlignment(inputs: SystemInput[]): TemporalAlignment[] {
    const alignments: TemporalAlignment[] = [];

    for (const input of inputs) {
      for (const signal of input.signals) {
        if (signal.timeline) {
          const alignment = this.calculateTemporalAlignment(signal);

          alignments.push({
            system: input.system,
            timeDimension: signal.timeline,
            alignment: alignment.value,
            relevance: alignment.relevance,
          });
        }
      }
    }

    return alignments;
  }

  private calculateTemporalAlignment(signal: SystemSignal): { value: number; relevance: number } {
    const currentSeason = this.getCurrentSeason();
    const currentCycle = this.getCurrentCycle();

    let alignment = 0.5;
    let relevance = 0.5;

    if (signal.timeline) {
      const seasonalMatch = this.getSeasonFromTimeline(signal.timeline);
      if (seasonalMatch === currentSeason) {
        alignment = 0.8;
        relevance = 0.7;
      }

      if (signal.timeline === currentCycle) {
        alignment = 0.9;
        relevance = 0.9;
      }
    }

    return { value: alignment, relevance };
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return '春';
    if (month >= 5 && month <= 7) return '夏';
    if (month >= 8 && month <= 10) return '秋';
    return '冬';
  }

  private getCurrentCycle(): string {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const cycles = ['春', '夏', '秋', '冬'];
    return cycles[Math.floor((dayOfYear / 365) * 4) % 4];
  }

  private getSeasonFromTimeline(timeline: string): string {
    if (timeline.includes('春')) return '春';
    if (timeline.includes('夏')) return '夏';
    if (timeline.includes('秋')) return '秋';
    if (timeline.includes('冬')) return '冬';
    return timeline;
  }

  getSystemHierarchy(): SystemHierarchy[] {
    return [...this.systemHierarchy];
  }

  setSystemHierarchy(hierarchy: SystemHierarchy[]): void {
    this.systemHierarchy = hierarchy.sort((a, b) => a.priority - b.priority);
  }
}
