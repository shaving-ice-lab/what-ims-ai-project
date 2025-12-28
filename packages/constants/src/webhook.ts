/**
 * Webhook相关常量
 */

/** Webhook目标类型 */
export const WEBHOOK_TARGET_TYPE = {
  /** 门店 */
  STORE: 'store',
  /** 供应商 */
  SUPPLIER: 'supplier',
} as const;

/** Webhook事件类型 */
export const WEBHOOK_EVENT_TYPE = {
  /** 订单创建 */
  ORDER_CREATED: 'order_created',
  /** 订单确认 */
  ORDER_CONFIRMED: 'order_confirmed',
  /** 订单配送中 */
  ORDER_DELIVERING: 'order_delivering',
  /** 订单完成 */
  ORDER_COMPLETED: 'order_completed',
  /** 订单取消 */
  ORDER_CANCELLED: 'order_cancelled',
  /** 订单恢复 */
  ORDER_RESTORED: 'order_restored',
} as const;

/** Webhook事件类型文本 */
export const WEBHOOK_EVENT_TYPE_TEXT: Record<string, string> = {
  [WEBHOOK_EVENT_TYPE.ORDER_CREATED]: '新订单',
  [WEBHOOK_EVENT_TYPE.ORDER_CONFIRMED]: '订单确认',
  [WEBHOOK_EVENT_TYPE.ORDER_DELIVERING]: '开始配送',
  [WEBHOOK_EVENT_TYPE.ORDER_COMPLETED]: '订单完成',
  [WEBHOOK_EVENT_TYPE.ORDER_CANCELLED]: '订单取消',
  [WEBHOOK_EVENT_TYPE.ORDER_RESTORED]: '订单恢复',
};

/** Webhook推送状态 */
export const WEBHOOK_STATUS = {
  /** 待推送 */
  PENDING: 'pending',
  /** 推送成功 */
  SUCCESS: 'success',
  /** 推送失败 */
  FAILED: 'failed',
} as const;

/** Webhook推送状态文本 */
export const WEBHOOK_STATUS_TEXT: Record<string, string> = {
  [WEBHOOK_STATUS.PENDING]: '待推送',
  [WEBHOOK_STATUS.SUCCESS]: '成功',
  [WEBHOOK_STATUS.FAILED]: '失败',
};

/** Webhook推送状态颜色 */
export const WEBHOOK_STATUS_COLOR: Record<string, string> = {
  [WEBHOOK_STATUS.PENDING]: '#f59e0b', // 橙色
  [WEBHOOK_STATUS.SUCCESS]: '#22c55e', // 绿色
  [WEBHOOK_STATUS.FAILED]: '#ef4444', // 红色
};

/** 默认Webhook事件（供应商） */
export const DEFAULT_SUPPLIER_WEBHOOK_EVENTS = [
  WEBHOOK_EVENT_TYPE.ORDER_CREATED,
  WEBHOOK_EVENT_TYPE.ORDER_CANCELLED,
] as const;

/** 默认Webhook事件（门店） */
export const DEFAULT_STORE_WEBHOOK_EVENTS = [
  WEBHOOK_EVENT_TYPE.ORDER_CONFIRMED,
  WEBHOOK_EVENT_TYPE.ORDER_DELIVERING,
  WEBHOOK_EVENT_TYPE.ORDER_COMPLETED,
] as const;
