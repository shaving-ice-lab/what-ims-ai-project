'use client';

/**
 * OrderStatusTag - 订单状态标签组件
 * 不同状态显示不同颜色和图标
 */

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import React from 'react';

export type OrderStatus =
  | 'pending_payment'
  | 'pending_confirm'
  | 'confirmed'
  | 'delivering'
  | 'completed'
  | 'cancelled';

interface StatusConfig {
  color: string;
  icon: React.ReactNode;
  text: string;
  description: string;
}

const statusConfigMap: Record<OrderStatus, StatusConfig> = {
  pending_payment: {
    color: 'orange',
    icon: <ExclamationCircleOutlined />,
    text: '待付款',
    description: '订单等待付款',
  },
  pending_confirm: {
    color: 'blue',
    icon: <ClockCircleOutlined />,
    text: '待确认',
    description: '订单已付款，等待供应商确认',
  },
  confirmed: {
    color: 'cyan',
    icon: <CheckCircleOutlined />,
    text: '已确认',
    description: '供应商已确认订单',
  },
  delivering: {
    color: 'processing',
    icon: <TruckOutlined />,
    text: '配送中',
    description: '订单正在配送',
  },
  completed: {
    color: 'success',
    icon: <CheckCircleOutlined />,
    text: '已完成',
    description: '订单已完成',
  },
  cancelled: {
    color: 'default',
    icon: <CloseCircleOutlined />,
    text: '已取消',
    description: '订单已取消',
  },
};

export interface OrderStatusTagProps {
  /** 订单状态 */
  status: OrderStatus;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 是否显示提示 */
  showTooltip?: boolean;
  /** 点击回调（用于查看状态流转） */
  onClick?: () => void;
}

const OrderStatusTag: React.FC<OrderStatusTagProps> = ({
  status,
  showIcon = true,
  showTooltip = true,
  onClick,
}) => {
  const config = statusConfigMap[status] || statusConfigMap.pending_confirm;

  const tag = (
    <Tag
      color={config.color}
      icon={showIcon ? config.icon : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {config.text}
    </Tag>
  );

  if (showTooltip) {
    return <Tooltip title={config.description}>{tag}</Tooltip>;
  }

  return tag;
};

export default OrderStatusTag;
