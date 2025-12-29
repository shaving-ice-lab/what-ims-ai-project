'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Button, Space, Tag, Progress, List } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  TruckOutlined,
  ShopOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import StoreLayout from '@/components/layouts/StoreLayout';

const { Title, Text } = Typography;

export default function StoreDashboard() {
  // 模拟数据
  const statsData = [
    {
      title: '本月订货金额',
      value: 268900,
      prefix: '¥',
      icon: <DollarOutlined />,
      color: '#1890ff',
      change: 12,
      trend: 'up',
    },
    {
      title: '本月订单数',
      value: 156,
      icon: <ShoppingCartOutlined />,
      color: '#52c41a',
      change: 8,
      trend: 'up',
    },
    {
      title: '待收货订单',
      value: 12,
      icon: <TruckOutlined />,
      color: '#fa8c16',
    },
    {
      title: '可用供应商',
      value: 24,
      icon: <ShopOutlined />,
      color: '#722ed1',
    },
  ];

  // 订货趋势数据
  const orderTrendData = Array.from({ length: 30 }, (_, i) => ({
    date: `01-${String(i + 1).padStart(2, '0')}`,
    amount: Math.floor(Math.random() * 10000) + 5000,
  }));

  // 供应商订货占比
  const supplierData = [
    { type: '生鲜供应商A', value: 35 },
    { type: '粮油供应商B', value: 25 },
    { type: '调味品供应商C', value: 18 },
    { type: '冷冻食品供应商D', value: 12 },
    { type: '其他', value: 10 },
  ];

  // 常购物料TOP10
  const frequentMaterials = [
    { name: '新鲜西红柿', count: 45, amount: 8900 },
    { name: '黄瓜', count: 42, amount: 6300 },
    { name: '土豆', count: 38, amount: 4560 },
    { name: '生菜', count: 35, amount: 5250 },
    { name: '胡萝卜', count: 32, amount: 3200 },
    { name: '大米', count: 28, amount: 8400 },
    { name: '食用油', count: 25, amount: 12500 },
    { name: '生抽', count: 24, amount: 2880 },
    { name: '鸡蛋', count: 22, amount: 4400 },
    { name: '猪肉', count: 20, amount: 16000 },
  ];

  // 待收货订单
  const pendingOrders = [
    {
      key: 1,
      orderNo: 'ORD202401290001',
      supplier: '生鲜供应商A',
      amount: 3580,
      status: 'delivering',
      deliveryTime: '今日 14:00',
    },
    {
      key: 2,
      orderNo: 'ORD202401290002',
      supplier: '粮油供应商B',
      amount: 2460,
      status: 'confirmed',
      deliveryTime: '今日 16:00',
    },
    {
      key: 3,
      orderNo: 'ORD202401290003',
      supplier: '调味品供应商C',
      amount: 1890,
      status: 'delivering',
      deliveryTime: '明日 09:00',
    },
  ];

  const lineConfig = {
    data: orderTrendData,
    xField: 'date',
    yField: 'amount',
    smooth: true,
    height: 200,
    yAxis: {
      label: {
        formatter: (v: string) => `¥${(Number(v) / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '订货金额',
        value: `¥${datum.amount.toLocaleString()}`,
      }),
    },
  };

  const pieConfig = {
    data: supplierData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    height: 200,
    label: {
      type: 'outer',
      content: '{percentage}',
    },
    legend: {
      position: 'bottom',
    },
  };

  return (
    <StoreLayout>
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
                    stat.trend && (
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
                          {Math.abs(stat.change!)}%
                        </span>
                      </Space>
                    )
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* 订货趋势和供应商占比 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={16}>
            <Card title="订货趋势（近30天）" bordered={false}>
              <Line {...lineConfig} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="供应商订货占比" bordered={false}>
              <Pie {...pieConfig} />
            </Card>
          </Col>
        </Row>

        {/* 常购物料和待收货订单 */}
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card 
              title="常购物料TOP10" 
              bordered={false}
              extra={<Button type="link">查看全部 <RightOutlined /></Button>}
            >
              <List
                dataSource={frequentMaterials}
                renderItem={(item, index) => (
                  <List.Item>
                    <Space style={{ width: '100%' }} size="large">
                      <Text strong>{index + 1}</Text>
                      <Text style={{ flex: 1 }}>{item.name}</Text>
                      <Text type="secondary">购买{item.count}次</Text>
                      <Text strong>¥{item.amount.toLocaleString()}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title="待收货订单" 
              bordered={false}
              extra={<Button type="link">查看全部 <RightOutlined /></Button>}
            >
              <Table
                dataSource={pendingOrders}
                columns={[
                  { 
                    title: '订单号', 
                    dataIndex: 'orderNo', 
                    key: 'orderNo',
                    render: (text: string) => <a>{text}</a>
                  },
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
                      const config: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
                        confirmed: { 
                          color: 'blue', 
                          text: '已确认',
                          icon: <CheckCircleOutlined />
                        },
                        delivering: { 
                          color: 'green', 
                          text: '配送中',
                          icon: <TruckOutlined />
                        },
                      };
                      const { color, text, icon } = config[status] || {};
                      return (
                        <Tag color={color}>
                          {icon} {text}
                        </Tag>
                      );
                    }
                  },
                  { 
                    title: '预计送达', 
                    dataIndex: 'deliveryTime', 
                    key: 'deliveryTime',
                    render: (time: string) => (
                      <Space>
                        <ClockCircleOutlined />
                        {time}
                      </Space>
                    )
                  },
                ]}
                pagination={false}
              />
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Space size="large">
                  <Button type="primary">立即订货</Button>
                  <Button>查看购物车</Button>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 快捷操作 */}
        <Card title="快捷操作" style={{ marginTop: 24 }}>
          <Space size="large">
            <Button type="primary" icon={<ShoppingCartOutlined />} size="large">
              在线订货
            </Button>
            <Button icon={<DollarOutlined />} size="large">
              市场行情
            </Button>
            <Button icon={<ClockCircleOutlined />} size="large">
              历史订单
            </Button>
            <Button icon={<ShopOutlined />} size="large">
              供应商列表
            </Button>
          </Space>
        </Card>
      </div>
    </StoreLayout>
  );
}
