// 天干
export type Tiangan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

// 地支
export type Dizhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

// 六十甲子
export type Jiazi = string;

// 节气
export type Jieqi =
  | '立春' | '雨水' | '惊蛰' | '春分' | '清明' | '谷雨'
  | '立夏' | '小满' | '芒种' | '夏至' | '小暑' | '大暑'
  | '立秋' | '处暑' | '白露' | '秋分' | '寒露' | '霜降'
  | '立冬' | '小雪' | '大雪' | '冬至' | '小寒' | '大寒';

// 五行
export type Wuxing = '金' | '木' | '水' | '火' | '土';

// 八卦
export type Bagua = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤';

// 九星
export type Jiuxing = '天蓬' | '天芮' | '天冲' | '天辅' | '天禽' | '天心' | '天柱' | '天任' | '天英';

// 八门
export type Bamen = '休门' | '死门' | '伤门' | '杜门' | '开门' | '惊门' | '生门' | '景门';

// 八神
export type Bashen = '值符' | '螣蛇' | '太阴' | '六合' | '白虎' | '玄武' | '九地' | '九天';

// Chrono Engine 输出结构
export interface ChronoData {
  // 公历时间
  gregorian: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    timestamp: number;
    dateString: string;
  };

  // 农历时间
  lunar: {
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
    yearGanZhi: Jiazi;
    monthGanZhi: Jiazi;
    dayGanZhi: Jiazi;
    hourGanZhi: Jiazi;
    zodiac: string;
    lunarMonthName: string;
    lunarDayName: string;
  };

  // 节气
  jieqi: {
    current: Jieqi | null;
    next: Jieqi;
    daysToNext: number;
    isJieqiDay: boolean;
  };

  // 干支系统
  ganzhi: {
    year: { gan: Tiangan; zhi: Dizhi; full: Jiazi };
    month: { gan: Tiangan; zhi: Dizhi; full: Jiazi };
    day: { gan: Tiangan; zhi: Dizhi; full: Jiazi };
    hour: { gan: Tiangan; zhi: Dizhi; full: Jiazi };
  };

  // 时辰
  shichen: {
    name: string;
    dizhi: Dizhi;
    startHour: number;
    endHour: number;
  };

  // 太岁、月建等
  special: {
    taisui: Dizhi;
    yuejian: Dizhi;
    xunkong: [Dizhi, Dizhi] | null;
    jiuxing: Jiuxing;
  };
}

// 经纬度（用于真太阳时计算）
export interface Coordinates {
  longitude: number;
  latitude: number;
}
