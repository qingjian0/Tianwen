import { JIEQI } from './constants';
import { Jieqi } from './types';

// 二十四节气的黄道经度（度数）
const JIEQI_LONGITUDE = [
  315, 330, 345, 0, 15, 30,
  45, 60, 75, 90, 105, 120,
  135, 150, 165, 180, 195, 210,
  225, 240, 255, 270, 285, 300
];

// 2000-2023年的节气日期数据（简化版）
const JIEQI_DATA: Record<number, number[]> = {
  2024: [4, 19, 5, 20, 4, 19, 5, 20, 5, 21, 6, 21, 7, 22, 7, 22, 8, 22, 8, 23, 7, 22, 21, 20],
  2025: [3, 18, 5, 20, 4, 20, 5, 21, 5, 21, 6, 21, 7, 22, 7, 23, 8, 23, 8, 23, 7, 22, 21, 20]
};

/**
 * 获取指定年份和节气的日期
 */
export function getJieqiDate(year: number, jieqiIndex: number): Date | null {
  const month = Math.floor(jieqiIndex / 2);
  const data = JIEQI_DATA[year];
  if (data && data[jieqiIndex]) {
    return new Date(year, month, data[jieqiIndex]);
  }
  
  // 简化算法：根据平均日期估算
  const baseDates = [
    [2, 4], [2, 19], [3, 6], [3, 21], [4, 5], [4, 20],
    [5, 6], [5, 21], [6, 6], [6, 21], [7, 7], [7, 23],
    [8, 8], [8, 23], [9, 8], [9, 23], [10, 8], [10, 23],
    [11, 8], [11, 22], [12, 7], [12, 22], [1, 6], [1, 20]
  ];
  
  let [m, d] = baseDates[jieqiIndex];
  if (jieqiIndex >= 22) {
    year += 1;
  }
  return new Date(year, m - 1, d);
}

/**
 * 获取当前日期的节气信息
 */
export function getCurrentJieqi(date: Date): {
  current: Jieqi | null;
  next: Jieqi;
  daysToNext: number;
  isJieqiDay: boolean;
} {
  const year = date.getFullYear();
  let current: Jieqi | null = null;
  let nextIndex = 0;
  let daysToNext = 999;
  let isJieqiDay = false;
  
  for (let i = 0; i < 24; i++) {
    const jieqiDate = getJieqiDate(year, i);
    if (!jieqiDate) continue;
    
    // 调整年份对于小寒、大寒
    let checkYear = year;
    if (i >= 22) checkYear = year + 1;
    
    const diffTime = jieqiDate.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      isJieqiDay = true;
      current = JIEQI[i];
      nextIndex = (i + 1) % 24;
      daysToNext = 15;
      break;
    } else if (diffDays > 0 && diffDays < daysToNext) {
      daysToNext = diffDays;
      nextIndex = i;
      if (i > 0) {
        current = JIEQI[i - 1];
      } else {
        current = JIEQI[23];
      }
    }
  }
  
  return {
    current,
    next: JIEQI[nextIndex],
    daysToNext,
    isJieqiDay
  };
}
