import { authService } from '@/services/auth';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import {
    BarChartOutlined,
    BellOutlined,
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
import { Avatar, Badge, Button, Dropdown, Layout, Menu, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './MainLayout.module.css';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const notifications = useSelector((state: RootState) => state.system.notifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
    router.push('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link href="/profile">个人信息</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link href="/settings">设置</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  const getMenuItems = () => {
    const role = user?.role;
    
    if (role === 'admin' || role === 'sub_admin') {
      return [
        {
          key: '/admin/dashboard',
          icon: <DashboardOutlined />,
          label: <Link href="/admin/dashboard">数据概览</Link>,
        },
        {
          key: '/admin/orders',
          icon: <ShoppingCartOutlined />,
          label: <Link href="/admin/orders">订单管理</Link>,
        },
        {
          key: '/admin/suppliers',
          icon: <TeamOutlined />,
          label: <Link href="/admin/suppliers">供应商管理</Link>,
        },
        {
          key: '/admin/stores',
          icon: <ShopOutlined />,
          label: <Link href="/admin/stores">门店管理</Link>,
        },
        {
          key: '/admin/materials',
          icon: <FileTextOutlined />,
          label: <Link href="/admin/materials">物料管理</Link>,
        },
        {
          key: '/admin/reports',
          icon: <BarChartOutlined />,
          label: <Link href="/admin/reports">报表分析</Link>,
        },
        {
          key: '/admin/settings',
          icon: <SettingOutlined />,
          label: <Link href="/admin/settings">系统设置</Link>,
        },
      ];
    } else if (role === 'supplier') {
      return [
        {
          key: '/supplier/dashboard',
          icon: <DashboardOutlined />,
          label: <Link href="/supplier/dashboard">数据概览</Link>,
        },
        {
          key: '/supplier/orders',
          icon: <ShoppingCartOutlined />,
          label: <Link href="/supplier/orders">订单管理</Link>,
        },
        {
          key: '/supplier/materials',
          icon: <FileTextOutlined />,
          label: <Link href="/supplier/materials">物料报价</Link>,
        },
        {
          key: '/supplier/delivery',
          icon: <TeamOutlined />,
          label: <Link href="/supplier/delivery">配送设置</Link>,
        },
        {
          key: '/supplier/stats',
          icon: <BarChartOutlined />,
          label: <Link href="/supplier/stats">统计分析</Link>,
        },
      ];
    } else if (role === 'store') {
      return [
        {
          key: '/store/dashboard',
          icon: <DashboardOutlined />,
          label: <Link href="/store/dashboard">数据概览</Link>,
        },
        {
          key: '/store/order',
          icon: <ShoppingCartOutlined />,
          label: <Link href="/store/order">订货中心</Link>,
        },
        {
          key: '/store/orders',
          icon: <FileTextOutlined />,
          label: <Link href="/store/orders">订单管理</Link>,
        },
        {
          key: '/store/cart',
          icon: <ShoppingCartOutlined />,
          label: <Link href="/store/cart">购物车</Link>,
        },
        {
          key: '/store/stats',
          icon: <BarChartOutlined />,
          label: <Link href="/store/stats">统计分析</Link>,
        },
      ];
    }
    
    return [];
  };

  return (
    <Layout className={styles.layout}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className={styles.sider}
      >
        <div className={styles.logo}>
          {collapsed ? 'IMS' : '供应链订货系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[router.pathname]}
          items={getMenuItems()}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.trigger}
          />
          
          <Space className={styles.headerRight}>
            <Badge count={unreadCount} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => router.push('/notifications')}
              />
            </Badge>
            
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space className={styles.userInfo}>
                <Avatar size="small" icon={<UserOutlined />} />
                <span>{user?.name || user?.username}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
