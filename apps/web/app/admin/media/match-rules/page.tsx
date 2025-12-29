'use client';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;

interface MatchRule {
  key: string;
  id: number;
  name: string;
  ruleType: 'name' | 'brand' | 'sku' | 'keyword';
  matchPattern: string;
  threshold: number;
  priority: number;
  enabled: boolean;
}

export default function MatchRulesPage() {
  const [autoMatchEnabled, setAutoMatchEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MatchRule | null>(null);
  const [form] = Form.useForm();

  // 模拟规则数据
  const [rulesData, setRulesData] = useState<MatchRule[]>([
    {
      key: '1',
      id: 1,
      name: '品牌名称精确匹配',
      ruleType: 'brand',
      matchPattern: 'exact',
      threshold: 100,
      priority: 1,
      enabled: true,
    },
    {
      key: '2',
      id: 2,
      name: 'SKU编码匹配',
      ruleType: 'sku',
      matchPattern: 'exact',
      threshold: 100,
      priority: 2,
      enabled: true,
    },
    {
      key: '3',
      id: 3,
      name: '产品名称模糊匹配',
      ruleType: 'name',
      matchPattern: 'fuzzy',
      threshold: 80,
      priority: 3,
      enabled: true,
    },
    {
      key: '4',
      id: 4,
      name: '关键词匹配',
      ruleType: 'keyword',
      matchPattern: 'contains',
      threshold: 70,
      priority: 4,
      enabled: false,
    },
  ]);

  // 规则类型选项
  const ruleTypeOptions = [
    { value: 'name', label: '产品名称' },
    { value: 'brand', label: '品牌' },
    { value: 'sku', label: 'SKU编码' },
    { value: 'keyword', label: '关键词' },
  ];

  // 匹配模式选项
  const matchPatternOptions = [
    { value: 'exact', label: '精确匹配' },
    { value: 'fuzzy', label: '模糊匹配' },
    { value: 'contains', label: '包含匹配' },
    { value: 'regex', label: '正则匹配' },
  ];

  // 规则类型标签颜色
  const ruleTypeColors: Record<string, string> = {
    name: 'blue',
    brand: 'green',
    sku: 'purple',
    keyword: 'orange',
  };

  // 打开新建/编辑弹窗
  const handleOpenModal = (item?: MatchRule) => {
    if (item) {
      setEditingItem(item);
      form.setFieldsValue(item);
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 切换启用状态
  const handleToggleEnabled = (id: number, enabled: boolean) => {
    setRulesData((prev) => prev.map((item) => (item.id === id ? { ...item, enabled } : item)));
    message.success(`规则已${enabled ? '启用' : '禁用'}`);
  };

  // 删除规则
  const handleDelete = (id: number) => {
    setRulesData((prev) => prev.filter((item) => item.id !== id));
    message.success('规则已删除');
  };

  // 提交表单
  const handleSubmit = async (values: Omit<MatchRule, 'key' | 'id'>) => {
    if (editingItem) {
      setRulesData((prev) =>
        prev.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item))
      );
      message.success('规则已更新');
    } else {
      const newItem: MatchRule = {
        key: String(Date.now()),
        id: Date.now(),
        ...values,
      };
      setRulesData((prev) => [...prev, newItem]);
      message.success('规则已创建');
    }
    setModalVisible(false);
    form.resetFields();
  };

  // 表格列定义
  const columns: ColumnsType<MatchRule> = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '规则类型',
      dataIndex: 'ruleType',
      key: 'ruleType',
      render: (type: string) => {
        const option = ruleTypeOptions.find((o) => o.value === type);
        return <Tag color={ruleTypeColors[type]}>{option?.label}</Tag>;
      },
    },
    {
      title: '匹配模式',
      dataIndex: 'matchPattern',
      key: 'matchPattern',
      render: (pattern: string) => {
        const option = matchPatternOptions.find((o) => o.value === pattern);
        return option?.label;
      },
    },
    {
      title: '相似度阈值',
      dataIndex: 'threshold',
      key: 'threshold',
      render: (threshold: number) => `${threshold}%`,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleEnabled(record.id, checked)}
          disabled={!autoMatchEnabled}
          size="small"
        />
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
            title="删除规则"
            description="确定要删除此规则吗？"
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
        <Title level={3}>图片匹配规则配置</Title>
        <Paragraph type="secondary">
          配置商品图片自动匹配规则，系统将根据规则自动为商品匹配素材库中的图片
        </Paragraph>

        {/* 自动匹配开关 */}
        <Card style={{ marginBottom: 24 }}>
          <Space>
            <span>自动匹配功能：</span>
            <Switch
              checked={autoMatchEnabled}
              onChange={setAutoMatchEnabled}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
            {autoMatchEnabled ? (
              <Tag color="success">已开启</Tag>
            ) : (
              <Tag color="default">已关闭</Tag>
            )}
          </Space>
          {!autoMatchEnabled && (
            <Alert
              message="自动匹配功能已关闭，商品图片将不会自动匹配"
              type="warning"
              style={{ marginTop: 16 }}
              showIcon
            />
          )}
        </Card>

        {/* 规则列表 */}
        <Card
          title="匹配规则列表"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
              新建规则
            </Button>
          }
        >
          <Table dataSource={rulesData} columns={columns} pagination={false} />
        </Card>

        {/* 新建/编辑弹窗 */}
        <Modal
          title={editingItem ? '编辑规则' : '新建规则'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              threshold: 80,
              priority: rulesData.length + 1,
              enabled: true,
            }}
          >
            <Form.Item
              name="name"
              label="规则名称"
              rules={[{ required: true, message: '请输入规则名称' }]}
            >
              <Input placeholder="请输入规则名称" />
            </Form.Item>

            <Form.Item
              name="ruleType"
              label="规则类型"
              rules={[{ required: true, message: '请选择规则类型' }]}
            >
              <Select options={ruleTypeOptions} placeholder="请选择规则类型" />
            </Form.Item>

            <Form.Item
              name="matchPattern"
              label="匹配模式"
              rules={[{ required: true, message: '请选择匹配模式' }]}
            >
              <Select options={matchPatternOptions} placeholder="请选择匹配模式" />
            </Form.Item>

            <Form.Item
              name="threshold"
              label="相似度阈值"
              rules={[{ required: true, message: '请输入相似度阈值' }]}
              tooltip="匹配相似度达到该阈值时才会匹配成功"
            >
              <InputNumber min={1} max={100} addonAfter="%" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="priority"
              label="优先级"
              rules={[{ required: true, message: '请输入优先级' }]}
              tooltip="数字越小优先级越高"
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="enabled" label="启用状态" valuePropName="checked">
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingItem ? '保存' : '创建'}
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
    </AdminLayout>
  );
}
