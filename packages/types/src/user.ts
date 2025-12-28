/**
 * 用户相关类型定义
 */

import type { BaseEntity, StatusEntity, Address, ContactInfo } from './base';

/** 用户角色枚举 */
export type UserRole = 'admin' | 'sub_admin' | 'supplier' | 'store';

/** 用户状态 */
export type UserStatus = 0 | 1;

/** 基础用户信息 */
export interface User extends StatusEntity {
  /** 用户名 */
  username: string;
  /** 密码哈希（仅后端使用） */
  passwordHash?: string;
  /** 角色类型 */
  role: UserRole;
  /** 手机号 */
  phone: string;
  /** 邮箱 */
  email?: string;
  /** 头像URL */
  avatar?: string;
  /** 最后登录时间 */
  lastLoginAt?: Date;
  /** 最后登录IP */
  lastLoginIp?: string;
  /** 登录失败次数 */
  loginFailCount: number;
  /** 锁定截止时间 */
  lockedUntil?: Date;
}

/** 管理员信息 */
export interface Admin extends BaseEntity {
  /** 关联用户ID */
  userId: number;
  /** 管理员姓名 */
  name: string;
  /** 是否主管理员 */
  isPrimary: boolean;
  /** 权限列表 */
  permissions: string[];
  /** 创建人ID */
  createdBy?: number;
  /** 备注 */
  remark?: string;
  /** 状态 */
  status: 0 | 1;
  /** 关联的用户信息 */
  user?: User;
}

/** 门店信息 */
export interface Store extends StatusEntity, Address, ContactInfo {
  /** 关联用户ID */
  userId: number;
  /** 门店编号 */
  storeNo: string;
  /** 门店名称 */
  name: string;
  /** 门店Logo */
  logo?: string;
  /** 加价开关 */
  markupEnabled: boolean;
  /** 企业微信群Webhook地址 */
  wechatWebhookUrl?: string;
  /** Webhook开关 */
  webhookEnabled: boolean;
  /** 关联的用户信息 */
  user?: User;
}

/** 供应商管理模式 */
export type SupplierManagementMode = 'self' | 'managed' | 'webhook' | 'api';

/** 配送模式 */
export type DeliveryMode = 'self_delivery' | 'express_delivery';

/** 供应商信息 */
export interface Supplier extends StatusEntity, ContactInfo {
  /** 关联用户ID */
  userId: number;
  /** 供应商编号 */
  supplierNo: string;
  /** 供应商真实名称 */
  name: string;
  /** 门店端显示名称 */
  displayName?: string;
  /** 供应商Logo */
  logo?: string;
  /** 起送价 */
  minOrderAmount: number;
  /** 配送日数组（1-7代表周一到周日） */
  deliveryDays: number[];
  /** 配送模式 */
  deliveryMode: DeliveryMode;
  /** 管理模式 */
  managementMode: SupplierManagementMode;
  /** 是否有后台 */
  hasBackend: boolean;
  /** 企业微信群Webhook地址 */
  wechatWebhookUrl?: string;
  /** Webhook开关 */
  webhookEnabled: boolean;
  /** 推送事件配置 */
  webhookEvents?: string[];
  /** API对接地址 */
  apiEndpoint?: string;
  /** API密钥（加密存储） */
  apiSecretKey?: string;
  /** 加价开关 */
  markupEnabled: boolean;
  /** 备注 */
  remark?: string;
  /** 关联的用户信息 */
  user?: User;
}

/** 微信绑定信息 */
export interface WechatBinding extends BaseEntity {
  /** 微信OpenID */
  openid: string;
  /** 微信UnionID */
  unionid?: string;
  /** 关联用户ID */
  userId?: number;
  /** 绑定角色 */
  role?: UserRole;
  /** 关联业务ID（门店/供应商ID） */
  bindableId?: number;
  /** 关联类型 */
  bindableType?: 'store' | 'supplier';
  /** 微信昵称 */
  nickname?: string;
  /** 微信头像 */
  avatar?: string;
  /** 绑定时间 */
  bindTime?: Date;
  /** 状态 */
  status: 0 | 1;
}

/** 登录请求 */
export interface LoginRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 记住我 */
  rememberMe?: boolean;
}

/** 登录响应 */
export interface LoginResponse {
  /** 访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;
  /** 过期时间（秒） */
  expiresIn: number;
  /** 用户信息 */
  user: UserInfo;
  /** 可用角色列表（多角色时返回） */
  availableRoles?: RoleInfo[];
}

/** 用户基本信息（前端使用） */
export interface UserInfo {
  /** 用户ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 手机号 */
  phone: string;
  /** 头像 */
  avatar?: string;
  /** 当前角色 */
  role: UserRole;
  /** 角色ID（门店ID或供应商ID） */
  roleId?: number;
  /** 角色名称（门店名或供应商名） */
  roleName?: string;
  /** 权限列表（管理员） */
  permissions?: string[];
}

/** 角色信息 */
export interface RoleInfo {
  /** 角色类型 */
  role: UserRole;
  /** 角色ID（门店ID或供应商ID） */
  roleId?: number;
  /** 角色名称 */
  roleName: string;
}

/** JWT Token载荷 */
export interface TokenPayload {
  /** 用户ID */
  userId: number;
  /** 当前角色 */
  currentRole: UserRole;
  /** 角色ID（门店ID或供应商ID） */
  roleId?: number;
  /** 会话ID */
  sessionId: string;
  /** 签发时间 */
  iat: number;
  /** 过期时间 */
  exp: number;
}

/** 创建管理员请求 */
export interface CreateAdminRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 管理员姓名 */
  name: string;
  /** 权限列表 */
  permissions: string[];
  /** 手机号 */
  phone?: string;
  /** 邮箱 */
  email?: string;
  /** 备注 */
  remark?: string;
}

/** 创建门店请求 */
export interface CreateStoreRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 门店名称 */
  name: string;
  /** 联系人姓名 */
  contactName: string;
  /** 联系电话 */
  contactPhone: string;
  /** 省 */
  province: string;
  /** 市 */
  city: string;
  /** 区/县 */
  district: string;
  /** 详细地址 */
  address: string;
  /** Logo */
  logo?: string;
}

/** 创建供应商请求 */
export interface CreateSupplierRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 供应商名称 */
  name: string;
  /** 显示名称 */
  displayName?: string;
  /** 联系人姓名 */
  contactName: string;
  /** 联系电话 */
  contactPhone: string;
  /** 起送价 */
  minOrderAmount?: number;
  /** 配送日 */
  deliveryDays?: number[];
  /** 配送模式 */
  deliveryMode?: DeliveryMode;
  /** 管理模式 */
  managementMode?: SupplierManagementMode;
  /** Logo */
  logo?: string;
  /** 备注 */
  remark?: string;
}

/** 配送区域 */
export interface DeliveryArea extends BaseEntity {
  /** 供应商ID */
  supplierId: number;
  /** 省 */
  province: string;
  /** 市 */
  city: string;
  /** 区/县 */
  district?: string;
  /** 状态 */
  status: 0 | 1;
}

/** 供应商配送设置审核 */
export interface SupplierSettingAudit extends BaseEntity {
  /** 供应商ID */
  supplierId: number;
  /** 变更类型 */
  changeType: 'min_order' | 'delivery_days' | 'delivery_area';
  /** 原值 */
  oldValue: unknown;
  /** 新值 */
  newValue: unknown;
  /** 审核状态 */
  status: 'pending' | 'approved' | 'rejected';
  /** 提交时间 */
  submitTime: Date;
  /** 审核时间 */
  auditTime?: Date;
  /** 审核人ID */
  auditorId?: number;
  /** 驳回原因 */
  rejectReason?: string;
}
