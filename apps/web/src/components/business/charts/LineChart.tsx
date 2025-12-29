'use client';

/**
 * LineChart - 折线图组件
 * 基于 @ant-design/charts 封装
 * 支持响应式适配、主题配置、数据为空占位
 */

import { Line, type LineConfig } from '@ant-design/charts';
import { Empty, Spin } from 'antd';
import React, { useMemo } from 'react';

export interface LineChartDataItem {
  /** X轴数据 */
  x: string | number;
  /** Y轴数据 */
  y: number;
  /** 分类（多条线时使用） */
  category?: string;
}

export interface LineChartProps {
  /** 图表数据 */
  data: LineChartDataItem[];
  /** 图表高度 */
  height?: number;
  /** X轴字段名 */
  xField?: string;
  /** Y轴字段名 */
  yField?: string;
  /** 分类字段名 */
  seriesField?: string;
  /** 是否平滑曲线 */
  smooth?: boolean;
  /** 是否显示数据点 */
  showPoint?: boolean;
  /** 是否显示面积 */
  showArea?: boolean;
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
  /** 自定义配置（覆盖默认配置） */
  config?: Partial<LineConfig>;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 300,
  xField = 'x',
  yField = 'y',
  seriesField,
  smooth = true,
  showPoint = true,
  showArea = false,
  color,
  loading = false,
  emptyText = '暂无数据',
  xAxisTitle,
  yAxisTitle,
  config,
}) => {
  const chartConfig: LineConfig = useMemo(() => {
    const baseConfig: LineConfig = {
      data,
      xField,
      yField,
      seriesField,
      smooth,
      height,
      point: showPoint
        ? {
            size: 4,
            shape: 'circle',
          }
        : undefined,
      area: showArea
        ? {
            style: {
              fillOpacity: 0.15,
            },
          }
        : undefined,
      color,
      xAxis: {
        title: xAxisTitle ? { text: xAxisTitle } : undefined,
      },
      yAxis: {
        title: yAxisTitle ? { text: yAxisTitle } : undefined,
      },
      tooltip: {
        showMarkers: true,
      },
      legend: seriesField
        ? {
            position: 'top',
          }
        : false,
      animation: {
        appear: {
          animation: 'wave-in',
          duration: 1000,
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
    smooth,
    height,
    showPoint,
    showArea,
    color,
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

  return <Line {...chartConfig} />;
};

export default LineChart;
