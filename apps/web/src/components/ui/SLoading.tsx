'use client';

/**
 * SLoading - 统一加载状态组件
 * 基于 Ant Design Spin 组件封装
 * 支持全局/局部 loading
 */

import { Spin, type SpinProps } from 'antd';
import React from 'react';

export interface SLoadingProps extends SpinProps {
  /** 是否全屏显示 */
  fullscreen?: boolean;
  /** 全屏时的背景色 */
  backgroundColor?: string;
}

const SLoading: React.FC<SLoadingProps> = ({
  fullscreen = false,
  backgroundColor = 'rgba(255, 255, 255, 0.8)',
  tip = '加载中...',
  children,
  ...rest
}) => {
  if (fullscreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor,
          zIndex: 9999,
        }}
      >
        <Spin tip={tip} size="large" {...rest} />
      </div>
    );
  }

  return (
    <Spin tip={tip} {...rest}>
      {children}
    </Spin>
  );
};

export default SLoading;
