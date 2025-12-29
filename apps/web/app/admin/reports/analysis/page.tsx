'use client';

import { Column } from '@ant-design/charts';
import { FallOutlined, RiseOutlined } from '@ant-design/icons';
import { Card, Col, DatePicker, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface RankChangeItem {
  key: string;
  rank: number;
  name: string;
  amount: number;
  change: number;
}

export default function AnalysisPage() {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 模拟同比环比数据
  const comparisonData = [
    { period: '1月', type: '本期', value: 125000 },
    { period: '1月', type: '上期', value: 110000 },
    { period: '2月', type: '本期', value: 138000 },
    { period: '2月', type: '上期', value: 125000 },
    { period: '3月', type: '本期', value: 145000 },
    { period: '3月', type: '上期', value: 138000 },
    { period: '4月', type: '本期', value: 152000 },
    { period: '4月', type: '上期', value: 145000 },
  ];

  // 模拟门店排名变化
  const storeRankData: RankChangeItem[] = [
    { key: '1', rank: 1, name: '门店A - 朝阳店', amount: 45680, change: 0 },
    { key: '2', rank: 2, name: '门店C - 西城店', amount: 38500, change: 1 },
    { key: '3', rank: 3, name: '门店B - 海淀店', amount: 28900, change: -1 },
    { key: '4', rank: 4, name: '门店D - 东城店', amount: 21300, change: 2 },
    { key: '5', rank: 5, name: '门店E - 丰台店', amount: 15600, change: -1 },
  ];

  // 模拟供应商排名变化
  const supplierRankData: RankChangeItem[] = [
    { key: '1', rank: 1, name: '生鲜供应商A', amount: 68900, change: 0 },
    { key: '2', rank: 2, name: '粮油供应商B', amount: 45600, change: 1 },
    { key: '3', rank: 3, name: '调味品供应商C', amount: 23400, change: -1 },
    { key: '4', rank: 4, name: '冷冻食品供应商D', amount: 19800, change: 0 },
    { key: '5', rank: 5, name: '饮料供应商E', amount: 12300, change: 2 },
  ];

  // 统计数据
  const statsData = {
    currentPeriod: 560000,
    lastPeriod: 518000,
    yoyGrowth: 8.1,
    momGrowth: 5.2,
  };

  // 柱状图配置
  const columnConfig = {
    data: comparisonData,
    isGroup: true,
    xField: 'period',
    yField: 'value',
    seriesField: 'type',
    height: 300,
    yAxis: {
      label: {
        formatter: (v: string) => `¥${(Number(v) / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      formatter: (datum: { type: string; value: number }) => ({
        name: datum.type,
        value: `¥${datum.value.toLocaleString()}`,
      }),
    },
  };

  // 排名变化表格列
  const rankColumns: ColumnsType<RankChangeItem> = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '排名变化',
      dataIndex: 'change',
      key: 'change',
      render: (change: number) => {
        if (change === 0) return <Tag>-</Tag>;
        if (change > 0) {
          return (
            <Tag color="green">
              <RiseOutlined /> 上升{change}位
            </Tag>
          );
        }
        return (
          <Tag color="red">
            <FallOutlined /> 下降{Math.abs(change)}位
          </Tag>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div>
        <Title level={3}>对比分析</Title>
        <Paragraph type="secondary">查看同比、环比数据分析和排名变化</Paragraph>

        {/* 时间选择 */}
        <Card style={{ marginBottom: 24 }}>
          <Space>
            <span>选择时间范围：</span>
            <RangePicker value={dateRange} onChange={(dates) => setDateRange(dates)} />
          </Space>
        </Card>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="本期销售额" value={statsData.currentPeriod} prefix="¥" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="上期销售额" value={statsData.lastPeriod} prefix="¥" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic
                title="同比增长"
                value={statsData.yoyGrowth}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic
                title="环比增长"
                value={statsData.momGrowth}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* 同比环比图表 */}
        <Card title="同比/环比分析" style={{ marginBottom: 24 }}>
          <Column {...columnConfig} />
        </Card>

        {/* 排名变化 */}
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card title="门店订货排名变化">
              <Table
                dataSource={storeRankData}
                columns={rankColumns}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="供应商销售排名变化">
              <Table
                dataSource={supplierRankData}
                columns={rankColumns}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
}
