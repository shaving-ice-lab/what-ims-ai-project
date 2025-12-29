'use client';

/**
 * SButton - 统一按钮组件
 * 基于 Ant Design Button 组件封装
 * 支持防重复点击（内置debounce）
 */

import { Button, type ButtonProps } from 'antd';
import React, { useCallback, useRef, useState } from 'react';

export interface SButtonProps extends ButtonProps {
  /** 防抖延迟时间（毫秒），默认 300ms */
  debounceTime?: number;
  /** 是否启用防抖，默认 true */
  enableDebounce?: boolean;
}

const SButton: React.FC<SButtonProps> = ({
  onClick,
  loading,
  debounceTime = 300,
  enableDebounce = true,
  children,
  ...rest
}) => {
  const [innerLoading, setInnerLoading] = useState(false);
  const lastClickTime = useRef<number>(0);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLElement>) => {
      if (!onClick) return;

      const now = Date.now();
      if (enableDebounce && now - lastClickTime.current < debounceTime) {
        return;
      }
      lastClickTime.current = now;

      const result = onClick(e) as unknown;

      // 如果 onClick 返回 Promise，自动处理 loading 状态
      if (result && typeof (result as Promise<unknown>).then === 'function') {
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
    <Button {...rest} loading={loading ?? innerLoading} onClick={handleClick}>
      {children}
    </Button>
  );
};

export default SButton;
