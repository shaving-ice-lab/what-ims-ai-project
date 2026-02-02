"use client";

/**
 * SButton - 统一按钮组件
 * 基于 shadcn/ui Button 组件封装
 * 支持防重复点击（内置debounce）
 */

import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import * as React from "react";

export interface SButtonProps extends ButtonProps {
  /** 防抖延迟时间（毫秒），默认 300ms */
  debounceTime?: number;
  /** 是否启用防抖，默认 true */
  enableDebounce?: boolean;
  /** 是否显示加载状态 */
  loading?: boolean;
}

const SButton: React.FC<SButtonProps> = ({
  onClick,
  loading: externalLoading,
  debounceTime = 300,
  enableDebounce = true,
  children,
  disabled,
  ...rest
}) => {
  const [innerLoading, setInnerLoading] = React.useState(false);
  const lastClickTime = React.useRef<number>(0);

  const isLoading = externalLoading ?? innerLoading;

  const handleClick = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!onClick) return;

      const now = Date.now();
      if (enableDebounce && now - lastClickTime.current < debounceTime) {
        return;
      }
      lastClickTime.current = now;

      const result = onClick(e) as unknown;

      // If onClick returns Promise, auto handle loading state
      if (result && typeof (result as Promise<unknown>).then === "function") {
        setInnerLoading(true);
        try {
          await result;
        } finally {
          setInnerLoading(false);
        }
      }
    },
    [onClick, debounceTime, enableDebounce]
  );

  return (
    <Button {...rest} disabled={disabled || isLoading} onClick={handleClick}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default SButton;
