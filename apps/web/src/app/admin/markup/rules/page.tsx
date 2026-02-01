'use client';

import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;

interface MarkupRule {
  key: string;
  id: number;
  name: string;
  storeId: number | null;
  storeName: string | null;
  supplierId: number | null;
  supplierName: string | null;
  materialId: number | null;
  materialName: string | null;
  markupType: 'fixed' | 'percentage';
  markupValue: number;
  minMarkup: number | null;
  maxMarkup: number | null;
  priority: number;
  enabled: boolean;
  createdAt: string;
}

export default function MarkupRulesPage() {
  const router = useRouter();
  const [loading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 筛选条件
  const [searchName, setSearchName] = useState('');
  const [filterStore, setFilterStore] = useState<number | null>(null);
  const [filterSupplier, setFilterSupplier] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<boolean | null>(null);

  // 模拟规则数据
  const [rulesData, setRulesData] = useState<MarkupRule[]>([
    {
      key: '1',
      id: 1,
      name: '默认加价规则',
      storeId: null,
      storeName: null,
      supplierId: null,
      supplierName: null,
      materialId: null,
      materialName: null,
      markupType: 'percentage',
      markupValue: 3,
      minMarkup: 1,
      maxMarkup: 50,
      priority: 1,
      enabled: true,
      createdAt: '2024-01-15',
    },
    {
      key: '2',
      id: 2,
      name: '生鲜供应商A固定加价',
      storeId: null,
      storeName: null,
      supplierId: 1,
      supplierName: '生鲜供应商A',
      materialId: null,
      materialName: null,
      markupType: 'fixed',
      markupValue: 2,
      minMarkup: null,
      maxMarkup: null,
      priority: 2,
      enabled: true,
      createdAt: '2024-01-16',
    },
    {
      key: '3',
      id: 3,
      name: '门店A专属规则',
      storeId: 1,
      storeName: '门店A - 朝阳店',
      supplierId: null,
      supplierName: null,
      materialId: null,
      materialName: null,
      markupType: 'percentage',
      markupValue: 2.5,
      minMarkup: 0.5,
      maxMarkup: 30,
      priority: 3,
      enabled: true,
      createdAt: '2024-01-17',
    },
    {
      key: '4',
      id: 4,
      name: '特定商品加价',
      storeId: null,
      storeName: null,
      supplierId: 2,
      supplierName: '粮油供应商B',
      materialId: 101,
      materialName: '金龙鱼大豆油5L',
      markupType: 'fixed',
      markupValue: 5,
      minMarkup: null,
      maxMarkup: null,
      priority: 4,
      enabled: false,
      createdAt: '2024-01-18',
    },
  ]);

  // 门店选项
  const storeOptions = [
    { value: 1, label: '门店A - 朝阳店' },
    { value: 2, label: '门店B - 海淀店' },
    { value: 3, label: '门店C - 西城店' },
  ];

  // 供应商选项
  const supplierOptions = [
    { value: 1, label: '生鲜供应商A' },
    { value: 2, label: '粮油供应商B' },
    { value: 3, label: '调味品供应商C' },
  ];

  // 状态切换
  const handleStatusChange = (id: number, enabled: boolean) => {
    setRulesData((prev) => prev.map((item) => (item.id === id ? { ...item, enabled } : item)));
    message.success(`规则已${enabled ? '启用' : '禁用'}`);
  };

  // 删除规则
  const handleDelete = (id: number) => {
    setRulesData((prev) => prev.filter((item) => item.id !== id));
    message.success('规则已删除');
  };

  // 批量操作
  const handleBatchEnable = () => {
    setRulesData((prev) =>
      prev.map((item) => (selectedRowKeys.includes(item.key) ? { ...item, enabled: true } : item))
    );
    setSelectedRowKeys([]);
    message.success('已批量启用选中规则');
  };

  const handleBatchDisable = () => {
    setRulesData((prev) =>
      prev.map((item) => (selectedRowKeys.includes(item.key) ? { ...item, enabled: false } : item))
    );
    setSelectedRowKeys([]);
    message.success('已批量禁用选中规则');
  };

  const handleBatchDelete = () => {
    setRulesData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
    message.success('已批量删除选中规则');
  };

  // 表格列定义
  const columns: ColumnsType<MarkupRule> = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '门店',
      dataIndex: 'storeName',
      key: 'storeName',
      width: 140,
      render: (name: string | null) => name || <Tag>全部</Tag>,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 140,
      render: (name: string | null) => name || <Tag>全部</Tag>,
    },
    {
      title: '商品',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 160,
      render: (name: string | null) => name || <Tag>全部</Tag>,
    },
    {
      title: '加价方式',
      dataIndex: 'markupType',
      key: 'markupType',
      width: 100,
      render: (type: 'fixed' | 'percentage') => (
        <Tag color={type === 'fixed' ? 'blue' : 'green'}>
          {type === 'fixed' ? '固定金额' : '百分比'}
        </Tag>
      ),
    },
    {
      title: '加价值',
      dataIndex: 'markupValue',
      key: 'markupValue',
      width: 100,
      render: (value: number, record) =>
        record.markupType === 'fixed' ? `¥${value}` : `${value}%`,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          size="small"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => router.push(`/admin/markup/rules/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这条规则吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 过滤数据
  const filteredData = rulesData.filter((item) => {
    if (searchName && !item.name.includes(searchName)) return false;
    if (filterStore && item.storeId !== filterStore) return false;
    if (filterSupplier && item.supplierId !== filterSupplier) return false;
    if (filterStatus !== null && item.enabled !== filterStatus) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div>
        <Title level={3}>加价规则管理</Title>
        <Paragraph type="secondary">
          管理平台加价规则，支持按门店、供应商、商品维度设置差异化加价策略
        </Paragraph>

        <Card>
          {/* 搜索筛选栏 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="搜索规则名称"
                prefix={<SearchOutlined />}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                placeholder="选择门店"
                style={{ width: '100%' }}
                options={[{ value: null, label: '全部门店' }, ...storeOptions]}
                value={filterStore}
                onChange={setFilterStore}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                placeholder="选择供应商"
                style={{ width: '100%' }}
                options={[{ value: null, label: '全部供应商' }, ...supplierOptions]}
                value={filterSupplier}
                onChange={setFilterSupplier}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="状态"
                style={{ width: '100%' }}
                options={[
                  { value: null, label: '全部状态' },
                  { value: true, label: '已启用' },
                  { value: false, label: '已禁用' },
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push('/admin/markup/rules/create')}
              >
                新建规则
              </Button>
            </Col>
          </Row>

          {/* 批量操作 */}
          {selectedRowKeys.length > 0 && (
            <Space style={{ marginBottom: 16 }}>
              <span>已选择 {selectedRowKeys.length} 项</span>
              <Button size="small" onClick={handleBatchEnable}>
                批量启用
              </Button>
              <Button size="small" onClick={handleBatchDisable}>
                批量禁用
              </Button>
              <Popconfirm
                title="确认批量删除"
                description={`确定要删除选中的 ${selectedRowKeys.length} 条规则吗？`}
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button size="small" danger>
                  批量删除
                </Button>
              </Popconfirm>
            </Space>
          )}

          {/* 规则表格 */}
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条规则`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
