"use client";

/**
 * OrderCard - 订单卡片组件
 * 统一订单展示样式，支持操作按钮插槽
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Package, Store } from "lucide-react";
import * as React from "react";

export type OrderStatus =
  | "pending_payment"
  | "pending_confirm"
  | "confirmed"
  | "delivering"
  | "completed"
  | "cancelled";

export interface OrderCardData {
  /** 订单ID */
  id: number;
  /** 订单编号 */
  orderNo: string;
  /** 门店名称 */
  storeName?: string;
  /** 供应商名称 */
  supplierName?: string;
  /** 订单状态 */
  status: OrderStatus;
  /** 商品金额 */
  goodsAmount: number;
  /** 服务费 */
  serviceFee?: number;
  /** 实付金额 */
  totalAmount: number;
  /** 加价总额 */
  markupTotal?: number;
  /** 商品数量 */
  itemCount: number;
  /** 期望配送日期 */
  expectedDeliveryDate?: string;
  /** 下单时间 */
  createdAt: string;
  /** 订单来源 */
  orderSource?: "app" | "web" | "h5";
}

export interface OrderCardProps {
  /** 订单数据 */
  order: OrderCardData;
  /** 视角模式：门店/供应商/管理员 */
  viewMode?: "store" | "supplier" | "admin";
  /** 是否显示加价信息（仅管理员可见） */
  showMarkup?: boolean;
  /** 点击卡片回调 */
  onClick?: (order: OrderCardData) => void;
  /** 操作按钮列表 */
  actions?: React.ReactNode;
  /** 是否加载中 */
  loading?: boolean;
  /** 额外的样式类名 */
  className?: string;
}

// 订单状态配置
const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: "warning" | "secondary" | "success" | "error" | "default" }
> = {
  pending_payment: { label: "待付款", variant: "warning" },
  pending_confirm: { label: "待确认", variant: "secondary" },
  confirmed: { label: "已确认", variant: "default" },
  delivering: { label: "配送中", variant: "secondary" },
  completed: { label: "已完成", variant: "success" },
  cancelled: { label: "已取消", variant: "error" },
};

// 订单来源配置
const ORDER_SOURCE_CONFIG: Record<string, string> = {
  app: "APP",
  web: "Web",
  h5: "H5",
};

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  viewMode = "store",
  showMarkup = false,
  onClick,
  actions,
  loading = false,
  className,
}) => {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  const formatMoney = (amount: number): string => {
    return `¥${amount.toFixed(2)}`;
  };

  const formatTime = (timeStr: string): string => {
    const date = new Date(timeStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <Card className={cn("mb-4", className)}>
        <CardContent className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex justify-between items-center pt-3 border-t">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "mb-4 transition-all duration-300 border-border/50",
        onClick && "cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20",
        className
      )}
      onClick={() => onClick?.(order)}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">
              {order.orderNo}
            </span>
            {order.orderSource && (
              <Badge variant="outline" className="text-xs">
                {ORDER_SOURCE_CONFIG[order.orderSource]}
              </Badge>
            )}
          </div>
          <Badge variant={statusConfig.variant} className="font-medium">
            {statusConfig.label}
          </Badge>
        </div>

        {/* Store/Supplier Info */}
        <div className="mb-4">
          {viewMode === "supplier" && order.storeName && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Store className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{order.storeName}</span>
            </div>
          )}
          {viewMode === "store" && order.supplierName && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Store className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{order.supplierName}</span>
            </div>
          )}
          {viewMode === "admin" && (
            <div className="flex flex-wrap gap-4">
              {order.storeName && (
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-blue-500/10 flex items-center justify-center">
                    <Store className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <span className="text-sm">{order.storeName}</span>
                </div>
              )}
              {order.supplierName && (
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-emerald-500/10 flex items-center justify-center">
                    <Package className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <span className="text-sm">{order.supplierName}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Info */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
          <span className="bg-muted/50 px-2 py-1 rounded-md">
            共 <span className="font-medium text-foreground">{order.itemCount}</span> 种商品
          </span>
          {order.expectedDeliveryDate && (
            <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
              <Calendar className="h-3.5 w-3.5" />
              <span>期望配送：{formatDate(order.expectedDeliveryDate)}</span>
            </div>
          )}
        </div>

        {/* Amount Info */}
        <div className="flex justify-between items-center pt-4 border-t border-border/50">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-muted-foreground text-xs block mb-0.5">实付金额</span>
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                {formatMoney(order.totalAmount)}
              </span>
            </div>
            {showMarkup &&
              order.markupTotal !== undefined &&
              order.markupTotal > 0 && (
                <div>
                  <span className="text-muted-foreground text-xs block mb-0.5">加价收入</span>
                  <span className="font-semibold text-emerald-500">
                    +{formatMoney(order.markupTotal)}
                  </span>
                </div>
              )}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTime(order.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="pt-4 mt-4 border-t border-border/50 flex justify-end gap-2">{actions}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
