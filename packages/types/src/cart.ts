/**
 * 购物车相关类型定义
 */

/** 购物车商品项 */
export interface CartItem {
  /** 物料SKU ID */
  skuId: number;
  /** 数量 */
  quantity: number;
  /** 加入时间 */
  addedAt: number;
  /** 加入时价格（用于价格变动提示） */
  priceAtAdd: number;
}

/** 购物车（按供应商分组） */
export interface Cart {
  /** 供应商ID */
  supplierId: number;
  /** 商品列表 */
  items: CartItem[];
}

/** 门店完整购物车 */
export interface StoreCart {
  /** 门店ID */
  storeId: number;
  /** 各供应商购物车 */
  carts: SupplierCart[];
  /** 购物车商品总数 */
  totalCount: number;
  /** 可结算总金额 */
  checkoutAmount: number;
}

/** 供应商购物车（带详细信息） */
export interface SupplierCart {
  /** 供应商ID */
  supplierId: number;
  /** 供应商名称 */
  supplierName: string;
  /** 供应商显示名称 */
  supplierDisplayName?: string;
  /** 起送价 */
  minOrderAmount: number;
  /** 配送日 */
  deliveryDays: number[];
  /** 商品列表 */
  items: CartItemDetail[];
  /** 小计金额 */
  subtotal: number;
  /** 是否达到起送价 */
  reachMinOrder: boolean;
  /** 距离起送价还差 */
  amountToMinOrder: number;
}

/** 购物车商品详情 */
export interface CartItemDetail {
  /** 物料SKU ID */
  skuId: number;
  /** 物料ID */
  materialId: number;
  /** 物料名称 */
  materialName: string;
  /** 品牌 */
  brand: string;
  /** 规格 */
  spec: string;
  /** 单位 */
  unit: string;
  /** 图片 */
  imageUrl?: string;
  /** 供应商原价 */
  price: number;
  /** 加价后价格 */
  finalPrice: number;
  /** 加价金额 */
  markupAmount: number;
  /** 数量 */
  quantity: number;
  /** 小计 */
  subtotal: number;
  /** 库存状态 */
  stockStatus: 'in_stock' | 'out_of_stock';
  /** 最小起订量 */
  minQuantity: number;
  /** 步进数量 */
  stepQuantity: number;
  /** 是否有效（库存、下架等） */
  isValid: boolean;
  /** 无效原因 */
  invalidReason?: string;
  /** 价格是否变动 */
  priceChanged: boolean;
  /** 原加入时价格 */
  priceAtAdd?: number;
}

/** 添加购物车请求 */
export interface AddToCartRequest {
  /** 供应商ID */
  supplierId: number;
  /** SKU ID */
  skuId: number;
  /** 数量 */
  quantity: number;
}

/** 更新购物车数量请求 */
export interface UpdateCartQuantityRequest {
  /** 供应商ID */
  supplierId: number;
  /** SKU ID */
  skuId: number;
  /** 新数量 */
  quantity: number;
}

/** 删除购物车商品请求 */
export interface RemoveCartItemRequest {
  /** 供应商ID */
  supplierId: number;
  /** SKU ID */
  skuId: number;
}

/** 清空购物车请求 */
export interface ClearCartRequest {
  /** 供应商ID（不传则清空所有） */
  supplierId?: number;
}

/** 购物车结算预览 */
export interface CartCheckoutPreview {
  /** 可结算的供应商购物车 */
  checkoutCarts: SupplierCart[];
  /** 不可结算的供应商购物车（未达起送价） */
  pendingCarts: SupplierCart[];
  /** 商品总数 */
  totalItems: number;
  /** 商品总金额 */
  goodsAmount: number;
  /** 服务费 */
  serviceFee: number;
  /** 应付总额 */
  totalAmount: number;
}
