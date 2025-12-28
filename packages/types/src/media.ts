/**
 * 素材库相关类型定义
 */

import type { BaseEntity, StatusEntity } from './base';

/** 图片匹配规则类型 */
export type ImageMatchRuleType = 'name' | 'brand' | 'sku' | 'keyword';

/** 素材图片 */
export interface MediaImage extends StatusEntity {
  /** 分类ID */
  categoryId?: number;
  /** 品牌 */
  brand?: string;
  /** 图片名称 */
  name?: string;
  /** 图片URL */
  url: string;
  /** 缩略图URL */
  thumbnailUrl?: string;
  /** 文件大小(字节) */
  fileSize?: number;
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
  /** 标签数组 */
  tags?: string[];
  /** 关联SKU编码数组 */
  skuCodes?: string[];
  /** 匹配关键词 */
  matchKeywords?: string;
  /** 使用次数 */
  usageCount: number;
  /** 上传人ID */
  uploadedBy?: number;
}

/** 图片匹配规则 */
export interface ImageMatchRule extends BaseEntity {
  /** 规则名称 */
  name: string;
  /** 规则类型 */
  ruleType: ImageMatchRuleType;
  /** 匹配模式（正则或关键词） */
  matchPattern: string;
  /** 相似度阈值(0-1) */
  similarityThreshold: number;
  /** 优先级 */
  priority: number;
  /** 是否启用 */
  isActive: boolean;
}

/** 上传图片请求 */
export interface UploadMediaImageRequest {
  /** 分类ID */
  categoryId?: number;
  /** 品牌 */
  brand?: string;
  /** 图片名称 */
  name?: string;
  /** 标签 */
  tags?: string[];
  /** 关联SKU编码 */
  skuCodes?: string[];
  /** 匹配关键词 */
  matchKeywords?: string;
}

/** 图片搜索参数 */
export interface MediaImageSearchParams {
  /** 分类ID */
  categoryId?: number;
  /** 品牌 */
  brand?: string;
  /** 搜索关键词 */
  keyword?: string;
  /** 标签 */
  tags?: string[];
}

/** 图片匹配结果 */
export interface ImageMatchResult {
  /** 图片信息 */
  image: MediaImage;
  /** 匹配分数 */
  score: number;
  /** 匹配规则 */
  matchedRule?: string;
}

/** 创建图片匹配规则请求 */
export interface CreateImageMatchRuleRequest {
  /** 规则名称 */
  name: string;
  /** 规则类型 */
  ruleType: ImageMatchRuleType;
  /** 匹配模式 */
  matchPattern: string;
  /** 相似度阈值 */
  similarityThreshold?: number;
  /** 优先级 */
  priority?: number;
}

/** 上传响应 */
export interface UploadResponse {
  /** 文件URL */
  url: string;
  /** 缩略图URL */
  thumbnailUrl?: string;
  /** 文件名 */
  filename: string;
  /** 文件大小 */
  fileSize: number;
  /** MIME类型 */
  mimeType: string;
}
