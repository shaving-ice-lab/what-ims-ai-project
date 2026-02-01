'use client';

import { SyncOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { Title, Paragraph, Text } = Typography;

interface MarketItem {
  key: string;
  id: number;
  name: string;
  brand: string;
  spec: string;
  myPrice: number;
  marketLowest: number;
  priceDiff: number;
  status: 'lowest' | 'higher' | 'equal';
}

export default function SupplierMarketPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [lastUpdated] = useState('2024-01-29 14:30:00');

  // 分类选项
  const categoryOptions = [
    { value: '粮油', label: '粮油' },
    { value: '调味品', label: '调味品' },
  ];

  // 模拟市场数据
  const marketData: MarketItem[] = [
    {
      key: '1',
      id: 1,
      name: '金龙鱼大豆油',
      brand: '金龙鱼',
      spec: '5L/桶',
      myPrice: 56.0,
      marketLowest: 56.0,
      priceDiff: 0,
      status: 'lowest',
    },
    {
      key: '2',
      id: 2,
      name: '福临门花生油',
      brand: '福临门',
      spec: '5L/桶',
      myPrice: 68.0,
      marketLowest: 65.0,
      priceDiff: 4.6,
      status: 'higher',
    },
    {
      key: '3',
      id: 3,
      name: '中粮大米',
      brand: '中粮',
      spec: '10kg/袋',
      myPrice: 45.0,
      marketLowest: 45.0,
      priceDiff: 0,
      status: 'equal',
    },
    {
      key: '4',
      id: 4,
      name: '海天酱油',
      brand: '海天',
      spec: '500ml/瓶',
      myPrice: 12.5,
      marketLowest: 12.0,
      priceDiff: 4.2,
      status: 'higher',
    },
    {
      key: '5',
      id: 5,
      name: '太太乐鸡精',
      brand: '太太乐',
      spec: '200g/袋',
      myPrice: 8.8,
      marketLowest: 9.0,
      priceDiff: -2.2,
      status: 'lowest',
    },
  ];

  // 统计数据
  const lowestCount = marketData.filter((m) => m.status === 'lowest').length;
  const higherCount = marketData.filter((m) => m.status === 'higher').length;
  const equalCount = marketData.filter((m) => m.status === 'equal').length;

  // 刷新数据
  const handleRefresh = () => {
    message.success('数据已刷新');
  };

  // 快捷调价
  const handleQuickAdjust = (_id: number, newPrice: number) => {
    message.success(`已将价格调整为 ¥${newPrice.toFixed(2)}`);
  };

  // 状态标签配置
  const statusConfig: Record<string, { label: string; color: string }> = {
    lowest: { label: '最低价', color: 'green' },
    higher: { label: '价格偏高', color: 'red' },
    equal: { label: '价格持平', color: 'default' },
  };

  // 表格列定义
  const columns: ColumnsType<MarketItem> = [
    { title: '产品名称', dataIndex: 'name', key: 'name' },
    { title: '品牌', dataIndex: 'brand', key: 'brand' },
    { title: '规格', dataIndex: 'spec', key: 'spec' },
    {
      title: '您的报价',
      dataIndex: 'myPrice',
      key: 'myPrice',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '市场最低价',
      dataIndex: 'marketLowest',
      key: 'marketLowest',
      render: (price: number) => <Text type="success">¥{price.toFixed(2)}</Text>,
    },
    {
      title: '价差',
      dataIndex: 'priceDiff',
      key: 'priceDiff',
      render: (diff: number) => (
        <span style={{ color: diff > 0 ? '#ff4d4f' : diff < 0 ? '#52c41a' : undefined }}>
          {diff > 0 ? '+' : ''}
          {diff.toFixed(1)}%
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = statusConfig[status];
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) =>
        record.status === 'higher' ? (
          <Button
            type="link"
            size="small"
            onClick={() => handleQuickAdjust(record.id, record.marketLowest)}
          >
            调至最低价
          </Button>
        ) : null,
    },
  ];

  // 过滤数据
  const filteredData = marketData.filter((item) => {
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            市场行情
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            了解您的产品在市场中的价格竞争力
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Text type="secondary">更新时间：{lastUpdated}</Text>
            <Button icon={<SyncOutlined />} onClick={handleRefresh}>
              刷新数据
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="在售产品" value={marketData.length} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="价格最低" value={lowestCount} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="价格偏高" value={higherCount} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="价格持平" value={equalCount} />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* 筛选栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="价格状态"
              style={{ width: '100%' }}
              options={[
                { value: null, label: '全部状态' },
                { value: 'lowest', label: '价格最低' },
                { value: 'higher', label: '价格偏高' },
                { value: 'equal', label: '价格持平' },
              ]}
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="分类筛选"
              style={{ width: '100%' }}
              options={[{ value: null, label: '全部分类' }, ...categoryOptions]}
              value={filterCategory}
              onChange={setFilterCategory}
              allowClear
            />
          </Col>
        </Row>

        {/* 产品列表 */}
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 个产品` }}
          rowClassName={(record) =>
            record.status === 'lowest'
              ? 'row-lowest'
              : record.status === 'higher'
                ? 'row-higher'
                : ''
          }
        />
      </Card>
    </div>
  );
}
