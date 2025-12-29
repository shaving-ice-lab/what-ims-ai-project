'use client';

import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Row, Select, Statistic, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface MaterialReportItem {
  key: string;
  id: number;
  materialName: string;
  brand: string;
  spec: string;
  salesCount: number;
  salesAmount: number;
  storeCount: number;
}

export default function MaterialReportsPage() {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // 分类选项
  const categoryOptions = [
    { value: '粮油', label: '粮油' },
    { value: '调味品', label: '调味品' },
    { value: '生鲜', label: '生鲜' },
    { value: '饮料', label: '饮料' },
  ];

  // 模拟物料汇总数据
  const materialData: MaterialReportItem[] = [
    {
      key: '1',
      id: 1,
      materialName: '金龙鱼大豆油',
      brand: '金龙鱼',
      spec: '5L/桶',
      salesCount: 456,
      salesAmount: 26448,
      storeCount: 45,
    },
    {
      key: '2',
      id: 2,
      materialName: '海天酱油',
      brand: '海天',
      spec: '500ml/瓶',
      salesCount: 892,
      salesAmount: 11150,
      storeCount: 62,
    },
    {
      key: '3',
      id: 3,
      materialName: '福临门花生油',
      brand: '福临门',
      spec: '5L/桶',
      salesCount: 234,
      salesAmount: 15912,
      storeCount: 38,
    },
    {
      key: '4',
      id: 4,
      materialName: '中粮大米',
      brand: '中粮',
      spec: '10kg/袋',
      salesCount: 567,
      salesAmount: 25515,
      storeCount: 52,
    },
    {
      key: '5',
      id: 5,
      materialName: '太太乐鸡精',
      brand: '太太乐',
      spec: '200g/袋',
      salesCount: 723,
      salesAmount: 6362,
      storeCount: 48,
    },
  ];

  // 统计汇总
  const totalStats = {
    totalMaterials: materialData.length,
    totalSalesCount: materialData.reduce((sum, m) => sum + m.salesCount, 0),
    totalSalesAmount: materialData.reduce((sum, m) => sum + m.salesAmount, 0),
    avgStoreCount: Math.round(
      materialData.reduce((sum, m) => sum + m.storeCount, 0) / materialData.length
    ),
  };

  // 导出报表
  const handleExport = () => {
    console.log('Exporting material reports...');
  };

  // 表格列定义
  const columns: ColumnsType<MaterialReportItem> = [
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
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
      title: '销量',
      dataIndex: 'salesCount',
      key: 'salesCount',
      sorter: (a, b) => a.salesCount - b.salesCount,
    },
    {
      title: '销售额',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
      sorter: (a, b) => a.salesAmount - b.salesAmount,
    },
    {
      title: '采购门店数',
      dataIndex: 'storeCount',
      key: 'storeCount',
      sorter: (a, b) => a.storeCount - b.storeCount,
    },
  ];

  return (
    <AdminLayout>
      <div>
        <Title level={3}>按物料汇总</Title>
        <Paragraph type="secondary">按物料维度查看销售数据汇总</Paragraph>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="物料种类" value={totalStats.totalMaterials} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="总销量" value={totalStats.totalSalesCount} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="总销售额" value={totalStats.totalSalesAmount} prefix="¥" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="平均采购门店" value={totalStats.avgStoreCount} />
            </Card>
          </Col>
        </Row>

        <Card>
          {/* 筛选栏 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={8}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
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
            <Col xs={24} sm={12} md={10} style={{ textAlign: 'right' }}>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出报表
              </Button>
            </Col>
          </Row>

          {/* 数据表格 */}
          <Table
            dataSource={materialData}
            columns={columns}
            pagination={{
              total: materialData.length,
              pageSize: 10,
              showTotal: (total) => `共 ${total} 种物料`,
            }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
