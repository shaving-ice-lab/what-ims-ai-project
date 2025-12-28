/**
 * 权限相关常量
 */

/** 权限模块 */
export const PERMISSIONS = {
  /** 订单管理 */
  ORDER: 'order',
  /** 数据报表 */
  REPORT: 'report',
  /** 供应商管理 */
  SUPPLIER: 'supplier',
  /** 门店管理 */
  STORE: 'store',
  /** 物料管理 */
  MATERIAL: 'material',
  /** 素材库 */
  MEDIA: 'media',
  /** 产品审核 */
  PRODUCT_AUDIT: 'product_audit',
  /** 加价管理 */
  MARKUP: 'markup',
  /** 配送设置审核 */
  DELIVERY_AUDIT: 'delivery_audit',
  /** Webhook配置 */
  WEBHOOK: 'webhook',
  /** 支付配置（敏感） */
  PAYMENT_CONFIG: 'payment_config',
  /** API配置（敏感） */
  API_CONFIG: 'api_config',
  /** 系统设置（敏感） */
  SYSTEM_CONFIG: 'system_config',
  /** 管理员管理（敏感） */
  ADMIN_MANAGE: 'admin_manage',
} as const;

/** 权限模块文本 */
export const PERMISSIONS_TEXT: Record<string, string> = {
  [PERMISSIONS.ORDER]: '订单管理',
  [PERMISSIONS.REPORT]: '数据报表',
  [PERMISSIONS.SUPPLIER]: '供应商管理',
  [PERMISSIONS.STORE]: '门店管理',
  [PERMISSIONS.MATERIAL]: '物料管理',
  [PERMISSIONS.MEDIA]: '素材库',
  [PERMISSIONS.PRODUCT_AUDIT]: '产品审核',
  [PERMISSIONS.MARKUP]: '加价管理',
  [PERMISSIONS.DELIVERY_AUDIT]: '配送设置审核',
  [PERMISSIONS.WEBHOOK]: 'Webhook配置',
  [PERMISSIONS.PAYMENT_CONFIG]: '支付配置',
  [PERMISSIONS.API_CONFIG]: 'API配置',
  [PERMISSIONS.SYSTEM_CONFIG]: '系统设置',
  [PERMISSIONS.ADMIN_MANAGE]: '管理员管理',
};

/** 权限模块描述 */
export const PERMISSIONS_DESC: Record<string, string> = {
  [PERMISSIONS.ORDER]: '查看、处理、取消订单等操作',
  [PERMISSIONS.REPORT]: '查看销售报表、数据统计等',
  [PERMISSIONS.SUPPLIER]: '管理供应商账号、审核供应商信息',
  [PERMISSIONS.STORE]: '管理门店账号、查看门店信息',
  [PERMISSIONS.MATERIAL]: '管理物料分类、物料信息、SKU',
  [PERMISSIONS.MEDIA]: '管理素材图片、图片匹配规则',
  [PERMISSIONS.PRODUCT_AUDIT]: '审核供应商上传的产品',
  [PERMISSIONS.MARKUP]: '配置加价规则、加价策略',
  [PERMISSIONS.DELIVERY_AUDIT]: '审核供应商配送设置变更',
  [PERMISSIONS.WEBHOOK]: '配置Webhook推送、查看推送日志',
  [PERMISSIONS.PAYMENT_CONFIG]: '配置支付渠道、密钥等（仅主管理员）',
  [PERMISSIONS.API_CONFIG]: '配置API对接参数（仅主管理员）',
  [PERMISSIONS.SYSTEM_CONFIG]: '系统全局配置（仅主管理员）',
  [PERMISSIONS.ADMIN_MANAGE]: '创建、管理子管理员（仅主管理员）',
};

/** 敏感权限（仅主管理员可拥有） */
export const SENSITIVE_PERMISSIONS = [
  PERMISSIONS.PAYMENT_CONFIG,
  PERMISSIONS.API_CONFIG,
  PERMISSIONS.SYSTEM_CONFIG,
  PERMISSIONS.ADMIN_MANAGE,
] as const;

/** 普通权限（可分配给子管理员） */
export const NORMAL_PERMISSIONS = [
  PERMISSIONS.ORDER,
  PERMISSIONS.REPORT,
  PERMISSIONS.SUPPLIER,
  PERMISSIONS.STORE,
  PERMISSIONS.MATERIAL,
  PERMISSIONS.MEDIA,
  PERMISSIONS.PRODUCT_AUDIT,
  PERMISSIONS.MARKUP,
  PERMISSIONS.DELIVERY_AUDIT,
  PERMISSIONS.WEBHOOK,
] as const;

/** 权限分组 */
export const PERMISSION_GROUPS = {
  /** 基础管理 */
  BASIC: {
    label: '基础管理',
    permissions: [PERMISSIONS.ORDER, PERMISSIONS.REPORT],
  },
  /** 用户管理 */
  USER: {
    label: '用户管理',
    permissions: [PERMISSIONS.SUPPLIER, PERMISSIONS.STORE],
  },
  /** 商品管理 */
  PRODUCT: {
    label: '商品管理',
    permissions: [PERMISSIONS.MATERIAL, PERMISSIONS.MEDIA, PERMISSIONS.PRODUCT_AUDIT],
  },
  /** 运营配置 */
  OPERATION: {
    label: '运营配置',
    permissions: [PERMISSIONS.MARKUP, PERMISSIONS.DELIVERY_AUDIT, PERMISSIONS.WEBHOOK],
  },
  /** 系统配置（敏感） */
  SYSTEM: {
    label: '系统配置',
    permissions: [
      PERMISSIONS.PAYMENT_CONFIG,
      PERMISSIONS.API_CONFIG,
      PERMISSIONS.SYSTEM_CONFIG,
      PERMISSIONS.ADMIN_MANAGE,
    ],
  },
} as const;
