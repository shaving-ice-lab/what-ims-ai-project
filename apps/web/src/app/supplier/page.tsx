'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Badge, Button, Space, Tag } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/charts';
import SupplierLayout from '@/components/layouts/SupplierLayout';

const { Title, Text } = Typography;

export default function SupplierDashboard() {
  // 模拟数据
  const statsData = [
    {
      title: '待处理订单',
      value: 8,
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
    },
    {
      title: '今日订单数',
      value: 42,
      icon: <ShoppingCartOutlined />,
      color: '#1890ff',
    },
    {
      title: '今日销售额',
      value: 58900,
      prefix: '¥',
      icon: <DollarOutlined />,
      color: '#52c41a',
    },
    {
      title: '本月销售额',
      value: 1258900,
      prefix: '¥',
      icon: <DollarOutlined />,
      color: '#722ed1',
    },
  ];

  // 待处理订单
  const pendingOrders = [
    {
      key: 1,
      orderNo: 'ORD202401290001',
      store: '星光超市',
      items: 15,
      amount: 3580,
      expectedDelivery: '2024-01-30',
      orderTime: '2024-01-29 08:30',
      status: 'pending',
    },
    {
      key: 2,
      orderNo: 'ORD202401290002',
      store: '便民生活超市',
      items: 8,
      amount: 2460,
      expectedDelivery: '2024-01-30',
      orderTime: '2024-01-29 09:15',
      status: 'pending',
    },
    {
      key: 3,
      orderNo: 'ORD202401290003',
      store: '社区便利店',
      items: 12,
      amount: 1890,
      expectedDelivery: '2024-01-31',
      orderTime: '2024-01-29 10:00',
      status: 'pending',
    },
  ];

  // 销售趋势数据
  const salesTrendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
      sales: Math.floor(Math.random() * 50000) + 30000,
      orders: Math.floor(Math.random() * 50) + 20,
    };
  });

  // 热销商品排行
  const hotProducts = [
    { name: '新鲜西红柿', sales: 580, unit: 'kg', amount: 3480 },
    { name: '黄瓜', sales: 420, unit: 'kg', amount: 2100 },
    { name: '土豆', sales: 350, unit: 'kg', amount: 1400 },
    { name: '生菜', sales: 280, unit: 'kg', amount: 1960 },
    { name: '胡萝卜', sales: 260, unit: 'kg', amount: 1040 },
  ];

  const lineConfig = {
    data: salesTrendData,
    xField: 'date',
    yField: 'sales',
    smooth: true,
    height: 250,
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

  const columnConfig = {
    data: hotProducts,
    xField: 'name',
    yField: 'amount',
    height: 250,
    yAxis: {
      label: {
        formatter: (v: string) => `¥${v}`,
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '销售额',
        value: `¥${datum.amount.toLocaleString()}`,
      }),
    },
  };

  return (
    <SupplierLayout>
      <div>
        <Title level={3}>订单概览</Title>
        
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
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* 待处理订单 */}
        <Card 
          title={
            <Space>
              <span>待处理订单</span>
              <Badge count={pendingOrders.length} style={{ backgroundColor: '#ff4d4f' }} />
            </Space>
          } 
          bordered={false} 
          style={{ marginBottom: 24 }}
        >
          <Table
            dataSource={pendingOrders}
            columns={[
              { 
                title: '订单编号', 
                dataIndex: 'orderNo', 
                key: 'orderNo',
                render: (text: string) => <a>{text}</a>
              },
              { title: '门店名称', dataIndex: 'store', key: 'store' },
              { 
                title: '商品数', 
                dataIndex: 'items', 
                key: 'items',
                render: (value: number) => `${value}件`
              },
              { 
                title: '金额', 
                dataIndex: 'amount', 
                key: 'amount',
                render: (value: number) => <Text strong>¥{value.toLocaleString()}</Text>
              },
              { 
                title: '期望配送', 
                dataIndex: 'expectedDelivery', 
                key: 'expectedDelivery',
                render: (date: string) => <Tag color="blue">{date}</Tag>
              },
              {
                title: '操作',
                key: 'action',
                render: (_: any, record: any) => (
                  <Space>
                    <Button type="primary" size="small" icon={<CheckCircleOutlined />}>
                      确认订单
                    </Button>
                    <Button size="small" icon={<EyeOutlined />}>
                      查看详情
                    </Button>
                    <Button size="small" icon={<PrinterOutlined />}>
                      打印
                    </Button>
                  </Space>
                ),
              },
            ]}
            pagination={false}
          />
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button type="primary">批量确认</Button>
          </div>
        </Card>

        {/* 图表区域 */}
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card title="近7天销售趋势" bordered={false}>
              <Line {...lineConfig} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="热销商品TOP5" bordered={false}>
              <Column {...columnConfig} />
            </Card>
          </Col>
        </Row>
      </div>
    </SupplierLayout>
  );
}
