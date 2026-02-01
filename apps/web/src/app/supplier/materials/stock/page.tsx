'use client';

import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Row,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';

const { Title, Paragraph } = Typography;

interface StockItem {
  key: string;
  id: number;
  name: string;
  brand: string;
  spec: string;
  category: string;
  inStock: boolean;
  lastUpdated: string;
}

export default function SupplierStockPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 模拟库存数据
  const [stockData, setStockData] = useState<StockItem[]>([
    {
      key: '1',
      id: 1,
      name: '金龙鱼大豆油',
      brand: '金龙鱼',
      spec: '5L/桶',
      category: '粮油',
      inStock: true,
      lastUpdated: '2024-01-29 10:00',
    },
    {
      key: '2',
      id: 2,
      name: '福临门花生油',
      brand: '福临门',
      spec: '5L/桶',
      category: '粮油',
      inStock: true,
      lastUpdated: '2024-01-29 09:30',
    },
    {
      key: '3',
      id: 3,
      name: '中粮大米',
      brand: '中粮',
      spec: '10kg/袋',
      category: '粮油',
      inStock: true,
      lastUpdated: '2024-01-28 16:00',
    },
    {
      key: '4',
      id: 4,
      name: '海天酱油',
      brand: '海天',
      spec: '500ml/瓶',
      category: '调味品',
      inStock: false,
      lastUpdated: '2024-01-28 14:00',
    },
    {
      key: '5',
      id: 5,
      name: '太太乐鸡精',
      brand: '太太乐',
      spec: '200g/袋',
      category: '调味品',
      inStock: true,
      lastUpdated: '2024-01-27 11:00',
    },
  ]);

  // 统计数据
  const inStockCount = stockData.filter((s) => s.inStock).length;
  const outOfStockCount = stockData.filter((s) => !s.inStock).length;

  // 切换库存状态
  const handleToggleStock = (id: number, inStock: boolean) => {
    setStockData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, inStock, lastUpdated: new Date().toLocaleString('zh-CN') }
          : item
      )
    );
    message.success(`已设置为${inStock ? '有货' : '缺货'}`);
  };

  // 批量设置有货
  const handleBatchInStock = () => {
    setStockData((prev) =>
      prev.map((item) =>
        selectedRowKeys.includes(item.key)
          ? { ...item, inStock: true, lastUpdated: new Date().toLocaleString('zh-CN') }
          : item
      )
    );
    setSelectedRowKeys([]);
    message.success(`已批量设置 ${selectedRowKeys.length} 个物料为有货`);
  };

  // 批量设置缺货
  const handleBatchOutOfStock = () => {
    setStockData((prev) =>
      prev.map((item) =>
        selectedRowKeys.includes(item.key)
          ? { ...item, inStock: false, lastUpdated: new Date().toLocaleString('zh-CN') }
          : item
      )
    );
    setSelectedRowKeys([]);
    message.success(`已批量设置 ${selectedRowKeys.length} 个物料为缺货`);
  };

  // 表格列定义
  const columns: ColumnsType<StockItem> = [
    { title: '物料名称', dataIndex: 'name', key: 'name' },
    { title: '品牌', dataIndex: 'brand', key: 'brand' },
    { title: '规格', dataIndex: 'spec', key: 'spec' },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (c: string) => <Tag>{c}</Tag>,
    },
    {
      title: '库存状态',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (inStock: boolean) => (
        <Tag
          color={inStock ? 'green' : 'red'}
          icon={inStock ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {inStock ? '有货' : '缺货'}
        </Tag>
      ),
    },
    { title: '最后更新', dataIndex: 'lastUpdated', key: 'lastUpdated' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Switch
          checked={record.inStock}
          checkedChildren="有货"
          unCheckedChildren="缺货"
          onChange={(checked) => handleToggleStock(record.id, checked)}
        />
      ),
    },
  ];

  // 过滤数据
  const filteredData = stockData.filter(
    (item) => item.name.includes(searchText) || item.brand.includes(searchText)
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>库存管理</Title>
      <Paragraph type="secondary">快速管理物料库存状态</Paragraph>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8}>
          <Card size="small">
            <Statistic title="有货物料" value={inStockCount} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card size="small">
            <Statistic title="缺货物料" value={outOfStockCount} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card size="small">
            <Statistic title="总物料数" value={stockData.length} />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* 工具栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="搜索物料"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={16} style={{ textAlign: 'right' }}>
            {selectedRowKeys.length > 0 && (
              <Space>
                <Button type="primary" onClick={handleBatchInStock}>
                  批量设为有货 ({selectedRowKeys.length})
                </Button>
                <Button danger onClick={handleBatchOutOfStock}>
                  批量设为缺货 ({selectedRowKeys.length})
                </Button>
              </Space>
            )}
          </Col>
        </Row>

        {/* 库存表格 */}
        <Table
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 个物料` }}
        />
      </Card>
    </div>
  );
}
