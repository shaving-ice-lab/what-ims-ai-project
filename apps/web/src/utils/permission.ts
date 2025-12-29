/**
 * 权限管理工具
 * 供应链订货系统 - Web端
 */

// 权限常量
export const PERMISSIONS = {
  // 普通权限（可分配给子管理员）
  ORDER: 'order',
  REPORT: 'report',
  SUPPLIER: 'supplier',
  STORE: 'store',
  MATERIAL: 'material',
  MEDIA: 'media',
  PRODUCT_AUDIT: 'product_audit',
  MARKUP: 'markup',
  DELIVERY_AUDIT: 'delivery_audit',
  WEBHOOK: 'webhook',

  // 敏感权限（仅主管理员）
  PAYMENT_CONFIG: 'payment_config',
  API_CONFIG: 'api_config',
  SYSTEM_CONFIG: 'system_config',
  ADMIN_MANAGE: 'admin_manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// 敏感权限列表
export const SENSITIVE_PERMISSIONS: Permission[] = [
  PERMISSIONS.PAYMENT_CONFIG,
  PERMISSIONS.API_CONFIG,
  PERMISSIONS.SYSTEM_CONFIG,
  PERMISSIONS.ADMIN_MANAGE,
];

// 普通权限列表（可分配给子管理员）
export const NORMAL_PERMISSIONS: Permission[] = [
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
];

// 权限描述映射
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
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

// 用户角色
export type UserRole = 'admin' | 'sub_admin' | 'supplier' | 'store';

// 角色描述
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: '管理员',
  sub_admin: '子管理员',
  supplier: '供应商',
  store: '门店',
};

// 检查是否为敏感权限
export function isSensitivePermission(permission: Permission): boolean {
  return SENSITIVE_PERMISSIONS.includes(permission);
}

// 检查用户是否有指定权限
export function hasPermission(
  userRole: UserRole,
  userPermissions: Permission[],
  isPrimary: boolean,
  requiredPermission: Permission
): boolean {
  // 主管理员拥有所有权限
  if (userRole === 'admin' && isPrimary) {
    return true;
  }

  // 敏感权限仅主管理员可访问
  if (isSensitivePermission(requiredPermission)) {
    return userRole === 'admin' && isPrimary;
  }

  // 子管理员检查权限列表
  if (userRole === 'sub_admin') {
    return userPermissions.includes(requiredPermission);
  }

  // 供应商和门店默认有访问权限，具体由路由控制
  return true;
}

// 检查用户是否有任意一个指定权限
export function hasAnyPermission(
  userRole: UserRole,
  userPermissions: Permission[],
  isPrimary: boolean,
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some((perm) =>
    hasPermission(userRole, userPermissions, isPrimary, perm)
  );
}

// 检查用户是否有所有指定权限
export function hasAllPermissions(
  userRole: UserRole,
  userPermissions: Permission[],
  isPrimary: boolean,
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every((perm) =>
    hasPermission(userRole, userPermissions, isPrimary, perm)
  );
}

// 获取用户可分配的权限列表
export function getAssignablePermissions(userRole: UserRole, isPrimary: boolean): Permission[] {
  // 只有主管理员可以分配权限
  if (userRole !== 'admin' || !isPrimary) {
    return [];
  }
  // 主管理员可以分配普通权限
  return NORMAL_PERMISSIONS;
}
