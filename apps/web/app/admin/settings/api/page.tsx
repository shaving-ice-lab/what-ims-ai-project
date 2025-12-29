'use client';

import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;

interface ApiKeyItem {
  key: string;
  id: number;
  name: string;
  apiKey: string;
  supplierId: number | null;
  supplierName: string | null;
  webhookUrl: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastUsed: string | null;
}

export default function ApiConfigPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiKeyItem | null>(null);
  const [form] = Form.useForm();

  // 模拟API密钥数据
  const [apiKeyData, setApiKeyData] = useState<ApiKeyItem[]>([
    {
      key: '1',
      id: 1,
      name: '全局API密钥',
      apiKey: 'sk_live_xxxxxxxxxxxxxxxxxxxx',
      supplierId: null,
      supplierName: null,
      webhookUrl: 'https://api.example.com/webhook',
      status: 'active',
      createdAt: '2024-01-10',
      lastUsed: '2024-01-29',
    },
    {
      key: '2',
      id: 2,
      name: '生鲜供应商A专用',
      apiKey: 'sk_live_yyyyyyyyyyyyyyyyyyyy',
      supplierId: 1,
      supplierName: '生鲜供应商A',
      webhookUrl: 'https://supplier-a.com/api/callback',
      status: 'active',
      createdAt: '2024-01-15',
      lastUsed: '2024-01-28',
    },
    {
      key: '3',
      id: 3,
      name: '粮油供应商B专用',
      apiKey: 'sk_live_zzzzzzzzzzzzzzzzzzzz',
      supplierId: 2,
      supplierName: '粮油供应商B',
      webhookUrl: 'https://supplier-b.com/webhook',
      status: 'inactive',
      createdAt: '2024-01-18',
      lastUsed: null,
    },
  ]);

  // 复制API密钥
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    message.success('API密钥已复制到剪贴板');
  };

  // 重新生成密钥
  const handleRegenerateKey = (id: number) => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 22)}`;
    setApiKeyData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, apiKey: newKey } : item))
    );
    message.success('API密钥已重新生成');
  };

  // 删除密钥
  const handleDelete = (id: number) => {
    setApiKeyData((prev) => prev.filter((item) => item.id !== id));
    message.success('API密钥已删除');
  };

  // 打开新建/编辑弹窗
  const handleOpenModal = (item?: ApiKeyItem) => {
    if (item) {
      setEditingItem(item);
      form.setFieldsValue(item);
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async (values: { name: string; webhookUrl: string }) => {
    if (editingItem) {
      setApiKeyData((prev) =>
        prev.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item))
      );
      message.success('API配置已更新');
    } else {
      const newItem: ApiKeyItem = {
        key: String(Date.now()),
        id: Date.now(),
        name: values.name,
        apiKey: `sk_live_${Math.random().toString(36).substring(2, 22)}`,
        supplierId: null,
        supplierName: null,
        webhookUrl: values.webhookUrl,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0] ?? '',
        lastUsed: null,
      };
      setApiKeyData((prev) => [...prev, newItem]);
      message.success('API密钥已创建');
    }
    setModalVisible(false);
  };

  // 表格列定义
  const columns: ColumnsType<ApiKeyItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'API密钥',
      dataIndex: 'apiKey',
      key: 'apiKey',
      render: (key: string) => (
        <Space>
          <Text code>{key.substring(0, 12)}...</Text>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopyKey(key)}
          />
        </Space>
      ),
    },
    {
      title: '关联供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      render: (name: string | null) => name || <Tag>全局</Tag>,
    },
    {
      title: 'Webhook地址',
      dataIndex: 'webhookUrl',
      key: 'webhookUrl',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '最后使用',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (date: string | null) => date || '-',
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
            title="重新生成密钥"
            description="确定要重新生成此API密钥吗？原密钥将立即失效"
            onConfirm={() => handleRegenerateKey(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" icon={<ReloadOutlined />}>
              重新生成
            </Button>
          </Popconfirm>
          <Popconfirm
            title="删除密钥"
            description="确定要删除此API密钥吗？"
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

  return (
    <AdminLayout>
      <div>
        <Title level={3}>API配置</Title>
        <Paragraph type="secondary">管理系统API密钥和Webhook推送配置，仅主管理员可访问</Paragraph>

        <Card
          title="API密钥管理"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
              新建密钥
            </Button>
          }
        >
          <Table dataSource={apiKeyData} columns={columns} pagination={false} />
        </Card>

        {/* 新建/编辑弹窗 */}
        <Modal
          title={editingItem ? '编辑API配置' : '新建API密钥'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
              <Input placeholder="请输入API密钥名称" />
            </Form.Item>

            <Form.Item
              name="webhookUrl"
              label="Webhook推送地址"
              rules={[
                { required: true, message: '请输入Webhook地址' },
                { type: 'url', message: '请输入有效的URL' },
              ]}
            >
              <Input placeholder="https://example.com/webhook" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingItem ? '保存' : '创建'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
