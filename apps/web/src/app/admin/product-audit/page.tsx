'use client';

import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Image,
  message,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface ProductAuditItem {
  key: string;
  id: number;
  name: string;
  brand: string;
  spec: string;
  price: number;
  supplierId: number;
  supplierName: string;
  image: string;
  submitTime: string;
  status: 'pending' | 'approved' | 'rejected';
  isNewBrand: boolean;
}

export default function ProductAuditPage() {
  const router = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 筛选条件
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterSupplier, setFilterSupplier] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 供应商选项
  const supplierOptions = [
    { value: 1, label: '生鲜供应商A' },
    { value: 2, label: '粮油供应商B' },
    { value: 3, label: '调味品供应商C' },
  ];

  // 模拟产品数据
  const [productData, setProductData] = useState<ProductAuditItem[]>([
    {
      key: '1',
      id: 1,
      name: '金龙鱼大豆油',
      brand: '金龙鱼',
      spec: '5L/桶',
      price: 58.0,
      supplierId: 2,
      supplierName: '粮油供应商B',
      image: 'https://via.placeholder.com/80',
      submitTime: '2024-01-29 10:30:00',
      status: 'pending',
      isNewBrand: false,
    },
    {
      key: '2',
      id: 2,
      name: '新品牌酱油',
      brand: '新品牌',
      spec: '500ml/瓶',
      price: 15.0,
      supplierId: 3,
      supplierName: '调味品供应商C',
      image: 'https://via.placeholder.com/80',
      submitTime: '2024-01-29 09:15:00',
      status: 'pending',
      isNewBrand: true,
    },
    {
      key: '3',
      id: 3,
      name: '福临门花生油',
      brand: '福临门',
      spec: '5L/桶',
      price: 68.0,
      supplierId: 2,
      supplierName: '粮油供应商B',
      image: 'https://via.placeholder.com/80',
      submitTime: '2024-01-28 16:20:00',
      status: 'approved',
      isNewBrand: false,
    },
    {
      key: '4',
      id: 4,
      name: '测试产品',
      brand: '未知品牌',
      spec: '规格不明',
      price: 999.0,
      supplierId: 1,
      supplierName: '生鲜供应商A',
      image: 'https://via.placeholder.com/80',
      submitTime: '2024-01-28 14:10:00',
      status: 'rejected',
      isNewBrand: true,
    },
  ]);

  // 待审核数量
  const pendingCount = productData.filter((item) => item.status === 'pending').length;

  // 批量审核通过
  const handleBatchApprove = () => {
    setProductData((prev) =>
      prev.map((item) =>
        selectedRowKeys.includes(item.key) ? { ...item, status: 'approved' as const } : item
      )
    );
    setSelectedRowKeys([]);
    message.success(`已批量通过 ${selectedRowKeys.length} 个产品`);
  };

  // 单个审核通过
  const handleApprove = (id: number) => {
    setProductData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' as const } : item))
    );
    message.success('审核已通过');
  };

  // 单个审核驳回
  const handleReject = (id: number) => {
    setProductData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' as const } : item))
    );
    message.success('已驳回');
  };

  // 状态标签
  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: '待审核', color: 'warning' },
    approved: { label: '已通过', color: 'success' },
    rejected: { label: '已驳回', color: 'error' },
  };

  // 表格列定义
  const columns: ColumnsType<ProductAuditItem> = [
    {
      title: '产品图片',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (src: string) => (
        <Image
          src={src}
          alt="产品图片"
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      ),
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      render: (brand: string, record) => (
        <Space>
          {brand}
          {record.isNewBrand && <Tag color="blue">新品牌</Tag>}
        </Space>
      ),
    },
    {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = statusLabels[status];
        return (
          <Badge status={config?.color as 'warning' | 'success' | 'error'} text={config?.label} />
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/admin/product-audit/${record.id}`)}
          >
            详情
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleApprove(record.id)}
              >
                通过
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
              >
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 过滤数据
  const filteredData = productData.filter((item) => {
    if (filterStatus && item.status !== filterStatus) return false;
    if (filterSupplier && item.supplierId !== filterSupplier) return false;
    return true;
  });

  // 只能选择待审核的产品
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record: ProductAuditItem) => ({
      disabled: record.status !== 'pending',
    }),
  };

  return (
    <AdminLayout>
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              产品审核
              {pendingCount > 0 && <Badge count={pendingCount} style={{ marginLeft: 12 }} />}
            </Title>
            <Paragraph type="secondary" style={{ margin: 0 }}>
              审核供应商提交的新产品信息
            </Paragraph>
          </Col>
        </Row>

        <Card>
          {/* 筛选栏 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={5}>
              <Select
                placeholder="状态筛选"
                style={{ width: '100%' }}
                options={[
                  { value: null, label: '全部状态' },
                  { value: 'pending', label: '待审核' },
                  { value: 'approved', label: '已通过' },
                  { value: 'rejected', label: '已驳回' },
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                placeholder="供应商筛选"
                style={{ width: '100%' }}
                options={[{ value: null, label: '全部供应商' }, ...supplierOptions]}
                value={filterSupplier}
                onChange={setFilterSupplier}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              {selectedRowKeys.length > 0 && (
                <Button type="primary" onClick={handleBatchApprove}>
                  批量通过 ({selectedRowKeys.length})
                </Button>
              )}
            </Col>
          </Row>

          {/* 产品列表 */}
          <Table
            rowSelection={rowSelection}
            dataSource={filteredData}
            columns={columns}
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
