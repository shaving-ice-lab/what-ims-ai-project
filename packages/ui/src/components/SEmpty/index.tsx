import React from 'react';

import { Button, Empty, EmptyProps } from 'antd';

export interface SEmptyProps extends EmptyProps {
  /** 操作按钮文字 */
  actionText?: string;
  /** 操作按钮点击回调 */
  onAction?: () => void;
  /** 空状态类型 */
  type?: 'default' | 'noData' | 'noResult' | 'error';
}

const typeConfig = {
  default: { description: '暂无数据' },
  noData: { description: '暂无数据' },
  noResult: { description: '未找到相关结果' },
  error: { description: '加载失败，请稍后重试' },
};

export const SEmpty: React.FC<SEmptyProps> = ({
  type = 'default',
  actionText,
  onAction,
  description,
  ...restProps
}) => {
  const config = typeConfig[type];

  return (
    <Empty description={description || config.description} {...restProps}>
      {actionText && onAction && (
        <Button type="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Empty>
  );
};

export default SEmpty;
