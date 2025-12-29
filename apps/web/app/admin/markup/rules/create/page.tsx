'use client';

import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AdminLayout from '../../../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;

interface RuleFormData {
  name: string;
  storeId: number | null;
  supplierId: number | null;
  materialId: number | null;
  markupType: 'fixed' | 'percentage';
  markupValue: number;
  minMarkup: number | null;
  maxMarkup: number | null;
  enabled: boolean;
}

export default function CreateMarkupRulePage() {
  const router = useRouter();
  const [form] = Form.useForm<RuleFormData>();
  const [loading, setLoading] = useState(false);
  const [markupType, setMarkupType] = useState<'fixed' | 'percentage'>('percentage');

  // 门店选项
  const storeOptions = [
    { value: 1, label: '门店A - 朝阳店' },
    { value: 2, label: '门店B - 海淀店' },
    { value: 3, label: '门店C - 西城店' },
    { value: 4, label: '门店D - 东城店' },
    { value: 5, label: '门店E - 丰台店' },
  ];

  // 供应商选项
  const supplierOptions = [
    { value: 1, label: '生鲜供应商A' },
    { value: 2, label: '粮油供应商B' },
    { value: 3, label: '调味品供应商C' },
    { value: 4, label: '冷冻食品供应商D' },
    { value: 5, label: '饮料供应商E' },
  ];

  // 物料选项
  const materialOptions = [
    { value: 101, label: '金龙鱼大豆油5L' },
    { value: 102, label: '福临门花生油5L' },
    { value: 103, label: '海天酱油500ml' },
    { value: 104, label: '太太乐鸡精200g' },
    { value: 105, label: '中粮大米10kg' },
  ];

  // 计算优先级说明
  const getPriorityDescription = () => {
    const storeId = form.getFieldValue('storeId');
    const supplierId = form.getFieldValue('supplierId');
    const materialId = form.getFieldValue('materialId');

    let priority = 1;
    const factors: string[] = [];

    if (storeId) {
      priority += 1;
      factors.push('指定门店');
    }
    if (supplierId) {
      priority += 1;
      factors.push('指定供应商');
    }
    if (materialId) {
      priority += 1;
      factors.push('指定物料');
    }

    if (factors.length === 0) {
      return `优先级: ${priority} (全局默认规则)`;
    }
    return `优先级: ${priority} (${factors.join(' + ')})`;
  };

  // 提交表单
  const handleSubmit = async (values: RuleFormData) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form values:', values);
      message.success('加价规则创建成功');
      router.push('/admin/markup/rules');
    } catch {
      message.error('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 800 }}>
        <Title level={3}>新建加价规则</Title>
        <Paragraph type="secondary">创建新的加价规则，规则越具体优先级越高</Paragraph>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              markupType: 'percentage',
              markupValue: 3,
              enabled: true,
            }}
            onValuesChange={() => form.validateFields(['name'])}
          >
            <Form.Item
              name="name"
              label="规则名称"
              rules={[{ required: true, message: '请输入规则名称' }]}
            >
              <Input placeholder="请输入规则名称" maxLength={50} />
            </Form.Item>

            <Form.Item name="storeId" label="门店" tooltip="不选择则对所有门店生效">
              <Select
                placeholder="选择门店（可选，不选则对全部门店生效）"
                options={storeOptions}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item name="supplierId" label="供应商" tooltip="不选择则对所有供应商生效">
              <Select
                placeholder="选择供应商（可选，不选则对全部供应商生效）"
                options={supplierOptions}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item name="materialId" label="物料" tooltip="不选择则对所有物料生效">
              <Select
                placeholder="选择物料（可选，不选则对全部物料生效）"
                options={materialOptions}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              name="markupType"
              label="加价方式"
              rules={[{ required: true, message: '请选择加价方式' }]}
            >
              <Radio.Group onChange={(e) => setMarkupType(e.target.value)}>
                <Radio value="fixed">固定金额</Radio>
                <Radio value="percentage">百分比</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="markupValue"
              label={markupType === 'fixed' ? '加价金额（元）' : '加价比例（%）'}
              rules={[
                { required: true, message: '请输入加价值' },
                { type: 'number', min: 0, message: '加价值不能为负数' },
              ]}
            >
              <InputNumber
                placeholder={markupType === 'fixed' ? '请输入加价金额' : '请输入加价比例'}
                style={{ width: '100%' }}
                min={0}
                precision={markupType === 'fixed' ? 2 : 1}
                addonAfter={markupType === 'fixed' ? '元' : '%'}
              />
            </Form.Item>

            {markupType === 'percentage' && (
              <>
                <Form.Item
                  name="minMarkup"
                  label="最低加价金额（元）"
                  tooltip="百分比加价时，加价金额的最低值"
                >
                  <InputNumber
                    placeholder="请输入最低加价金额（可选）"
                    style={{ width: '100%' }}
                    min={0}
                    precision={2}
                    addonAfter="元"
                  />
                </Form.Item>

                <Form.Item
                  name="maxMarkup"
                  label="最高加价金额（元）"
                  tooltip="百分比加价时，加价金额的最高值"
                >
                  <InputNumber
                    placeholder="请输入最高加价金额（可选）"
                    style={{ width: '100%' }}
                    min={0}
                    precision={2}
                    addonAfter="元"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item name="enabled" label="启用状态" valuePropName="checked">
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>

            <Alert
              message="优先级说明"
              description={
                <div>
                  <Text>{getPriorityDescription()}</Text>
                  <br />
                  <Text type="secondary">
                    规则越具体（指定门店+供应商+物料）优先级越高，优先级高的规则会覆盖低优先级规则
                  </Text>
                </div>
              }
              type="info"
              style={{ marginBottom: 24 }}
            />

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  提交
                </Button>
                <Button onClick={() => router.back()}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AdminLayout>
  );
}
