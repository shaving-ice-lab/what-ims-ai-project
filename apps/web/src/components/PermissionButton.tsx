"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { RootState } from "@/store";
import { hasPermission, type Permission } from "@/utils/permission";
import * as React from "react";
import { useSelector } from "react-redux";

interface PermissionButtonProps extends ButtonProps {
  permission: Permission;
  fallback?: React.ReactNode;
  hideOnNoPermission?: boolean;
  tooltipOnNoPermission?: string;
}

/**
 * Permission Button Component
 * Controls button visibility and availability based on user permissions
 */
export function PermissionButton({
  permission,
  fallback,
  hideOnNoPermission = false,
  tooltipOnNoPermission = "暂无权限",
  children,
  ...buttonProps
}: PermissionButtonProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const userPermissions = (user?.permissions ?? []) as Permission[];

  const canAccess = user
    ? hasPermission(
        user.role,
        userPermissions,
        user.isPrimary ?? false,
        permission
      )
    : false;

  // Hide when no permission
  if (!canAccess && hideOnNoPermission) {
    return fallback ? <>{fallback}</> : null;
  }

  // Disable and show tooltip when no permission
  if (!canAccess) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button {...buttonProps} disabled>
              {children}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{tooltipOnNoPermission}</TooltipContent>
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
 * Permission Guard Component
 * Controls child component visibility based on user permissions
 */
export function PermissionGuard({
  permission,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const userPermissions = (user?.permissions ?? []) as Permission[];

  if (!user) {
    return <>{fallback}</>;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];

  const canAccess = requireAll
    ? permissions.every((perm) =>
        hasPermission(
          user.role,
          userPermissions,
          user.isPrimary ?? false,
          perm
        )
      )
    : permissions.some((perm) =>
        hasPermission(
          user.role,
          userPermissions,
          user.isPrimary ?? false,
          perm
        )
      );

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default PermissionButton;
