'use client';

/**
 * SEmpty - 统一空状态组件
 * 基于 Ant Design Empty 组件封装
 * 内置常见空状态（无数据、无搜索结果、网络错误）
 */

import { FileSearchOutlined, InboxOutlined, WifiOutlined } from '@ant-design/icons';
import { Button, Empty, type EmptyProps } from 'antd';
import React from 'react';

export type EmptyType = 'default' | 'noData' | 'noResult' | 'networkError';

export interface SEmptyProps extends Omit<EmptyProps, 'description'> {
  /** 空状态类型 */
  type?: EmptyType;
  /** 自定义描述 */
  description?: React.ReactNode;
  /** 重试回调（用于网络错误） */
  onRetry?: () => void;
}

const emptyConfig: Record<EmptyType, { icon: React.ReactNode; description: string }> = {
  default: {
    icon: <InboxOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />,
    description: '暂无数据',
  },
  noData: {
    icon: <InboxOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />,
    description: '暂无数据',
  },
  noResult: {
    icon: <FileSearchOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />,
    description: '未找到相关结果',
  },
  networkError: {
    icon: <WifiOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />,
    description: '网络连接失败',
  },
};

const SEmpty: React.FC<SEmptyProps> = ({
  type = 'default',
  description,
  onRetry,
  children,
  ...rest
}) => {
  const config = emptyConfig[type];

  return (
    <Empty image={config.icon} description={description ?? config.description} {...rest}>
      {type === 'networkError' && onRetry ? (
        <Button type="primary" onClick={onRetry}>
          重试
        </Button>
      ) : (
        children
      )}
    </Empty>
  );
};

export default SEmpty;
