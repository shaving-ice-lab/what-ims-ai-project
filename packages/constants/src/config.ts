/**
 * 配置相关常量
 */

/** 加价方式 */
export const MARKUP_TYPE = {
  /** 固定金额 */
  FIXED: 'fixed',
  /** 百分比 */
  PERCENT: 'percent',
} as const;

/** 加价方式文本 */
export const MARKUP_TYPE_TEXT: Record<string, string> = {
  [MARKUP_TYPE.FIXED]: '固定金额',
  [MARKUP_TYPE.PERCENT]: '百分比',
};

/** 配置类型 */
export const CONFIG_TYPE = {
  /** 字符串 */
  STRING: 'string',
  /** 数字 */
  NUMBER: 'number',
  /** 布尔 */
  BOOLEAN: 'boolean',
  /** JSON */
  JSON: 'json',
} as const;

/** 系统配置键 */
export const SYSTEM_CONFIG_KEYS = {
  /** 全局加价总开关 */
  MARKUP_GLOBAL_ENABLED: 'markup_global_enabled',
  /** 服务费费率 */
  SERVICE_FEE_RATE: 'service_fee_rate',
  /** 自主取消时限(秒) */
  ORDER_CANCEL_THRESHOLD: 'order_cancel_threshold',
  /** 支付超时时间(秒) */
  PAYMENT_TIMEOUT: 'payment_timeout',
  /** Webhook重试次数 */
  WEBHOOK_RETRY_TIMES: 'webhook_retry_times',
  /** Webhook重试间隔(秒) */
  WEBHOOK_RETRY_INTERVAL: 'webhook_retry_interval',
} as const;

/** 系统配置默认值 */
export const SYSTEM_CONFIG_DEFAULTS: Record<string, unknown> = {
  [SYSTEM_CONFIG_KEYS.MARKUP_GLOBAL_ENABLED]: true,
  [SYSTEM_CONFIG_KEYS.SERVICE_FEE_RATE]: 0.003, // 3‰
  [SYSTEM_CONFIG_KEYS.ORDER_CANCEL_THRESHOLD]: 3600, // 1小时
  [SYSTEM_CONFIG_KEYS.PAYMENT_TIMEOUT]: 900, // 15分钟
  [SYSTEM_CONFIG_KEYS.WEBHOOK_RETRY_TIMES]: 3,
  [SYSTEM_CONFIG_KEYS.WEBHOOK_RETRY_INTERVAL]: 300, // 5分钟
};

/** 系统配置描述 */
export const SYSTEM_CONFIG_DESC: Record<string, string> = {
  [SYSTEM_CONFIG_KEYS.MARKUP_GLOBAL_ENABLED]: '全局加价总开关，关闭后所有加价规则失效',
  [SYSTEM_CONFIG_KEYS.SERVICE_FEE_RATE]: '支付服务费费率，如0.003表示3‰',
  [SYSTEM_CONFIG_KEYS.ORDER_CANCEL_THRESHOLD]: '门店可自主取消订单的时限（秒），超过后需申请取消',
  [SYSTEM_CONFIG_KEYS.PAYMENT_TIMEOUT]: '支付二维码有效期（秒）',
  [SYSTEM_CONFIG_KEYS.WEBHOOK_RETRY_TIMES]: 'Webhook推送失败后的重试次数',
  [SYSTEM_CONFIG_KEYS.WEBHOOK_RETRY_INTERVAL]: 'Webhook重试间隔（秒）',
};

/** 系统配置类型映射 */
export const SYSTEM_CONFIG_TYPES: Record<string, string> = {
  [SYSTEM_CONFIG_KEYS.MARKUP_GLOBAL_ENABLED]: CONFIG_TYPE.BOOLEAN,
  [SYSTEM_CONFIG_KEYS.SERVICE_FEE_RATE]: CONFIG_TYPE.NUMBER,
  [SYSTEM_CONFIG_KEYS.ORDER_CANCEL_THRESHOLD]: CONFIG_TYPE.NUMBER,
  [SYSTEM_CONFIG_KEYS.PAYMENT_TIMEOUT]: CONFIG_TYPE.NUMBER,
  [SYSTEM_CONFIG_KEYS.WEBHOOK_RETRY_TIMES]: CONFIG_TYPE.NUMBER,
  [SYSTEM_CONFIG_KEYS.WEBHOOK_RETRY_INTERVAL]: CONFIG_TYPE.NUMBER,
};
