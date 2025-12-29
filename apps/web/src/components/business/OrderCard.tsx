'use client';

/**
 * OrderCard - 订单卡片组件
 * 统一订单展示样式，支持操作按钮插槽
 */

import {
  CalendarOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Card, Space, Tag, Typography } from 'antd';
import React from 'react';

const { Text, Title } = Typography;

export type OrderStatus =
  | 'pending_payment'
  | 'pending_confirm'
  | 'confirmed'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export interface OrderCardData {
  /** 订单ID */
  id: number;
  /** 订单编号 */
  orderNo: string;
  /** 门店名称 */
  storeName?: string;
  /** 供应商名称 */
  supplierName?: string;
  /** 订单状态 */
  status: OrderStatus;
  /** 商品金额 */
  goodsAmount: number;
  /** 服务费 */
  serviceFee?: number;
  /** 实付金额 */
  totalAmount: number;
  /** 加价总额 */
  markupTotal?: number;
  /** 商品数量 */
  itemCount: number;
  /** 期望配送日期 */
  expectedDeliveryDate?: string;
  /** 下单时间 */
  createdAt: string;
  /** 订单来源 */
  orderSource?: 'app' | 'web' | 'h5';
}

export interface OrderCardProps {
  /** 订单数据 */
  order: OrderCardData;
  /** 视角模式：门店/供应商/管理员 */
  viewMode?: 'store' | 'supplier' | 'admin';
  /** 是否显示加价信息（仅管理员可见） */
  showMarkup?: boolean;
  /** 点击卡片回调 */
  onClick?: (order: OrderCardData) => void;
  /** 操作按钮列表 */
  actions?: React.ReactNode;
  /** 是否加载中 */
  loading?: boolean;
  /** 额外的样式类名 */
  className?: string;
}

// 订单状态配置
const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending_payment: { label: '待付款', color: 'orange' },
  pending_confirm: { label: '待确认', color: 'blue' },
  confirmed: { label: '已确认', color: 'cyan' },
  delivering: { label: '配送中', color: 'purple' },
  completed: { label: '已完成', color: 'green' },
  cancelled: { label: '已取消', color: 'default' },
};

// 订单来源配置
const ORDER_SOURCE_CONFIG: Record<string, string> = {
  app: 'APP',
  web: 'Web',
  h5: 'H5',
};

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  viewMode = 'store',
  showMarkup = false,
  onClick,
  actions,
  loading = false,
  className,
}) => {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  // 格式化金额
  const formatMoney = (amount: number): string => {
    return `¥${amount.toFixed(2)}`;
  };

  // 格式化时间
  const formatTime = (timeStr: string): string => {
    const date = new Date(timeStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 格式化日期
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Card
      className={className}
      loading={loading}
      hoverable={!!onClick}
      onClick={() => onClick?.(order)}
      style={{ marginBottom: 16 }}
    >
      {/* 卡片头部 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            订单编号：{order.orderNo}
          </Text>
          {order.orderSource && (
            <Tag style={{ marginLeft: 8 }} color="default">
              {ORDER_SOURCE_CONFIG[order.orderSource]}
            </Tag>
          )}
        </div>
        <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
      </div>

      {/* 门店/供应商信息 */}
      <div style={{ marginBottom: 12 }}>
        {viewMode === 'supplier' && order.storeName && (
          <Space>
            <ShopOutlined />
            <Text strong>{order.storeName}</Text>
          </Space>
        )}
        {viewMode === 'store' && order.supplierName && (
          <Space>
            <ShopOutlined />
            <Text strong>{order.supplierName}</Text>
          </Space>
        )}
        {viewMode === 'admin' && (
          <Space size="large">
            {order.storeName && (
              <Space>
                <ShopOutlined />
                <Text>门店：{order.storeName}</Text>
              </Space>
            )}
            {order.supplierName && (
              <Space>
                <ShoppingOutlined />
                <Text>供应商：{order.supplierName}</Text>
              </Space>
            )}
          </Space>
        )}
      </div>

      {/* 订单信息 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Space size="large">
          <Text type="secondary">
            共 <Text strong>{order.itemCount}</Text> 种商品
          </Text>
          {order.expectedDeliveryDate && (
            <Space>
              <CalendarOutlined />
              <Text type="secondary">期望配送：{formatDate(order.expectedDeliveryDate)}</Text>
            </Space>
          )}
        </Space>
      </div>

      {/* 金额信息 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <div>
          <Space size="large">
            <div>
              <Text type="secondary">实付金额：</Text>
              <Title level={4} style={{ display: 'inline', margin: 0, color: '#f5222d' }}>
                {formatMoney(order.totalAmount)}
              </Title>
            </div>
            {showMarkup && order.markupTotal !== undefined && order.markupTotal > 0 && (
              <div>
                <Text type="secondary">加价收入：</Text>
                <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
                  +{formatMoney(order.markupTotal)}
                </Text>
              </div>
            )}
          </Space>
        </div>
        <Space>
          <ClockCircleOutlined style={{ color: '#999' }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formatTime(order.createdAt)}
          </Text>
        </Space>
      </div>

      {/* 操作按钮区域 */}
      {actions && (
        <div
          style={{
            paddingTop: 12,
            borderTop: '1px solid #f0f0f0',
            textAlign: 'right',
          }}
        >
          {actions}
        </div>
      )}
    </Card>
  );
};

export default OrderCard;
