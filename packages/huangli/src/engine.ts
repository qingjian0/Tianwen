import { ChronoEngine } from "@tianwen/chrono-engine";
import { HuangLiInput, HuangLiResult, DayInfo } from "./types";
import {
  JIANCHU,
  YI_JI_TEMPLATES,
  JISHEN_LIST,
  XIONGSHEN_LIST,
} from "./constants";

export class HuangLiEngine {
  private chronoData;

  constructor() {
    this.chronoData = ChronoEngine.now();
  }

  query(date?: Date): HuangLiResult {
    const d = date || new Date();
    const chrono = ChronoEngine.at(d);
    const lunar = chrono.lunar;

    const monthIndex = (lunar.month - 1 + (lunar.year - 1900) * 12) % 12;
    const dayIndex = (d.getDate() - 1 + monthIndex) % 12;
    const jianchu = JIANCHU[dayIndex];

    const activities = YI_JI_TEMPLATES[jianchu] || YI_JI_TEMPLATES["平日"];

    const jishen = this.pickRandom(JISHEN_LIST, 3);
    const xiongshen = this.pickRandom(XIONGSHEN_LIST, 2);

    const chongAnimal = this.getChongAnimal(d.getDay());

    const dayInfo: DayInfo = {
      solarDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      lunarDate: `农历${lunar.year}年${lunar.month}月${lunar.day}日`,
      lunarYear: `${lunar.year}`,
      lunarMonth: `${lunar.month}`,
      lunarDay: `${lunar.day}`,
      ganzhi: {
        year: chrono.ganzhi.year,
        month: chrono.ganzhi.month,
        day: chrono.ganzhi.day,
      },
      animal: chrono.shengxiao,
      jieqi: this.getApproxJieqi(d),
      activities,
      chongSha: {
        chong: `${chongAnimal}年`,
        sha: `${chongAnimal}方`,
      },
      jishen,
      xiongshen,
      wuxing: chrono.wuxing?.day || "未知",
      pengzu: this.getPengzu(d.getDate()),
    };

    return {
      date: dayInfo,
      monthOverview: {
        daysInMonth: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
        jieqi: ["节气示例"],
        festivals: [],
      },
    };
  }

  queryByDate(year: number, month: number, day: number): HuangLiResult {
    return this.query(new Date(year, month - 1, day));
  }

  private getChongAnimal(dayOfWeek: number): string {
    const animals = [
      "鼠",
      "牛",
      "虎",
      "兔",
      "龙",
      "蛇",
      "马",
      "羊",
      "猴",
      "鸡",
      "狗",
      "猪",
    ];
    return animals[dayOfWeek];
  }

  private getApproxJieqi(date: Date): string | null {
    const m = date.getMonth();
    const d = date.getDate();
    const jieqiMap: [number, number, string][] = [
      [0, 5, "小寒"],
      [0, 20, "大寒"],
      [1, 4, "立春"],
      [1, 19, "雨水"],
      [2, 5, "惊蛰"],
      [2, 20, "春分"],
      [3, 5, "清明"],
      [3, 20, "谷雨"],
      [4, 5, "立夏"],
      [4, 21, "小满"],
      [5, 5, "芒种"],
      [5, 21, "夏至"],
      [6, 7, "小暑"],
      [6, 22, "大暑"],
      [7, 7, "立秋"],
      [7, 23, "处暑"],
      [8, 7, "白露"],
      [8, 23, "秋分"],
      [9, 8, "寒露"],
      [9, 23, "霜降"],
      [10, 7, "立冬"],
      [10, 22, "小雪"],
      [11, 7, "大雪"],
      [11, 22, "冬至"],
    ];
    for (const [jm, jd, name] of jieqiMap) {
      if (m === jm && Math.abs(d - jd) <= 1) return name;
    }
    return null;
  }

  private getPengzu(day: number): string[] {
    const pengzuMap: Record<number, string[]> = {
      1: ["甲不开仓", "子不问卜"],
      2: ["乙不栽植", "丑不冠带"],
      3: ["丙不修灶", "寅不祭祀"],
      4: ["丁不剃头", "卯不穿井"],
      5: ["戊不受田", "辰不哭泣"],
      6: ["己不破券", "巳不远行"],
      7: ["庚不经络", "午不苫盖"],
      8: ["辛不合酱", "未不服药"],
      9: ["壬不决水", "申不安床"],
      10: ["癸不词讼", "酉不会客"],
      11: ["子不问卜", "戌不吃犬"],
      12: ["丑不冠带", "亥不嫁娶"],
      13: ["寅不祭祀", "甲不开仓"],
      14: ["卯不穿井", "乙不栽植"],
      15: ["辰不哭泣", "丙不修灶"],
      16: ["巳不远行", "丁不剃头"],
      17: ["午不苫盖", "戊不受田"],
      18: ["未不服药", "己不破券"],
      19: ["申不安床", "庚不经络"],
      20: ["酉不会客", "辛不合酱"],
      21: ["戌不吃犬", "壬不决水"],
      22: ["亥不嫁娶", "癸不词讼"],
      23: ["甲不开仓", "卯不穿井"],
      24: ["乙不栽植", "辰不哭泣"],
      25: ["丙不修灶", "巳不远行"],
      26: ["丁不剃头", "午不苫盖"],
      27: ["戊不受田", "未不服药"],
      28: ["己不破券", "申不安床"],
      29: ["庚不经络", "酉不会客"],
      30: ["辛不合酱", "戌不吃犬"],
      31: ["壬不决水", "亥不嫁娶"],
    };
    return pengzuMap[day] || ["子不问卜", "丑不冠带"];
  }

  private pickRandom<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}

export default HuangLiEngine;
