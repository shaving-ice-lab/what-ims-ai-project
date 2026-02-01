'use client';

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  message,
  Space,
  Typography,
} from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;

interface CreateAdminForm {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  permissions: string[];
}

export default function CreateAdminPage() {
  const router = useRouter();
  const [form] = Form.useForm<CreateAdminForm>();
  const [loading, setLoading] = useState(false);

  // 权限选项
  const permissionGroups = [
    {
      title: '订单相关',
      permissions: [
        { value: 'order', label: '订单管理', desc: '查看和处理订单' },
        { value: 'order_cancel', label: '订单取消', desc: '审核取消申请' },
      ],
    },
    {
      title: '用户相关',
      permissions: [
        { value: 'store', label: '门店管理', desc: '管理门店账号和信息' },
        { value: 'supplier', label: '供应商管理', desc: '管理供应商账号和信息' },
      ],
    },
    {
      title: '商品相关',
      permissions: [
        { value: 'material', label: '物料管理', desc: '管理物料和分类' },
        { value: 'product_audit', label: '产品审核', desc: '审核供应商产品' },
      ],
    },
    {
      title: '财务相关',
      permissions: [
        { value: 'markup', label: '加价管理', desc: '配置加价规则' },
        { value: 'report', label: '报表统计', desc: '查看统计报表' },
      ],
    },
  ];

  // 敏感权限（子管理员不可选）
  const sensitivePermissions = ['payment_config', 'api_config', 'admin_manage'];

  // 提交表单
  const handleSubmit = async (values: CreateAdminForm) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Creating admin:', values);
      message.success('子管理员创建成功');
      router.push('/admin/admins');
    } catch {
      message.error('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 800 }}>
        <Title level={3}>创建子管理员</Title>
        <Paragraph type="secondary">创建新的子管理员账号，并分配相应权限</Paragraph>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ permissions: [] }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" style={{ marginBottom: 24 }}>
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入管理员姓名" maxLength={20} />
            </Form.Item>

            <Form.Item
              name="username"
              label="登录账号"
              rules={[
                { required: true, message: '请输入登录账号' },
                {
                  pattern: /^[a-zA-Z0-9_]{4,20}$/,
                  message: '账号只能包含字母、数字和下划线，长度4-20',
                },
              ]}
            >
              <Input placeholder="请输入登录账号" maxLength={20} />
            </Form.Item>

            <Form.Item
              name="password"
              label="登录密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码长度至少6位' },
              ]}
            >
              <Input.Password placeholder="请输入登录密码" maxLength={20} />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="请再次输入密码" maxLength={20} />
            </Form.Item>

            <Form.Item
              name="phone"
              label="手机号"
              rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}
            >
              <Input placeholder="请输入手机号（可选）" maxLength={11} />
            </Form.Item>
          </Card>

          {/* 权限分配 */}
          <Card title="权限分配" style={{ marginBottom: 24 }}>
            <Alert
              message="权限说明"
              description="子管理员无法获得支付配置、API配置、管理员管理等敏感权限"
              type="info"
              style={{ marginBottom: 24 }}
            />

            <Form.Item name="permissions">
              <Checkbox.Group style={{ width: '100%' }}>
                {permissionGroups.map((group, groupIndex) => (
                  <div key={groupIndex} style={{ marginBottom: 16 }}>
                    <Text strong>{group.title}</Text>
                    <div style={{ marginTop: 8, marginLeft: 16 }}>
                      {group.permissions.map((perm) => (
                        <div key={perm.value} style={{ marginBottom: 8 }}>
                          <Checkbox value={perm.value}>
                            {perm.label}
                            <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                              {perm.desc}
                            </Text>
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                    {groupIndex < permissionGroups.length - 1 && <Divider />}
                  </div>
                ))}
              </Checkbox.Group>
            </Form.Item>

            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                敏感权限（不可选）：
                {sensitivePermissions.map((p) => (
                  <Text key={p} delete style={{ marginLeft: 8 }}>
                    {p}
                  </Text>
                ))}
              </Text>
            </div>
          </Card>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                创建管理员
              </Button>
              <Button onClick={() => router.back()}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </AdminLayout>
  );
}
