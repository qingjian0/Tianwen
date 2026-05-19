/**
 * Case Replay - 类型定义
 */

export interface CaseMetadata {
  id: string;
  name: string;
  description?: string;
  system: 'meihua' | 'liuyao' | 'bazi' | 'qimen';
  createdAt: number;
  tags?: string[];
}

export interface CaseInput {
  timestamp?: string;
  birthInfo?: any;
  question?: string;
  category?: string;
  [key: string]: any;
}

export interface CaseExpectedOutput {
  fortune?: string;
  probability?: number;
  signals?: string[];
  timing?: any;
  [key: string]: any;
}

export interface TestCase {
  metadata: CaseMetadata;
  input: CaseInput;
  expectedOutput: CaseExpectedOutput;
}

export interface ReplayResult {
  caseId: string;
  passed: boolean;
  actualOutput?: any;
  expectedOutput?: CaseExpectedOutput;
  executionTime?: number;
  errors?: string[];
  metrics?: {
    accuracy?: number;
    precision?: number;
    recall?: number;
  };
}

export interface ReplayReport {
  totalCases: number;
  passed: number;
  failed: number;
  duration: number;
  results: ReplayResult[];
  metrics: {
    overallAccuracy: number;
  };
}
