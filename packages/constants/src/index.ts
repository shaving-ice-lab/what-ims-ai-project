// 订单状态常量
export const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  PENDING_CONFIRM: 'pending_confirm',
  CONFIRMED: 'confirmed',
  DELIVERING: 'delivering',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING_PAYMENT]: '待付款',
  [ORDER_STATUS.PENDING_CONFIRM]: '待确认',
  [ORDER_STATUS.CONFIRMED]: '已确认',
  [ORDER_STATUS.DELIVERING]: '配送中',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
};

// 用户角色常量
export const USER_ROLE = {
  ADMIN: 'admin',
  SUB_ADMIN: 'sub_admin',
  SUPPLIER: 'supplier',
  STORE: 'store',
} as const;

export const USER_ROLE_TEXT = {
  [USER_ROLE.ADMIN]: '主管理员',
  [USER_ROLE.SUB_ADMIN]: '子管理员',
  [USER_ROLE.SUPPLIER]: '供应商',
  [USER_ROLE.STORE]: '门店',
};

// 权限模块常量
export const PERMISSIONS = {
  // 普通权限（可分配给子管理员）
  ORDER: 'order',              // 订单管理
  REPORT: 'report',            // 数据报表
  SUPPLIER: 'supplier',        // 供应商管理
  STORE: 'store',              // 门店管理
  MATERIAL: 'material',        // 物料管理
  MEDIA: 'media',              // 素材库
  PRODUCT_AUDIT: 'product_audit',     // 产品审核
  MARKUP: 'markup',            // 加价管理
  DELIVERY_AUDIT: 'delivery_audit',   // 配送设置审核
  WEBHOOK: 'webhook',          // Webhook配置
  
  // 敏感权限（仅主管理员）
  PAYMENT_CONFIG: 'payment_config',   // 支付配置
  API_CONFIG: 'api_config',           // API配置
  SYSTEM_CONFIG: 'system_config',     // 系统设置
  ADMIN_MANAGE: 'admin_manage',       // 管理员管理
} as const;

export const SENSITIVE_PERMISSIONS = [
  'payment_config', 'api_config', 'system_config', 'admin_manage'
];

// 配送模式常量
export const DELIVERY_MODE = {
  SELF_DELIVERY: 'self_delivery',
  EXPRESS_DELIVERY: 'express_delivery',
} as const;

export const DELIVERY_MODE_TEXT = {
  [DELIVERY_MODE.SELF_DELIVERY]: '自配送',
  [DELIVERY_MODE.EXPRESS_DELIVERY]: '快递配送',
};

// 支付方式常量
export const PAYMENT_METHOD = {
  WECHAT: 'wechat',
  ALIPAY: 'alipay',
} as const;

export const PAYMENT_METHOD_TEXT = {
  [PAYMENT_METHOD.WECHAT]: '微信支付',
  [PAYMENT_METHOD.ALIPAY]: '支付宝',
};

// 支付状态常量
export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_STATUS_TEXT = {
  [PAYMENT_STATUS.UNPAID]: '未支付',
  [PAYMENT_STATUS.PAID]: '已支付',
  [PAYMENT_STATUS.REFUNDED]: '已退款',
};

// 审核状态常量
export const AUDIT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const AUDIT_STATUS_TEXT = {
  [AUDIT_STATUS.PENDING]: '待审核',
  [AUDIT_STATUS.APPROVED]: '已通过',
  [AUDIT_STATUS.REJECTED]: '已驳回',
};

// 库存状态常量
export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
} as const;

export const STOCK_STATUS_TEXT = {
  [STOCK_STATUS.IN_STOCK]: '有货',
  [STOCK_STATUS.OUT_OF_STOCK]: '缺货',
};

// 加价类型常量
export const MARKUP_TYPE = {
  FIXED: 'fixed',
  PERCENT: 'percent',
} as const;

export const MARKUP_TYPE_TEXT = {
  [MARKUP_TYPE.FIXED]: '固定金额',
  [MARKUP_TYPE.PERCENT]: '百分比',
};

// 管理模式常量
export const MANAGEMENT_MODE = {
  SELF: 'self',
  MANAGED: 'managed',
  WEBHOOK: 'webhook',
  API: 'api',
} as const;

export const MANAGEMENT_MODE_TEXT = {
  [MANAGEMENT_MODE.SELF]: '自管理',
  [MANAGEMENT_MODE.MANAGED]: '托管',
  [MANAGEMENT_MODE.WEBHOOK]: 'Webhook对接',
  [MANAGEMENT_MODE.API]: 'API对接',
};

// 错误码常量
export const ERROR_CODE = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// 正则表达式常量
export const REGEX = {
  PHONE: /^1[3-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ID_CARD: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  CREDIT_CODE: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
  CHINESE_NAME: /^[\u4e00-\u9fa5]{2,10}$/,
} as const;

// 系统配置键常量
export const SYSTEM_CONFIG_KEY = {
  ORDER_CANCEL_THRESHOLD: 'order_cancel_threshold',
  PAYMENT_TIMEOUT: 'payment_timeout',
  SERVICE_FEE_RATE: 'service_fee_rate',
  WEBHOOK_RETRY_TIMES: 'webhook_retry_times',
  WEBHOOK_RETRY_INTERVAL: 'webhook_retry_interval',
} as const;

// 分页默认值
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// 日期格式
export const DATE_FORMAT = {
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
} as const;

// 文件大小限制（字节）
export const FILE_SIZE_LIMIT = {
  IMAGE: 5 * 1024 * 1024,  // 5MB
  EXCEL: 10 * 1024 * 1024, // 10MB
  PDF: 20 * 1024 * 1024,   // 20MB
} as const;

// 文件类型
export const FILE_TYPE = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
  EXCEL: ['xlsx', 'xls', 'csv'],
  PDF: ['pdf'],
} as const;

// Webhook事件类型
export const WEBHOOK_EVENT = {
  ORDER_CREATED: 'order.created',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_DELIVERING: 'order.delivering',
  ORDER_COMPLETED: 'order.completed',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_RESTORED: 'order.restored',
} as const;

export const WEBHOOK_EVENT_TEXT = {
  [WEBHOOK_EVENT.ORDER_CREATED]: '订单创建',
  [WEBHOOK_EVENT.ORDER_CONFIRMED]: '订单确认',
  [WEBHOOK_EVENT.ORDER_DELIVERING]: '订单配送',
  [WEBHOOK_EVENT.ORDER_COMPLETED]: '订单完成',
  [WEBHOOK_EVENT.ORDER_CANCELLED]: '订单取消',
  [WEBHOOK_EVENT.ORDER_RESTORED]: '订单恢复',
};
