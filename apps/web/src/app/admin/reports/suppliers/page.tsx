'use client';

import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Row, Statistic, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface SupplierReportItem {
  key: string;
  id: number;
  supplierName: string;
  orderCount: number;
  salesAmount: number;
  avgOrderAmount: number;
  topMaterials: string[];
}

export default function SupplierReportsPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 模拟供应商汇总数据
  const supplierData: SupplierReportItem[] = [
    {
      key: '1',
      id: 1,
      supplierName: '生鲜供应商A',
      orderCount: 234,
      salesAmount: 68900,
      avgOrderAmount: 294,
      topMaterials: ['新鲜蔬菜', '水果拼盘', '肉类'],
    },
    {
      key: '2',
      id: 2,
      supplierName: '粮油供应商B',
      orderCount: 156,
      salesAmount: 45600,
      avgOrderAmount: 292,
      topMaterials: ['金龙鱼大豆油', '福临门花生油', '中粮大米'],
    },
    {
      key: '3',
      id: 3,
      supplierName: '调味品供应商C',
      orderCount: 89,
      salesAmount: 23400,
      avgOrderAmount: 263,
      topMaterials: ['海天酱油', '太太乐鸡精', '老干妈辣酱'],
    },
    {
      key: '4',
      id: 4,
      supplierName: '冷冻食品供应商D',
      orderCount: 67,
      salesAmount: 19800,
      avgOrderAmount: 296,
      topMaterials: ['速冻水饺', '冷冻鸡翅', '速冻汤圆'],
    },
    {
      key: '5',
      id: 5,
      supplierName: '饮料供应商E',
      orderCount: 45,
      salesAmount: 12300,
      avgOrderAmount: 273,
      topMaterials: ['可口可乐', '农夫山泉', '王老吉'],
    },
  ];

  // 统计汇总
  const totalStats = {
    totalSuppliers: supplierData.length,
    totalOrders: supplierData.reduce((sum, s) => sum + s.orderCount, 0),
    totalAmount: supplierData.reduce((sum, s) => sum + s.salesAmount, 0),
    avgOrderAmount: Math.round(
      supplierData.reduce((sum, s) => sum + s.salesAmount, 0) /
        supplierData.reduce((sum, s) => sum + s.orderCount, 0)
    ),
  };

  // 导出报表
  const handleExport = () => {
    console.log('Exporting supplier reports...');
  };

  // 表格列定义
  const columns: ColumnsType<SupplierReportItem> = [
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      sorter: (a, b) => a.orderCount - b.orderCount,
    },
    {
      title: '销售金额',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
      sorter: (a, b) => a.salesAmount - b.salesAmount,
    },
    {
      title: '平均订单金额',
      dataIndex: 'avgOrderAmount',
      key: 'avgOrderAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '热销物料',
      dataIndex: 'topMaterials',
      key: 'topMaterials',
      render: (materials: string[]) => materials.slice(0, 3).join('、'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => router.push(`/admin/reports/suppliers/${record.id}`)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div>
        <Title level={3}>按供应商汇总</Title>
        <Paragraph type="secondary">按供应商维度查看销售数据汇总</Paragraph>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="供应商数量" value={totalStats.totalSuppliers} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="总订单数" value={totalStats.totalOrders} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="总销售金额" value={totalStats.totalAmount} prefix="¥" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="平均订单金额" value={totalStats.avgOrderAmount} prefix="¥" />
            </Card>
          </Col>
        </Row>

        <Card>
          {/* 筛选栏 */}
          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <RangePicker value={dateRange} onChange={(dates) => setDateRange(dates)} />
            </Col>
            <Col>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出报表
              </Button>
            </Col>
          </Row>

          {/* 数据表格 */}
          <Table
            dataSource={supplierData}
            columns={columns}
            pagination={{
              total: supplierData.length,
              pageSize: 10,
              showTotal: (total) => `共 ${total} 家供应商`,
            }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
