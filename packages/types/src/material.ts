/**
 * 物料相关类型定义
 */

import type { BaseEntity, StatusEntity, TreeNode } from './base';

/** 库存状态 */
export type StockStatus = 'in_stock' | 'out_of_stock';

/** 审核状态 */
export type AuditStatus = 'pending' | 'approved' | 'rejected';

/** 物料分类 */
export interface Category extends StatusEntity {
  /** 分类名称 */
  name: string;
  /** 分类图标URL */
  icon?: string;
  /** 排序值 */
  sortOrder: number;
  /** 父分类ID */
  parentId?: number;
  /** 层级(1/2/3) */
  level: number;
  /** 路径(如1/2/3) */
  path: string;
  /** 加价开关 */
  markupEnabled: boolean;
  /** 子分类列表 */
  children?: Category[];
}

/** 分类树节点 */
export type CategoryTreeNode = TreeNode<Category>;

/** 物料基础信息 */
export interface Material extends StatusEntity {
  /** 物料编号 */
  materialNo: string;
  /** 分类ID */
  categoryId: number;
  /** 物料通用名称 */
  name: string;
  /** 物料别名 */
  alias?: string;
  /** 物料描述 */
  description?: string;
  /** 默认图片 */
  imageUrl?: string;
  /** 搜索关键词 */
  keywords?: string;
  /** 排序值 */
  sortOrder: number;
  /** 关联分类 */
  category?: Category;
  /** SKU列表 */
  skus?: MaterialSku[];
}

/** 物料SKU */
export interface MaterialSku extends StatusEntity {
  /** SKU编号 */
  skuNo: string;
  /** 物料ID */
  materialId: number;
  /** 品牌 */
  brand: string;
  /** 规格 */
  spec: string;
  /** 销售单位 */
  unit: string;
  /** 重量(kg) */
  weight?: number;
  /** 条形码 */
  barcode?: string;
  /** SKU专属图片 */
  imageUrl?: string;
  /** 关联物料 */
  material?: Material;
  /** 供应商报价列表 */
  supplierMaterials?: SupplierMaterial[];
}

/** 供应商物料报价 */
export interface SupplierMaterial extends StatusEntity {
  /** 供应商ID */
  supplierId: number;
  /** 关联SKU ID */
  materialSkuId: number;
  /** 供应商报价 */
  price: number;
  /** 原价（用于显示划线价） */
  originalPrice?: number;
  /** 最小起订量 */
  minQuantity: number;
  /** 步进数量 */
  stepQuantity: number;
  /** 库存状态 */
  stockStatus: StockStatus;
  /** 审核状态 */
  auditStatus: AuditStatus;
  /** 审核驳回原因 */
  rejectReason?: string;
  /** 是否推荐 */
  isRecommended: boolean;
  /** 销量统计 */
  salesCount: number;
  /** 关联SKU */
  materialSku?: MaterialSku;
  /** 供应商信息 */
  supplier?: {
    id: number;
    name: string;
    displayName?: string;
    minOrderAmount: number;
    deliveryDays: number[];
  };
}

/** 创建分类请求 */
export interface CreateCategoryRequest {
  /** 分类名称 */
  name: string;
  /** 父分类ID */
  parentId?: number;
  /** 分类图标 */
  icon?: string;
  /** 排序值 */
  sortOrder?: number;
  /** 加价开关 */
  markupEnabled?: boolean;
}

/** 更新分类请求 */
export interface UpdateCategoryRequest {
  /** 分类名称 */
  name?: string;
  /** 分类图标 */
  icon?: string;
  /** 排序值 */
  sortOrder?: number;
  /** 加价开关 */
  markupEnabled?: boolean;
  /** 状态 */
  status?: 0 | 1;
}

/** 创建物料请求 */
export interface CreateMaterialRequest {
  /** 分类ID */
  categoryId: number;
  /** 物料名称 */
  name: string;
  /** 物料别名 */
  alias?: string;
  /** 物料描述 */
  description?: string;
  /** 默认图片 */
  imageUrl?: string;
  /** 搜索关键词 */
  keywords?: string;
  /** 排序值 */
  sortOrder?: number;
}

/** 创建SKU请求 */
export interface CreateMaterialSkuRequest {
  /** 物料ID */
  materialId: number;
  /** 品牌 */
  brand: string;
  /** 规格 */
  spec: string;
  /** 销售单位 */
  unit: string;
  /** 重量 */
  weight?: number;
  /** 条形码 */
  barcode?: string;
  /** SKU图片 */
  imageUrl?: string;
}

/** 创建供应商物料报价请求 */
export interface CreateSupplierMaterialRequest {
  /** SKU ID */
  materialSkuId: number;
  /** 报价 */
  price: number;
  /** 原价 */
  originalPrice?: number;
  /** 最小起订量 */
  minQuantity?: number;
  /** 步进数量 */
  stepQuantity?: number;
  /** 库存状态 */
  stockStatus?: StockStatus;
}

/** 更新供应商物料报价请求 */
export interface UpdateSupplierMaterialRequest {
  /** 报价 */
  price?: number;
  /** 原价 */
  originalPrice?: number;
  /** 最小起订量 */
  minQuantity?: number;
  /** 步进数量 */
  stepQuantity?: number;
  /** 库存状态 */
  stockStatus?: StockStatus;
}

/** 物料查询参数 */
export interface MaterialQueryParams {
  /** 分类ID */
  categoryId?: number;
  /** 供应商ID */
  supplierId?: number;
  /** 搜索关键词 */
  keyword?: string;
  /** 品牌 */
  brand?: string;
  /** 库存状态 */
  stockStatus?: StockStatus;
  /** 是否只显示推荐 */
  isRecommended?: boolean;
}

/** 供应商物料审核请求 */
export interface AuditSupplierMaterialRequest {
  /** 审核状态 */
  auditStatus: 'approved' | 'rejected';
  /** 驳回原因 */
  rejectReason?: string;
}

/** 门店端物料展示（带报价对比） */
export interface MaterialWithPricing extends Material {
  /** 供应商报价列表 */
  prices: SupplierPricing[];
  /** 最低价 */
  minPrice?: number;
  /** 最高价 */
  maxPrice?: number;
}

/** 供应商报价信息 */
export interface SupplierPricing {
  /** 供应商ID */
  supplierId: number;
  /** 供应商名称 */
  supplierName: string;
  /** SKU ID */
  skuId: number;
  /** 品牌 */
  brand: string;
  /** 规格 */
  spec: string;
  /** 单位 */
  unit: string;
  /** 报价 */
  price: number;
  /** 加价后价格 */
  finalPrice: number;
  /** 加价金额 */
  markupAmount: number;
  /** 原价 */
  originalPrice?: number;
  /** 最小起订量 */
  minQuantity: number;
  /** 步进数量 */
  stepQuantity: number;
  /** 库存状态 */
  stockStatus: StockStatus;
  /** 起送价 */
  minOrderAmount: number;
  /** 配送日 */
  deliveryDays: number[];
  /** 图片 */
  imageUrl?: string;
}
