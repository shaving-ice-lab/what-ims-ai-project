'use client';

import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import {
    ApiOutlined,
    AppstoreOutlined,
    AuditOutlined,
    BarChartOutlined,
    BellOutlined,
    DashboardOutlined,
    DollarOutlined,
    FileTextOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PictureOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { App, Avatar, Badge, Button, Dropdown, Layout, Menu, Space } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { message } = App.useApp();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch(logout());
    message.success('已退出登录');
    router.push('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => router.push('/admin/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => router.push('/admin/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const menuItems: MenuItem[] = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link href="/admin">数据看板</Link>,
    },
    {
      key: 'order-management',
      icon: <ShoppingCartOutlined />,
      label: '订单管理',
      children: [
        {
          key: '/admin/orders',
          label: <Link href="/admin/orders">订单列表</Link>,
        },
        {
          key: '/admin/delivery-audit',
          label: <Link href="/admin/delivery-audit">配送审核</Link>,
        },
      ],
    },
    {
      key: 'user-management',
      icon: <TeamOutlined />,
      label: '用户管理',
      children: [
        {
          key: '/admin/suppliers',
          label: <Link href="/admin/suppliers">供应商管理</Link>,
        },
        {
          key: '/admin/stores',
          label: <Link href="/admin/stores">门店管理</Link>,
        },
        {
          key: '/admin/admins',
          label: <Link href="/admin/admins">管理员管理</Link>,
        },
      ],
    },
    {
      key: '/admin/materials',
      icon: <AppstoreOutlined />,
      label: <Link href="/admin/materials">物料管理</Link>,
    },
    {
      key: 'markup-management',
      icon: <DollarOutlined />,
      label: '加价管理',
      children: [
        {
          key: '/admin/markup/rules',
          label: <Link href="/admin/markup/rules">加价规则</Link>,
        },
        {
          key: '/admin/markup/switches',
          label: <Link href="/admin/markup/switches">加价开关</Link>,
        },
        {
          key: '/admin/markup/simulate',
          label: <Link href="/admin/markup/simulate">价格模拟</Link>,
        },
        {
          key: '/admin/markup/import',
          label: <Link href="/admin/markup/import">批量导入</Link>,
        },
        {
          key: '/admin/markup/statistics',
          label: <Link href="/admin/markup/statistics">加价统计</Link>,
        },
      ],
    },
    {
      key: 'market-management',
      icon: <BarChartOutlined />,
      label: '行情管理',
      children: [
        {
          key: '/admin/market',
          label: <Link href="/admin/market">行情价格</Link>,
        },
        {
          key: '/admin/market/alerts',
          label: <Link href="/admin/market/alerts">预警设置</Link>,
        },
      ],
    },
    {
      key: 'media-management',
      icon: <PictureOutlined />,
      label: '媒资管理',
      children: [
        {
          key: '/admin/media',
          label: <Link href="/admin/media">媒资库</Link>,
        },
        {
          key: '/admin/media/match-rules',
          label: <Link href="/admin/media/match-rules">匹配规则</Link>,
        },
      ],
    },
    {
      key: '/admin/product-audit',
      icon: <AuditOutlined />,
      label: <Link href="/admin/product-audit">商品审核</Link>,
    },
    {
      key: 'reports',
      icon: <FileTextOutlined />,
      label: '报表统计',
      children: [
        {
          key: '/admin/reports/analysis',
          label: <Link href="/admin/reports/analysis">数据分析</Link>,
        },
        {
          key: '/admin/reports/materials',
          label: <Link href="/admin/reports/materials">物料报表</Link>,
        },
        {
          key: '/admin/reports/suppliers',
          label: <Link href="/admin/reports/suppliers">供应商报表</Link>,
        },
        {
          key: '/admin/reports/stores',
          label: <Link href="/admin/reports/stores">门店报表</Link>,
        },
      ],
    },
    {
      key: 'system-settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      children: [
        {
          key: '/admin/settings/params',
          label: <Link href="/admin/settings/params">参数配置</Link>,
        },
        {
          key: '/admin/settings/payment',
          label: <Link href="/admin/settings/payment">支付配置</Link>,
        },
        {
          key: '/admin/settings/print-templates',
          label: <Link href="/admin/settings/print-templates">打印模板</Link>,
        },
        {
          key: '/admin/settings/api',
          label: <Link href="/admin/settings/api">API配置</Link>,
        },
        {
          key: '/admin/settings/logs',
          label: <Link href="/admin/settings/logs">操作日志</Link>,
        },
      ],
    },
    {
      key: '/admin/webhook-logs',
      icon: <ApiOutlined />,
      label: <Link href="/admin/webhook-logs">Webhook日志</Link>,
    },
  ];

  // Find selected keys based on pathname
  const getSelectedKeys = () => {
    return [pathname];
  };

  // Find open keys for submenus
  const getOpenKeys = () => {
    const openKeys: string[] = [];
    menuItems.forEach((item) => {
      if (item && 'children' in item && item.children) {
        const hasMatch = item.children.some(
          (child) => child && 'key' in child && pathname.startsWith(child.key as string)
        );
        if (hasMatch && item.key) {
          openKeys.push(item.key as string);
        }
      }
    });
    return openKeys;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: collapsed ? 16 : 18,
            fontWeight: 'bold',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          {collapsed ? 'IMS' : '供应链订货系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 64, height: 64 }}
          />

          <Space size={16}>
            <Badge count={0} size="small">
              <Button type="text" icon={<BellOutlined />} style={{ fontSize: 16 }} />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} />
                <span>{user?.name || user?.username || '管理员'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
