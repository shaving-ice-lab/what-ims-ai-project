'use client';

/**
 * StatCard - 数据统计卡片组件
 * 数值动画效果、趋势指示、图标支持
 */

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Statistic, type StatisticProps } from 'antd';
import React from 'react';

export interface StatCardProps extends Omit<StatisticProps, 'title'> {
  /** 卡片标题 */
  title: React.ReactNode;
  /** 统计值 */
  value: number | string;
  /** 图标 */
  icon?: React.ReactNode;
  /** 趋势方向 */
  trend?: 'up' | 'down' | 'none';
  /** 趋势值（百分比） */
  trendValue?: number;
  /** 点击回调 */
  onClick?: () => void;
  /** 卡片背景色 */
  backgroundColor?: string;
  /** 是否加载中 */
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend = 'none',
  trendValue,
  onClick,
  backgroundColor,
  loading = false,
  ...rest
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') {
      return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
    }
    if (trend === 'down') {
      return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return '#52c41a';
    if (trend === 'down') return '#ff4d4f';
    return undefined;
  };

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{
        backgroundColor,
        cursor: onClick ? 'pointer' : 'default',
      }}
      loading={loading}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Statistic
          title={title}
          value={value}
          suffix={
            trend !== 'none' && trendValue !== undefined ? (
              <span style={{ fontSize: 14, color: getTrendColor() }}>
                {getTrendIcon()}
                {trendValue}%
              </span>
            ) : undefined
          }
          {...rest}
        />
        {icon && (
          <div
            style={{
              fontSize: 32,
              opacity: 0.6,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
