/**
 * 用户相关常量
 */

/** 用户角色 */
export const USER_ROLE = {
  /** 管理员 */
  ADMIN: 'admin',
  /** 子管理员 */
  SUB_ADMIN: 'sub_admin',
  /** 供应商 */
  SUPPLIER: 'supplier',
  /** 门店 */
  STORE: 'store',
} as const;

/** 用户角色文本 */
export const USER_ROLE_TEXT: Record<string, string> = {
  [USER_ROLE.ADMIN]: '管理员',
  [USER_ROLE.SUB_ADMIN]: '子管理员',
  [USER_ROLE.SUPPLIER]: '供应商',
  [USER_ROLE.STORE]: '门店',
};

/** 用户状态 */
export const USER_STATUS = {
  /** 禁用 */
  DISABLED: 0,
  /** 启用 */
  ENABLED: 1,
} as const;

/** 用户状态文本 */
export const USER_STATUS_TEXT: Record<number, string> = {
  [USER_STATUS.DISABLED]: '禁用',
  [USER_STATUS.ENABLED]: '启用',
};

/** 供应商管理模式 */
export const SUPPLIER_MANAGEMENT_MODE = {
  /** 自主管理 */
  SELF: 'self',
  /** 平台托管 */
  MANAGED: 'managed',
  /** Webhook通知 */
  WEBHOOK: 'webhook',
  /** API对接 */
  API: 'api',
} as const;

/** 供应商管理模式文本 */
export const SUPPLIER_MANAGEMENT_MODE_TEXT: Record<string, string> = {
  [SUPPLIER_MANAGEMENT_MODE.SELF]: '自主管理',
  [SUPPLIER_MANAGEMENT_MODE.MANAGED]: '平台托管',
  [SUPPLIER_MANAGEMENT_MODE.WEBHOOK]: 'Webhook通知',
  [SUPPLIER_MANAGEMENT_MODE.API]: 'API对接',
};

/** 配送模式 */
export const DELIVERY_MODE = {
  /** 自配送 */
  SELF_DELIVERY: 'self_delivery',
  /** 快递配送 */
  EXPRESS_DELIVERY: 'express_delivery',
} as const;

/** 配送模式文本 */
export const DELIVERY_MODE_TEXT: Record<string, string> = {
  [DELIVERY_MODE.SELF_DELIVERY]: '自配送',
  [DELIVERY_MODE.EXPRESS_DELIVERY]: '快递配送',
};

/** 星期映射 */
export const WEEKDAY_MAP: Record<number, string> = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日',
};

/** 审核状态（供应商设置变更） */
export const SETTING_AUDIT_STATUS = {
  /** 待审核 */
  PENDING: 'pending',
  /** 已通过 */
  APPROVED: 'approved',
  /** 已拒绝 */
  REJECTED: 'rejected',
} as const;

/** 审核状态文本 */
export const SETTING_AUDIT_STATUS_TEXT: Record<string, string> = {
  [SETTING_AUDIT_STATUS.PENDING]: '待审核',
  [SETTING_AUDIT_STATUS.APPROVED]: '已通过',
  [SETTING_AUDIT_STATUS.REJECTED]: '已拒绝',
};

/** 设置变更类型 */
export const SETTING_CHANGE_TYPE = {
  /** 起送价 */
  MIN_ORDER: 'min_order',
  /** 配送日 */
  DELIVERY_DAYS: 'delivery_days',
  /** 配送区域 */
  DELIVERY_AREA: 'delivery_area',
} as const;

/** 设置变更类型文本 */
export const SETTING_CHANGE_TYPE_TEXT: Record<string, string> = {
  [SETTING_CHANGE_TYPE.MIN_ORDER]: '起送价',
  [SETTING_CHANGE_TYPE.DELIVERY_DAYS]: '配送日',
  [SETTING_CHANGE_TYPE.DELIVERY_AREA]: '配送区域',
};
