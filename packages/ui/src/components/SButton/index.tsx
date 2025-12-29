import React, { useCallback, useRef, useState } from 'react';

import { Button, ButtonProps } from 'antd';

export interface SButtonProps extends ButtonProps {
  /** 防抖时间（毫秒），默认300ms */
  debounceTime?: number;
  /** 是否启用防抖，默认true */
  enableDebounce?: boolean;
}

export const SButton: React.FC<SButtonProps> = ({
  debounceTime = 300,
  enableDebounce = true,
  onClick,
  loading,
  children,
  ...restProps
}) => {
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!enableDebounce) {
        onClick?.(e);
        return;
      }

      if (isDebouncing) return;

      setIsDebouncing(true);
      onClick?.(e);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setIsDebouncing(false);
      }, debounceTime);
    },
    [onClick, enableDebounce, isDebouncing, debounceTime]
  );

  return (
    <Button {...restProps} loading={loading || isDebouncing} onClick={handleClick}>
      {children}
    </Button>
  );
};

export default SButton;
