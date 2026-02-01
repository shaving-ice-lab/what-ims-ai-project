'use client';

import { ClockCircleOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  InputNumber,
  message,
  Radio,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useState } from 'react';

const { Title, Paragraph, Text } = Typography;

interface DeliverySettings {
  minOrderAmount: number;
  deliveryDays: string[];
  deliveryMode: 'self_delivery' | 'express_delivery';
}

export default function SupplierDeliveryPage() {
  const [form] = Form.useForm<DeliverySettings>();
  const [loading, setLoading] = useState(false);
  const [auditStatus, setAuditStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>(
    'approved'
  );
  const [rejectReason] = useState<string | null>(null);

  // 初始值
  const initialValues: DeliverySettings = {
    minOrderAmount: 100,
    deliveryDays: ['1', '3', '5'],
    deliveryMode: 'self_delivery',
  };

  // 配送日选项
  const deliveryDayOptions = [
    { label: '周一', value: '1' },
    { label: '周二', value: '2' },
    { label: '周三', value: '3' },
    { label: '周四', value: '4' },
    { label: '周五', value: '5' },
    { label: '周六', value: '6' },
    { label: '周日', value: '0' },
  ];

  // 配送模式选项
  const deliveryModeOptions = [
    {
      value: 'self_delivery',
      label: '自配送',
      desc: '供应商自行安排配送，适合本地配送',
    },
    {
      value: 'express_delivery',
      label: '快递配送',
      desc: '通过快递公司配送，需上传运单号',
    },
  ];

  // 提交设置
  const handleSubmit = async (values: DeliverySettings) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Saving delivery settings:', values);
      setAuditStatus('pending');
      message.success('配送设置已提交审核');
    } catch {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <Title level={3}>配送设置</Title>
      <Paragraph type="secondary">设置您的起送价、配送日和配送模式，修改后需要管理员审核</Paragraph>

      {/* 审核状态提示 */}
      {auditStatus === 'pending' && (
        <Alert
          message="配送设置审核中"
          description="您的配送设置变更正在等待管理员审核，审核期间将使用原有设置"
          type="warning"
          showIcon
          icon={<ClockCircleOutlined />}
          style={{ marginBottom: 24 }}
        />
      )}

      {auditStatus === 'rejected' && rejectReason && (
        <Alert
          message="配送设置审核未通过"
          description={`驳回原因：${rejectReason}`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
        {/* 起送价设置 */}
        <Card title="起送价设置" style={{ marginBottom: 24 }}>
          <Form.Item
            name="minOrderAmount"
            label="最低起送价"
            rules={[
              { required: true, message: '请输入起送价' },
              { type: 'number', min: 0, message: '起送价不能为负数' },
            ]}
            extra="门店订单金额需达到此金额才能下单"
          >
            <InputNumber
              min={0}
              precision={2}
              addonBefore="¥"
              style={{ width: 200 }}
              placeholder="请输入起送价"
            />
          </Form.Item>
          <Text type="secondary">
            当前生效起送价：<Text strong>¥{initialValues.minOrderAmount}</Text>
          </Text>
        </Card>

        {/* 配送日设置 */}
        <Card title="配送日设置" style={{ marginBottom: 24 }}>
          <Form.Item
            name="deliveryDays"
            label="选择配送日"
            rules={[{ required: true, message: '请至少选择一个配送日' }]}
            extra="门店只能选择您设置的配送日进行下单"
          >
            <Checkbox.Group options={deliveryDayOptions} />
          </Form.Item>

          <Divider />

          <Text type="secondary">
            当前生效配送日：
            {initialValues.deliveryDays.map((d) => {
              const day = deliveryDayOptions.find((o) => o.value === d);
              return (
                <Tag key={d} color="blue" style={{ marginLeft: 4 }}>
                  {day?.label}
                </Tag>
              );
            })}
          </Text>
        </Card>

        {/* 配送模式设置 */}
        <Card title="配送模式设置" style={{ marginBottom: 24 }}>
          <Form.Item
            name="deliveryMode"
            label="选择配送模式"
            rules={[{ required: true, message: '请选择配送模式' }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                {deliveryModeOptions.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    <Space direction="vertical" size={0}>
                      <Text strong>{option.label}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {option.desc}
                      </Text>
                    </Space>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
        </Card>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
            size="large"
          >
            提交审核
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
