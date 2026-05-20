export interface HuangLiInput {
  year: number;
  month: number;
  day: number;
  calendar?: 'solar' | 'lunar';
}

export interface DayActivities {
  yi: string[];
  ji: string[];
}

export interface DayInfo {
  solarDate: string;
  lunarDate: string;
  lunarYear: string;
  lunarMonth: string;
  lunarDay: string;
  ganzhi: {
    year: string;
    month: string;
    day: string;
  };
  animal: string;
  jieqi: string | null;
  activities: DayActivities;
  chongSha: {
    chong: string;
    sha: string;
  };
  jishen: string[];
  xiongshen: string[];
  wuxing: string;
  pengzu: string[];
}

export interface HuangLiResult {
  date: DayInfo;
  monthOverview: {
    daysInMonth: number;
    jieqi: string[];
    festivals: string[];
  };
}