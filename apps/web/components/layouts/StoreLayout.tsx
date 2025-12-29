'use client';

import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  DollarOutlined,
  LineChartOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/userSlice';

const { Header, Sider, Content } = Layout;

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const cartCount = useSelector((state: RootState) => state.cart.totalCount);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    router.push('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '门店信息',
      onClick: () => router.push('/store/profile'),
    },
    {
      key: 'address',
      icon: <EnvironmentOutlined />,
      label: '收货地址',
      onClick: () => router.push('/store/address'),
    },
    {
      type: 'divider' as const,
      key: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: '/store',
      icon: <DashboardOutlined />,
      label: '数据看板',
    },
    {
      key: '/store/order',
      icon: <ShoppingOutlined />,
      label: '在线订货',
      children: [
        {
          key: '/store/order/browse',
          label: '浏览商品',
        },
        {
          key: '/store/order/cart',
          label: `购物车${cartCount > 0 ? `(${cartCount})` : ''}`,
        },
      ],
    },
    {
      key: '/store/orders',
      icon: <ShoppingCartOutlined />,
      label: '订单管理',
      children: [
        {
          key: '/store/orders/list',
          label: '我的订单',
        },
        {
          key: '/store/orders/history',
          label: '历史订单',
        },
      ],
    },
    {
      key: '/store/market',
      icon: <DollarOutlined />,
      label: '市场行情',
    },
    {
      key: '/store/suppliers',
      icon: <AppstoreOutlined />,
      label: '供应商列表',
    },
    {
      key: '/store/reorder',
      icon: <HistoryOutlined />,
      label: '常购清单',
    },
    {
      key: '/store/stats',
      icon: <LineChartOutlined />,
      label: '统计分析',
      children: [
        {
          key: '/store/stats/orders',
          label: '订单统计',
        },
        {
          key: '/store/stats/categories',
          label: '分类统计',
        },
        {
          key: '/store/stats/suppliers',
          label: '供应商统计',
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={240}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 16 : 20,
          fontWeight: 'bold',
        }}>
          {collapsed ? 'IMS' : '门店订货'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={['/store/order', '/store/orders', '/store/stats']}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        }}>
          <div style={{ fontSize: 16, fontWeight: 500 }}>
            门店订货系统
          </div>
          
          <Space size="middle">
            <Badge count={cartCount} showZero>
              <Button
                type="text"
                icon={<ShoppingCartOutlined />}
                onClick={() => router.push('/store/order/cart')}
              />
            </Badge>
            
            <Badge count={2} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => router.push('/store/notifications')}
              />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.name || '门店'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: '24px',
          padding: 24,
          background: '#fff',
          minHeight: 280,
          borderRadius: 8,
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
