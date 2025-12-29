'use client';

import { Line } from '@ant-design/charts';
import { DownloadOutlined, RiseOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Space,
  Statistic,
  Table,
  Tabs,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface StoreStatItem {
  key: string;
  id: number;
  name: string;
  orderCount: number;
  orderAmount: number;
  markupIncome: number;
  avgMarkupRate: number;
}

interface SupplierStatItem {
  key: string;
  id: number;
  name: string;
  orderCount: number;
  orderAmount: number;
  markupIncome: number;
  avgMarkupRate: number;
}

interface MaterialStatItem {
  key: string;
  id: number;
  name: string;
  brand: string;
  salesCount: number;
  salesAmount: number;
  markupIncome: number;
}

export default function MarkupStatisticsPage() {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 模拟趋势数据
  const trendData = Array.from({ length: 30 }, (_, i) => ({
    date: `2024-01-${String(i + 1).padStart(2, '0')}`,
    income: Math.floor(Math.random() * 5000) + 1000,
  }));

  // 模拟门店统计数据
  const storeData: StoreStatItem[] = [
    {
      key: '1',
      id: 1,
      name: '门店A - 朝阳店',
      orderCount: 156,
      orderAmount: 45680,
      markupIncome: 1580,
      avgMarkupRate: 3.46,
    },
    {
      key: '2',
      id: 2,
      name: '门店B - 海淀店',
      orderCount: 89,
      orderAmount: 28900,
      markupIncome: 960,
      avgMarkupRate: 3.32,
    },
    {
      key: '3',
      id: 3,
      name: '门店C - 西城店',
      orderCount: 124,
      orderAmount: 38500,
      markupIncome: 1290,
      avgMarkupRate: 3.35,
    },
    {
      key: '4',
      id: 4,
      name: '门店D - 东城店',
      orderCount: 67,
      orderAmount: 21300,
      markupIncome: 720,
      avgMarkupRate: 3.38,
    },
    {
      key: '5',
      id: 5,
      name: '门店E - 丰台店',
      orderCount: 45,
      orderAmount: 15600,
      markupIncome: 480,
      avgMarkupRate: 3.08,
    },
  ];

  // 模拟供应商统计数据
  const supplierData: SupplierStatItem[] = [
    {
      key: '1',
      id: 1,
      name: '生鲜供应商A',
      orderCount: 234,
      orderAmount: 68900,
      markupIncome: 2380,
      avgMarkupRate: 3.45,
    },
    {
      key: '2',
      id: 2,
      name: '粮油供应商B',
      orderCount: 156,
      orderAmount: 45600,
      markupIncome: 1520,
      avgMarkupRate: 3.33,
    },
    {
      key: '3',
      id: 3,
      name: '调味品供应商C',
      orderCount: 89,
      orderAmount: 23400,
      markupIncome: 780,
      avgMarkupRate: 3.33,
    },
    {
      key: '4',
      id: 4,
      name: '冷冻食品供应商D',
      orderCount: 67,
      orderAmount: 19800,
      markupIncome: 660,
      avgMarkupRate: 3.33,
    },
    {
      key: '5',
      id: 5,
      name: '饮料供应商E',
      orderCount: 45,
      orderAmount: 12300,
      markupIncome: 410,
      avgMarkupRate: 3.33,
    },
  ];

  // 模拟商品统计数据
  const materialData: MaterialStatItem[] = [
    {
      key: '1',
      id: 101,
      name: '金龙鱼大豆油5L',
      brand: '金龙鱼',
      salesCount: 156,
      salesAmount: 9048,
      markupIncome: 312,
    },
    {
      key: '2',
      id: 102,
      name: '福临门花生油5L',
      brand: '福临门',
      salesCount: 89,
      salesAmount: 6052,
      markupIncome: 178,
    },
    {
      key: '3',
      id: 103,
      name: '海天酱油500ml',
      brand: '海天',
      salesCount: 234,
      salesAmount: 2925,
      markupIncome: 117,
    },
    {
      key: '4',
      id: 104,
      name: '太太乐鸡精200g',
      brand: '太太乐',
      salesCount: 178,
      salesAmount: 1566,
      markupIncome: 89,
    },
    {
      key: '5',
      id: 105,
      name: '中粮大米10kg',
      brand: '中粮',
      salesCount: 67,
      salesAmount: 3015,
      markupIncome: 134,
    },
  ];

  // 统计汇总
  const totalStats = {
    totalIncome: 5750,
    totalOrders: 481,
    avgMarkupRate: 3.38,
    growthRate: 12.5,
  };

  // 折线图配置
  const lineConfig = {
    data: trendData,
    xField: 'date',
    yField: 'income',
    smooth: true,
    height: 300,
    yAxis: {
      label: {
        formatter: (v: string) => `¥${v}`,
      },
    },
    tooltip: {
      formatter: (datum: { income: number }) => ({
        name: '加价收入',
        value: `¥${datum.income.toLocaleString()}`,
      }),
    },
    color: '#52c41a',
  };

  // 门店表格列
  const storeColumns: ColumnsType<StoreStatItem> = [
    { title: '门店名称', dataIndex: 'name', key: 'name' },
    { title: '订单数', dataIndex: 'orderCount', key: 'orderCount' },
    {
      title: '订单金额',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: '加价收入',
      dataIndex: 'markupIncome',
      key: 'markupIncome',
      render: (v: number) => <span style={{ color: '#52c41a' }}>¥{v.toLocaleString()}</span>,
      sorter: (a, b) => a.markupIncome - b.markupIncome,
    },
    {
      title: '平均加价率',
      dataIndex: 'avgMarkupRate',
      key: 'avgMarkupRate',
      render: (v: number) => `${v.toFixed(2)}%`,
    },
  ];

  // 供应商表格列
  const supplierColumns: ColumnsType<SupplierStatItem> = [
    { title: '供应商名称', dataIndex: 'name', key: 'name' },
    { title: '订单数', dataIndex: 'orderCount', key: 'orderCount' },
    {
      title: '订单金额',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: '加价收入',
      dataIndex: 'markupIncome',
      key: 'markupIncome',
      render: (v: number) => <span style={{ color: '#52c41a' }}>¥{v.toLocaleString()}</span>,
      sorter: (a, b) => a.markupIncome - b.markupIncome,
    },
    {
      title: '平均加价率',
      dataIndex: 'avgMarkupRate',
      key: 'avgMarkupRate',
      render: (v: number) => `${v.toFixed(2)}%`,
    },
  ];

  // 商品表格列
  const materialColumns: ColumnsType<MaterialStatItem> = [
    { title: '商品名称', dataIndex: 'name', key: 'name' },
    { title: '品牌', dataIndex: 'brand', key: 'brand' },
    { title: '销量', dataIndex: 'salesCount', key: 'salesCount' },
    {
      title: '销售额',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: '加价收入',
      dataIndex: 'markupIncome',
      key: 'markupIncome',
      render: (v: number) => <span style={{ color: '#52c41a' }}>¥{v.toLocaleString()}</span>,
      sorter: (a, b) => a.markupIncome - b.markupIncome,
    },
  ];

  // 导出报表
  const handleExport = () => {
    // 实际应调用API导出
    console.log('Exporting report...');
  };

  const tabItems = [
    {
      key: 'store',
      label: '按门店',
      children: (
        <Table dataSource={storeData} columns={storeColumns} pagination={false} size="small" />
      ),
    },
    {
      key: 'supplier',
      label: '按供应商',
      children: (
        <Table
          dataSource={supplierData}
          columns={supplierColumns}
          pagination={false}
          size="small"
        />
      ),
    },
    {
      key: 'material',
      label: '按商品',
      children: (
        <Table
          dataSource={materialData}
          columns={materialColumns}
          pagination={false}
          size="small"
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              加价收入统计
            </Title>
            <Paragraph type="secondary" style={{ margin: 0 }}>
              查看平台加价收入的详细统计数据
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <RangePicker value={dateRange} onChange={(dates) => setDateRange(dates)} />
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出报表
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 统计汇总 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="本期加价收入"
                value={totalStats.totalIncome}
                prefix="¥"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="订单数" value={totalStats.totalOrders} suffix="单" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="平均加价率"
                value={totalStats.avgMarkupRate}
                suffix="%"
                precision={2}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="环比增长"
                value={totalStats.growthRate}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* 趋势图 */}
        <Card title="加价收入趋势（近30天）" style={{ marginBottom: 24 }}>
          <Line {...lineConfig} />
        </Card>

        {/* 分维度统计 */}
        <Card title="分维度统计">
          <Tabs items={tabItems} />
        </Card>
      </div>
    </AdminLayout>
  );
}
