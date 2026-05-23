/**
 * Pipeline 单元测试
 */

import { TianwenPipeline, PredictionInput } from "../src";

describe("TianwenPipeline", () => {
  let pipeline: TianwenPipeline;

  beforeEach(() => {
    pipeline = new TianwenPipeline();
  });

  describe("基本功能", () => {
    it("应该创建 Pipeline 实例", () => {
      expect(pipeline).toBeDefined();
      expect(pipeline.healthCheck).toBeDefined();
    });

    it("应该成功执行推演", async () => {
      const input: PredictionInput = {
        question: "测试问题",
        category: "test",
        system: "meihua",
        mode: "single",
      };

      const result = await pipeline.execute(input);
      expect(result).toBeDefined();
      expect(result.context).toBeDefined();
      expect(result.output).toBeDefined();
    });

    it("应该返回正确的输出结构", async () => {
      const input: PredictionInput = {
        question: "财运测试",
        category: "wealth",
        system: "meihua",
        mode: "single",
      };

      const result = await pipeline.execute(input);
      expect(result.output.summary).toBeDefined();
      expect(result.output.probability).toBeDefined();
      expect(result.output.fortune).toBeDefined();
      expect(result.output.signals).toBeInstanceOf(Array);
      expect(result.output.appliedRules).toBeInstanceOf(Array);
      expect(result.output.calculationTrace).toBeInstanceOf(Array);
    });
  });

  describe("阶段处理", () => {
    it("应该执行所有启用阶段", async () => {
      const input: PredictionInput = {
        question: "完整流程测试",
        category: "test",
        system: "meihua",
        mode: "single",
      };

      const result = await pipeline.execute(input);
      const completedStages = result.context.stageResults.size;

      expect(completedStages).toBeGreaterThan(0);
    });

    it("应该记录阶段时长", async () => {
      const input: PredictionInput = {
        question: "性能测试",
        category: "test",
        system: "meihua",
        mode: "single",
      };

      const result = await pipeline.execute(input);

      for (const [
        stage,
        stageResult,
      ] of result.context.stageResults.entries()) {
        expect(stageResult.duration).toBeDefined();
        expect(stageResult.duration).toBeGreaterThanOrEqual(0);
      }
    });

    it("应该生成计算轨迹", async () => {
      const input: PredictionInput = {
        question: "轨迹测试",
        category: "test",
        system: "meihua",
        mode: "single",
      };

      const result = await pipeline.execute(input);
      const trace = result.output.calculationTrace;

      expect(trace.length).toBeGreaterThan(0);
      trace.forEach((step) => {
        expect(step.stage).toBeDefined();
        expect(step.action).toBeDefined();
        expect(step.result).toBeDefined();
        expect(step.duration).toBeDefined();
      });
    });
  });

  describe("错误处理", () => {
    it("应该处理无效输入", async () => {
      const input: PredictionInput = {
        question: "",
        category: "test",
        system: "meihua",
        mode: "single",
      };

      const result = await pipeline.execute(input);
      expect(result).toBeDefined();
    });

    it("应该处理缺少的阶段数据", async () => {
      const pipeline = new TianwenPipeline({
        rules: { enabled: false },
      });

      const input: PredictionInput = {
        question: "规则禁用测试",
        category: "test",
        system: "meihua",
        mode: "single",
      };

      const result = await pipeline.execute(input);
      expect(result.success).toBe(true);
    });
  });

  describe("多系统推演", () => {
    it("应该支持多系统输入", async () => {
      const input: PredictionInput = {
        question: "多系统测试",
        category: "test",
        system: ["meihua", "liuyao"],
        mode: "fusion",
      };

      const result = await pipeline.execute(input);
      expect(result.success).toBe(true);
    });
  });

  describe("配置管理", () => {
    it("应该允许更新配置", () => {
      pipeline.updateConfig({ enableCache: false });
      const config = pipeline.getConfig();
      expect(config.enableCache).toBe(false);
    });

    it("应该允许自定义处理器", () => {
      const customProcessor = {
        process: jest.fn().mockResolvedValue({
          stage: "custom",
          status: "completed",
          startTime: new Date(),
          duration: 100,
        }),
      };

      pipeline.registerProcessor("interpretation", customProcessor as any);
      const processor = pipeline.getProcessor("interpretation");
      expect(processor).toBeDefined();
    });
  });
});

describe("PipelineContext", () => {
  it("应该正确创建上下文", async () => {
    const pipeline = new TianwenPipeline();
    const input: PredictionInput = {
      question: "上下文测试",
      category: "test",
      system: "meihua",
      mode: "single",
    };

    const result = await pipeline.execute(input);
    const context = result.context;

    expect(context.id).toBeDefined();
    expect(context.input).toEqual(input);
    expect(context.metadata.createdAt).toBeDefined();
  });

  it("应该正确记录阶段结果", async () => {
    const pipeline = new TianwenPipeline();
    const input: PredictionInput = {
      question: "阶段记录测试",
      category: "test",
      system: "meihua",
      mode: "single",
    };

    const result = await pipeline.execute(input);
    const chronoResult = result.context.stageResults.get("chrono");

    expect(chronoResult).toBeDefined();
    expect(chronoResult!.status).toBe("completed");
    expect(chronoResult!.data).toBeDefined();
  });
});
