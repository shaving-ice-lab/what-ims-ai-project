/**
 * 订单相关常量
 */

/** 订单状态 */
export const ORDER_STATUS = {
  /** 待付款 */
  PENDING_PAYMENT: 'pending_payment',
  /** 待确认 */
  PENDING_CONFIRM: 'pending_confirm',
  /** 已确认 */
  CONFIRMED: 'confirmed',
  /** 配送中 */
  DELIVERING: 'delivering',
  /** 已完成 */
  COMPLETED: 'completed',
  /** 已取消 */
  CANCELLED: 'cancelled',
} as const;

/** 订单状态文本 */
export const ORDER_STATUS_TEXT: Record<string, string> = {
  [ORDER_STATUS.PENDING_PAYMENT]: '待付款',
  [ORDER_STATUS.PENDING_CONFIRM]: '待确认',
  [ORDER_STATUS.CONFIRMED]: '已确认',
  [ORDER_STATUS.DELIVERING]: '配送中',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
};

/** 订单状态颜色 */
export const ORDER_STATUS_COLOR: Record<string, string> = {
  [ORDER_STATUS.PENDING_PAYMENT]: '#f59e0b', // 橙色
  [ORDER_STATUS.PENDING_CONFIRM]: '#3b82f6', // 蓝色
  [ORDER_STATUS.CONFIRMED]: '#8b5cf6', // 紫色
  [ORDER_STATUS.DELIVERING]: '#06b6d4', // 青色
  [ORDER_STATUS.COMPLETED]: '#22c55e', // 绿色
  [ORDER_STATUS.CANCELLED]: '#6b7280', // 灰色
};

/** 支付状态 */
export const PAYMENT_STATUS = {
  /** 未支付 */
  UNPAID: 'unpaid',
  /** 已支付 */
  PAID: 'paid',
  /** 已退款 */
  REFUNDED: 'refunded',
} as const;

/** 支付状态文本 */
export const PAYMENT_STATUS_TEXT: Record<string, string> = {
  [PAYMENT_STATUS.UNPAID]: '未支付',
  [PAYMENT_STATUS.PAID]: '已支付',
  [PAYMENT_STATUS.REFUNDED]: '已退款',
};

/** 支付方式 */
export const PAYMENT_METHOD = {
  /** 微信支付 */
  WECHAT: 'wechat',
  /** 支付宝 */
  ALIPAY: 'alipay',
} as const;

/** 支付方式文本 */
export const PAYMENT_METHOD_TEXT: Record<string, string> = {
  [PAYMENT_METHOD.WECHAT]: '微信支付',
  [PAYMENT_METHOD.ALIPAY]: '支付宝',
};

/** 订单来源 */
export const ORDER_SOURCE = {
  /** APP */
  APP: 'app',
  /** Web */
  WEB: 'web',
  /** H5 */
  H5: 'h5',
} as const;

/** 订单来源文本 */
export const ORDER_SOURCE_TEXT: Record<string, string> = {
  [ORDER_SOURCE.APP]: 'APP',
  [ORDER_SOURCE.WEB]: 'Web端',
  [ORDER_SOURCE.H5]: 'H5',
};

/** 取消人类型 */
export const CANCELLED_BY = {
  /** 门店 */
  STORE: 'store',
  /** 供应商 */
  SUPPLIER: 'supplier',
  /** 管理员 */
  ADMIN: 'admin',
  /** 系统 */
  SYSTEM: 'system',
} as const;

/** 取消人类型文本 */
export const CANCELLED_BY_TEXT: Record<string, string> = {
  [CANCELLED_BY.STORE]: '门店',
  [CANCELLED_BY.SUPPLIER]: '供应商',
  [CANCELLED_BY.ADMIN]: '管理员',
  [CANCELLED_BY.SYSTEM]: '系统',
};

/** 取消申请状态 */
export const CANCEL_REQUEST_STATUS = {
  /** 待处理 */
  PENDING: 'pending',
  /** 已通过 */
  APPROVED: 'approved',
  /** 已拒绝 */
  REJECTED: 'rejected',
} as const;

/** 取消申请状态文本 */
export const CANCEL_REQUEST_STATUS_TEXT: Record<string, string> = {
  [CANCEL_REQUEST_STATUS.PENDING]: '待处理',
  [CANCEL_REQUEST_STATUS.APPROVED]: '已通过',
  [CANCEL_REQUEST_STATUS.REJECTED]: '已拒绝',
};

/** 订单状态流转映射（当前状态可以转换到的状态） */
export const ORDER_STATUS_FLOW: Record<string, string[]> = {
  [ORDER_STATUS.PENDING_PAYMENT]: [ORDER_STATUS.PENDING_CONFIRM, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PENDING_CONFIRM]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.DELIVERING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.DELIVERING]: [ORDER_STATUS.COMPLETED],
  [ORDER_STATUS.COMPLETED]: [],
  [ORDER_STATUS.CANCELLED]: [ORDER_STATUS.PENDING_CONFIRM], // 恢复订单
};
