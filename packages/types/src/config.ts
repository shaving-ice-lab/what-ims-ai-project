/**
 * 配置相关类型定义
 */

import type { BaseEntity } from './base';

/** 加价方式 */
export type MarkupType = 'fixed' | 'percent';

/** 配置类型 */
export type ConfigType = 'string' | 'number' | 'boolean' | 'json';

/** 加价规则 */
export interface PriceMarkup extends BaseEntity {
  /** 规则名称 */
  name: string;
  /** 规则说明 */
  description?: string;
  /** 门店ID（NULL表示全部门店） */
  storeId?: number;
  /** 供应商ID（NULL表示全部供应商） */
  supplierId?: number;
  /** 分类ID（NULL表示全部分类） */
  categoryId?: number;
  /** 物料ID（NULL表示全部物料） */
  materialId?: number;
  /** 加价方式 */
  markupType: MarkupType;
  /** 加价值（固定金额或百分比如0.05表示5%） */
  markupValue: number;
  /** 最低加价金额（百分比时） */
  minMarkup?: number;
  /** 最高加价金额（百分比时） */
  maxMarkup?: number;
  /** 优先级，数值越大优先级越高 */
  priority: number;
  /** 是否启用 */
  isActive: boolean;
  /** 生效开始时间 */
  startTime?: Date;
  /** 生效结束时间 */
  endTime?: Date;
  /** 创建人ID */
  createdBy?: number;
}

/** 系统配置 */
export interface SystemConfig extends BaseEntity {
  /** 配置键 */
  configKey: string;
  /** 配置值 */
  configValue: string;
  /** 配置类型 */
  configType: ConfigType;
  /** 配置说明 */
  description?: string;
  /** 是否敏感配置 */
  isSensitive: boolean;
  /** 更新人ID */
  updatedBy?: number;
}

/** 创建加价规则请求 */
export interface CreatePriceMarkupRequest {
  /** 规则名称 */
  name: string;
  /** 规则说明 */
  description?: string;
  /** 门店ID */
  storeId?: number;
  /** 供应商ID */
  supplierId?: number;
  /** 分类ID */
  categoryId?: number;
  /** 物料ID */
  materialId?: number;
  /** 加价方式 */
  markupType: MarkupType;
  /** 加价值 */
  markupValue: number;
  /** 最低加价金额 */
  minMarkup?: number;
  /** 最高加价金额 */
  maxMarkup?: number;
  /** 优先级 */
  priority?: number;
  /** 生效开始时间 */
  startTime?: string;
  /** 生效结束时间 */
  endTime?: string;
}

/** 更新加价规则请求 */
export interface UpdatePriceMarkupRequest {
  /** 规则名称 */
  name?: string;
  /** 规则说明 */
  description?: string;
  /** 加价方式 */
  markupType?: MarkupType;
  /** 加价值 */
  markupValue?: number;
  /** 最低加价金额 */
  minMarkup?: number;
  /** 最高加价金额 */
  maxMarkup?: number;
  /** 优先级 */
  priority?: number;
  /** 是否启用 */
  isActive?: boolean;
  /** 生效开始时间 */
  startTime?: string;
  /** 生效结束时间 */
  endTime?: string;
}

/** 更新系统配置请求 */
export interface UpdateSystemConfigRequest {
  /** 配置值 */
  configValue: string;
}

/** 系统配置键常量类型 */
export interface SystemConfigKeys {
  /** 全局加价总开关 */
  MARKUP_GLOBAL_ENABLED: 'markup_global_enabled';
  /** 服务费费率 */
  SERVICE_FEE_RATE: 'service_fee_rate';
  /** 自主取消时限(秒) */
  ORDER_CANCEL_THRESHOLD: 'order_cancel_threshold';
  /** 支付超时时间(秒) */
  PAYMENT_TIMEOUT: 'payment_timeout';
  /** Webhook重试次数 */
  WEBHOOK_RETRY_TIMES: 'webhook_retry_times';
  /** Webhook重试间隔(秒) */
  WEBHOOK_RETRY_INTERVAL: 'webhook_retry_interval';
}

/** 加价计算结果 */
export interface MarkupCalculation {
  /** 原价 */
  originalPrice: number;
  /** 加价金额 */
  markupAmount: number;
  /** 最终价格 */
  finalPrice: number;
  /** 应用的规则ID */
  appliedRuleId?: number;
  /** 应用的规则名称 */
  appliedRuleName?: string;
}

/** 加价规则匹配条件 */
export interface MarkupMatchCondition {
  /** 门店ID */
  storeId?: number;
  /** 供应商ID */
  supplierId?: number;
  /** 分类ID */
  categoryId?: number;
  /** 物料ID */
  materialId?: number;
}
