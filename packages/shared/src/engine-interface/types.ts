/**
 * 统一 Engine Interface 类型定义
 */

export interface EngineConfig {
  name: string;
  version: string;
  metadata?: Record<string, any>;
}

export interface EngineState {
  initialized: boolean;
  ready: boolean;
  error?: string;
}

export interface CalculationResult {
  success: boolean;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}
