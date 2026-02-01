'use client';

import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
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
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface PrintTemplate {
  key: string;
  id: number;
  name: string;
  content: string;
  supplierIds: number[];
  supplierNames: string[];
  isDefault: boolean;
  createdAt: string;
}

export default function PrintTemplatesPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<PrintTemplate | null>(null);
  const [previewContent, setPreviewContent] = useState('');
  const [form] = Form.useForm();

  // 供应商选项
  const supplierOptions = [
    { value: 1, label: '生鲜供应商A' },
    { value: 2, label: '粮油供应商B' },
    { value: 3, label: '调味品供应商C' },
    { value: 4, label: '冷冻食品供应商D' },
    { value: 5, label: '饮料供应商E' },
  ];

  // 模拟模板数据
  const [templateData, setTemplateData] = useState<PrintTemplate[]>([
    {
      key: '1',
      id: 1,
      name: '默认送货单模板',
      content: `【送货单】
订单号：{{order_no}}
下单时间：{{order_time}}
----------------------------------------
门店：{{store_name}}
地址：{{store_address}}
联系人：{{contact_name}}
电话：{{contact_phone}}
----------------------------------------
商品明细：
{{#items}}
{{item_name}} x{{quantity}} {{unit}}  ¥{{price}}
{{/items}}
----------------------------------------
合计金额：¥{{total_amount}}
----------------------------------------
配送员签名：____________
门店签收：____________
日期：____________`,
      supplierIds: [],
      supplierNames: [],
      isDefault: true,
      createdAt: '2024-01-10',
    },
    {
      key: '2',
      id: 2,
      name: '生鲜供应商专用模板',
      content: `【生鲜送货单】
订单号：{{order_no}}
门店：{{store_name}}
----------------------------------------
{{#items}}
{{item_name}} {{spec}} x{{quantity}}
{{/items}}
----------------------------------------
温馨提示：请当场验收生鲜商品
签收人：____________`,
      supplierIds: [1],
      supplierNames: ['生鲜供应商A'],
      isDefault: false,
      createdAt: '2024-01-15',
    },
  ]);

  // 可用变量
  const availableVariables = [
    { name: '{{order_no}}', desc: '订单号' },
    { name: '{{order_time}}', desc: '下单时间' },
    { name: '{{store_name}}', desc: '门店名称' },
    { name: '{{store_address}}', desc: '门店地址' },
    { name: '{{contact_name}}', desc: '联系人' },
    { name: '{{contact_phone}}', desc: '联系电话' },
    { name: '{{total_amount}}', desc: '订单总金额' },
    { name: '{{#items}}...{{/items}}', desc: '商品列表循环' },
    { name: '{{item_name}}', desc: '商品名称' },
    { name: '{{spec}}', desc: '商品规格' },
    { name: '{{quantity}}', desc: '数量' },
    { name: '{{unit}}', desc: '单位' },
    { name: '{{price}}', desc: '单价' },
  ];

  // 打开新建/编辑弹窗
  const handleOpenModal = (item?: PrintTemplate) => {
    if (item) {
      setEditingItem(item);
      form.setFieldsValue(item);
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 预览模板
  const handlePreview = (content: string) => {
    // 模拟数据替换
    let previewText = content
      .replace('{{order_no}}', 'ORD202401290001')
      .replace('{{order_time}}', '2024-01-29 10:30:00')
      .replace('{{store_name}}', '门店A - 朝阳店')
      .replace('{{store_address}}', '北京市朝阳区XX路XX号')
      .replace('{{contact_name}}', '张三')
      .replace('{{contact_phone}}', '138****8888')
      .replace('{{total_amount}}', '358.00')
      .replace(
        /\{\{#items\}\}[\s\S]*?\{\{\/items\}\}/g,
        '金龙鱼大豆油5L x2 桶  ¥116.00\n海天酱油500ml x5 瓶  ¥62.50\n中粮大米10kg x2 袋  ¥90.00'
      );

    setPreviewContent(previewText);
    setPreviewVisible(true);
  };

  // 删除模板
  const handleDelete = (id: number) => {
    setTemplateData((prev) => prev.filter((item) => item.id !== id));
    message.success('模板已删除');
  };

  // 提交表单
  const handleSubmit = async (values: { name: string; content: string; supplierIds: number[] }) => {
    const supplierNames =
      values.supplierIds
        ?.map((id) => supplierOptions.find((s) => s.value === id)?.label ?? '')
        .filter(Boolean) ?? [];

    if (editingItem) {
      setTemplateData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...values, supplierNames } : item
        )
      );
      message.success('模板已更新');
    } else {
      const newItem: PrintTemplate = {
        key: String(Date.now()),
        id: Date.now(),
        name: values.name,
        content: values.content,
        supplierIds: values.supplierIds || [],
        supplierNames,
        isDefault: false,
        createdAt: new Date().toISOString().split('T')[0] ?? '',
      };
      setTemplateData((prev) => [...prev, newItem]);
      message.success('模板已创建');
    }
    setModalVisible(false);
  };

  // 表格列定义
  const columns: ColumnsType<PrintTemplate> = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Space>
          {name}
          {record.isDefault && <Tag color="blue">默认</Tag>}
        </Space>
      ),
    },
    {
      title: '分配供应商',
      dataIndex: 'supplierNames',
      key: 'supplierNames',
      render: (names: string[]) =>
        names.length > 0 ? (
          names.map((n) => <Tag key={n}>{n}</Tag>)
        ) : (
          <Text type="secondary">全部供应商</Text>
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
            onClick={() => handlePreview(record.content)}
          >
            预览
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            编辑
          </Button>
          {!record.isDefault && (
            <Popconfirm
              title="删除模板"
              description="确定要删除此模板吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div>
        <Title level={3}>送货单模板配置</Title>
        <Paragraph type="secondary">管理送货单打印模板，可为不同供应商分配专属模板</Paragraph>

        <Card
          title="模板列表"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
              创建模板
            </Button>
          }
        >
          <Table dataSource={templateData} columns={columns} pagination={false} />
        </Card>

        {/* 新建/编辑弹窗 */}
        <Modal
          title={editingItem ? '编辑模板' : '创建模板'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  name="name"
                  label="模板名称"
                  rules={[{ required: true, message: '请输入模板名称' }]}
                >
                  <Input placeholder="请输入模板名称" />
                </Form.Item>

                <Form.Item name="supplierIds" label="分配供应商" tooltip="不选择则对所有供应商生效">
                  <Select
                    mode="multiple"
                    placeholder="选择供应商（不选则对全部生效）"
                    options={supplierOptions}
                    allowClear
                  />
                </Form.Item>

                <Form.Item
                  name="content"
                  label="模板内容"
                  rules={[{ required: true, message: '请输入模板内容' }]}
                >
                  <TextArea
                    rows={15}
                    placeholder="请输入模板内容，可使用右侧变量"
                    style={{ fontFamily: 'monospace' }}
                  />
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
            </Col>
            <Col span={8}>
              <Card size="small" title="可用变量" style={{ background: '#fafafa' }}>
                {availableVariables.map((v, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <Text code copyable={{ text: v.name }}>
                      {v.name}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {v.desc}
                    </Text>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
        </Modal>

        {/* 预览弹窗 */}
        <Modal
          title="模板预览"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width={500}
        >
          <pre
            style={{
              background: '#f5f5f5',
              padding: 16,
              borderRadius: 4,
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
            }}
          >
            {previewContent}
          </pre>
        </Modal>
      </div>
    </AdminLayout>
  );
}
