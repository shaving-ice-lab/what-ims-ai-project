'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Progress, Space } from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/charts';
import AdminLayout from '@/components/layouts/AdminLayout';

const { Title, Text } = Typography;

export default function AdminDashboard() {
  // 模拟数据
  const statsData = [
    {
      title: '总门店数',
      value: 128,
      icon: <HomeOutlined />,
      color: '#1890ff',
      change: 12,
      trend: 'up',
    },
    {
      title: '总供应商数',
      value: 56,
      icon: <ShopOutlined />,
      color: '#52c41a',
      change: 8,
      trend: 'up',
    },
    {
      title: '今日订单数',
      value: 234,
      icon: <ShoppingCartOutlined />,
      color: '#fa8c16',
      change: -5,
      trend: 'down',
    },
    {
      title: '今日交易额',
      value: 568900,
      prefix: '¥',
      icon: <DollarOutlined />,
      color: '#eb2f96',
      change: 15,
      trend: 'up',
    },
  ];

  // 订单趋势数据
  const orderTrendData = Array.from({ length: 30 }, (_, i) => ({
    date: `2024-01-${String(i + 1).padStart(2, '0')}`,
    orders: Math.floor(Math.random() * 300) + 150,
    amount: Math.floor(Math.random() * 100000) + 50000,
  }));

  // 供应商销售排行
  const supplierRankData = [
    { name: '生鲜供应商A', sales: 238900, orders: 89 },
    { name: '粮油供应商B', sales: 198700, orders: 76 },
    { name: '调味品供应商C', sales: 156200, orders: 64 },
    { name: '冷冻食品供应商D', sales: 134500, orders: 52 },
    { name: '饮料供应商E', sales: 112300, orders: 48 },
  ];

  // 分类销售占比
  const categorySalesData = [
    { type: '生鲜', value: 35 },
    { type: '粮油', value: 25 },
    { type: '调味品', value: 18 },
    { type: '冷冻食品', value: 12 },
    { type: '饮料', value: 10 },
  ];

  const lineConfig = {
    data: orderTrendData,
    xField: 'date',
    yField: 'amount',
    smooth: true,
    height: 300,
    yAxis: {
      label: {
        formatter: (v: string) => `¥${(Number(v) / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '交易额',
        value: `¥${datum.amount.toLocaleString()}`,
      }),
    },
  };

  const pieConfig = {
    data: categorySalesData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    height: 300,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
  };

  const columnConfig = {
    data: supplierRankData.map(item => ({
      ...item,
      name: item.name.replace('供应商', ''),
    })),
    xField: 'name',
    yField: 'sales',
    height: 300,
    yAxis: {
      label: {
        formatter: (v: string) => `¥${(Number(v) / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '销售额',
        value: `¥${datum.sales.toLocaleString()}`,
      }),
    },
  };

  return (
    <AdminLayout>
      <div>
        <Title level={3}>数据看板</Title>
        
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          {statsData.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.prefix}
                  valueStyle={{ color: stat.color }}
                  suffix={
                    <Space size={4}>
                      {stat.trend === 'up' ? (
                        <RiseOutlined style={{ color: '#52c41a' }} />
                      ) : (
                        <FallOutlined style={{ color: '#ff4d4f' }} />
                      )}
                      <span style={{ 
                        fontSize: 14, 
                        color: stat.trend === 'up' ? '#52c41a' : '#ff4d4f' 
                      }}>
                        {Math.abs(stat.change)}%
                      </span>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* 图表区域 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={16}>
            <Card title="订单趋势（近30天）" bordered={false}>
              <Line {...lineConfig} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="分类销售占比" bordered={false}>
              <Pie {...pieConfig} />
            </Card>
          </Col>
        </Row>

        {/* 供应商销售排行 */}
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card title="供应商销售排行TOP5" bordered={false}>
              <Column {...columnConfig} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="最新订单" bordered={false}>
              <Table
                dataSource={[
                  { key: 1, orderNo: 'ORD202401290001', store: '门店A', supplier: '生鲜供应商A', amount: 3580, status: '待确认' },
                  { key: 2, orderNo: 'ORD202401290002', store: '门店B', supplier: '粮油供应商B', amount: 2460, status: '配送中' },
                  { key: 3, orderNo: 'ORD202401290003', store: '门店C', supplier: '调味品供应商C', amount: 1890, status: '已完成' },
                  { key: 4, orderNo: 'ORD202401290004', store: '门店D', supplier: '冷冻食品供应商D', amount: 4520, status: '待确认' },
                  { key: 5, orderNo: 'ORD202401290005', store: '门店E', supplier: '饮料供应商E', amount: 980, status: '配送中' },
                ]}
                columns={[
                  { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
                  { title: '门店', dataIndex: 'store', key: 'store' },
                  { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
                  { 
                    title: '金额', 
                    dataIndex: 'amount', 
                    key: 'amount',
                    render: (value: number) => `¥${value.toLocaleString()}`
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status: string) => {
                      const colors: Record<string, string> = {
                        '待确认': 'orange',
                        '配送中': 'blue',
                        '已完成': 'green',
                      };
                      return <span style={{ color: colors[status] }}>{status}</span>;
                    }
                  }
                ]}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
}
