/**
 * 支付相关类型定义
 */

import type { BaseEntity } from './base';
import type { PaymentMethod } from './order';

/** 支付状态 */
export type PaymentRecordStatus =
  | 'pending'
  | 'success'
  | 'failed'
  | 'refunded'
  | 'partial_refund';

/** 支付记录 */
export interface PaymentRecord extends BaseEntity {
  /** 订单ID */
  orderId: number;
  /** 订单编号 */
  orderNo: string;
  /** 支付流水号 */
  paymentNo: string;
  /** 支付方式 */
  paymentMethod: PaymentMethod;
  /** 商品金额 */
  goodsAmount: number;
  /** 手续费 */
  serviceFee: number;
  /** 实付金额 */
  amount: number;
  /** 支付状态 */
  status: PaymentRecordStatus;
  /** 支付二维码URL */
  qrcodeUrl?: string;
  /** 二维码过期时间 */
  qrcodeExpireTime?: Date;
  /** 第三方交易号 */
  tradeNo?: string;
  /** 实际支付时间 */
  payTime?: Date;
  /** 支付回调原始数据 */
  callbackData?: Record<string, unknown>;
  /** 退款流水号 */
  refundNo?: string;
  /** 退款金额 */
  refundAmount?: number;
  /** 退款时间 */
  refundTime?: Date;
  /** 退款原因 */
  refundReason?: string;
  /** 错误信息 */
  errorMsg?: string;
}

/** 创建支付请求 */
export interface CreatePaymentRequest {
  /** 订单ID */
  orderId: number;
  /** 支付方式 */
  paymentMethod: PaymentMethod;
}

/** 创建支付响应 */
export interface CreatePaymentResponse {
  /** 支付流水号 */
  paymentNo: string;
  /** 支付二维码URL */
  qrcodeUrl: string;
  /** 二维码过期时间 */
  expireTime: Date;
  /** 实付金额 */
  amount: number;
}

/** 支付状态查询响应 */
export interface PaymentStatusResponse {
  /** 支付流水号 */
  paymentNo: string;
  /** 支付状态 */
  status: PaymentRecordStatus;
  /** 支付时间 */
  payTime?: Date;
  /** 第三方交易号 */
  tradeNo?: string;
}

/** 退款请求 */
export interface RefundRequest {
  /** 支付记录ID */
  paymentId: number;
  /** 退款金额 */
  amount: number;
  /** 退款原因 */
  reason: string;
}

/** 退款响应 */
export interface RefundResponse {
  /** 退款流水号 */
  refundNo: string;
  /** 退款金额 */
  refundAmount: number;
  /** 退款状态 */
  status: 'success' | 'pending' | 'failed';
}

/** 支付回调数据（微信） */
export interface WechatPayCallback {
  /** 返回状态码 */
  return_code: string;
  /** 返回信息 */
  return_msg?: string;
  /** 业务结果 */
  result_code?: string;
  /** 商户订单号 */
  out_trade_no?: string;
  /** 微信支付订单号 */
  transaction_id?: string;
  /** 支付完成时间 */
  time_end?: string;
  /** 总金额（分） */
  total_fee?: number;
}

/** 支付回调数据（支付宝） */
export interface AlipayCallback {
  /** 通知类型 */
  notify_type: string;
  /** 通知时间 */
  notify_time: string;
  /** 商户订单号 */
  out_trade_no: string;
  /** 支付宝交易号 */
  trade_no: string;
  /** 交易状态 */
  trade_status: string;
  /** 订单金额 */
  total_amount: string;
  /** 实收金额 */
  receipt_amount?: string;
}
