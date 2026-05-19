import meihuaRules from './meihua/rules';
import liuyaoRules from './liuyao/rules';
import universalRules from './universal/rules';

export const allRules = [
  ...meihuaRules,
  ...liuyaoRules,
  ...universalRules
];

export const getRulesByCategory = (category: string) => {
  const categoryMap: Record<string, any[]> = {
    meihua: meihuaRules,
    liuyao: liuyaoRules,
    universal: universalRules
  };
  return categoryMap[category] || [];
};

export {
  meihuaRules,
  liuyaoRules,
  universalRules
};

export default allRules;
