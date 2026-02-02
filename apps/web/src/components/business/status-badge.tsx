"use client";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Order status mapping
export const orderStatusConfig = {
  pending: { label: "待处理", variant: "warning" as const },
  confirmed: { label: "已确认", variant: "info" as const },
  processing: { label: "处理中", variant: "info" as const },
  shipped: { label: "已发货", variant: "info" as const },
  delivered: { label: "已送达", variant: "success" as const },
  completed: { label: "已完成", variant: "success" as const },
  cancelled: { label: "已取消", variant: "error" as const },
  refunded: { label: "已退款", variant: "error" as const },
} as const;

// Audit status mapping
export const auditStatusConfig = {
  pending: { label: "待审核", variant: "warning" as const },
  approved: { label: "已通过", variant: "success" as const },
  rejected: { label: "已拒绝", variant: "error" as const },
} as const;

// Payment status mapping
export const paymentStatusConfig = {
  unpaid: { label: "未支付", variant: "warning" as const },
  paid: { label: "已支付", variant: "success" as const },
  refunding: { label: "退款中", variant: "info" as const },
  refunded: { label: "已退款", variant: "error" as const },
} as const;

// User status mapping
export const userStatusConfig = {
  active: { label: "正常", variant: "success" as const },
  inactive: { label: "未激活", variant: "secondary" as const },
  suspended: { label: "已停用", variant: "error" as const },
  pending: { label: "待审核", variant: "warning" as const },
} as const;

// Stock status mapping
export const stockStatusConfig = {
  in_stock: { label: "有库存", variant: "success" as const },
  low_stock: { label: "库存低", variant: "warning" as const },
  out_of_stock: { label: "无库存", variant: "error" as const },
} as const;

type StatusConfig = {
  label: string;
  variant: BadgeProps["variant"];
};

interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: string;
  config?: Record<string, StatusConfig>;
  showDot?: boolean;
}

export function StatusBadge({
  status,
  config,
  showDot = false,
  className,
  ...props
}: StatusBadgeProps) {
  const statusConfig = config?.[status] || {
    label: status,
    variant: "secondary" as const,
  };

  return (
    <Badge
      variant={statusConfig.variant}
      className={cn(
        "font-medium transition-all",
        showDot && "gap-2 pl-2",
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            "h-2 w-2 rounded-full animate-pulse",
            statusConfig.variant === "success" && "bg-emerald-500",
            statusConfig.variant === "warning" && "bg-amber-500",
            statusConfig.variant === "error" && "bg-red-500",
            statusConfig.variant === "info" && "bg-blue-500",
            statusConfig.variant === "secondary" && "bg-gray-400"
          )}
        />
      )}
      {statusConfig.label}
    </Badge>
  );
}

// Convenience components for specific status types
export function OrderStatusBadge({
  status,
  ...props
}: Omit<StatusBadgeProps, "config">) {
  return (
    <StatusBadge
      status={status}
      config={orderStatusConfig}
      showDot
      {...props}
    />
  );
}

export function AuditStatusBadge({
  status,
  ...props
}: Omit<StatusBadgeProps, "config">) {
  return <StatusBadge status={status} config={auditStatusConfig} {...props} />;
}

export function PaymentStatusBadge({
  status,
  ...props
}: Omit<StatusBadgeProps, "config">) {
  return <StatusBadge status={status} config={paymentStatusConfig} {...props} />;
}

export function UserStatusBadge({
  status,
  ...props
}: Omit<StatusBadgeProps, "config">) {
  return (
    <StatusBadge status={status} config={userStatusConfig} showDot {...props} />
  );
}

export function StockStatusBadge({
  status,
  ...props
}: Omit<StatusBadgeProps, "config">) {
  return <StatusBadge status={status} config={stockStatusConfig} {...props} />;
}
