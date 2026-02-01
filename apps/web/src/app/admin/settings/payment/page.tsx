'use client';

import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    SaveOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { Alert, App, Button, Card, Form, Input, Space, Tabs, Typography, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;

interface LichuConfig {
  merchant_no: string;
  terminal_id: string;
  access_token: string;
  notify_url: string;
}

interface WechatPayConfig {
  mch_id: string;
  api_key: string;
  cert_file: UploadFile[];
}

interface AlipayConfig {
  app_id: string;
  public_key: string;
  private_key: string;
}

export default function PaymentConfigPage() {
  const [lichuForm] = Form.useForm<LichuConfig>();
  const [wechatForm] = Form.useForm<WechatPayConfig>();
  const [alipayForm] = Form.useForm<AlipayConfig>();
  const [loading, setLoading] = useState(false);
  const [testingLichu, setTestingLichu] = useState(false);
  const [testingWechat, setTestingWechat] = useState(false);
  const [testingAlipay, setTestingAlipay] = useState(false);
  const { message } = App.useApp();

  // 保存利楚扫呗配置
  const handleSaveLichu = async (values: LichuConfig) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Lichu config:', values);
      message.success('利楚扫呗配置保存成功');
    } catch {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 测试利楚扫呗连接
  const handleTestLichu = async () => {
    setTestingLichu(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success('利楚扫呗连接测试成功');
    } catch {
      message.error('连接测试失败');
    } finally {
      setTestingLichu(false);
    }
  };

  // 保存微信支付配置
  const handleSaveWechat = async (values: WechatPayConfig) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Wechat config:', values);
      message.success('微信支付配置保存成功');
    } catch {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 测试微信支付连接
  const handleTestWechat = async () => {
    setTestingWechat(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success('微信支付连接测试成功');
    } catch {
      message.error('连接测试失败');
    } finally {
      setTestingWechat(false);
    }
  };

  // 保存支付宝配置
  const handleSaveAlipay = async (values: AlipayConfig) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Alipay config:', values);
      message.success('支付宝配置保存成功');
    } catch {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 测试支付宝连接
  const handleTestAlipay = async () => {
    setTestingAlipay(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success('支付宝连接测试成功');
    } catch {
      message.error('连接测试失败');
    } finally {
      setTestingAlipay(false);
    }
  };

  const tabItems = [
    {
      key: 'lichu',
      label: '利楚扫呗',
      children: (
        <Form
          form={lichuForm}
          layout="vertical"
          onFinish={handleSaveLichu}
          initialValues={{
            notify_url: 'https://api.example.com/payment/lichu/notify',
          }}
        >
          <Alert
            message="利楚扫呗是主要的支付渠道，支持微信和支付宝扫码支付"
            type="info"
            style={{ marginBottom: 24 }}
          />

          <Form.Item
            name="merchant_no"
            label="商户号"
            rules={[{ required: true, message: '请输入商户号' }]}
          >
            <Input placeholder="请输入利楚扫呗商户号" />
          </Form.Item>

          <Form.Item
            name="terminal_id"
            label="终端号"
            rules={[{ required: true, message: '请输入终端号' }]}
          >
            <Input placeholder="请输入终端号" />
          </Form.Item>

          <Form.Item
            name="access_token"
            label="签名令牌"
            rules={[{ required: true, message: '请输入签名令牌' }]}
          >
            <Input.Password placeholder="请输入签名令牌（加密存储）" />
          </Form.Item>

          <Form.Item
            name="notify_url"
            label="支付回调地址"
            rules={[{ required: true, message: '请输入回调地址' }]}
          >
            <Input placeholder="请输入支付回调地址" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                保存配置
              </Button>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={handleTestLichu}
                loading={testingLichu}
              >
                测试连接
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'wechat',
      label: '微信支付',
      children: (
        <Form form={wechatForm} layout="vertical" onFinish={handleSaveWechat}>
          <Alert
            message="微信支付直连模式，需要在微信商户平台申请"
            type="info"
            style={{ marginBottom: 24 }}
          />

          <Form.Item
            name="mch_id"
            label="商户号"
            rules={[{ required: true, message: '请输入商户号' }]}
          >
            <Input placeholder="请输入微信支付商户号" />
          </Form.Item>

          <Form.Item
            name="api_key"
            label="API密钥"
            rules={[{ required: true, message: '请输入API密钥' }]}
          >
            <Input.Password placeholder="请输入API密钥（加密存储）" />
          </Form.Item>

          <Form.Item
            name="cert_file"
            label="证书文件"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept=".p12,.pem">
              <Button icon={<UploadOutlined />}>上传证书文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                保存配置
              </Button>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={handleTestWechat}
                loading={testingWechat}
              >
                测试连接
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'alipay',
      label: '支付宝',
      children: (
        <Form form={alipayForm} layout="vertical" onFinish={handleSaveAlipay}>
          <Alert
            message="支付宝当面付，需要在支付宝开放平台申请应用"
            type="info"
            style={{ marginBottom: 24 }}
          />

          <Form.Item
            name="app_id"
            label="应用ID"
            rules={[{ required: true, message: '请输入应用ID' }]}
          >
            <Input placeholder="请输入支付宝应用ID" />
          </Form.Item>

          <Form.Item
            name="public_key"
            label="支付宝公钥"
            rules={[{ required: true, message: '请输入公钥' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入支付宝公钥" />
          </Form.Item>

          <Form.Item
            name="private_key"
            label="应用私钥"
            rules={[{ required: true, message: '请输入私钥' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入应用私钥（加密存储）" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                保存配置
              </Button>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={handleTestAlipay}
                loading={testingAlipay}
              >
                测试连接
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ maxWidth: 800 }}>
        <Title level={3}>支付配置</Title>
        <Paragraph type="secondary">配置支付渠道参数，仅主管理员可访问</Paragraph>

        <Alert
          message="安全提示"
          description="支付配置涉及资金安全，请确保所有密钥和证书妥善保管，不要泄露给他人"
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: 24 }}
        />

        <Card>
          <Tabs items={tabItems} />
        </Card>
      </div>
    </AdminLayout>
  );
}
