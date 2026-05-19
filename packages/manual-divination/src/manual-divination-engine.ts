/**
 * 手动起卦引擎
 */

import {
  DivinationMethod,
  ManualDivinationConfig,
  DivinationStep,
  ManualDivinationState,
  CoinResult,
  YarrowResult,
  YarrowStep
} from './types';
import { hexagrams, getHexagramById } from '@tianwen/meihua';

export class ManualDivinationEngine {
  private state: ManualDivinationState;
  private config: ManualDivinationConfig;

  constructor(config: ManualDivinationConfig) {
    this.config = config;
    this.state = this.initializeState();
  }

  private initializeState(): ManualDivinationState {
    const steps = this.getStepsForMethod(this.config.method);
    return {
      currentStep: 0,
      steps,
      collectedData: {},
      completed: false
    };
  }

  getState(): ManualDivinationState {
    return this.state;
  }

  getStepsForMethod(method: DivinationMethod): DivinationStep[] {
    switch (method) {
      case 'coin':
        return [
          {
            type: 'coin-toss',
            description: '掷三枚铜钱得到初爻（从下往上）',
            stepNumber: 1,
            totalSteps: 6,
            userInputRequired: true
          },
          {
            type: 'coin-toss',
            description: '掷三枚铜钱得到二爻',
            stepNumber: 2,
            totalSteps: 6,
            userInputRequired: true
          },
          {
            type: 'coin-toss',
            description: '掷三枚铜钱得到三爻',
            stepNumber: 3,
            totalSteps: 6,
            userInputRequired: true
          },
          {
            type: 'coin-toss',
            description: '掷三枚铜钱得到四爻',
            stepNumber: 4,
            totalSteps: 6,
            userInputRequired: true
          },
          {
            type: 'coin-toss',
            description: '掷三枚铜钱得到五爻',
            stepNumber: 5,
            totalSteps: 6,
            userInputRequired: true
          },
          {
            type: 'coin-toss',
            description: '掷三枚铜钱得到上爻',
            stepNumber: 6,
            totalSteps: 6,
            userInputRequired: true
          }
        ];
      case 'yarrow':
        return [
          {
            type: 'yarrow',
            description: '蓍草演算 - 第一爻',
            stepNumber: 1,
            totalSteps: 6,
            userInputRequired: true
          },
          {
            type: 'yarrow',
            description: '蓍草演算 - 第二爻',
            stepNumber: 2,
            totalSteps: 6,
            userInputRequired: true
          },
          {
            type: 'yarrow',
            description: '蓍草演算 - 第三爻',
            stepNumber: 3,
            totalSteps: 6,
            userInputRequired: true
          },
          {
            type: 'yarrow',
            description: '蓍草演算 - 第四爻',
            stepNumber: 4,
            totalSteps: 6,
            userInputRequired: true
          },
          {
            type: 'yarrow',
            description: '蓍草演算 - 第五爻',
            stepNumber: 5,
            totalSteps: 6,
            userInputRequired: true
          },
          {
            type: 'yarrow',
            description: '蓍草演算 - 第六爻',
            stepNumber: 6,
            totalSteps: 6,
            userInputRequired: true
          }
        ];
      case 'number':
        return [
          {
            type: 'number-input',
            description: '输入第一个数字',
            stepNumber: 1,
            totalSteps: 3,
            userInputRequired: true
          },
          {
            type: 'number-input',
            description: '输入第二个数字',
            stepNumber: 2,
            totalSteps: 3,
            userInputRequired: true
          },
          {
            type: 'number-input',
            description: '输入第三个数字（动爻数）',
            stepNumber: 3,
            totalSteps: 3,
            userInputRequired: true
          }
        ];
      case 'specify-hexagram':
        return [
          {
            type: 'select-hexagram',
            description: '选择本卦',
            stepNumber: 1,
            totalSteps: 2,
            userInputRequired: true
          },
          {
            type: 'select-changes',
            description: '选择动爻',
            stepNumber: 2,
            totalSteps: 2,
            userInputRequired: true
          }
        ];
      default:
        return [];
    }
  }

  processCoinResult(coins: CoinResult): void {
    const lines = this.state.collectedData.lines || [];
    lines.push(coins);
    this.state.collectedData.lines = lines;
    
    if (lines.length === 6) {
      this.complete();
    } else {
      this.nextStep();
    }
  }

  processYarrowResult(result: YarrowResult): void {
    const lines = this.state.collectedData.lines || [];
    lines.push(result);
    this.state.collectedData.lines = lines;
    
    if (lines.length === 6) {
      this.complete();
    } else {
      this.nextStep();
    }
  }

  processNumberInput(n1: number, n2: number, n3: number): void {
    this.state.collectedData.numbers = [n1, n2, n3];
    this.complete();
  }

  selectHexagram(hexagramId: number): void {
    this.state.collectedData.hexagramId = hexagramId;
    this.nextStep();
  }

  selectChangingLines(lines: number[]): void {
    this.state.collectedData.changingLines = lines;
    this.complete();
  }

  nextStep(): void {
    if (this.state.currentStep < this.state.steps.length - 1) {
      this.state.currentStep++;
    }
  }

  prevStep(): void {
    if (this.state.currentStep > 0) {
      this.state.currentStep--;
    }
  }

  private complete(): void {
    this.state.completed = true;
    this.state.result = this.calculateResult();
  }

  private calculateResult(): any {
    const { method, collectedData } = this.state;
    
    switch (this.config.method) {
      case 'coin':
        return this.buildFromCoinLines(collectedData.lines || []);
      case 'number':
        return this.buildFromNumbers(collectedData.numbers || []);
      case 'specify-hexagram':
        return this.buildFromSelection(
          collectedData.hexagramId,
          collectedData.changingLines
        );
      default:
        return null;
    }
  }

  private buildFromCoinLines(lines: CoinResult[]): any {
    const lineValues = lines.map(l => l.sum);
    return this.buildHexagramFromLineValues(lineValues);
  }

  private buildFromNumbers(nums: number[]): any {
    const [n1, n2, n3] = nums;
    const lower = (n1 % 8) || 8;
    const upper = (n2 % 8) || 8;
    const changing = (n3 % 6) || 6;
    
    const hexagramId = (upper - 1) * 8 + lower;
    const hexagram = getHexagramById(hexagramId);
    
    return {
      hexagram,
      changingLines: [changing]
    };
  }

  private buildFromSelection(hexagramId: number, changingLines: number[]): any {
    const hexagram = getHexagramById(hexagramId);
    return {
      hexagram,
      changingLines
    };
  }

  private buildHexagramFromLineValues(lineValues: number[]): any {
    let binary = '';
    const changingLines: number[] = [];
    
    lineValues.forEach((val, idx) => {
      if (val === 6 || val === 7) {
        binary = '0' + binary; // 阴
      } else {
        binary = '1' + binary; // 阳
      }
      
      if (val === 6 || val === 9) {
        changingLines.push(idx + 1);
      }
    });
    
    const hexagramId = parseInt(binary, 2) + 1;
    const hexagram = getHexagramById(hexagramId);
    
    return {
      hexagram,
      lineValues,
      changingLines
    };
  }

  reset(): void {
    this.state = this.initializeState();
  }

  static simulateCoinToss(): CoinResult {
    const coin1 = Math.random() < 0.5 ? 2 : 3;
    const coin2 = Math.random() < 0.5 ? 2 : 3;
    const coin3 = Math.random() < 0.5 ? 2 : 3;
    const sum = coin1 + coin2 + coin3;
    return { coin1, coin2, coin3, sum: sum as 6 | 7 | 8 | 9 };
  }

  static simulateYarrow(): YarrowResult {
    const steps: YarrowStep[] = [];
    let stalks = 50 - 1; // 大衍之数五十，其用四十有九
    
    for (let i = 0; i < 3; i++) {
      const left = Math.floor(Math.random() * (stalks - 1)) + 1;
      const right = stalks - left;
      const rightMod4 = right % 4;
      const rightRemainder = rightMod4 === 0 ? 4 : rightMod4;
      
      steps.push({
        step: i + 1,
        stalksLeft: left,
        stalksRight: right,
        remainder: rightRemainder
      });
      
      stalks = left + (right - rightRemainder);
    }
    
    let result = 6;
    if (stalks === 36) result = 9;
    else if (stalks === 32) result = 8;
    else if (stalks === 28) result = 7;
    else if (stalks === 24) result = 6;
    
    return { steps, result };
  }
}
