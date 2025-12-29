'use client';

import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  DollarOutlined,
  TruckOutlined,
  LineChartOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/userSlice';

const { Header, Sider, Content } = Layout;

interface SupplierLayoutProps {
  children: React.ReactNode;
}

export default function SupplierLayout({ children }: SupplierLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    router.push('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => router.push('/supplier/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '配送设置',
      onClick: () => router.push('/supplier/delivery-settings'),
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
      key: '/supplier',
      icon: <DashboardOutlined />,
      label: '订单概览',
    },
    {
      key: '/supplier/orders',
      icon: <ShoppingCartOutlined />,
      label: '订单管理',
    },
    {
      key: '/supplier/materials',
      icon: <AppstoreOutlined />,
      label: '物料价格管理',
      children: [
        {
          key: '/supplier/materials/list',
          label: '价格列表',
        },
        {
          key: '/supplier/materials/import',
          label: '批量导入',
        },
        {
          key: '/supplier/materials/stock',
          label: '库存管理',
        },
      ],
    },
    {
      key: '/supplier/market',
      icon: <DollarOutlined />,
      label: '市场行情',
    },
    {
      key: '/supplier/print',
      icon: <PrinterOutlined />,
      label: '送货单打印',
    },
    {
      key: '/supplier/delivery',
      icon: <TruckOutlined />,
      label: '配送管理',
      children: [
        {
          key: '/supplier/delivery/settings',
          label: '配送设置',
        },
        {
          key: '/supplier/delivery/areas',
          label: '配送区域',
        },
        {
          key: '/supplier/delivery/tracking',
          label: '运单管理',
        },
      ],
    },
    {
      key: '/supplier/stats',
      icon: <LineChartOutlined />,
      label: '统计分析',
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
          {collapsed ? 'IMS' : '供应商管理'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={['/supplier/materials', '/supplier/delivery']}
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
            供应商后台
          </div>
          
          <Space size="middle">
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => router.push('/supplier/notifications')}
              />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.displayName || user?.name || '供应商'}</span>
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
