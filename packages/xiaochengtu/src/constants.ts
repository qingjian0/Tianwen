export const BAGUA_NAMES: Record<number, string> = {
  1: '乾', 2: '兑', 3: '离', 4: '震',
  5: '巽', 6: '坎', 7: '艮', 8: '坤'
};

export const PALACE_POSITIONS: Record<number, string> = {
  1: '中宫', 2: '乾宫', 3: '兑宫', 4: '离宫',
  5: '震宫', 6: '巽宫', 7: '坎宫', 8: '艮宫', 9: '坤宫'
};

export const GUICANG_RULES: Record<string, string> = {
  '坤坤': '坤', '坤乾': '乾', '乾坤': '坤',
  '乾乾': '乾', '兑兑': '兑', '离离': '离'
};