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

interface StoreReportItem {
  key: string;
  id: number;
  storeName: string;
  orderCount: number;
  orderAmount: number;
  avgOrderAmount: number;
  topMaterials: string[];
}

export default function StoreReportsPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 模拟门店汇总数据
  const storeData: StoreReportItem[] = [
    {
      key: '1',
      id: 1,
      storeName: '门店A - 朝阳店',
      orderCount: 156,
      orderAmount: 45680,
      avgOrderAmount: 293,
      topMaterials: ['金龙鱼大豆油', '海天酱油', '中粮大米'],
    },
    {
      key: '2',
      id: 2,
      storeName: '门店B - 海淀店',
      orderCount: 89,
      orderAmount: 28900,
      avgOrderAmount: 325,
      topMaterials: ['福临门花生油', '太太乐鸡精', '金龙鱼大豆油'],
    },
    {
      key: '3',
      id: 3,
      storeName: '门店C - 西城店',
      orderCount: 124,
      orderAmount: 38500,
      avgOrderAmount: 310,
      topMaterials: ['海天酱油', '金龙鱼大豆油', '福临门花生油'],
    },
    {
      key: '4',
      id: 4,
      storeName: '门店D - 东城店',
      orderCount: 67,
      orderAmount: 21300,
      avgOrderAmount: 318,
      topMaterials: ['中粮大米', '金龙鱼大豆油', '海天酱油'],
    },
    {
      key: '5',
      id: 5,
      storeName: '门店E - 丰台店',
      orderCount: 45,
      orderAmount: 15600,
      avgOrderAmount: 347,
      topMaterials: ['金龙鱼大豆油', '福临门花生油', '太太乐鸡精'],
    },
  ];

  // 统计汇总
  const totalStats = {
    totalStores: storeData.length,
    totalOrders: storeData.reduce((sum, s) => sum + s.orderCount, 0),
    totalAmount: storeData.reduce((sum, s) => sum + s.orderAmount, 0),
    avgOrderAmount: Math.round(
      storeData.reduce((sum, s) => sum + s.orderAmount, 0) /
        storeData.reduce((sum, s) => sum + s.orderCount, 0)
    ),
  };

  // 导出报表
  const handleExport = () => {
    console.log('Exporting store reports...');
  };

  // 表格列定义
  const columns: ColumnsType<StoreReportItem> = [
    {
      title: '门店名称',
      dataIndex: 'storeName',
      key: 'storeName',
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      sorter: (a, b) => a.orderCount - b.orderCount,
    },
    {
      title: '订货金额',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
      sorter: (a, b) => a.orderAmount - b.orderAmount,
    },
    {
      title: '平均订单金额',
      dataIndex: 'avgOrderAmount',
      key: 'avgOrderAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '常购物料',
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
          onClick={() => router.push(`/admin/reports/stores/${record.id}`)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div>
        <Title level={3}>按门店汇总</Title>
        <Paragraph type="secondary">按门店维度查看订货数据汇总</Paragraph>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="门店数量" value={totalStats.totalStores} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="总订单数" value={totalStats.totalOrders} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="总订货金额" value={totalStats.totalAmount} prefix="¥" />
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
            dataSource={storeData}
            columns={columns}
            pagination={{
              total: storeData.length,
              pageSize: 10,
              showTotal: (total) => `共 ${total} 家门店`,
            }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
