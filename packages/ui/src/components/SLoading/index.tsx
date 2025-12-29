import React from 'react';

import { Spin, SpinProps } from 'antd';

export interface SLoadingProps extends SpinProps {
  /** 是否全屏显示 */
  fullscreen?: boolean;
  /** 遮罩层背景色 */
  maskColor?: string;
}

export const SLoading: React.FC<SLoadingProps> = ({
  fullscreen = false,
  maskColor = 'rgba(255, 255, 255, 0.8)',
  tip = '加载中...',
  size = 'default',
  ...restProps
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
          backgroundColor: maskColor,
          zIndex: 9999,
        }}
      >
        <Spin tip={tip} size={size} {...restProps} />
      </div>
    );
  }

  return <Spin tip={tip} size={size} {...restProps} />;
};

export default SLoading;
