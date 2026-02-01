'use client';

import { DownloadOutlined, RiseOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;

interface PriceCompareItem {
  key: string;
  id: number;
  name: string;
  brand: string;
  spec: string;
  supplierCount: number;
  minPrice: number;
  maxPrice: number;
  priceDiffRate: number;
  avgMarkupRate: number;
  isExclusive: boolean;
  suppliers: {
    id: number;
    name: string;
    price: number;
    isLowest: boolean;
  }[];
}

export default function MarketMonitorPage() {
  const [searchText, setSearchText] = useState('');
  const [filterRegion, setFilterRegion] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  // 区域选项
  const regionOptions = [
    { value: '北京', label: '北京' },
    { value: '上海', label: '上海' },
    { value: '广州', label: '广州' },
  ];

  // 分类选项
  const categoryOptions = [
    { value: '粮油', label: '粮油' },
    { value: '调味品', label: '调味品' },
    { value: '生鲜', label: '生鲜' },
  ];

  // 统计数据
  const statsData = {
    totalProducts: 1256,
    activeSuppliers: 48,
    priceAnomalyCount: 12,
    exclusiveCount: 89,
    avgMarkupRate: 3.2,
    todayPriceChanges: 23,
  };

  // 模拟价格对比数据
  const priceData: PriceCompareItem[] = [
    {
      key: '1',
      id: 1,
      name: '金龙鱼大豆油',
      brand: '金龙鱼',
      spec: '5L/桶',
      supplierCount: 3,
      minPrice: 56.0,
      maxPrice: 62.0,
      priceDiffRate: 10.7,
      avgMarkupRate: 3.2,
      isExclusive: false,
      suppliers: [
        { id: 1, name: '粮油供应商A', price: 56.0, isLowest: true },
        { id: 2, name: '粮油供应商B', price: 58.0, isLowest: false },
        { id: 3, name: '粮油供应商C', price: 62.0, isLowest: false },
      ],
    },
    {
      key: '2',
      id: 2,
      name: '海天酱油',
      brand: '海天',
      spec: '500ml/瓶',
      supplierCount: 2,
      minPrice: 12.0,
      maxPrice: 13.5,
      priceDiffRate: 12.5,
      avgMarkupRate: 2.8,
      isExclusive: false,
      suppliers: [
        { id: 3, name: '调味品供应商A', price: 12.0, isLowest: true },
        { id: 4, name: '调味品供应商B', price: 13.5, isLowest: false },
      ],
    },
    {
      key: '3',
      id: 3,
      name: '特供有机大米',
      brand: '中粮',
      spec: '10kg/袋',
      supplierCount: 1,
      minPrice: 89.0,
      maxPrice: 89.0,
      priceDiffRate: 0,
      avgMarkupRate: 4.5,
      isExclusive: true,
      suppliers: [{ id: 5, name: '粮油供应商A', price: 89.0, isLowest: true }],
    },
    {
      key: '4',
      id: 4,
      name: '福临门花生油',
      brand: '福临门',
      spec: '5L/桶',
      supplierCount: 4,
      minPrice: 65.0,
      maxPrice: 78.0,
      priceDiffRate: 20.0,
      avgMarkupRate: 3.5,
      isExclusive: false,
      suppliers: [
        { id: 1, name: '粮油供应商A', price: 65.0, isLowest: true },
        { id: 2, name: '粮油供应商B', price: 68.0, isLowest: false },
        { id: 6, name: '粮油供应商D', price: 72.0, isLowest: false },
        { id: 7, name: '粮油供应商E', price: 78.0, isLowest: false },
      ],
    },
  ];

  // 导出报表
  const handleExport = () => {
    console.log('Exporting market data...');
  };

  // 展开行内容 - 供应商报价详情
  const expandedRowRender = (record: PriceCompareItem) => {
    const supplierColumns: ColumnsType<PriceCompareItem['suppliers'][0]> = [
      {
        title: '供应商',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '报价',
        dataIndex: 'price',
        key: 'price',
        render: (price: number, row) => (
          <Space>
            <span style={{ color: row.isLowest ? '#52c41a' : undefined }}>¥{price.toFixed(2)}</span>
            {row.isLowest && <Tag color="green">最低</Tag>}
            {!row.isLowest && price > record.minPrice * 1.15 && <Tag color="red">偏高</Tag>}
          </Space>
        ),
      },
      {
        title: '与最低价差',
        key: 'diff',
        render: (_, row) => {
          const diff = ((row.price - record.minPrice) / record.minPrice) * 100;
          if (diff === 0) return '-';
          return (
            <span style={{ color: diff > 10 ? '#ff4d4f' : '#faad14' }}>+{diff.toFixed(1)}%</span>
          );
        },
      },
    ];

    return (
      <Table
        columns={supplierColumns}
        dataSource={record.suppliers.map((s, i) => ({ ...s, key: String(i) }))}
        pagination={false}
        size="small"
      />
    );
  };

  // 表格列定义
  const columns: ColumnsType<PriceCompareItem> = [
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Space>
          {name}
          {record.isExclusive && <Tag color="purple">独家供应</Tag>}
        </Space>
      ),
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
      title: '供应商数',
      dataIndex: 'supplierCount',
      key: 'supplierCount',
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: count === 1 ? '#faad14' : '#52c41a' }} />
      ),
    },
    {
      title: '最低价',
      dataIndex: 'minPrice',
      key: 'minPrice',
      render: (price: number) => <Text style={{ color: '#52c41a' }}>¥{price.toFixed(2)}</Text>,
    },
    {
      title: '最高价',
      dataIndex: 'maxPrice',
      key: 'maxPrice',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '价差率',
      dataIndex: 'priceDiffRate',
      key: 'priceDiffRate',
      render: (rate: number) => (
        <span style={{ color: rate > 15 ? '#ff4d4f' : rate > 10 ? '#faad14' : '#52c41a' }}>
          {rate.toFixed(1)}%
        </span>
      ),
      sorter: (a, b) => a.priceDiffRate - b.priceDiffRate,
    },
    {
      title: '平均加价率',
      dataIndex: 'avgMarkupRate',
      key: 'avgMarkupRate',
      render: (rate: number) => `${rate.toFixed(1)}%`,
    },
  ];

  // 过滤数据
  const filteredData = priceData.filter((item) => {
    if (searchText && !item.name.includes(searchText) && !item.brand.includes(searchText)) {
      return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <div>
        <Title level={3}>市场行情监控</Title>
        <Paragraph type="secondary">监控全平台产品价格，分析供应商报价差异和市场行情</Paragraph>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic title="在售产品" value={statsData.totalProducts} />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic title="活跃供应商" value={statsData.activeSuppliers} />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="价格异常"
                value={statsData.priceAnomalyCount}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="独家供应"
                value={statsData.exclusiveCount}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic title="平均加价率" value={statsData.avgMarkupRate} suffix="%" />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="今日价格变动"
                value={statsData.todayPriceChanges}
                prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* 价格对比表 */}
        <Card title="产品价格对比表">
          {/* 筛选栏 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="搜索产品或品牌"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="区域筛选"
                style={{ width: '100%' }}
                options={[{ value: null, label: '全部区域' }, ...regionOptions]}
                value={filterRegion}
                onChange={setFilterRegion}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="分类筛选"
                style={{ width: '100%' }}
                options={[{ value: null, label: '全部分类' }, ...categoryOptions]}
                value={filterCategory}
                onChange={setFilterCategory}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={10} style={{ textAlign: 'right' }}>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出Excel
              </Button>
            </Col>
          </Row>

          <Table
            dataSource={filteredData}
            columns={columns}
            expandable={{
              expandedRowRender,
              expandedRowKeys,
              onExpand: (expanded, record) => {
                setExpandedRowKeys(expanded ? [record.key] : []);
              },
            }}
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showTotal: (total) => `共 ${total} 个产品`,
            }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
