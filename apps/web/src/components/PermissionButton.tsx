'use client';

import { hasPermission, type Permission } from '@/utils/permission';
import type { ButtonProps } from 'antd';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

// 定义用户信息类型
interface UserInfo {
  id: number;
  username: string;
  role: 'admin' | 'sub_admin' | 'supplier' | 'store';
  isPrimary?: boolean;
  permissions?: string[];
}

// 定义Store状态类型
interface AppState {
  user: {
    user: UserInfo | null;
  };
}

interface PermissionButtonProps extends ButtonProps {
  permission: Permission;
  fallback?: React.ReactNode;
  hideOnNoPermission?: boolean;
  tooltipOnNoPermission?: string;
}

/**
 * 权限按钮组件
 * 根据用户权限控制按钮的显示和可用状态
 */
export function PermissionButton({
  permission,
  fallback,
  hideOnNoPermission = false,
  tooltipOnNoPermission = '暂无权限',
  children,
  ...buttonProps
}: PermissionButtonProps) {
  const user = useSelector((state: AppState) => state.user.user);
  const userPermissions = (user?.permissions ?? []) as Permission[];

  const canAccess = user
    ? hasPermission(user.role, userPermissions, user.isPrimary ?? false, permission)
    : false;

  // 无权限时隐藏
  if (!canAccess && hideOnNoPermission) {
    return fallback ? <>{fallback}</> : null;
  }

  // 无权限时禁用并显示提示
  if (!canAccess) {
    return (
      <Tooltip title={tooltipOnNoPermission}>
        <Button {...buttonProps} disabled>
          {children}
        </Button>
      </Tooltip>
    );
  }

  return <Button {...buttonProps}>{children}</Button>;
}

interface PermissionGuardProps {
  permission: Permission | Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 权限守卫组件
 * 根据用户权限控制子组件的显示
 */
export function PermissionGuard({
  permission,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const user = useSelector((state: AppState) => state.user.user);
  const userPermissions = (user?.permissions ?? []) as Permission[];

  if (!user) {
    return <>{fallback}</>;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];

  const canAccess = requireAll
    ? permissions.every((perm) =>
        hasPermission(user.role, userPermissions, user.isPrimary ?? false, perm)
      )
    : permissions.some((perm) =>
        hasPermission(user.role, userPermissions, user.isPrimary ?? false, perm)
      );

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default PermissionButton;
