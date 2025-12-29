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
  Popconfirm,
  Space,
  Spin,
  Typography,
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;

interface EditAdminForm {
  name: string;
  username: string;
  phone?: string;
  permissions: string[];
}

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.id as string;
  const [form] = Form.useForm<EditAdminForm>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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

  // 加载管理员数据
  useEffect(() => {
    const loadAdminData = async () => {
      setInitialLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 模拟数据
        const mockData: Record<string, EditAdminForm> = {
          '2': {
            name: '运营管理员',
            username: 'operator',
            phone: '139****9999',
            permissions: ['order', 'store', 'supplier'],
          },
          '3': {
            name: '财务管理员',
            username: 'finance',
            phone: '137****7777',
            permissions: ['order', 'report', 'markup'],
          },
          '4': {
            name: '客服管理员',
            username: 'support',
            phone: '',
            permissions: ['order', 'store'],
          },
        };

        const data = mockData[adminId] ?? mockData['2'];
        if (data) {
          form.setFieldsValue(data);
        }
      } catch {
        message.error('加载数据失败');
      } finally {
        setInitialLoading(false);
      }
    };

    loadAdminData();
  }, [adminId, form]);

  // 提交表单
  const handleSubmit = async (values: EditAdminForm) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Updating admin:', values);
      message.success('管理员信息更新成功');
      router.push('/admin/admins');
    } catch {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置密码
  const handleResetPassword = async () => {
    message.success('密码已重置为默认密码：123456');
  };

  // 禁用管理员
  const handleDisable = async () => {
    message.success('管理员已禁用');
    router.push('/admin/admins');
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>加载中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: 800 }}>
        <Title level={3}>编辑子管理员</Title>
        <Paragraph type="secondary">修改管理员信息和权限配置，ID: {adminId}</Paragraph>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* 基本信息 */}
          <Card title="基本信息" style={{ marginBottom: 24 }}>
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入管理员姓名" maxLength={20} />
            </Form.Item>

            <Form.Item name="username" label="登录账号">
              <Input disabled />
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

          {/* 账号操作 */}
          <Card title="账号操作" style={{ marginBottom: 24 }}>
            <Space>
              <Popconfirm
                title="重置密码"
                description="确定要重置该管理员的密码吗？"
                onConfirm={handleResetPassword}
                okText="确定"
                cancelText="取消"
              >
                <Button>重置密码</Button>
              </Popconfirm>
              <Popconfirm
                title="禁用管理员"
                description="确定要禁用该管理员吗？禁用后该账号将无法登录"
                onConfirm={handleDisable}
                okText="确定"
                cancelText="取消"
              >
                <Button danger>禁用账号</Button>
              </Popconfirm>
            </Space>
          </Card>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存修改
              </Button>
              <Button onClick={() => router.back()}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </AdminLayout>
  );
}
