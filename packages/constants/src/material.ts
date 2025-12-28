/**
 * 物料相关常量
 */

/** 库存状态 */
export const STOCK_STATUS = {
  /** 有货 */
  IN_STOCK: 'in_stock',
  /** 缺货 */
  OUT_OF_STOCK: 'out_of_stock',
} as const;

/** 库存状态文本 */
export const STOCK_STATUS_TEXT: Record<string, string> = {
  [STOCK_STATUS.IN_STOCK]: '有货',
  [STOCK_STATUS.OUT_OF_STOCK]: '缺货',
};

/** 库存状态颜色 */
export const STOCK_STATUS_COLOR: Record<string, string> = {
  [STOCK_STATUS.IN_STOCK]: '#22c55e', // 绿色
  [STOCK_STATUS.OUT_OF_STOCK]: '#ef4444', // 红色
};

/** 审核状态 */
export const AUDIT_STATUS = {
  /** 待审核 */
  PENDING: 'pending',
  /** 已通过 */
  APPROVED: 'approved',
  /** 已拒绝 */
  REJECTED: 'rejected',
} as const;

/** 审核状态文本 */
export const AUDIT_STATUS_TEXT: Record<string, string> = {
  [AUDIT_STATUS.PENDING]: '待审核',
  [AUDIT_STATUS.APPROVED]: '已通过',
  [AUDIT_STATUS.REJECTED]: '已拒绝',
};

/** 审核状态颜色 */
export const AUDIT_STATUS_COLOR: Record<string, string> = {
  [AUDIT_STATUS.PENDING]: '#f59e0b', // 橙色
  [AUDIT_STATUS.APPROVED]: '#22c55e', // 绿色
  [AUDIT_STATUS.REJECTED]: '#ef4444', // 红色
};

/** 图片匹配规则类型 */
export const IMAGE_MATCH_RULE_TYPE = {
  /** 按名称匹配 */
  NAME: 'name',
  /** 按品牌匹配 */
  BRAND: 'brand',
  /** 按SKU匹配 */
  SKU: 'sku',
  /** 按关键词匹配 */
  KEYWORD: 'keyword',
} as const;

/** 图片匹配规则类型文本 */
export const IMAGE_MATCH_RULE_TYPE_TEXT: Record<string, string> = {
  [IMAGE_MATCH_RULE_TYPE.NAME]: '按名称匹配',
  [IMAGE_MATCH_RULE_TYPE.BRAND]: '按品牌匹配',
  [IMAGE_MATCH_RULE_TYPE.SKU]: '按SKU匹配',
  [IMAGE_MATCH_RULE_TYPE.KEYWORD]: '按关键词匹配',
};

/** 默认分类图标 */
export const DEFAULT_CATEGORY_ICONS: Record<string, string> = {
  vegetables: '🥬',
  fruits: '🍎',
  meat: '🥩',
  seafood: '🦐',
  dairy: '🥛',
  beverages: '🥤',
  snacks: '🍪',
  condiments: '🧂',
  frozen: '🧊',
  other: '📦',
};

/** 常用单位 */
export const COMMON_UNITS = [
  '个',
  '件',
  '箱',
  '包',
  '袋',
  '盒',
  '瓶',
  '罐',
  '桶',
  '斤',
  '公斤',
  '克',
  '升',
  '毫升',
] as const;

/** 常用品牌（示例） */
export const COMMON_BRANDS = [
  '本地',
  '进口',
  '有机',
  '无品牌',
] as const;
