'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import {
  BarChartOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, Space } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const { Header, Sider, Content } = Layout;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, currentRole } = useAppSelector((state) => state.auth);

  // Generate menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: '数据看板',
      },
    ];

    if (currentRole === 'store') {
      return [
        ...baseItems,
        {
          key: '/products',
          icon: <ShoppingCartOutlined />,
          label: '在线订货',
        },
        {
          key: '/cart',
          icon: <ShoppingCartOutlined />,
          label: '购物车',
        },
        {
          key: '/orders',
          icon: <FileTextOutlined />,
          label: '订单管理',
        },
        {
          key: '/market',
          icon: <BarChartOutlined />,
          label: '市场行情',
        },
        {
          key: '/statistics',
          icon: <BarChartOutlined />,
          label: '统计分析',
        },
      ];
    }

    if (currentRole === 'supplier') {
      return [
        ...baseItems,
        {
          key: '/orders',
          icon: <FileTextOutlined />,
          label: '订单管理',
        },
        {
          key: '/market',
          icon: <BarChartOutlined />,
          label: '市场行情',
        },
        {
          key: '/materials',
          icon: <ShopOutlined />,
          label: '物料价格管理',
        },
        {
          key: '/delivery',
          icon: <SettingOutlined />,
          label: '配送设置',
        },
      ];
    }

    if (currentRole === 'admin') {
      return [
        ...baseItems,
        {
          key: '/orders',
          icon: <FileTextOutlined />,
          label: '订单管理',
        },
        {
          key: '/market',
          icon: <BarChartOutlined />,
          label: '市场行情',
        },
        {
          key: '/stores',
          icon: <ShopOutlined />,
          label: '门店管理',
        },
        {
          key: '/suppliers',
          icon: <TeamOutlined />,
          label: '供应商管理',
        },
        {
          key: '/materials',
          icon: <ShoppingCartOutlined />,
          label: '物料管理',
        },
        {
          key: '/markup',
          icon: <SettingOutlined />,
          label: '加价管理',
        },
        {
          key: '/admins',
          icon: <UserOutlined />,
          label: '管理员管理',
        },
        {
          key: '/system',
          icon: <SettingOutlined />,
          label: '系统设置',
        },
      ];
    }

    return baseItems;
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
      onClick: () => router.push('/settings'),
    },
    {
      type: 'divider' as const,
      key: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        dispatch(logout());
        router.push('/login');
      },
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  const getRoleName = () => {
    const roleMap = {
      admin: '管理员',
      supplier: '供应商',
      store: '门店',
    };
    return roleMap[currentRole as keyof typeof roleMap] || '用户';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="logo"
          style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.3)' }}
        />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={getMenuItems()}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Space style={{ marginRight: 24 }}>
            <span>{getRoleName()}</span>
            <Dropdown menu={{ items: userMenuItems }}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.username || '用户'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
