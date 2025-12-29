'use client';

import {
  CrownOutlined,
  EditOutlined,
  LockOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;

interface AdminItem {
  key: string;
  id: number;
  name: string;
  username: string;
  phone: string | null;
  isMaster: boolean;
  permissions: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string | null;
}

export default function AdminListPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  // 模拟管理员数据
  const [adminsData, setAdminsData] = useState<AdminItem[]>([
    {
      key: '1',
      id: 1,
      name: '主管理员',
      username: 'admin',
      phone: '138****8888',
      isMaster: true,
      permissions: ['all'],
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-29 14:30:00',
    },
    {
      key: '2',
      id: 2,
      name: '运营管理员',
      username: 'operator',
      phone: '139****9999',
      isMaster: false,
      permissions: ['order', 'store', 'supplier'],
      status: 'active',
      createdAt: '2024-01-10',
      lastLogin: '2024-01-29 10:15:00',
    },
    {
      key: '3',
      id: 3,
      name: '财务管理员',
      username: 'finance',
      phone: '137****7777',
      isMaster: false,
      permissions: ['order', 'report', 'markup'],
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-01-28 16:20:00',
    },
    {
      key: '4',
      id: 4,
      name: '客服管理员',
      username: 'support',
      phone: null,
      isMaster: false,
      permissions: ['order', 'store'],
      status: 'inactive',
      createdAt: '2024-01-20',
      lastLogin: null,
    },
  ]);

  // 权限标签映射
  const permissionLabels: Record<string, string> = {
    all: '全部权限',
    order: '订单管理',
    store: '门店管理',
    supplier: '供应商管理',
    material: '物料管理',
    markup: '加价管理',
    report: '报表统计',
    setting: '系统设置',
  };

  // 禁用/启用管理员
  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setAdminsData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus as 'active' | 'inactive' } : item
      )
    );
    message.success(`管理员已${newStatus === 'active' ? '启用' : '禁用'}`);
  };

  // 重置密码
  const handleResetPassword = (_id: number) => {
    message.success('密码已重置为默认密码：123456');
  };

  // 表格列定义
  const columns: ColumnsType<AdminItem> = [
    {
      title: '管理员',
      key: 'admin',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>
              {record.name}
              {record.isMaster && (
                <Tag color="gold" style={{ marginLeft: 8 }}>
                  <CrownOutlined /> 主管理员
                </Tag>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>@{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string | null) => phone || '-',
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 280,
      render: (permissions: string[]) => (
        <Space wrap>
          {permissions.map((p) => (
            <Tag key={p} color={p === 'all' ? 'purple' : 'blue'}>
              {permissionLabels[p] || p}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={status === 'active' ? '启用' : '禁用'}
        />
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (time: string | null) => time || '从未登录',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {!record.isMaster && (
            <>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => router.push(`/admin/admins/${record.id}/edit`)}
              >
                编辑
              </Button>
              <Popconfirm
                title="重置密码"
                description="确定要重置该管理员的密码吗？"
                onConfirm={() => handleResetPassword(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" size="small" icon={<LockOutlined />}>
                  重置密码
                </Button>
              </Popconfirm>
              <Popconfirm
                title={record.status === 'active' ? '禁用管理员' : '启用管理员'}
                description={`确定要${record.status === 'active' ? '禁用' : '启用'}该管理员吗？`}
                onConfirm={() => handleToggleStatus(record.id, record.status)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" size="small" danger={record.status === 'active'}>
                  {record.status === 'active' ? '禁用' : '启用'}
                </Button>
              </Popconfirm>
            </>
          )}
          {record.isMaster && <span style={{ color: '#999' }}>主管理员不可操作</span>}
        </Space>
      ),
    },
  ];

  // 过滤数据
  const filteredData = adminsData.filter(
    (item) => item.name.includes(searchText) || item.username.includes(searchText)
  );

  return (
    <AdminLayout>
      <div>
        <Title level={3}>管理员管理</Title>
        <Paragraph type="secondary">管理系统管理员账号，仅主管理员可访问此页面</Paragraph>

        <Card>
          <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
            <Input
              placeholder="搜索管理员"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/admin/admins/create')}
            >
              创建子管理员
            </Button>
          </Space>

          <Table dataSource={filteredData} columns={columns} pagination={false} />
        </Card>
      </div>
    </AdminLayout>
  );
}
