import React from 'react';

import { Skeleton, SkeletonProps } from 'antd';

export interface SSkeletonProps extends SkeletonProps {
  /** 骨架屏类型 */
  type?: 'default' | 'card' | 'list' | 'table';
  /** 列表项数量 */
  rows?: number;
}

export const SSkeleton: React.FC<SSkeletonProps> = ({
  type = 'default',
  rows = 3,
  active = true,
  ...restProps
}) => {
  if (type === 'card') {
    return (
      <div style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
        <Skeleton.Avatar active={active} size={48} style={{ marginBottom: 16 }} />
        <Skeleton active={active} paragraph={{ rows: 2 }} {...restProps} />
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Skeleton active={active} avatar paragraph={{ rows: 1 }} {...restProps} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div>
        <Skeleton.Input active={active} block style={{ marginBottom: 16, height: 40 }} />
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton.Input
            key={index}
            active={active}
            block
            style={{ marginBottom: 8, height: 48 }}
          />
        ))}
      </div>
    );
  }

  return <Skeleton active={active} paragraph={{ rows }} {...restProps} />;
};

export default SSkeleton;
