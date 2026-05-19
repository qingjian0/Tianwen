/**
 * Phase 9 沙箱运行程序
 * 真实的可执行代码，包含所有核心系统
 */

console.log('='.repeat(70));
console.log('天问系统 Phase 9 - 沙箱运行程序');
console.log('='.repeat(70));

// --- 1. 基础类型定义 ---
type Tiangan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
type Dizhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
type Wuxing = '木' | '火' | '土' | '金' | '水';

// --- 2. 认知推理引擎 ---
class CognitiveEngine {
  execute(signals: Array<{ type: string; value: any; weight: number; wuxing?: string }>) {
    const trace = {
      nodes: new Map(),
      edges: [],
      rootSignals: [] as string[],
      conclusions: [] as string[]
    };

    let id = 0;
    for (const signal of signals) {
      const nodeId = `signal-${++id}`;
      trace.nodes.set(nodeId, {
        nodeId, type: 'signal', content: signal, sources: []
      });
      trace.rootSignals.push(nodeId);
    }

    const relationNodes = this.analyzeRelations(signals, trace);

    const conclusionId = `conclusion-${++id}`;
    const finalConfidence = this.calculateFinalConfidence(signals);
    trace.nodes.set(conclusionId, {
      nodeId: conclusionId,
      type: 'conclusion',
      content: { confidence: finalConfidence, status: finalConfidence > 0.6 ? 'positive' : 'neutral' },
      sources: relationNodes
    });
    trace.conclusions.push(conclusionId);

    return {
      success: true,
      trace,
      finalConfidence,
      status: finalConfidence > 0.6 ? 'positive' : 'neutral'
    };
  }

  private analyzeRelations(
    signals: any[], trace: { nodes: Map<string, any>; edges: any[] }
  ) {
    const relations: string[] = [];
    const cycle = ['木', '火', '土', '金', '水'];

    for (let i = 0; i < signals.length - 1; i++) {
      if (signals[i].wuxing && signals[i + 1].wuxing) {
        const aIdx = cycle.indexOf(signals[i].wuxing);
        const bIdx = cycle.indexOf(signals[i + 1].wuxing);
        const isSheng = ((aIdx + 1) % 5) === bIdx;
        const isKe = ((aIdx + 2) % 5) === bIdx;

        const relationId = `rel-${i}`;
        trace.nodes.set(relationId, {
          nodeId: relationId,
          type: isSheng ? 'sheng' : isKe ? 'ke' : 'neutral',
          content: { a: signals[i], b: signals[i + 1] },
          sources: [`signal-${i + 1}`, `signal-${i + 2}`]
        });
        relations.push(relationId);

        trace.edges.push({
          from: `signal-${i + 1}`,
          to: relationId,
          weight: 0.7
        });
      }
    }

    return relations;
  }

  private calculateFinalConfidence(signals: any[]) {
    const totalWeight = signals.reduce((sum, s) => sum + s.weight, 0);
    return Math.min(1, totalWeight / signals.length);
  }
}

// --- 3. 时间记忆系统 ---
class TemporalMemory {
  states: Array<{ stateId: string; timestamp: number; content: any; confidence: number }> = [];

  saveState(content: any) {
    const stateId = `state-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    this.states.push({
      stateId,
      timestamp: Date.now(),
      content,
      confidence: 0.7 + Math.random() * 0.3
    });
    return stateId;
  }

  queryRecent(limit = 5) {
    return this.states.slice(-limit).reverse();
  }
}

// --- 4. 规则知识图谱 ---
class RuleKnowledgeGraph {
  nodes: Map<string, { id: string; name: string; category: string; confidence: number }> = new Map();
  edges: Array<{ from: string; to: string; type: string; weight: number }> = [];
  relationTypes = ['supports', 'contradicts', 'refines', 'triggers'] as const;

  addRule(name: string, category: string, confidence: number) {
    const id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    this.nodes.set(id, { id, name, category, confidence });
    return id;
  }

  addRelation(fromRule: string, toRule: string, type: typeof this.relationTypes[number], weight = 0.5) {
    this.edges.push({ from: fromRule, to: toRule, type, weight });
  }

  getStats() {
    return {
      nodes: this.nodes.size,
      edges: this.edges.length,
      avgConfidence: Array.from(this.nodes.values()).reduce((s, n) => s + n.confidence, 0) / this.nodes.size || 0
    };
  }
}

// --- 5. 多系统共振引擎 ---
class MultiSystemResonanceEngine {
  systemWeights = {
    bazi: 1.0,
    liuyao: 0.95,
    meihua: 0.9,
    qimen: 0.85,
    ziwei: 0.8
  };

  fuse(systems: Array<{ name: string; signals: any[]; confidence: number }>) {
    const totalConfidence = systems.reduce((sum, s) => sum + s.confidence * (this.systemWeights[s.name as keyof typeof this.systemWeights] || 0.5), 0);
    const totalWeight = systems.reduce((sum, s) => sum + (this.systemWeights[s.name as keyof typeof this.systemWeights] || 0.5), 0);

    const finalConfidence = totalConfidence / totalWeight;
    const isPositive = finalConfidence > 0.55;

    return {
      success: true,
      finalConfidence,
      status: isPositive ? 'positive' : 'neutral',
      systemsCount: systems.length,
      summary: `多系统共振: ${finalConfidence > 0.6 ? '积极' : '中性'}, 涉及 ${systems.length} 个系统`,
      recommendations: finalConfidence > 0.6 ? '宜积极行动' : '宜谨慎观望'
    };
  }
}

// --- 6. 术数引擎模拟 ---
class MeihuaEngine {
  divinate(question: string) {
    const guaNames = ['乾为天', '坤为地', '震为雷', '巽为风', '坎为水', '离为火', '艮为山', '兑为泽'];
    const gua = guaNames[Math.floor(Math.random() * guaNames.length)];
    const score = 60 + Math.floor(Math.random() * 40);
    const isPositive = score > 70;

    return {
      gua,
      score,
      interpretation: `${gua}: ${isPositive ? '卦象吉祥' : '需待时机'}`,
      confidence: 0.6 + Math.random() * 0.3
    };
  }
}

class BaziEngine {
  calculate(birth: { year: number; month: number; day: number; gender: '男' | '女' }) {
    const tianganList: Tiangan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const dizhiList: Dizhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const yearGanIndex = (birth.year - 4) % 10;
    const yearZhiIndex = (birth.year - 4) % 12;

    const year = tianganList[yearGanIndex] + dizhiList[yearZhiIndex];
    const month = '丙' + dizhiList[(birth.month + 1) % 12];
    const day = '甲' + dizhiList[birth.day % 12];
    const hour = '子' + tianganList[birth.year % 10];

    const score = 55 + Math.floor(Math.random() * 40);
    const fortune = ['木', '火', '土', '金', '水'][Math.floor(Math.random() * 5)];

    return {
      bazi: `${year} ${month} ${day} ${hour}`,
      favorable: fortune,
      score,
      confidence: 0.65 + Math.random() * 0.25,
      recommendation: '格局' + (score > 65 ? '良好' : '平稳')
    };
  }
}

class QimenEngine {
  layout(time: Date) {
    const juxing = ['阳遁', '阴遁'][Math.floor(Math.random() * 2)];
    const jushu = Math.floor(Math.random() * 9) + 1;
    const zhiFu = ['天蓬', '天任', '天冲', '天辅', '天英', '天芮', '天柱', '天心'][Math.floor(Math.random() * 8)];
    const zhiShi = ['休门', '生门', '伤门', '杜门', '景门', '死门', '惊门', '开门'][Math.floor(Math.random() * 8)];
    const score = 60 + Math.floor(Math.random() * 40);

    return {
      juxing,
      jushu,
      zhiFu,
      zhiShi,
      score,
      confidence: 0.6 + Math.random() * 0.3,
      analysis: `${juxing}${jushu}局, 值符${zhiFu}, 值使${zhiShi}`
    };
  }
}

class ZiweiEngine {
  layout(birth: { year: number; month: number; day: number; gender: '男' | '女' }) {
    const stars = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞'];
    const lucky = ['天府', '太阴', '贪狼', '左辅', '右弼'];
    const mainStar = stars[Math.floor(Math.random() * stars.length)];
    const luckyStar = lucky[Math.floor(Math.random() * lucky.length)];
    const score = 60 + Math.floor(Math.random() * 40);

    return {
      mainPalace: '命宫',
      mainStar,
      luckyStar,
      score,
      confidence: 0.55 + Math.random() * 0.35,
      overview: mainStar + '坐命, ' + luckyStar + '同宫'
    };
  }
}

// --- 7. 主程序 ---
async function runSandbox() {
  console.log('\n[1] 初始化引擎...');

  const cognitiveEngine = new CognitiveEngine();
  const temporalMemory = new TemporalMemory();
  const ruleGraph = new RuleKnowledgeGraph();
  const resonanceEngine = new MultiSystemResonanceEngine();

  console.log('✓ 所有引擎初始化完成');

  console.log('\n[2] 规则知识图谱构建...');
  const rule1 = ruleGraph.addRule('财星旺相', '财运', 0.85);
  const rule2 = ruleGraph.addRule('官星得地', '事业', 0.9);
  const rule3 = ruleGraph.addRule('印星护身', '贵人', 0.75);
  ruleGraph.addRelation(rule1, rule2, 'supports', 0.8);
  ruleGraph.addRelation(rule2, rule3, 'supports', 0.7);

  const ruleStats = ruleGraph.getStats();
  console.log('✓ 规则图:', ruleStats.nodes, '节点,', ruleStats.edges, '边');

  console.log('\n[3] 时间记忆记录...');
  temporalMemory.saveState({ type: 'event', text: '用户咨询1', score: 75 });
  await new Promise(r => setTimeout(r, 50));
  temporalMemory.saveState({ type: 'event', text: '用户咨询2', score: 82 });
  await new Promise(r => setTimeout(r, 50));
  temporalMemory.saveState({ type: 'event', text: '用户咨询3', score: 68 });
  const recentStates = temporalMemory.queryRecent(3);
  console.log('✓ 记忆系统:', recentStates.length, '条历史记录');

  console.log('\n[4] 术数推演演示...');
  const meihua = new MeihuaEngine();
  const bazi = new BaziEngine();
  const qimen = new QimenEngine();
  const ziwei = new ZiweiEngine();

  const meihuaResult = meihua.divinate('事业');
  const baziResult = bazi.calculate({ year: 1990, month: 1, day: 1, gender: '男' });
  const qimenResult = qimen.layout(new Date());
  const ziweiResult = ziwei.layout({ year: 1990, month: 1, day: 1, gender: '男' });

  console.log('  梅花:', meihuaResult.gua, '(' + meihuaResult.score + '分)');
  console.log('  八字:', baziResult.bazi, '(' + baziResult.score + '分)');
  console.log('  奇门:', qimenResult.analysis, '(' + qimenResult.score + '分)');
  console.log('  紫微:', ziweiResult.overview, '(' + ziweiResult.score + '分)');

  console.log('\n[5] 多系统共振融合...');
  const fusionResult = resonanceEngine.fuse([
    { name: 'meihua', signals: [meihuaResult], confidence: meihuaResult.confidence },
    { name: 'bazi', signals: [baziResult], confidence: baziResult.confidence },
    { name: 'qimen', signals: [qimenResult], confidence: qimenResult.confidence },
    { name: 'ziwei', signals: [ziweiResult], confidence: ziweiResult.confidence }
  ]);

  console.log('  融合置信度:', (fusionResult.finalConfidence * 100).toFixed(1) + '%');
  console.log('  融合建议:', fusionResult.recommendations);

  console.log('\n[6] 认知推理演示...');
  const cogResult = cognitiveEngine.execute([
    { type: 'wuxing', value: '木', weight: 0.8, wuxing: '木' },
    { type: 'wuxing', value: '火', weight: 0.75, wuxing: '火' },
    { type: 'wuxing', value: '土', weight: 0.7, wuxing: '土' }
  ]);

  console.log('  推理节点:', cogResult.trace.nodes.size);
  console.log('  推理置信度:', (cogResult.finalConfidence * 100).toFixed(1) + '%');
  console.log('  结论状态:', cogResult.status);

  console.log('\n[7] 综合报告...');
  const finalScore = Math.round((
    fusionResult.finalConfidence * 0.5 +
    cogResult.finalConfidence * 0.3 +
    (ruleStats.avgConfidence) * 0.2
  ) * 100);

  console.log('\n' + '='.repeat(70));
  console.log('Phase 9 沙箱运行报告');
  console.log('='.repeat(70));
  console.log('  总评分数:', finalScore + '分');
  console.log('  结果预测:', finalScore > 70 ? '✅ 积极' : finalScore > 50 ? '⚪ 中性' : '⚠️ 需谨慎');
  console.log('  执行建议:', finalScore > 70 ? '宜积极行动' : '宜观望');
  console.log('='.repeat(70));
  console.log('✅ 沙箱运行完成');
}

runSandbox().catch(error => {
  console.error('❌ 沙箱运行错误:', error);
  process.exit(1);
});
