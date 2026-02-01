'use client';

import { LockOutlined, QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Space,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;

interface SystemParams {
  order_cancel_threshold: number;
  order_cancel_request_timeout: number;
  payment_timeout: number;
  payment_polling_interval: number;
  unpaid_order_cancel_timeout: number;
  service_fee_rate: number;
  service_fee_enabled: boolean;
  webhook_retry_times: number;
  webhook_retry_interval: number;
  webhook_timeout: number;
  markup_global_enabled: boolean;
  cart_expire_days: number;
  order_no_prefix: string;
}

export default function SystemParamsPage() {
  const [form] = Form.useForm<SystemParams>();
  const [loading, setLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [pendingValues, setPendingValues] = useState<SystemParams | null>(null);
  const [password, setPassword] = useState('');

  // 初始值（模拟从API获取）
  const initialValues: SystemParams = {
    order_cancel_threshold: 60,
    order_cancel_request_timeout: 24,
    payment_timeout: 30,
    payment_polling_interval: 3,
    unpaid_order_cancel_timeout: 30,
    service_fee_rate: 0.6,
    service_fee_enabled: true,
    webhook_retry_times: 3,
    webhook_retry_interval: 5,
    webhook_timeout: 10,
    markup_global_enabled: true,
    cart_expire_days: 7,
    order_no_prefix: 'ORD',
  };

  // 检查是否修改了敏感配置
  const checkSensitiveChanges = (values: SystemParams): boolean => {
    return (
      values.service_fee_rate !== initialValues.service_fee_rate ||
      values.service_fee_enabled !== initialValues.service_fee_enabled ||
      values.markup_global_enabled !== initialValues.markup_global_enabled
    );
  };

  // 提交表单
  const handleSubmit = async (values: SystemParams) => {
    if (checkSensitiveChanges(values)) {
      setPendingValues(values);
      setPasswordModalVisible(true);
      return;
    }
    await saveConfig(values);
  };

  // 保存配置
  const saveConfig = async (values: SystemParams) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Saving config:', values);
      message.success('系统参数保存成功');
    } catch {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 密码确认
  const handlePasswordConfirm = async () => {
    if (password !== 'admin123') {
      message.error('密码错误');
      return;
    }
    setPasswordModalVisible(false);
    setPassword('');
    if (pendingValues) {
      await saveConfig(pendingValues);
      setPendingValues(null);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 800 }}>
        <Title level={3}>系统参数配置</Title>
        <Paragraph type="secondary">配置系统运行的各项参数，修改敏感配置需要密码确认</Paragraph>

        <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
          {/* 订单相关配置 */}
          <Card title="订单相关配置" style={{ marginBottom: 24 }}>
            <Form.Item
              name="order_cancel_threshold"
              label={
                <Space>
                  门店自主取消时限
                  <Tooltip title="门店在下单后多长时间内可以自主取消订单">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: '请输入取消时限' }]}
            >
              <InputNumber min={1} max={1440} addonAfter="分钟" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="order_cancel_request_timeout"
              label={
                <Space>
                  取消申请超时提醒
                  <Tooltip title="取消申请超过该时间未处理时发送提醒">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: '请输入超时时间' }]}
            >
              <InputNumber min={1} max={72} addonAfter="小时" style={{ width: '100%' }} />
            </Form.Item>
          </Card>

          {/* 支付相关配置 */}
          <Card title="支付相关配置" style={{ marginBottom: 24 }}>
            <Form.Item
              name="payment_timeout"
              label={
                <Space>
                  支付超时时间
                  <Tooltip title="用户发起支付后的等待超时时间">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: '请输入超时时间' }]}
            >
              <InputNumber min={1} max={60} addonAfter="分钟" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="payment_polling_interval"
              label={
                <Space>
                  支付状态轮询间隔
                  <Tooltip title="轮询支付状态的时间间隔">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: '请输入轮询间隔' }]}
            >
              <InputNumber min={1} max={10} addonAfter="秒" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="unpaid_order_cancel_timeout"
              label={
                <Space>
                  未支付订单自动取消时间
                  <Tooltip title="订单未支付超过该时间后自动取消">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: '请输入自动取消时间' }]}
            >
              <InputNumber min={5} max={1440} addonAfter="分钟" style={{ width: '100%' }} />
            </Form.Item>
          </Card>

          {/* 费率相关配置 */}
          <Card
            title={
              <Space>
                费率相关配置
                <LockOutlined style={{ color: '#faad14' }} />
                <Text type="warning" style={{ fontSize: 12 }}>
                  敏感配置
                </Text>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Form.Item
              name="service_fee_rate"
              label={
                <Space>
                  支付手续费费率
                  <Tooltip title="支付时收取的手续费比例">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: '请输入费率' }]}
            >
              <InputNumber
                min={0}
                max={5}
                step={0.1}
                precision={2}
                addonAfter="%"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item name="service_fee_enabled" label="手续费转嫁开关" valuePropName="checked">
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
          </Card>

          {/* Webhook相关配置 */}
          <Card title="Webhook推送配置" style={{ marginBottom: 24 }}>
            <Form.Item
              name="webhook_retry_times"
              label={
                <Space>
                  推送重试次数
                  <Tooltip title="推送失败后的重试次数">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: '请输入重试次数' }]}
            >
              <InputNumber min={0} max={10} addonAfter="次" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="webhook_retry_interval"
              label={
                <Space>
                  重试间隔基数
                  <Tooltip title="每次重试的间隔时间基数，实际间隔 = 基数 * 重试次数">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: '请输入间隔基数' }]}
            >
              <InputNumber min={1} max={60} addonAfter="秒" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="webhook_timeout"
              label={
                <Space>
                  推送超时时间
                  <Tooltip title="单次推送的超时时间">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: '请输入超时时间' }]}
            >
              <InputNumber min={1} max={30} addonAfter="秒" style={{ width: '100%' }} />
            </Form.Item>
          </Card>

          {/* 加价相关配置 */}
          <Card
            title={
              <Space>
                加价相关配置
                <LockOutlined style={{ color: '#faad14' }} />
                <Text type="warning" style={{ fontSize: 12 }}>
                  敏感配置
                </Text>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Form.Item name="markup_global_enabled" label="全局加价总开关" valuePropName="checked">
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
          </Card>

          {/* 其他系统参数 */}
          <Card title="其他系统参数" style={{ marginBottom: 24 }}>
            <Form.Item
              name="cart_expire_days"
              label={
                <Space>
                  购物车过期时间
                  <Tooltip title="购物车商品的过期天数">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: '请输入过期天数' }]}
            >
              <InputNumber min={1} max={30} addonAfter="天" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="order_no_prefix"
              label={
                <Space>
                  订单编号前缀
                  <Tooltip title="订单号的固定前缀">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: '请输入订单编号前缀' }]}
            >
              <Input maxLength={10} style={{ width: '100%' }} />
            </Form.Item>
          </Card>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              保存配置
            </Button>
          </Form.Item>
        </Form>

        {/* 密码确认弹窗 */}
        <Modal
          title="敏感配置修改确认"
          open={passwordModalVisible}
          onOk={handlePasswordConfirm}
          onCancel={() => {
            setPasswordModalVisible(false);
            setPassword('');
          }}
          okText="确认"
          cancelText="取消"
        >
          <Paragraph type="warning">您正在修改敏感配置，请输入管理员密码确认</Paragraph>
          <Input.Password
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}
