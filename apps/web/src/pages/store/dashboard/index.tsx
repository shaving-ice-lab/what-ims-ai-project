import MainLayout from '@/components/layouts/MainLayout';
import {
    ClockCircleOutlined,
    DollarOutlined,
    PlusOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    SyncOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import { Button, Card, Col, List, Row, Space, Statistic, Table, Tag } from 'antd';
import React from 'react';
import styles from './dashboard.module.css';

const StoreDashboard: React.FC = () => {
  // 模拟数据 - 实际应从API获取
  const stats = {
    monthlyOrders: 86,
    totalSpending: 125678.90,
    monthlySpending: 28456.50,
    pendingOrders: 3,
    deliveringOrders: 5,
    completedOrders: 78,
    cartItems: 8,
    frequentSuppliers: 5,
  };

  const spendingTrend = [
    { date: '06-01', value: 1250 },
    { date: '06-05', value: 2100 },
    { date: '06-10', value: 1800 },
    { date: '06-15', value: 3200 },
    { date: '06-20', value: 2800 },
    { date: '06-25', value: 4500 },
    { date: '06-30', value: 3800 },
  ];

  const categorySpending = [
    { type: '蔬菜类', value: 8500 },
    { type: '肉类', value: 12000 },
    { type: '水产类', value: 6800 },
    { type: '调料类', value: 3200 },
    { type: '饮料类', value: 4500 },
  ];

  const recentOrders = [
    {
      id: 'PO001',
      supplier: '北京生鲜供应商',
      amount: 2345.67,
      items: 8,
      status: 'delivered',
      date: '2024-06-28',
    },
    {
      id: 'PO002',
      supplier: '上海食品供应商',
      amount: 3456.78,
      items: 12,
      status: 'delivering',
      date: '2024-06-29',
    },
    {
      id: 'PO003',
      supplier: '天津蔬菜供应商',
      amount: 1234.56,
      items: 5,
      status: 'pending',
      date: '2024-06-29',
    },
  ];

  const frequentSuppliers = [
    { name: '北京生鲜供应商', orders: 23, amount: 45678.90 },
    { name: '上海食品供应商', orders: 18, amount: 38900.50 },
    { name: '天津蔬菜供应商', orders: 15, amount: 28450.00 },
    { name: '河北肉类供应商', orders: 12, amount: 35600.00 },
    { name: '山东调料供应商', orders: 10, amount: 12800.00 },
  ];

  const statusMap: Record<string, { color: string; text: string }> = {
    pending: { color: 'gold', text: '待确认' },
    confirmed: { color: 'blue', text: '已确认' },
    delivering: { color: 'cyan', text: '配送中' },
    delivered: { color: 'green', text: '已送达' },
    completed: { color: 'default', text: '已完成' },
  };

  const lowStockItems = [
    { name: '西红柿', current: 5, min: 20, unit: 'kg' },
    { name: '牛肉', current: 10, min: 30, unit: 'kg' },
    { name: '生菜', current: 3, min: 15, unit: 'kg' },
    { name: '食用油', current: 2, min: 10, unit: '桶' },
  ];

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h1 className={styles.title}>门店数据概览</h1>
          <Space>
            <Button type="primary" icon={<ShoppingOutlined />} href="/store/order">
              去订货
            </Button>
            <Button icon={<ShoppingCartOutlined />} href="/store/cart">
              购物车({stats.cartItems})
            </Button>
          </Space>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="本月订单"
                value={stats.monthlyOrders}
                prefix={<ShoppingCartOutlined />}
              />
              <div className={styles.cardFooter}>
                待收货: {stats.deliveringOrders}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="本月支出"
                value={stats.monthlySpending}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="元"
              />
              <div className={styles.cardFooter}>
                总支出: ¥{stats.totalSpending.toFixed(2)}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="待处理"
                value={stats.pendingOrders}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
              <div className={styles.cardFooter}>
                需要确认收货
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="常用供应商"
                value={stats.frequentSuppliers}
                prefix={<TeamOutlined />}
              />
              <div className={styles.cardFooter}>
                本月合作供应商
              </div>
            </Card>
          </Col>
        </Row>

        {/* 库存预警 */}
        <Card 
          title="库存预警" 
          extra={<Button type="link" icon={<PlusOutlined />}>补货</Button>}
          style={{ marginTop: 16 }}
        >
          <List
            dataSource={lowStockItems}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button type="primary" size="small">立即补货</Button>
                ]}
              >
                <List.Item.Meta
                  title={<span style={{ color: '#ff4d4f' }}>{item.name}</span>}
                  description={`当前库存: ${item.current}${item.unit} / 最低库存: ${item.min}${item.unit}`}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* 图表区域 */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={14}>
            <Card title="本月支出趋势" extra={<SyncOutlined />}>
              <Line
                data={spendingTrend}
                xField="date"
                yField="value"
                smooth={true}
                point={{
                  size: 3,
                }}
                animation={{
                  appear: {
                    animation: 'path-in',
                    duration: 1000,
                  },
                }}
                height={250}
              />
            </Card>
          </Col>
          <Col xs={24} lg={10}>
            <Card title="品类支出分布" extra={<SyncOutlined />}>
              <Pie
                data={categorySpending}
                angleField="value"
                colorField="type"
                radius={0.8}
                label={{
                  type: 'outer',
                  content: '{name} {percentage}',
                }}
                height={250}
              />
            </Card>
          </Col>
        </Row>

        {/* 最近订单 */}
        <Card 
          title="最近订单" 
          extra={<a href="/store/orders">查看全部</a>} 
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
                  <Tag color={statusMap[status]?.color || 'default'}>
                    {statusMap[status]?.text || status}
                  </Tag>
                ),
              },
              {
                title: '下单日期',
                dataIndex: 'date',
                key: 'date',
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <Space>
                    {record.status === 'delivered' && (
                      <a>确认收货</a>
                    )}
                    <a>查看详情</a>
                  </Space>
                ),
              },
            ]}
          />
        </Card>

        {/* 常用供应商 */}
        <Card 
          title="常用供应商" 
          extra={<a href="/store/order">查看更多</a>} 
          style={{ marginTop: 16 }}
        >
          <Table
            dataSource={frequentSuppliers}
            rowKey="name"
            pagination={false}
            size="small"
            columns={[
              {
                title: '供应商',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: '本月订单',
                dataIndex: 'orders',
                key: 'orders',
                align: 'center',
              },
              {
                title: '累计金额',
                dataIndex: 'amount',
                key: 'amount',
                align: 'right',
                render: (value) => `¥${value.toLocaleString()}`,
              },
              {
                title: '操作',
                key: 'action',
                render: () => (
                  <Button type="link" size="small">去订货</Button>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default StoreDashboard;
