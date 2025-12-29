'use client';

/**
 * SDrawer - 统一抽屉组件
 * 基于 Ant Design Drawer 组件封装
 * 支持多层级
 */

import { Drawer, type DrawerProps } from 'antd';
import React from 'react';

export interface SDrawerProps extends DrawerProps {
  /** 抽屉层级，用于多层抽屉时的 z-index 计算 */
  level?: number;
}

const SDrawer: React.FC<SDrawerProps> = ({ level = 0, style, children, ...rest }) => {
  const zIndex = 1000 + level * 10;

  return (
    <Drawer style={{ ...style }} zIndex={zIndex} {...rest}>
      {children}
    </Drawer>
  );
};

export default SDrawer;
