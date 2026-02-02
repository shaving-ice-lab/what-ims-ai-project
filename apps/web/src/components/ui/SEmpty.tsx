"use client";

/**
 * SEmpty - 统一空状态组件
 * 基于 shadcn/ui 封装
 * 内置常见空状态（无数据、无搜索结果、网络错误）
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inbox, RefreshCw, Search, WifiOff } from "lucide-react";
import * as React from "react";

export type EmptyType = "default" | "noData" | "noResult" | "networkError";

export interface SEmptyProps {
  /** 空状态类型 */
  type?: EmptyType;
  /** 自定义图标 */
  icon?: React.ReactNode;
  /** 自定义描述 */
  description?: React.ReactNode;
  /** 重试回调（用于网络错误） */
  onRetry?: () => void;
  /** 额外的内容 */
  children?: React.ReactNode;
  /** 额外类名 */
  className?: string;
}

const emptyConfig: Record<
  EmptyType,
  { icon: React.ReactNode; description: string }
> = {
  default: {
    icon: <Inbox className="h-12 w-12 text-muted-foreground/50" />,
    description: "暂无数据",
  },
  noData: {
    icon: <Inbox className="h-12 w-12 text-muted-foreground/50" />,
    description: "暂无数据",
  },
  noResult: {
    icon: <Search className="h-12 w-12 text-muted-foreground/50" />,
    description: "未找到相关结果",
  },
  networkError: {
    icon: <WifiOff className="h-12 w-12 text-[hsl(var(--error))]" />,
    description: "网络连接失败",
  },
};

const SEmpty: React.FC<SEmptyProps> = ({
  type = "default",
  icon,
  description,
  onRetry,
  children,
  className,
}) => {
  const config = emptyConfig[type];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
    >
      <div className="mb-4">{icon || config.icon}</div>
      <p className="text-muted-foreground text-sm mb-4">
        {description ?? config.description}
      </p>
      {type === "networkError" && onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          重试
        </Button>
      ) : (
        children
      )}
    </div>
  );
};

export default SEmpty;
