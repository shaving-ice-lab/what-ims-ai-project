'use client';

import { Line } from '@ant-design/charts';
import { ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Table, Tabs, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;

interface PriceAlertItem {
  key: string;
  id: number;
  productName: string;
  brand: string;
  supplierName: string;
  currentPrice: number;
  previousPrice: number;
  changeRate: number;
  alertType: 'high' | 'low' | 'anomaly';
  alertTime: string;
}

interface ExclusiveItem {
  key: string;
  id: number;
  productName: string;
  brand: string;
  spec: string;
  supplierName: string;
  price: number;
  duration: number;
}

export default function PriceAlertsPage() {
  // 模拟价格异常预警数据
  const alertData: PriceAlertItem[] = [
    {
      key: '1',
      id: 1,
      productName: '金龙鱼大豆油5L',
      brand: '金龙鱼',
      supplierName: '粮油供应商C',
      currentPrice: 72.0,
      previousPrice: 58.0,
      changeRate: 24.1,
      alertType: 'high',
      alertTime: '2024-01-29 10:30',
    },
    {
      key: '2',
      id: 2,
      productName: '海天酱油500ml',
      brand: '海天',
      supplierName: '调味品供应商B',
      currentPrice: 8.0,
      previousPrice: 12.5,
      changeRate: -36.0,
      alertType: 'low',
      alertTime: '2024-01-29 09:15',
    },
    {
      key: '3',
      id: 3,
      productName: '福临门花生油5L',
      brand: '福临门',
      supplierName: '粮油供应商E',
      currentPrice: 95.0,
      previousPrice: 68.0,
      changeRate: 39.7,
      alertType: 'anomaly',
      alertTime: '2024-01-28 16:45',
    },
  ];

  // 模拟独家供应产品数据
  const exclusiveData: ExclusiveItem[] = [
    {
      key: '1',
      id: 1,
      productName: '特供有机大米',
      brand: '中粮',
      spec: '10kg/袋',
      supplierName: '粮油供应商A',
      price: 89.0,
      duration: 30,
    },
    {
      key: '2',
      id: 2,
      productName: '进口橄榄油',
      brand: '贝蒂斯',
      spec: '500ml/瓶',
      supplierName: '进口食品供应商',
      price: 68.0,
      duration: 45,
    },
    {
      key: '3',
      id: 3,
      productName: '高端矿泉水',
      brand: '依云',
      spec: '500ml*24',
      supplierName: '饮料供应商A',
      price: 120.0,
      duration: 60,
    },
  ];

  // 模拟价格趋势数据
  const trendData = [
    { date: '01-01', category: '粮油', avgPrice: 55 },
    { date: '01-05', category: '粮油', avgPrice: 56 },
    { date: '01-10', category: '粮油', avgPrice: 58 },
    { date: '01-15', category: '粮油', avgPrice: 57 },
    { date: '01-20', category: '粮油', avgPrice: 59 },
    { date: '01-25', category: '粮油', avgPrice: 60 },
    { date: '01-29', category: '粮油', avgPrice: 58 },
    { date: '01-01', category: '调味品', avgPrice: 12 },
    { date: '01-05', category: '调味品', avgPrice: 12.5 },
    { date: '01-10', category: '调味品', avgPrice: 13 },
    { date: '01-15', category: '调味品', avgPrice: 12.8 },
    { date: '01-20', category: '调味品', avgPrice: 13.2 },
    { date: '01-25', category: '调味品', avgPrice: 13.5 },
    { date: '01-29', category: '调味品', avgPrice: 13 },
  ];

  // 预警类型标签
  const alertTypeLabels: Record<string, { label: string; color: string }> = {
    high: { label: '价格过高', color: 'red' },
    low: { label: '价格过低', color: 'orange' },
    anomaly: { label: '异常波动', color: 'purple' },
  };

  // 预警表格列
  const alertColumns: ColumnsType<PriceAlertItem> = [
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: '当前价格',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '原价格',
      dataIndex: 'previousPrice',
      key: 'previousPrice',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '变动率',
      dataIndex: 'changeRate',
      key: 'changeRate',
      render: (rate: number) => (
        <span style={{ color: rate > 0 ? '#ff4d4f' : '#52c41a' }}>
          {rate > 0 ? '+' : ''}
          {rate.toFixed(1)}%
        </span>
      ),
    },
    {
      title: '预警类型',
      dataIndex: 'alertType',
      key: 'alertType',
      render: (type: string) => {
        const config = alertTypeLabels[type];
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: '预警时间',
      dataIndex: 'alertTime',
      key: 'alertTime',
    },
  ];

  // 独家供应表格列
  const exclusiveColumns: ColumnsType<ExclusiveItem> = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '独家供应天数',
      dataIndex: 'duration',
      key: 'duration',
      render: (days: number) => <Tag color={days > 30 ? 'orange' : 'default'}>{days}天</Tag>,
    },
  ];

  // 趋势图配置
  const lineConfig = {
    data: trendData,
    xField: 'date',
    yField: 'avgPrice',
    seriesField: 'category',
    smooth: true,
    height: 300,
  };

  const tabItems = [
    {
      key: 'alerts',
      label: (
        <Space>
          <WarningOutlined />
          价格异常预警
          <Tag color="red">{alertData.length}</Tag>
        </Space>
      ),
      children: <Table dataSource={alertData} columns={alertColumns} pagination={false} />,
    },
    {
      key: 'exclusive',
      label: (
        <Space>
          <ExclamationCircleOutlined />
          独家供应产品
          <Tag color="orange">{exclusiveData.length}</Tag>
        </Space>
      ),
      children: <Table dataSource={exclusiveData} columns={exclusiveColumns} pagination={false} />,
    },
  ];

  return (
    <AdminLayout>
      <div>
        <Title level={3}>价格预警管理</Title>
        <Paragraph type="secondary">监控价格异常波动和独家供应产品，及时发现市场风险</Paragraph>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} md={6}>
            <Card size="small">
              <Statistic
                title="价格过高预警"
                value={alertData.filter((a) => a.alertType === 'high').length}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card size="small">
              <Statistic
                title="价格过低预警"
                value={alertData.filter((a) => a.alertType === 'low').length}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card size="small">
              <Statistic
                title="异常波动"
                value={alertData.filter((a) => a.alertType === 'anomaly').length}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card size="small">
              <Statistic
                title="独家供应产品"
                value={exclusiveData.length}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 预警列表 */}
        <Card style={{ marginBottom: 24 }}>
          <Tabs items={tabItems} />
        </Card>

        {/* 价格趋势图 */}
        <Card title="分类价格趋势（近30天）">
          <Line {...lineConfig} />
        </Card>
      </div>
    </AdminLayout>
  );
}
