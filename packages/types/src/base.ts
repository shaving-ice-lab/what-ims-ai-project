/**
 * 基础类型定义
 */

/** 分页请求参数 */
export interface PaginationQuery {
  /** 当前页码，从1开始 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
}

/** 分页响应结果 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  items: T[];
  /** 总数量 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

/** API统一响应格式 */
export interface ApiResponse<T = unknown> {
  /** 状态码，0表示成功 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 响应时间戳 */
  timestamp: number;
}

/** API错误响应 */
export interface ApiErrorResponse {
  /** 错误码 */
  code: number;
  /** 错误消息 */
  message: string;
  /** 错误详情 */
  details?: Record<string, string[]>;
  /** 响应时间戳 */
  timestamp: number;
}

/** 通用ID类型 */
export type ID = number | string;

/** 基础实体接口 */
export interface BaseEntity {
  /** 主键ID */
  id: number;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/** 状态实体接口 */
export interface StatusEntity extends BaseEntity {
  /** 状态：1启用，0禁用 */
  status: 0 | 1;
}

/** 树形结构节点 */
export interface TreeNode<T = unknown> {
  /** 节点ID */
  id: number;
  /** 父节点ID */
  parentId: number | null;
  /** 子节点列表 */
  children?: TreeNode<T>[];
  /** 节点数据 */
  data?: T;
}

/** 键值对选项 */
export interface SelectOption<T = string | number> {
  /** 显示文本 */
  label: string;
  /** 选项值 */
  value: T;
  /** 是否禁用 */
  disabled?: boolean;
}

/** 日期范围 */
export interface DateRange {
  /** 开始日期 */
  startDate: Date | string;
  /** 结束日期 */
  endDate: Date | string;
}

/** 地址信息 */
export interface Address {
  /** 省 */
  province: string;
  /** 市 */
  city: string;
  /** 区/县 */
  district: string;
  /** 详细地址 */
  address: string;
  /** 纬度 */
  latitude?: number;
  /** 经度 */
  longitude?: number;
}

/** 联系人信息 */
export interface ContactInfo {
  /** 联系人姓名 */
  contactName: string;
  /** 联系电话 */
  contactPhone: string;
  /** 联系邮箱 */
  contactEmail?: string;
}
