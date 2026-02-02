"use client";

/**
 * SModal - 统一弹窗组件
 * 基于 shadcn/ui Dialog 组件封装
 * 支持全屏模式
 */

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2 } from "lucide-react";
import * as React from "react";

export interface SModalProps {
  /** 是否显示 */
  open?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 标题 */
  title?: React.ReactNode;
  /** 描述 */
  description?: React.ReactNode;
  /** 是否支持全屏 */
  allowFullscreen?: boolean;
  /** 宽度 */
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** 底部内容 */
  footer?: React.ReactNode;
  /** 确认按钮文字 */
  okText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 确认回调 */
  onOk?: () => void;
  /** 取消回调 */
  onCancel?: () => void;
  /** 确认按钮加载状态 */
  confirmLoading?: boolean;
  /** 子元素 */
  children?: React.ReactNode;
}

const widthClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  full: "sm:max-w-[90vw]",
};

const SModal: React.FC<SModalProps> = ({
  open = false,
  onClose,
  title,
  description,
  allowFullscreen = false,
  width = "md",
  footer,
  okText = "确认",
  cancelText = "取消",
  onOk,
  onCancel,
  confirmLoading = false,
  children,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleClose = () => {
    onClose?.();
    onCancel?.();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className={cn(
          isFullscreen
            ? "sm:max-w-[100vw] h-[100vh] rounded-none"
            : widthClasses[width]
        )}
      >
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle>{title}</DialogTitle>
            {allowFullscreen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div
          className={cn("py-4", isFullscreen && "flex-1 overflow-auto")}
        >
          {children}
        </div>
        {(footer || onOk || onCancel) && (
          <DialogFooter>
            {footer || (
              <>
                {onCancel && (
                  <Button variant="outline" onClick={handleClose}>
                    {cancelText}
                  </Button>
                )}
                {onOk && (
                  <Button onClick={onOk} disabled={confirmLoading}>
                    {confirmLoading ? "处理中..." : okText}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SModal;
