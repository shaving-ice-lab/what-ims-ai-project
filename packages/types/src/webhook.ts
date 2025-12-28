/**
 * Webhook相关类型定义
 */

import type { BaseEntity } from './base';

/** 推送目标类型 */
export type WebhookTargetType = 'store' | 'supplier';

/** Webhook事件类型 */
export type WebhookEventType =
  | 'order_created'
  | 'order_confirmed'
  | 'order_delivering'
  | 'order_completed'
  | 'order_cancelled'
  | 'order_restored';

/** Webhook推送状态 */
export type WebhookStatus = 'pending' | 'success' | 'failed';

/** Webhook推送日志 */
export interface WebhookLog extends BaseEntity {
  /** 推送目标类型 */
  targetType: WebhookTargetType;
  /** 门店ID或供应商ID */
  targetId: number;
  /** 事件类型 */
  eventType: WebhookEventType;
  /** 关联订单ID */
  orderId?: number;
  /** 推送地址 */
  webhookUrl: string;
  /** 请求头 */
  requestHeaders?: Record<string, string>;
  /** 请求内容 */
  requestBody: Record<string, unknown>;
  /** HTTP响应状态码 */
  responseCode?: number;
  /** 响应内容 */
  responseBody?: string;
  /** 推送状态 */
  status: WebhookStatus;
  /** 已重试次数 */
  retryCount: number;
  /** 下次重试时间 */
  nextRetryAt?: Date;
  /** 错误信息 */
  errorMsg?: string;
  /** 请求耗时(毫秒) */
  durationMs?: number;
}

/** Webhook载荷基础结构 */
export interface WebhookPayloadBase {
  /** 事件类型 */
  event: WebhookEventType;
  /** 事件时间戳 */
  timestamp: number;
  /** 签名 */
  signature: string;
  /** 随机数 */
  nonce: string;
}

/** 订单相关Webhook载荷 */
export interface OrderWebhookPayload extends WebhookPayloadBase {
  /** 订单数据 */
  data: {
    /** 订单ID */
    orderId: number;
    /** 订单编号 */
    orderNo: string;
    /** 订单状态 */
    status: string;
    /** 商品金额 */
    goodsAmount: number;
    /** 实付总额 */
    totalAmount: number;
    /** 商品数量 */
    itemCount: number;
    /** 门店信息 */
    store?: {
      id: number;
      name: string;
      contactName: string;
      contactPhone: string;
    };
    /** 供应商信息 */
    supplier?: {
      id: number;
      name: string;
    };
    /** 配送地址 */
    deliveryAddress?: string;
    /** 期望配送日期 */
    expectedDeliveryDate?: string;
    /** 备注 */
    remark?: string;
    /** 订单明细 */
    items?: Array<{
      materialName: string;
      brand: string;
      spec: string;
      unit: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }>;
  };
}

/** 企业微信机器人消息格式 */
export interface WechatWorkBotMessage {
  /** 消息类型 */
  msgtype: 'text' | 'markdown' | 'image' | 'news';
  /** 文本消息 */
  text?: {
    content: string;
    mentioned_list?: string[];
    mentioned_mobile_list?: string[];
  };
  /** Markdown消息 */
  markdown?: {
    content: string;
  };
}

/** 操作日志 */
export interface OperationLog extends BaseEntity {
  /** 操作用户ID */
  userId?: number;
  /** 用户类型 */
  userType: 'admin' | 'supplier' | 'store';
  /** 用户名称（冗余） */
  userName?: string;
  /** 模块名称 */
  module: string;
  /** 操作类型 */
  action: string;
  /** 目标类型 */
  targetType?: string;
  /** 目标ID */
  targetId?: number;
  /** 操作描述 */
  description?: string;
  /** 操作前数据 */
  beforeData?: Record<string, unknown>;
  /** 操作后数据 */
  afterData?: Record<string, unknown>;
  /** 变更差异 */
  diffData?: Record<string, unknown>;
  /** IP地址 */
  ipAddress?: string;
  /** 浏览器UA */
  userAgent?: string;
  /** 请求URL */
  requestUrl?: string;
  /** 请求方法 */
  requestMethod?: string;
}

/** 操作日志查询参数 */
export interface OperationLogQueryParams {
  /** 用户ID */
  userId?: number;
  /** 用户类型 */
  userType?: 'admin' | 'supplier' | 'store';
  /** 模块 */
  module?: string;
  /** 操作类型 */
  action?: string;
  /** 目标类型 */
  targetType?: string;
  /** 目标ID */
  targetId?: number;
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
}
