export * from "./meihua/rules";
export * from "./liuyao/rules";
export * from "./universal/rules";
export * from "./bazi/rules";
export * from "./qimen/rules";
export * from "./ziwei/rules";

import { meihuaRules } from "./meihua/rules";
import { liuyaoRules } from "./liuyao/rules";
import { universalRules } from "./universal/rules";
import { baziRules } from "./bazi/rules";
import { qimenRules } from "./qimen/rules";
import { ziweiRules } from "./ziwei/rules";

export const allRules = [
  ...meihuaRules,
  ...liuyaoRules,
  ...universalRules,
  ...baziRules,
  ...qimenRules,
  ...ziweiRules,
];

export const rulesByCategory = {
  meihua: meihuaRules,
  liuyao: liuyaoRules,
  universal: universalRules,
  bazi: baziRules,
  qimen: qimenRules,
  ziwei: ziweiRules,
};

export const getRulesByCategory = (category: string) => {
  return rulesByCategory[category] || [];
};

export const getRuleCount = () => {
  return {
    total: allRules.length,
    meihua: meihuaRules.length,
    liuyao: liuyaoRules.length,
    universal: universalRules.length,
    bazi: baziRules.length,
    qimen: qimenRules.length,
    ziwei: ziweiRules.length,
  };
};
