import MainLayout from '@/components/layouts/MainLayout';
import {
    DollarOutlined,
    RiseOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    SyncOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import { Card, Col, Progress, Row, Statistic, Table, Tag } from 'antd';
import React from 'react';
import styles from './dashboard.module.css';

const AdminDashboard: React.FC = () => {
  // 模拟数据 - 实际应从API获取
  const stats = {
    totalOrders: 1234,
    monthlyOrders: 456,
    totalRevenue: 1234567.89,
    monthlyRevenue: 456789.12,
    totalSuppliers: 28,
    activeSuppliers: 25,
    totalStores: 156,
    activeStores: 148,
  };

  const orderTrend = [
    { month: '1月', value: 320, type: '订单数' },
    { month: '2月', value: 432, type: '订单数' },
    { month: '3月', value: 401, type: '订单数' },
    { month: '4月', value: 534, type: '订单数' },
    { month: '5月', value: 590, type: '订单数' },
    { month: '6月', value: 630, type: '订单数' },
  ];

  const categoryDistribution = [
    { type: '蔬菜类', value: 27 },
    { type: '肉类', value: 25 },
    { type: '水产类', value: 18 },
    { type: '调料类', value: 15 },
    { type: '其他', value: 15 },
  ];

  const recentOrders = [
    {
      id: 'ORD001',
      store: '星巴克中关村店',
      supplier: '北京生鲜供应商',
      amount: 5678.90,
      status: 'pending',
      time: '10分钟前',
    },
    {
      id: 'ORD002',
      store: '麦当劳西单店',
      supplier: '上海食品供应商',
      amount: 3456.78,
      status: 'confirmed',
      time: '30分钟前',
    },
    {
      id: 'ORD003',
      store: '肯德基朝阳店',
      supplier: '天津蔬菜供应商',
      amount: 8901.23,
      status: 'delivered',
      time: '1小时前',
    },
  ];

  const statusMap: Record<string, { color: string; text: string }> = {
    pending: { color: 'gold', text: '待确认' },
    confirmed: { color: 'blue', text: '已确认' },
    delivered: { color: 'green', text: '已配送' },
    completed: { color: 'default', text: '已完成' },
  };

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <h1 className={styles.title}>数据概览</h1>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="总订单数"
                value={stats.totalOrders}
                prefix={<ShoppingCartOutlined />}
                suffix={
                  <span className={styles.trend}>
                    <RiseOutlined style={{ color: '#52c41a' }} />
                    12%
                  </span>
                }
              />
              <div className={styles.cardFooter}>
                本月: {stats.monthlyOrders}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="总营收"
                value={stats.totalRevenue}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="元"
              />
              <div className={styles.cardFooter}>
                本月: ¥{stats.monthlyRevenue.toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="供应商"
                value={stats.activeSuppliers}
                suffix={`/ ${stats.totalSuppliers}`}
                prefix={<TeamOutlined />}
              />
              <Progress 
                percent={Math.round((stats.activeSuppliers / stats.totalSuppliers) * 100)} 
                showInfo={false}
                strokeColor="#1890ff"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="门店"
                value={stats.activeStores}
                suffix={`/ ${stats.totalStores}`}
                prefix={<ShopOutlined />}
              />
              <Progress 
                percent={Math.round((stats.activeStores / stats.totalStores) * 100)} 
                showInfo={false}
                strokeColor="#52c41a"
              />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={16}>
            <Card title="订单趋势" extra={<SyncOutlined />}>
              <Line
                data={orderTrend}
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
          <Col xs={24} lg={8}>
            <Card title="品类分布" extra={<SyncOutlined />}>
              <Pie
                data={categoryDistribution}
                angleField="value"
                colorField="type"
                radius={0.8}
                label={{
                  type: 'outer',
                  content: '{name} {percentage}',
                }}
                interactions={[
                  {
                    type: 'pie-legend-active',
                  },
                  {
                    type: 'element-active',
                  },
                ]}
                height={300}
              />
            </Card>
          </Col>
        </Row>

        {/* 最近订单 */}
        <Card title="最近订单" extra={<a href="/admin/orders">查看全部</a>} style={{ marginTop: 16 }}>
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
                title: '供应商',
                dataIndex: 'supplier',
                key: 'supplier',
              },
              {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                render: (amount) => `¥${amount.toFixed(2)}`,
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => (
                  <Tag color={statusMap[status]?.color || 'default'}>
                    {statusMap[status]?.text || status}
                  </Tag>
                ),
              },
              {
                title: '时间',
                dataIndex: 'time',
                key: 'time',
              },
            ]}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
