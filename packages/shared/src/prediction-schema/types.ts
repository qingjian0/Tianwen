/**
 * 推演标准数据结构定义
 * 超级重要：为后续AI和RAG系统奠定基础
 */

// ==========================================
// TimeWindow - 时间窗口
// ==========================================
export interface TimeWindow {
  start: Date;
  end: Date;
  strength: number; // 0-100，强度
  description: string;
}

// ==========================================
// SystemAnalysis - 单一术数系统分析
// ==========================================
export interface SystemAnalysis {
  systemName: string; // 术数系统名称，如"梅花易数"、"六爻"、"奇门遁甲"
  favorable: string[]; // 有利信号
  unfavorable: string[]; // 不利信号
  signals: Record<string, any>; // 具体信号数据
  confidence: number; // 0-100，置信度
}

// ==========================================
// PredictionResult - 最终推演结果（核心）
// ==========================================
export interface PredictionResult {
  id: string; // 唯一ID
  question: string; // 问题
  systems: string[]; // 使用的术数系统
  timestamp: Date; // 时间戳
  summary: string; // 摘要
  probability: number; // 0-100，成功率
  risk: number; // 0-100，风险率
  resonance: number; // 0-100，共振强度（多系统一致性）
  timing: TimeWindow[]; // 时间窗口建议
  suggestions: string[]; // 建议
  analyses: SystemAnalysis[]; // 各系统分析
  rawData?: Record<string, any>; // 原始数据（可选）
}

// ==========================================
// PredictionInput - 推演输入
// ==========================================
export interface PredictionInput {
  question: string;
  systems: string[];
  context?: Record<string, any>;
  timestamp?: Date;
}
