/**
 * 订单相关类型定义
 */

import type { BaseEntity, Address, ContactInfo } from './base';

/** 订单状态 */
export type OrderStatus =
  | 'pending_payment'
  | 'pending_confirm'
  | 'confirmed'
  | 'delivering'
  | 'completed'
  | 'cancelled';

/** 支付状态 */
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

/** 支付方式 */
export type PaymentMethod = 'wechat' | 'alipay';

/** 订单来源 */
export type OrderSource = 'app' | 'web' | 'h5';

/** 取消人类型 */
export type CancelledBy = 'store' | 'supplier' | 'admin' | 'system';

/** 操作人类型 */
export type OperatorType = 'store' | 'supplier' | 'admin' | 'system';

/** 订单信息 */
export interface Order extends BaseEntity {
  /** 订单编号 */
  orderNo: string;
  /** 门店ID */
  storeId: number;
  /** 供应商ID */
  supplierId: number;
  /** 商品金额（含加价） */
  goodsAmount: number;
  /** 支付手续费(3‰) */
  serviceFee: number;
  /** 门店实付总额 */
  totalAmount: number;
  /** 供应商结算金额（原价总额） */
  supplierAmount: number;
  /** 加价总额 */
  markupTotal: number;
  /** 商品种类数 */
  itemCount: number;
  /** 订单状态 */
  status: OrderStatus;
  /** 支付状态 */
  paymentStatus: PaymentStatus;
  /** 支付方式 */
  paymentMethod?: PaymentMethod;
  /** 实际支付时间 */
  paymentTime?: Date;
  /** 支付流水号 */
  paymentNo?: string;
  /** 订单来源 */
  orderSource: OrderSource;
  /** 配送省 */
  deliveryProvince: string;
  /** 配送市 */
  deliveryCity: string;
  /** 配送区 */
  deliveryDistrict: string;
  /** 配送详细地址 */
  deliveryAddress: string;
  /** 配送联系人 */
  deliveryContact: string;
  /** 配送电话 */
  deliveryPhone: string;
  /** 期望配送日期 */
  expectedDeliveryDate?: Date;
  /** 实际送达时间 */
  actualDeliveryTime?: Date;
  /** 门店备注 */
  remark?: string;
  /** 供应商备注 */
  supplierRemark?: string;
  /** 取消原因 */
  cancelReason?: string;
  /** 取消人类型 */
  cancelledBy?: CancelledBy;
  /** 取消人ID */
  cancelledById?: number;
  /** 取消时间 */
  cancelledAt?: Date;
  /** 恢复时间 */
  restoredAt?: Date;
  /** 确认时间 */
  confirmedAt?: Date;
  /** 开始配送时间 */
  deliveringAt?: Date;
  /** 完成时间 */
  completedAt?: Date;
  /** 订单明细列表 */
  items?: OrderItem[];
  /** 门店信息 */
  store?: {
    id: number;
    name: string;
    storeNo: string;
  };
  /** 供应商信息 */
  supplier?: {
    id: number;
    name: string;
    displayName?: string;
  };
}

/** 订单明细 */
export interface OrderItem extends BaseEntity {
  /** 订单ID */
  orderId: number;
  /** 物料SKU ID */
  materialSkuId: number;
  /** 物料名称（冗余） */
  materialName: string;
  /** 品牌（冗余） */
  brand: string;
  /** 规格（冗余） */
  spec: string;
  /** 单位（冗余） */
  unit: string;
  /** 商品图片（冗余） */
  imageUrl?: string;
  /** 数量 */
  quantity: number;
  /** 供应商原价 */
  unitPrice: number;
  /** 单品加价金额 */
  markupAmount: number;
  /** 门店支付单价 */
  finalPrice: number;
  /** 小计 */
  subtotal: number;
}

/** 订单取消申请 */
export interface OrderCancelRequest extends BaseEntity {
  /** 订单ID */
  orderId: number;
  /** 门店ID */
  storeId: number;
  /** 取消原因 */
  reason: string;
  /** 申请状态 */
  status: 'pending' | 'approved' | 'rejected';
  /** 处理管理员ID */
  adminId?: number;
  /** 管理员处理备注 */
  adminRemark?: string;
  /** 是否已联系供应商 */
  supplierContacted: boolean;
  /** 供应商反馈 */
  supplierResponse?: string;
  /** 处理时间 */
  processedAt?: Date;
}

/** 订单状态变更日志 */
export interface OrderStatusLog extends BaseEntity {
  /** 订单ID */
  orderId: number;
  /** 原状态 */
  fromStatus?: OrderStatus;
  /** 新状态 */
  toStatus: OrderStatus;
  /** 操作人类型 */
  operatorType: OperatorType;
  /** 操作人ID */
  operatorId?: number;
  /** 备注 */
  remark?: string;
}

/** 创建订单请求 */
export interface CreateOrderRequest {
  /** 供应商ID */
  supplierId: number;
  /** 订单明细 */
  items: CreateOrderItemRequest[];
  /** 期望配送日期 */
  expectedDeliveryDate?: string;
  /** 备注 */
  remark?: string;
}

/** 创建订单明细请求 */
export interface CreateOrderItemRequest {
  /** 物料SKU ID */
  materialSkuId: number;
  /** 数量 */
  quantity: number;
}

/** 批量创建订单请求（结算时使用） */
export interface BatchCreateOrderRequest {
  /** 多个供应商的订单 */
  orders: CreateOrderRequest[];
}

/** 更新订单请求 */
export interface UpdateOrderRequest {
  /** 供应商备注 */
  supplierRemark?: string;
  /** 期望配送日期 */
  expectedDeliveryDate?: string;
}

/** 订单查询参数 */
export interface OrderQueryParams {
  /** 订单状态 */
  status?: OrderStatus;
  /** 支付状态 */
  paymentStatus?: PaymentStatus;
  /** 门店ID */
  storeId?: number;
  /** 供应商ID */
  supplierId?: number;
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
  /** 订单编号 */
  orderNo?: string;
  /** 搜索关键词 */
  keyword?: string;
}

/** 订单统计数据 */
export interface OrderStatistics {
  /** 总订单数 */
  totalOrders: number;
  /** 总金额 */
  totalAmount: number;
  /** 待付款订单数 */
  pendingPaymentCount: number;
  /** 待确认订单数 */
  pendingConfirmCount: number;
  /** 配送中订单数 */
  deliveringCount: number;
  /** 已完成订单数 */
  completedCount: number;
  /** 已取消订单数 */
  cancelledCount: number;
}

/** 订单配送信息 */
export interface OrderDeliveryInfo extends Address, ContactInfo {
  /** 期望配送日期 */
  expectedDeliveryDate?: Date;
  /** 实际送达时间 */
  actualDeliveryTime?: Date;
}
