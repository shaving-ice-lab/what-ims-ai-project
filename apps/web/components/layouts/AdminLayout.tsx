'use client';

import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Button } from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined,
  TagsOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/userSlice';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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

  const userMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: '个人资料',
          onClick: () => router.push('/admin/profile'),
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: '系统设置',
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
      ]}
    />
  );

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: '数据看板',
    },
    {
      key: '/admin/suppliers',
      icon: <ShopOutlined />,
      label: '供应商管理',
    },
    {
      key: '/admin/stores',
      icon: <HomeOutlined />,
      label: '门店管理',
    },
    {
      key: '/admin/materials',
      icon: <AppstoreOutlined />,
      label: '物料管理',
      children: [
        {
          key: '/admin/materials/categories',
          label: '分类管理',
        },
        {
          key: '/admin/materials/list',
          label: '物料列表',
        },
        {
          key: '/admin/materials/skus',
          label: 'SKU管理',
        },
      ],
    },
    {
      key: '/admin/orders',
      icon: <ShoppingCartOutlined />,
      label: '订单管理',
    },
    {
      key: '/admin/price-markup',
      icon: <TagsOutlined />,
      label: '加价管理',
    },
    {
      key: '/admin/reports',
      icon: <LineChartOutlined />,
      label: '统计报表',
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: '用户管理',
      children: [
        {
          key: '/admin/users/admins',
          label: '管理员',
        },
        {
          key: '/admin/users/audit',
          label: '审核管理',
        },
      ],
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: '系统配置',
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
          {collapsed ? 'IMS' : '供应链订货系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={['/admin/materials', '/admin/users']}
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
            管理后台
          </div>
          
          <Space size="middle">
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => router.push('/admin/notifications')}
              />
            </Badge>
            
            <Dropdown menu={{ items: userMenu.props.items }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.name || user?.username || '管理员'}</span>
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
