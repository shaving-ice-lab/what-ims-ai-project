import React from 'react';

import { Drawer, DrawerProps } from 'antd';

export interface SDrawerProps extends DrawerProps {
  /** 是否显示底部按钮 */
  showFooter?: boolean;
}

export const SDrawer: React.FC<SDrawerProps> = ({
  showFooter = true,
  footer,
  width = 480,
  destroyOnClose = true,
  maskClosable = false,
  ...restProps
}) => {
  return (
    <Drawer
      width={width}
      destroyOnClose={destroyOnClose}
      maskClosable={maskClosable}
      footer={showFooter ? footer : null}
      {...restProps}
    />
  );
};

export default SDrawer;
