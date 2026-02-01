import MainLayout from '@/components/layouts/MainLayout';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    RiseOutlined,
    ShoppingCartOutlined,
    SyncOutlined,
    TruckOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import { Card, Col, Progress, Row, Space, Statistic, Table, Tag } from 'antd';
import React from 'react';
import styles from './dashboard.module.css';

const SupplierDashboard: React.FC = () => {
  // 模拟数据 - 实际应从API获取
  const stats = {
    totalOrders: 856,
    monthlyOrders: 128,
    totalRevenue: 985432.50,
    monthlyRevenue: 156789.30,
    pendingOrders: 15,
    deliveringOrders: 8,
    completedOrders: 833,
    completionRate: 97.3,
  };

  const monthlyTrend = [
    { month: '1月', value: 85000, type: '收入' },
    { month: '2月', value: 92000, type: '收入' },
    { month: '3月', value: 88000, type: '收入' },
    { month: '4月', value: 105000, type: '收入' },
    { month: '5月', value: 112000, type: '收入' },
    { month: '6月', value: 128000, type: '收入' },
  ];

  const topProducts = [
    { name: '新鲜蔬菜', quantity: 1250, revenue: 45000 },
    { name: '优质肉类', quantity: 850, revenue: 68000 },
    { name: '海鲜水产', quantity: 620, revenue: 55000 },
    { name: '调味料', quantity: 1800, revenue: 23000 },
    { name: '粮油类', quantity: 950, revenue: 31000 },
  ];

  const recentOrders = [
    {
      id: 'SO001',
      store: '星巴克中关村店',
      amount: 3456.78,
      items: 12,
      status: 'pending',
      time: '5分钟前',
    },
    {
      id: 'SO002',
      store: '麦当劳西单店',
      amount: 2345.67,
      items: 8,
      status: 'confirmed',
      time: '15分钟前',
    },
    {
      id: 'SO003',
      store: '肯德基朝阳店',
      amount: 4567.89,
      items: 15,
      status: 'delivering',
      time: '30分钟前',
    },
    {
      id: 'SO004',
      store: '必胜客国贸店',
      amount: 1234.56,
      items: 6,
      status: 'completed',
      time: '1小时前',
    },
  ];

  const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
    pending: { color: 'gold', text: '待确认', icon: <ClockCircleOutlined /> },
    confirmed: { color: 'blue', text: '已确认', icon: <CheckCircleOutlined /> },
    delivering: { color: 'cyan', text: '配送中', icon: <TruckOutlined /> },
    completed: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
  };

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <h1 className={styles.title}>供应商数据概览</h1>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="待处理订单"
                value={stats.pendingOrders}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
              <div className={styles.cardFooter}>
                需要及时处理
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="配送中订单"
                value={stats.deliveringOrders}
                prefix={<TruckOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <div className={styles.cardFooter}>
                正在配送路上
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="本月订单"
                value={stats.monthlyOrders}
                prefix={<ShoppingCartOutlined />}
                suffix={
                  <span className={styles.trend}>
                    <RiseOutlined style={{ color: '#52c41a' }} />
                    15%
                  </span>
                }
              />
              <div className={styles.cardFooter}>
                总订单: {stats.totalOrders}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="本月收入"
                value={stats.monthlyRevenue}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="元"
              />
              <div className={styles.cardFooter}>
                总收入: ¥{stats.totalRevenue.toFixed(2)}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={14}>
            <Card title="月度收入趋势" extra={<SyncOutlined />}>
              <Line
                data={monthlyTrend}
                xField="month"
                yField="value"
                seriesField="type"
                smooth={true}
                animation={{
                  appear: {
                    animation: 'path-in',
                    duration: 1000,
                  },
                }}
                height={300}
              />
            </Card>
          </Col>
          <Col xs={24} lg={10}>
            <Card title="热销产品TOP5" extra={<SyncOutlined />}>
              <Table
                dataSource={topProducts}
                rowKey="name"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: '产品',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: '销量',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    align: 'right',
                  },
                  {
                    title: '收入',
                    dataIndex: 'revenue',
                    key: 'revenue',
                    align: 'right',
                    render: (value) => `¥${value.toLocaleString()}`,
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>

        {/* 最近订单 */}
        <Card 
          title="待处理订单" 
          extra={<a href="/supplier/orders">查看全部</a>} 
          style={{ marginTop: 16 }}
        >
          <Table
            dataSource={recentOrders}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: '订单号',
                dataIndex: 'id',
                key: 'id',
                render: (text) => <a>{text}</a>,
              },
              {
                title: '门店',
                dataIndex: 'store',
                key: 'store',
              },
              {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                render: (amount) => `¥${amount.toFixed(2)}`,
              },
              {
                title: '商品数',
                dataIndex: 'items',
                key: 'items',
                align: 'center',
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => (
                  <Tag 
                    color={statusMap[status]?.color || 'default'} 
                    icon={statusMap[status]?.icon}
                  >
                    {statusMap[status]?.text || status}
                  </Tag>
                ),
              },
              {
                title: '时间',
                dataIndex: 'time',
                key: 'time',
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <Space>
                    {record.status === 'pending' && (
                      <a>确认订单</a>
                    )}
                    {record.status === 'confirmed' && (
                      <a>开始配送</a>
                    )}
                    <a>查看详情</a>
                  </Space>
                ),
              },
            ]}
          />
        </Card>

        {/* 完成率统计 */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="订单完成率"
                value={stats.completionRate}
                precision={1}
                suffix="%"
                prefix={<CheckCircleOutlined />}
              />
              <Progress 
                percent={stats.completionRate} 
                strokeColor="#52c41a"
                showInfo={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default SupplierDashboard;
