import { Bagua, Wuxing, ChronoEngine } from '@tianwen/chrono-engine';
import { 
  BAGUA_INFO, 
  XIANTIAN_BAGUA, 
  BAGUA_BY_INDEX,
  WUXING_SHENG, 
  WUXING_KE,
  LIUSHISIGUA 
} from './constants';
import { Yao, Guaxiang, DivinationMethod, MeihuaResult } from './types';

/**
 * 根据数字获取八卦
 */
export function getBaguaByNumber(num: number): Bagua {
  const n = ((num - 1) % 8 + 8) % 8;
  return BAGUA_BY_INDEX[n];
}

/**
 * 生成六爻
 */
export function generateYao(binary6: string, changingPositions: number[] = []): Yao[] {
  const yaos: Yao[] = [];
  for (let i = 0; i < 6; i++) {
    const position = i + 1;
    yaos.push({
      position,
      type: binary6[i] === '1' ? 'yang' : 'yin',
      isChanging: changingPositions.includes(position)
    });
  }
  return yaos;
}

/**
 * 根据上下卦生成六爻二进制
 */
export function generateBinary(shangGua: Bagua, xiaGua: Bagua): string {
  return BAGUA_INFO[shangGua].binary + BAGUA_INFO[xiaGua].binary;
}

/**
 * 计算互卦
 */
export function calculateHuGua(binary: string): { shangGua: Bagua; xiaGua: Bagua } | null {
  if (binary.length !== 6) return null;
  
  // 互卦取2-4爻为下互，3-5爻为上互
  const xiaHuBinary = binary[1] + binary[2] + binary[3];
  const shangHuBinary = binary[2] + binary[3] + binary[4];
  
  const xiaHu = findBaguaByBinary(xiaHuBinary);
  const shangHu = findBaguaByBinary(shangHuBinary);
  
  if (xiaHu && shangHu) {
    return { shangGua: shangHu, xiaGua: xiaHu };
  }
  return null;
}

/**
 * 根据二进制找八卦
 */
function findBaguaByBinary(binary: string): Bagua | null {
  for (const [name, info] of Object.entries(BAGUA_INFO)) {
    if (info.binary === binary) {
      return name as Bagua;
    }
  }
  return null;
}

/**
 * 计算变卦
 */
export function calculateBianGua(binary: string, changingPositions: number[]): string {
  let result = binary.split('');
  for (const pos of changingPositions) {
    const index = pos - 1;
    result[index] = result[index] === '1' ? '0' : '1';
  }
  return result.join('');
}

/**
 * 计算错卦（阴阳全变）
 */
export function calculateCuoGua(binary: string): string {
  return binary.split('').map(c => c === '1' ? '0' : '1').join('');
}

/**
 * 计算综卦（反转）
 */
export function calculateZongGua(binary: string): string {
  return binary.split('').reverse().join('');
}

/**
 * 计算体用关系
 */
export function calculateTiYong(
  shangGua: Bagua, 
  xiaGua: Bagua, 
  changingPositions: number[]
): {
  ti: Bagua;
  yong: Bagua;
  tiWuxing: Wuxing;
  yongWuxing: Wuxing;
  relation: 'sheng' | 'ke' | 'bihe' | 'tishengyong' | 'yongshengti';
} {
  let ti: Bagua;
  let yong: Bagua;
  
  // 判断动爻位置确定体用
  const hasShangDong = changingPositions.some(p => p >= 4);
  const hasXiaDong = changingPositions.some(p => p <= 3);
  
  if (changingPositions.length === 0) {
    // 无动爻，以下卦为体
    ti = xiaGua;
    yong = shangGua;
  } else if (hasXiaDong && !hasShangDong) {
    // 下卦动
    ti = shangGua;
    yong = xiaGua;
  } else if (hasShangDong && !hasXiaDong) {
    // 上卦动
    ti = xiaGua;
    yong = shangGua;
  } else {
    // 都动或都不动，看数量
    ti = xiaGua;
    yong = shangGua;
  }
  
  const tiWuxing = BAGUA_INFO[ti].wuxing;
  const yongWuxing = BAGUA_INFO[yong].wuxing;
  
  let relation: any;
  if (tiWuxing === yongWuxing) {
    relation = 'bihe';
  } else if (WUXING_SHENG[tiWuxing] === yongWuxing) {
    relation = 'tishengyong';
  } else if (WUXING_SHENG[yongWuxing] === tiWuxing) {
    relation = 'yongshengti';
  } else if (WUXING_KE[tiWuxing] === yongWuxing) {
    relation = 'ke';
  } else {
    relation = 'sheng';
  }
  
  return { ti, yong, tiWuxing, yongWuxing, relation };
}

/**
 * 根据二进制找六十四卦
 */
export function findLiuShiSiGua(binary: string) {
  return LIUSHISIGUA.find(g => g.binary === binary);
}
