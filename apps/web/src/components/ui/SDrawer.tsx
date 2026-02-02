"use client";

/**
 * SDrawer - 统一抽屉组件
 * 基于 shadcn/ui Sheet 组件封装
 * 支持多层级
 */

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import * as React from "react";

export interface SDrawerProps {
  /** 是否显示 */
  open?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 标题 */
  title?: React.ReactNode;
  /** 描述 */
  description?: React.ReactNode;
  /** 抽屉层级，用于多层抽屉时的 z-index 计算 */
  level?: number;
  /** 抽屉方向 */
  side?: "top" | "right" | "bottom" | "left";
  /** 宽度/高度 */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** 底部内容 */
  footer?: React.ReactNode;
  /** 子元素 */
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  full: "sm:max-w-full",
};

const SDrawer: React.FC<SDrawerProps> = ({
  open = false,
  onClose,
  title,
  description,
  level = 0,
  side = "right",
  size = "md",
  footer,
  children,
}) => {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <SheetContent
        side={side}
        className={sizeClasses[size]}
        style={{ zIndex: 50 + level * 10 }}
      >
        {title && (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && (
              <SheetDescription>{description}</SheetDescription>
            )}
          </SheetHeader>
        )}
        <div className="flex-1 overflow-auto py-4">{children}</div>
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
};

export default SDrawer;
