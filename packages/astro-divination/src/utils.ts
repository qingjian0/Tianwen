import {
  Bagua,
  Dizhi,
  LiuShiSiGuaFull,
  Wuxing,
  Yao
} from "./types";
import {
  BAGUA_INFO,
  DIZHI,
  LIUSHISIGUA,
  TIANGAN,
  WUXING_KE,
  WUXING_SHENG,
  XIANTIAN_BAGUA_ORDER
} from "./constants";

// 根据数字获取八卦（先天八卦数）
export function getBaguaByNumber(num: number): Bagua {
  let n = num % 8;
  if (n === 0) n = 8;
  return XIANTIAN_BAGUA_ORDER[n - 1];
}

// 根据二进制找八卦
export function findBaguaByBinary(binary: string): Bagua | null {
  for (const [name, info] of Object.entries(BAGUA_INFO)) {
    if (info.binary === binary) {
      return name as Bagua;
    }
  }
  return null;
}

// 生成六爻
export function generateYao(
  binary: string,
  changingPositions: number[] = []
): Yao[] {
  const yaos: Yao[] = [];
  for (let i = 0; i < 6; i++) {
    const position = i + 1;
    yaos.push({
      position,
      type: binary[i] === "1" ? "yang" : "yin",
      isChanging: changingPositions.includes(position)
    });
  }
  return yaos;
}

// 生成完整六十四卦
export function generateLiuShiSiGua(
  binary: string,
  changingPositions: number[] = []
): LiuShiSiGuaFull | null {
  if (binary.length !== 6) return null;

  const shangBinary = binary.substring(0, 3);
  const xiaBinary = binary.substring(3, 6);
  const shangGua = findBaguaByBinary(shangBinary);
  const xiaGua = findBaguaByBinary(xiaBinary);

  if (!shangGua || !xiaGua) return null;

  const guaInfo = LIUSHISIGUA.find(g => g.binary === binary);

  return {
    index: guaInfo?.index || 0,
    name: guaInfo?.name || `${shangGua}${xiaGua}`,
    shangGua,
    xiaGua,
    binary,
    yao: generateYao(binary, changingPositions)
  };
}

// 根据上下卦生成二进制
export function generateBinary(shangGua: Bagua, xiaGua: Bagua): string {
  return BAGUA_INFO[shangGua].binary + BAGUA_INFO[xiaGua].binary;
}

// 计算互卦
export function calculateHuGua(binary: string): { shangGua: Bagua; xiaGua: Bagua; binary: string } | null {
  if (binary.length !== 6) return null;

  // 互卦：取2、3、4爻为下互卦，3、4、5爻为上互卦
  const xiaHuBinary = binary[1] + binary[2] + binary[3]; // 第2、3、4爻（索引1、2、3）
  const shangHuBinary = binary[2] + binary[3] + binary[4]; // 第3、4、5爻（索引2、3、4）

  const xiaGua = findBaguaByBinary(xiaHuBinary);
  const shangGua = findBaguaByBinary(shangHuBinary);

  if (!shangGua || !xiaGua) return null;

  return {
    shangGua,
    xiaGua,
    binary: shangHuBinary + xiaHuBinary
  };
}

// 计算变卦
export function calculateBianGua(binary: string, changingPositions: number[]): string {
  let result = binary.split("");
  for (const pos of changingPositions) {
    const index = pos - 1;
    result[index] = result[index] === "1" ? "0" : "1";
  }
  return result.join("");
}

// 计算错卦（所有爻阴阳反转）
export function calculateCuoGua(binary: string): string {
  return binary.split("").map(c => c === "1" ? "0" : "1").join("");
}

// 计算综卦（卦象上下颠倒）
export function calculateZongGua(binary: string): string {
  return binary.split("").reverse().join("");
}

// 计算体用关系
export function calculateTiYong(
  shangGua: Bagua,
  xiaGua: Bagua,
  changingPositions: number[]
): {
  ti: Bagua;
  yong: Bagua;
  tiWuxing: Wuxing;
  yongWuxing: Wuxing;
  relation: "bihe" | "yongshengti" | "tishengyong" | "ke" | "sheng";
} {
  let ti: Bagua;
  let yong: Bagua;

  if (changingPositions.length === 0) {
    // 无动爻，以下卦为体，上卦为用
    ti = xiaGua;
    yong = shangGua;
  } else {
    // 判断动爻在哪一卦
    const shangDong = changingPositions.some(p => p >= 4); // 上卦4、5、6爻
    const xiaDong = changingPositions.some(p => p <= 3); // 下卦1、2、3爻

    if (xiaDong && !shangDong) {
      // 下卦动，上卦为体，下卦为用
      ti = shangGua;
      yong = xiaGua;
    } else if (shangDong && !xiaDong) {
      // 上卦动，下卦为体，上卦为用
      ti = xiaGua;
      yong = shangGua;
    } else {
      // 都动或都不动，以下卦为体
      ti = xiaGua;
      yong = shangGua;
    }
  }

  const tiWuxing = BAGUA_INFO[ti].wuxing;
  const yongWuxing = BAGUA_INFO[yong].wuxing;

  // 判断关系
  let relation: "bihe" | "yongshengti" | "tishengyong" | "ke" | "sheng";

  if (tiWuxing === yongWuxing) {
    relation = "bihe";
  } else if (WUXING_SHENG[yongWuxing] === tiWuxing) {
    relation = "yongshengti";
  } else if (WUXING_SHENG[tiWuxing] === yongWuxing) {
    relation = "tishengyong";
  } else if (WUXING_KE[tiWuxing] === yongWuxing) {
    relation = "ke";
  } else {
    relation = "sheng";
  }

  return { ti, yong, tiWuxing, yongWuxing, relation };
}

// 获取年干支
export function getYearGanZhi(year: number): { gan: string; zhi: string; full: string } {
  const ganIndex = ((year - 4) % 10 + 10) % 10;
  const zhiIndex = ((year - 4) % 12 + 12) % 12;
  const jiaziIndex = (zhiIndex * 10 - ganIndex + 120) % 60;

  return {
    gan: TIANGAN[ganIndex],
    zhi: DIZHI[zhiIndex],
    full: TIANGAN[ganIndex] + DIZHI[zhiIndex]
  };
}

// 获取月干支（五虎遁）
export function getMonthGanZhi(yearGan: string, month: number): { gan: string; zhi: string; full: string } {
  const yearGanIndex = TIANGAN.indexOf(yearGan);
  let monthGanBase: number;

  if (yearGanIndex === 0 || yearGanIndex === 5) { // 甲己
    monthGanBase = 2; // 丙寅起
  } else if (yearGanIndex === 1 || yearGanIndex === 6) { // 乙庚
    monthGanBase = 4; // 戊寅起
  } else if (yearGanIndex === 2 || yearGanIndex === 7) { // 丙辛
    monthGanBase = 6; // 庚寅起
  } else if (yearGanIndex === 3 || yearGanIndex === 8) { // 丁壬
    monthGanBase = 8; // 壬寅起
  } else { // 戊癸
    monthGanBase = 0; // 甲寅起
  }

  const ganIndex = (monthGanBase + month - 1) % 10;
  const zhiIndex = (month + 1) % 12; // 寅为正月（索引2）

  return {
    gan: TIANGAN[ganIndex],
    zhi: DIZHI[zhiIndex],
    full: TIANGAN[ganIndex] + DIZHI[zhiIndex]
  };
}

// 获取时辰
export function getShichen(hour: number): Dizhi {
  const shichenIndex = Math.floor((hour + 1) / 2) % 12;
  return DIZHI[shichenIndex];
}

// 获取时干支（五鼠遁）
export function getHourGanZhi(dayGan: string, hourIndex: number): { gan: string; zhi: string; full: string } {
  const dayGanIndex = TIANGAN.indexOf(dayGan);
  let hourGanBase: number;

  if (dayGanIndex === 0 || dayGanIndex === 5) { // 甲己
    hourGanBase = 0; // 甲子起
  } else if (dayGanIndex === 1 || dayGanIndex === 6) { // 乙庚
    hourGanBase = 2; // 丙子起
  } else if (dayGanIndex === 2 || dayGanIndex === 7) { // 丙辛
    hourGanBase = 4; // 戊子起
  } else if (dayGanIndex === 3 || dayGanIndex === 8) { // 丁壬
    hourGanBase = 6; // 庚子起
  } else { // 戊癸
    hourGanBase = 8; // 壬子起
  }

  const ganIndex = (hourGanBase + hourIndex) % 10;
  const zhiIndex = hourIndex % 12;

  return {
    gan: TIANGAN[ganIndex],
    zhi: DIZHI[zhiIndex],
    full: TIANGAN[ganIndex] + DIZHI[zhiIndex]
  };
}

// 获取旬空
export function getXunKong(jiazi: string): [Dizhi, Dizhi] | null {
  const jiaziList = [
    "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉",
    "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未",
    "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳",
    "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯",
    "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑",
    "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"
  ];

  const index = jiaziList.indexOf(jiazi);
  if (index === -1) return null;

  const xunStart = Math.floor(index / 10) * 10;
  const xunStartZhiIndex = xunStart % 12;
  const xunKong1 = DIZHI[(xunStartZhiIndex + 10) % 12];
  const xunKong2 = DIZHI[(xunStartZhiIndex + 11) % 12];

  return [xunKong1, xunKong2];
}
