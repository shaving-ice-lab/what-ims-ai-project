'use client';

import {
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

interface MaterialItem {
  key: string;
  id: number;
  name: string;
  brand: string;
  spec: string;
  unit: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
}

export default function SupplierMaterialsPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MaterialItem | null>(null);
  const [form] = Form.useForm();

  // 筛选条件
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // 分类选项
  const categoryOptions = [
    { value: '粮油', label: '粮油' },
    { value: '调味品', label: '调味品' },
    { value: '生鲜', label: '生鲜' },
    { value: '饮料', label: '饮料' },
  ];

  // 模拟物料数据
  const [materialsData, setMaterialsData] = useState<MaterialItem[]>([
    {
      key: '1',
      id: 1,
      name: '金龙鱼大豆油',
      brand: '金龙鱼',
      spec: '5L/桶',
      unit: '桶',
      category: '粮油',
      price: 58.0,
      stock: 500,
      status: 'active',
    },
    {
      key: '2',
      id: 2,
      name: '福临门花生油',
      brand: '福临门',
      spec: '5L/桶',
      unit: '桶',
      category: '粮油',
      price: 68.0,
      stock: 300,
      status: 'active',
    },
    {
      key: '3',
      id: 3,
      name: '中粮大米',
      brand: '中粮',
      spec: '10kg/袋',
      unit: '袋',
      category: '粮油',
      price: 45.0,
      stock: 200,
      status: 'active',
    },
    {
      key: '4',
      id: 4,
      name: '海天酱油',
      brand: '海天',
      spec: '500ml/瓶',
      unit: '瓶',
      category: '调味品',
      price: 12.5,
      stock: 0,
      status: 'inactive',
    },
  ]);

  // 打开新建/编辑弹窗
  const handleOpenModal = (item?: MaterialItem) => {
    if (item) {
      setEditingItem(item);
      form.setFieldsValue(item);
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 切换状态
  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setMaterialsData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus as 'active' | 'inactive' } : item
      )
    );
    message.success(`物料已${newStatus === 'active' ? '上架' : '下架'}`);
  };

  // 提交表单
  const handleSubmit = async (values: Partial<MaterialItem>) => {
    if (editingItem) {
      setMaterialsData((prev) =>
        prev.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item))
      );
      message.success('物料信息已更新');
    } else {
      const newId = Date.now();
      const newItem: MaterialItem = {
        ...(values as Omit<MaterialItem, 'key' | 'id' | 'status'>),
        key: String(newId),
        id: newId,
        status: 'active',
      };
      setMaterialsData((prev) => [...prev, newItem]);
      message.success('物料已添加');
    }
    setModalVisible(false);
    form.resetFields();
  };

  // 表格列定义
  const columns: ColumnsType<MaterialItem> = [
    {
      title: '物料名称',
      dataIndex: 'name',
      key: 'name',
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
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <span style={{ color: stock === 0 ? '#ff4d4f' : undefined }}>{stock}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '上架' : '下架'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={record.status === 'active' ? '下架物料' : '上架物料'}
            description={`确定要${record.status === 'active' ? '下架' : '上架'}此物料吗？`}
            onConfirm={() => handleToggleStatus(record.id, record.status)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger={record.status === 'active'}>
              {record.status === 'active' ? '下架' : '上架'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 过滤数据
  const filteredData = materialsData.filter((item) => {
    if (searchText && !item.name.includes(searchText) && !item.brand.includes(searchText)) {
      return false;
    }
    if (filterCategory && item.category !== filterCategory) return false;
    return true;
  });

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>物料价格管理</Title>
      <Paragraph type="secondary">管理您的物料信息和价格，支持批量导入导出</Paragraph>

      <Card>
        {/* 工具栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="搜索物料"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
          <Col xs={24} sm={24} md={14} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<DownloadOutlined />}>下载模板</Button>
              <Button icon={<UploadOutlined />}>批量导入</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
                添加物料
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 物料表格 */}
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个物料`,
          }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingItem ? '编辑物料' : '添加物料'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="物料名称"
                rules={[{ required: true, message: '请输入物料名称' }]}
              >
                <Input placeholder="请输入物料名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brand"
                label="品牌"
                rules={[{ required: true, message: '请输入品牌' }]}
              >
                <Input placeholder="请输入品牌" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="分类"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select options={categoryOptions} placeholder="请选择分类" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="单位"
                rules={[{ required: true, message: '请输入单位' }]}
              >
                <Input placeholder="如：桶、瓶、袋" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="spec"
                label="规格"
                rules={[{ required: true, message: '请输入规格' }]}
              >
                <Input placeholder="如：5L/桶" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="单价"
                rules={[{ required: true, message: '请输入单价' }]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  addonBefore="¥"
                  style={{ width: '100%' }}
                  placeholder="请输入单价"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="stock" label="库存">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入库存数量" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? '保存' : '添加'}
              </Button>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
