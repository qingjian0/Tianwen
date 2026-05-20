import { ChronoEngine } from '@tianwen/chrono-engine';
import { XiaoChengTuInput, XiaoChengTuResult, Palace } from './types';
import { BAGUA_NAMES, PALACE_POSITIONS } from './constants';

export class XiaoChengTuEngine {
  private chronoData;

  constructor() {
    this.chronoData = ChronoEngine.now();
  }

  calculate(input: XiaoChengTuInput): XiaoChengTuResult {
    let numbers: number[];

    if (input.numbers && input.numbers.length >= 3) {
      numbers = input.numbers.slice(0, 3);
    } else if (input.date) {
      const chrono = ChronoEngine.at(input.date);
      const n1 = (chrono.lunar.year + chrono.lunar.month) % 8 || 8;
      const n2 = (chrono.lunar.month + chrono.lunar.day) % 8 || 8;
      const n3 = (chrono.lunar.year + chrono.lunar.month + chrono.lunar.day) % 6 || 6;
      numbers = [n1, n2, n3];
    } else {
      const now = new Date();
      const ms = now.getMilliseconds();
      numbers = [
        (ms % 8) || 8,
        ((ms * 3 + 7) % 8) || 8,
        ((ms * 7 + 3) % 6) || 6
      ];
    }

    const shangGua = BAGUA_NAMES[numbers[0]] || '乾';
    const xiaGua = BAGUA_NAMES[numbers[1]] || '坤';
    const dongYao = numbers[2];

    const hostGua = xiaGua;
    const guestGua = shangGua;

    const palaces: Palace[] = [];
    for (let i = 1; i <= 9; i++) {
      const guaNum = ((numbers[0] + numbers[1] + i) % 8) || 8;
      palaces.push({
        position: i,
        guaName: BAGUA_NAMES[guaNum],
        guaNum,
        isYongShen: i === dongYao % 9 || dongYao % 9 === 0 && i === 9,
        isHost: BAGUA_NAMES[guaNum] === hostGua,
        relationship: BAGUA_NAMES[guaNum] === hostGua ? '体卦' : BAGUA_NAMES[guaNum] === guestGua ? '用卦' : '辅卦',
        analysis: `${PALACE_POSITIONS[i]}：${BAGUA_NAMES[guaNum]}`
      });
    }

    return {
      originGua: { shang: shangGua, xia: xiaGua, dongYao },
      palaces,
      hostGuests: {
        host: palaces.find(p => p.isHost) || palaces[0],
        guest: palaces.find(p => p.guaName === guestGua) || palaces[1]
      }
    };
  }

  analyze(result: XiaoChengTuResult): {
    overview: string;
    keyPalaces: string[];
    suggestions: string[];
  } {
    const yongShen = result.palaces.find(p => p.isYongShen);
    return {
      overview: `本卦${result.originGua.shang}上${result.originGua.xia}下，动爻${result.originGua.dongYao}。${yongShen ? `用神在${yongShen.analysis}。` : ''}`,
      keyPalaces: result.palaces.filter(p => p.isYongShen || p.isHost).map(p => p.analysis),
      suggestions: ['体用分明', '观象玩辞']
    };
  }
}

export default XiaoChengTuEngine;