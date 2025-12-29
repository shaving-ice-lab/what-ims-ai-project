'use client';

/**
 * PieChart - 饼图组件
 * 基于 @ant-design/charts 封装
 * 支持响应式适配、主题配置、数据为空占位
 */

import { Pie, type PieConfig } from '@ant-design/charts';
import { Empty, Spin } from 'antd';
import React, { useMemo } from 'react';

export interface PieChartDataItem {
  /** 分类名称 */
  type: string;
  /** 数值 */
  value: number;
}

export interface PieChartProps {
  /** 图表数据 */
  data: PieChartDataItem[];
  /** 图表高度 */
  height?: number;
  /** 角度字段名 */
  angleField?: string;
  /** 颜色字段名 */
  colorField?: string;
  /** 内半径（环形图） */
  innerRadius?: number;
  /** 外半径 */
  radius?: number;
  /** 主题色 */
  color?: string[];
  /** 是否加载中 */
  loading?: boolean;
  /** 空状态描述 */
  emptyText?: string;
  /** 是否显示标签 */
  showLabel?: boolean;
  /** 标签类型 */
  labelType?: 'inner' | 'outer' | 'spider';
  /** 是否显示中心统计 */
  showStatistic?: boolean;
  /** 中心统计标题 */
  statisticTitle?: string;
  /** 自定义配置（覆盖默认配置） */
  config?: Partial<PieConfig>;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 300,
  angleField = 'value',
  colorField = 'type',
  innerRadius = 0,
  radius = 0.8,
  color,
  loading = false,
  emptyText = '暂无数据',
  showLabel = true,
  labelType = 'outer',
  showStatistic = false,
  statisticTitle = '总计',
  config,
}) => {
  const chartConfig: PieConfig = useMemo(() => {
    const baseConfig: PieConfig = {
      data,
      angleField,
      colorField,
      radius,
      innerRadius,
      height,
      color,
      label: showLabel
        ? {
            type: labelType,
            content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(1)}%`,
          }
        : false,
      tooltip: {
        formatter: (datum: PieChartDataItem) => ({
          name: datum.type,
          value: datum.value,
        }),
      },
      legend: {
        position: 'right',
        layout: 'vertical',
      },
      statistic: showStatistic
        ? {
            title: {
              content: statisticTitle,
              style: {
                fontSize: '14px',
                color: '#666',
              },
            },
            content: {
              style: {
                fontSize: '24px',
                fontWeight: 'bold',
              },
              formatter: () => {
                const total = data.reduce((sum, item) => sum + item.value, 0);
                return total.toLocaleString();
              },
            },
          }
        : false,
      interactions: [{ type: 'element-active' }],
      animation: {
        appear: {
          animation: 'fade-in',
          duration: 800,
        },
      },
      ...config,
    };
    return baseConfig;
  }, [
    data,
    angleField,
    colorField,
    radius,
    innerRadius,
    height,
    color,
    showLabel,
    labelType,
    showStatistic,
    statisticTitle,
    config,
  ]);

  if (loading) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin tip="加载中..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty description={emptyText} />
      </div>
    );
  }

  return <Pie {...chartConfig} />;
};

export default PieChart;
