import {
  ChronoEngine,
  Tiangan,
  Dizhi,
  Wuxing,
  Bagua,
  ChronoData,
} from "@tianwen/chrono-engine";
import {
  NAGUA_MAP,
  LIUQIN_RELATION,
  LIUSHEN,
  LIUSHEN_START,
  TIANGAN_WUXING,
  DIZHI_WUXING,
  DIZHI_LIUCHONG,
  SHIYAO_POSITION,
} from "./constants";
import { LiuYaoResult, LiuYaoYao, YaoState } from "./types";

// 六十四卦名（简化版）
const GUA_NAMES: Record<string, string> = {
  乾乾: "乾为天",
  兑兑: "兑为泽",
  离离: "离为火",
  震震: "震为雷",
  巽巽: "巽为风",
  坎坎: "坎为水",
  艮艮: "艮为山",
  坤坤: "坤为地",
  乾兑: "天泽履",
  乾离: "天火同人",
  乾震: "天雷无妄",
  乾巽: "天风姤",
  乾坎: "天水讼",
  乾艮: "天山遁",
  乾坤: "天地否",
  兑乾: "泽天夬",
  兑离: "泽火革",
  兑震: "泽雷随",
  兑巽: "泽风大过",
  兑坎: "泽水困",
  兑艮: "泽山咸",
  兑坤: "泽地萃",
  离乾: "火天大有",
  离兑: "火泽睽",
  离震: "火雷噬嗑",
  离巽: "火风鼎",
  离坎: "火水未济",
  离艮: "火山旅",
  离坤: "火地晋",
  震乾: "雷天大壮",
  震兑: "雷泽归妹",
  震离: "雷火丰",
  震巽: "雷风恒",
  震坎: "雷水解",
  震艮: "雷山小过",
  震坤: "雷地豫",
  巽乾: "风天小畜",
  巽兑: "风泽中孚",
  巽离: "风火家人",
  巽震: "风雷益",
  巽坎: "风水涣",
  巽艮: "风山渐",
  巽坤: "风地观",
  坎乾: "水天需",
  坎兑: "水泽节",
  坎离: "水火既济",
  坎震: "水雷屯",
  坎巽: "水风井",
  坎艮: "水山蹇",
  坎坤: "水地比",
  艮乾: "山天大畜",
  艮兑: "山泽损",
  艮离: "山火贲",
  艮震: "山雷颐",
  艮巽: "山风蛊",
  艮坎: "山水蒙",
  艮坤: "山地剥",
  坤乾: "地天泰",
  坤兑: "地泽临",
  坤离: "地火明夷",
  坤震: "地雷复",
  坤巽: "地风升",
  坤坎: "地水师",
  坤艮: "地山谦",
};

export class LiuYaoEngine {
  private chronoEngine: ChronoEngine;

  constructor() {
    this.chronoEngine = new ChronoEngine();
  }

  /**
   * 铜钱起卦
   */
  divinateByCoin(results: number[], date?: Date): LiuYaoResult {
    if (results.length !== 6) {
      throw new Error("铜钱起卦需要6次结果");
    }

    const chronoData = date ? ChronoEngine.at(date) : ChronoEngine.now();
    const yaos: YaoState[] = results.map((r) => {
      if (r === 6) return "oldYin";
      if (r === 7) return "youngYang";
      if (r === 8) return "youngYin";
      if (r === 9) return "oldYang";
      throw new Error("铜钱结果必须是6,7,8,9");
    });

    return this.buildResult("coin", yaos, chronoData);
  }

  /**
   * 数字起卦
   */
  divinateByNumber(
    num1: number,
    num2: number,
    num3?: number,
    date?: Date,
  ): LiuYaoResult {
    const chronoData = date ? ChronoEngine.at(date) : ChronoEngine.now();

    const yaos: YaoState[] = [];
    for (let i = 0; i < 6; i++) {
      const n = (num1 + num2 + (num3 || 0) + i) % 4;
      if (n === 0) yaos.push("oldYang");
      else if (n === 1) yaos.push("youngYang");
      else if (n === 2) yaos.push("youngYin");
      else yaos.push("oldYin");
    }

    return this.buildResult("number", yaos, chronoData);
  }

  /**
   * 时间起卦
   */
  divinateByTime(date?: Date): LiuYaoResult {
    const chronoData = date ? ChronoEngine.at(date) : ChronoEngine.now();
    const lunar = chronoData.lunar;

    const yaos: YaoState[] = [];
    const seed =
      lunar.year +
      lunar.month +
      lunar.day +
      this.getHourIndex(chronoData.shichen.dizhi);

    for (let i = 0; i < 6; i++) {
      const n = (seed + i) % 4;
      if (n === 0) yaos.push("oldYang");
      else if (n === 1) yaos.push("youngYang");
      else if (n === 2) yaos.push("youngYin");
      else yaos.push("oldYin");
    }

    return this.buildResult("time", yaos, chronoData);
  }

  /**
   * 构建六爻结果
   */
  private buildResult(
    method: "coin" | "number" | "time" | "manual",
    yaos: YaoState[],
    chronoData: ChronoData,
  ): LiuYaoResult {
    // 1. 确定本卦
    const benGuaYaosBinary = yaos
      .map((y) => (y === "oldYang" || y === "youngYang" ? "1" : "0"))
      .join("");
    const shangGua = this.getBaguaFromBinary(benGuaYaosBinary.substring(0, 3));
    const xiaGua = this.getBaguaFromBinary(benGuaYaosBinary.substring(3, 6));
    const guaName = GUA_NAMES[shangGua + xiaGua] || `${shangGua}${xiaGua}`;

    // 2. 世爻应爻
    const shiyaoPos = this.getShiyaoPosition(shangGua, xiaGua);
    const yingyaoPos = (shiyaoPos + 2) % 6 || 6;

    // 3. 月建、日辰、旬空
    const yuejian = chronoData.ganzhi.month.zhi;
    const richend = chronoData.ganzhi.day.gan;
    const xunkong = this.calculateXunkong(chronoData.ganzhi.day.full);

    // 4. 六神起始
    const liushenStart = LIUSHEN_START[richend];

    // 5. 世爻五行（为六亲）
    const shiyaoWuxing = this.getShiyaoWuxing(shangGua, xiaGua, shiyaoPos);

    // 6. 构建本卦爻
    const benGuaYaos: LiuYaoYao[] = [];
    for (let i = 0; i < 6; i++) {
      const pos = i + 1;
      const yaoState = yaos[i];
      const { tiangan, dizhi } = this.getNagua(shangGua, xiaGua, pos);
      const dizhiWuxing = DIZHI_WUXING[dizhi];
      const liuqin = LIUQIN_RELATION[shiyaoWuxing][dizhiWuxing];
      const liushen = LIUSHEN[(liushenStart + i) % 6];
      const isChanging = yaoState === "oldYang" || yaoState === "oldYin";

      benGuaYaos.push({
        position: pos,
        state: yaoState,
        isChanging,
        tiangan,
        dizhi,
        wuxing: dizhiWuxing,
        liuqin,
        liushen,
        isShiyao: pos === shiyaoPos,
        isYingyao: pos === yingyaoPos,
        isXunkong: xunkong.includes(dizhi),
        isYuepo: dizhi === DIZHI_LIUCHONG[yuejian],
        isRichong: dizhi === DIZHI_LIUCHONG[chronoData.ganzhi.day.zhi],
      });
    }

    // 7. 变卦
    let bianGua: LiuYaoResult["bianGua"] = undefined;
    const changingPositions = benGuaYaos
      .filter((y) => y.isChanging)
      .map((y) => y.position);
    if (changingPositions.length > 0) {
      const bianBinary = benGuaYaosBinary
        .split("")
        .map((c, i) => {
          return changingPositions.includes(i + 1)
            ? c === "1"
              ? "0"
              : "1"
            : c;
        })
        .join("");
      const bianShangGua = this.getBaguaFromBinary(bianBinary.substring(0, 3));
      const bianXiaGua = this.getBaguaFromBinary(bianBinary.substring(3, 6));
      const bianGuaName =
        GUA_NAMES[bianShangGua + bianXiaGua] || `${bianShangGua}${bianXiaGua}`;

      const bianShiyaoPos = this.getShiyaoPosition(bianShangGua, bianXiaGua);
      const bianYingyaoPos = (bianShiyaoPos + 2) % 6 || 6;
      const bianShiyaoWuxing = this.getShiyaoWuxing(
        bianShangGua,
        bianXiaGua,
        bianShiyaoPos,
      );

      const bianGuaYaos: LiuYaoYao[] = [];
      for (let i = 0; i < 6; i++) {
        const pos = i + 1;
        const yaoState = changingPositions.includes(pos)
          ? yaos[i] === "oldYang"
            ? "youngYin"
            : "youngYang"
          : yaos[i];
        const { tiangan, dizhi } = this.getNagua(bianShangGua, bianXiaGua, pos);
        const dizhiWuxing = DIZHI_WUXING[dizhi];
        const liuqin = LIUQIN_RELATION[bianShiyaoWuxing][dizhiWuxing];
        const liushen = LIUSHEN[(liushenStart + i) % 6];

        bianGuaYaos.push({
          position: pos,
          state: yaoState,
          isChanging: false,
          tiangan,
          dizhi,
          wuxing: dizhiWuxing,
          liuqin,
          liushen,
          isShiyao: pos === bianShiyaoPos,
          isYingyao: pos === bianYingyaoPos,
          isXunkong: xunkong.includes(dizhi),
          isYuepo: dizhi === DIZHI_LIUCHONG[yuejian],
          isRichong: dizhi === DIZHI_LIUCHONG[chronoData.ganzhi.day.zhi],
        });
      }

      bianGua = {
        name: bianGuaName,
        shangGua: bianShangGua,
        xiaGua: bianXiaGua,
        yaos: bianGuaYaos,
      };
    }

    return {
      method,
      benGua: {
        name: guaName,
        shangGua,
        xiaGua,
        yaos: benGuaYaos,
      },
      bianGua,
      chronoData,
      yuejian,
      richend,
      xunkong,
    };
  }

  /**
   * 从二进制获取八卦
   */
  private getBaguaFromBinary(binary: string): Bagua {
    const map: Record<string, Bagua> = {
      "111": "乾",
      "110": "兑",
      "101": "离",
      "100": "震",
      "011": "巽",
      "010": "坎",
      "001": "艮",
      "000": "坤",
    };
    return map[binary] || "乾";
  }

  /**
   * 获取纳甲
   */
  private getNagua(
    shangGua: Bagua,
    xiaGua: Bagua,
    position: number,
  ): { tiangan: Tiangan; dizhi: Dizhi } {
    const gua = position <= 3 ? xiaGua : shangGua;
    const idxInGua = position <= 3 ? position - 1 : position - 4;
    const nagua = NAGUA_MAP[gua];

    return {
      tiangan: nagua.tiangan[idxInGua],
      dizhi: nagua.dizhi[idxInGua],
    };
  }

  /**
   * 计算世爻位置（简化版游年歌诀）
   */
  private getShiyaoPosition(shangGua: Bagua, xiaGua: Bagua): number {
    if (shangGua === xiaGua) {
      return SHIYAO_POSITION[shangGua];
    }
    return 3; // 默认三爻
  }

  /**
   * 获取世爻五行
   */
  private getShiyaoWuxing(
    shangGua: Bagua,
    xiaGua: Bagua,
    position: number,
  ): Wuxing {
    const { dizhi } = this.getNagua(shangGua, xiaGua, position);
    return DIZHI_WUXING[dizhi];
  }

  /**
   * 计算旬空
   */
  private calculateXunkong(rizhu: string): [Dizhi, Dizhi] {
    const dizhiList: Dizhi[] = [
      "子",
      "丑",
      "寅",
      "卯",
      "辰",
      "巳",
      "午",
      "未",
      "申",
      "酉",
      "戌",
      "亥",
    ];
    const tianganList: Tiangan[] = [
      "甲",
      "乙",
      "丙",
      "丁",
      "戊",
      "己",
      "庚",
      "辛",
      "壬",
      "癸",
    ];

    const tian = rizhu[0] as Tiangan;
    const di = rizhu[1] as Dizhi;
    const tianIdx = tianganList.indexOf(tian);
    const diIdx = dizhiList.indexOf(di);

    const xunStart = tianIdx;
    const xunDiStart = diIdx - tianIdx;

    const kong1 = dizhiList[(xunDiStart + 10) % 12];
    const kong2 = dizhiList[(xunDiStart + 11) % 12];

    return [kong1, kong2];
  }

  /**
   * 获取时辰索引
   */
  private getHourIndex(dizhi: Dizhi): number {
    const dizhiList: Dizhi[] = [
      "子",
      "丑",
      "寅",
      "卯",
      "辰",
      "巳",
      "午",
      "未",
      "申",
      "酉",
      "戌",
      "亥",
    ];
    return dizhiList.indexOf(dizhi) + 1;
  }
}
