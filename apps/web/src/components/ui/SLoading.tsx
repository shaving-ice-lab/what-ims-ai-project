"use client";

/**
 * SLoading - 统一加载状态组件
 * 基于 shadcn/ui 封装
 * 支持全局/局部 loading
 */

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import * as React from "react";

export interface SLoadingProps {
  /** 是否显示 */
  spinning?: boolean;
  /** 是否全屏显示 */
  fullscreen?: boolean;
  /** 全屏时的背景色 */
  backgroundColor?: string;
  /** 加载提示文字 */
  tip?: string;
  /** 尺寸 */
  size?: "sm" | "md" | "lg";
  /** 子元素 */
  children?: React.ReactNode;
  /** 额外类名 */
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const SLoading: React.FC<SLoadingProps> = ({
  spinning = true,
  fullscreen = false,
  backgroundColor = "rgba(255, 255, 255, 0.8)",
  tip = "加载中...",
  size = "md",
  children,
  className,
}) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {tip && <span className="text-sm text-muted-foreground">{tip}</span>}
    </div>
  );

  if (fullscreen) {
    if (!spinning) return null;
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-[9999]"
        style={{ backgroundColor }}
      >
        {spinnerContent}
      </div>
    );
  }

  if (!children) {
    return spinning ? spinnerContent : null;
  }

  return (
    <div className={cn("relative", className)}>
      {children}
      {spinning && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor }}
        >
          {spinnerContent}
        </div>
      )}
    </div>
  );
};

export default SLoading;
