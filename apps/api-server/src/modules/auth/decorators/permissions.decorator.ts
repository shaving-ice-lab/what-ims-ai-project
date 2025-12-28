import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * 权限装饰器 - 用于标记接口需要的权限
 * @param permissions 所需权限列表
 * @example
 * @RequirePermissions('order', 'report')
 * @Get('orders')
 * async getOrders() {}
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * 超级管理员装饰器 - 标记仅超级管理员可访问
 */
export const SUPER_ADMIN_KEY = 'superAdmin';
export const RequireSuperAdmin = () => SetMetadata(SUPER_ADMIN_KEY, true);
