'use client';

/**
 * BarChart - 柱状图组件
 * 基于 @ant-design/charts 封装
 * 支持响应式适配、主题配置、数据为空占位
 */

import { Column, type ColumnConfig } from '@ant-design/charts';
import { Empty, Spin } from 'antd';
import React, { useMemo } from 'react';

export interface BarChartDataItem {
  /** X轴数据（分类） */
  x: string;
  /** Y轴数据（数值） */
  y: number;
  /** 分组（堆叠或分组柱状图时使用） */
  group?: string;
}

export interface BarChartProps {
  /** 图表数据 */
  data: BarChartDataItem[];
  /** 图表高度 */
  height?: number;
  /** X轴字段名 */
  xField?: string;
  /** Y轴字段名 */
  yField?: string;
  /** 分组字段名 */
  seriesField?: string;
  /** 是否分组柱状图 */
  isGroup?: boolean;
  /** 是否堆叠柱状图 */
  isStack?: boolean;
  /** 主题色 */
  color?: string | string[];
  /** 是否加载中 */
  loading?: boolean;
  /** 空状态描述 */
  emptyText?: string;
  /** X轴标题 */
  xAxisTitle?: string;
  /** Y轴标题 */
  yAxisTitle?: string;
  /** 柱子圆角 */
  columnRadius?: number;
  /** 柱子最大宽度 */
  maxColumnWidth?: number;
  /** 自定义配置（覆盖默认配置） */
  config?: Partial<ColumnConfig>;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 300,
  xField = 'x',
  yField = 'y',
  seriesField,
  isGroup = false,
  isStack = false,
  color,
  loading = false,
  emptyText = '暂无数据',
  xAxisTitle,
  yAxisTitle,
  columnRadius = 4,
  maxColumnWidth = 40,
  config,
}) => {
  const chartConfig: ColumnConfig = useMemo(() => {
    const baseConfig: ColumnConfig = {
      data,
      xField,
      yField,
      seriesField,
      isGroup,
      isStack,
      height,
      color,
      columnStyle: {
        radius: [columnRadius, columnRadius, 0, 0],
      },
      maxColumnWidth,
      xAxis: {
        title: xAxisTitle ? { text: xAxisTitle } : undefined,
        label: {
          autoRotate: true,
          autoHide: true,
        },
      },
      yAxis: {
        title: yAxisTitle ? { text: yAxisTitle } : undefined,
      },
      tooltip: {
        showMarkers: false,
      },
      legend: seriesField
        ? {
            position: 'top',
          }
        : false,
      label: {
        position: 'top',
        style: {
          fill: '#666',
          fontSize: 12,
        },
      },
      animation: {
        appear: {
          animation: 'grow-in-y',
          duration: 800,
        },
      },
      ...config,
    };
    return baseConfig;
  }, [
    data,
    xField,
    yField,
    seriesField,
    isGroup,
    isStack,
    height,
    color,
    columnRadius,
    maxColumnWidth,
    xAxisTitle,
    yAxisTitle,
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

  return <Column {...chartConfig} />;
};

export default BarChart;
