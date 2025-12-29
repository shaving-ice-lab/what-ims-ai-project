'use client';

/**
 * PermissionMenu - 权限菜单组件
 * 根据用户权限动态生成侧边栏菜单
 */

import {
  BarChartOutlined,
  DashboardOutlined,
  FileImageOutlined,
  MoneyCollectOutlined,
  OrderedListOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, type MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

export interface MenuConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  permission?: string;
  children?: MenuConfig[];
  roles?: ('admin' | 'sub_admin' | 'supplier' | 'store')[];
}

// 管理员菜单配置
const adminMenuConfig: MenuConfig[] = [
  {
    key: 'dashboard',
    label: '数据看板',
    icon: <DashboardOutlined />,
    path: '/admin/dashboard',
  },
  {
    key: 'orders',
    label: '订单管理',
    icon: <OrderedListOutlined />,
    path: '/admin/orders',
    permission: 'order',
  },
  {
    key: 'suppliers',
    label: '供应商管理',
    icon: <TeamOutlined />,
    path: '/admin/suppliers',
    permission: 'supplier',
  },
  {
    key: 'stores',
    label: '门店管理',
    icon: <ShopOutlined />,
    path: '/admin/stores',
    permission: 'store',
  },
  {
    key: 'materials',
    label: '物料管理',
    icon: <ShopOutlined />,
    path: '/admin/materials',
    permission: 'material',
  },
  {
    key: 'media',
    label: '素材库',
    icon: <FileImageOutlined />,
    path: '/admin/media',
    permission: 'media',
  },
  {
    key: 'markup',
    label: '加价管理',
    icon: <MoneyCollectOutlined />,
    path: '/admin/markup',
    permission: 'markup',
  },
  {
    key: 'reports',
    label: '数据报表',
    icon: <BarChartOutlined />,
    path: '/admin/reports',
    permission: 'report',
  },
  {
    key: 'system',
    label: '系统设置',
    icon: <SettingOutlined />,
    permission: 'system_config',
    children: [
      {
        key: 'admins',
        label: '管理员管理',
        path: '/admin/system/admins',
        permission: 'admin_manage',
      },
      {
        key: 'config',
        label: '系统配置',
        path: '/admin/system/config',
        permission: 'system_config',
      },
    ],
  },
];

// 供应商菜单配置
const supplierMenuConfig: MenuConfig[] = [
  {
    key: 'dashboard',
    label: '数据概览',
    icon: <DashboardOutlined />,
    path: '/supplier/dashboard',
  },
  {
    key: 'orders',
    label: '订单管理',
    icon: <OrderedListOutlined />,
    path: '/supplier/orders',
  },
  {
    key: 'materials',
    label: '商品管理',
    icon: <ShopOutlined />,
    path: '/supplier/materials',
  },
  {
    key: 'prices',
    label: '价格管理',
    icon: <MoneyCollectOutlined />,
    path: '/supplier/prices',
  },
  {
    key: 'settings',
    label: '配送设置',
    icon: <SettingOutlined />,
    path: '/supplier/settings',
  },
];

// 门店菜单配置
const storeMenuConfig: MenuConfig[] = [
  {
    key: 'home',
    label: '首页',
    icon: <DashboardOutlined />,
    path: '/store/home',
  },
  {
    key: 'suppliers',
    label: '供应商列表',
    icon: <TeamOutlined />,
    path: '/store/suppliers',
  },
  {
    key: 'cart',
    label: '购物车',
    icon: <ShopOutlined />,
    path: '/store/cart',
  },
  {
    key: 'orders',
    label: '我的订单',
    icon: <OrderedListOutlined />,
    path: '/store/orders',
  },
  {
    key: 'profile',
    label: '个人中心',
    icon: <UserOutlined />,
    path: '/store/profile',
  },
];

export interface PermissionMenuProps {
  role: 'admin' | 'sub_admin' | 'supplier' | 'store';
  permissions?: string[];
  isPrimary?: boolean;
  collapsed?: boolean;
  selectedKey?: string;
  onSelect?: (key: string) => void;
}

const PermissionMenu: React.FC<PermissionMenuProps> = ({
  role,
  permissions = [],
  isPrimary = false,
  collapsed = false,
  selectedKey,
  onSelect,
}) => {
  const router = useRouter();

  // 根据角色获取菜单配置
  const getMenuConfig = (): MenuConfig[] => {
    switch (role) {
      case 'admin':
      case 'sub_admin':
        return adminMenuConfig;
      case 'supplier':
        return supplierMenuConfig;
      case 'store':
        return storeMenuConfig;
      default:
        return [];
    }
  };

  // 检查是否有权限
  const hasPermission = (permission?: string): boolean => {
    if (!permission) return true;
    if (isPrimary) return true; // 主管理员拥有所有权限
    return permissions.includes(permission);
  };

  // 过滤菜单项
  const filterMenuItems = (items: MenuConfig[]): MenuConfig[] => {
    return items.filter((item) => {
      // 检查权限
      if (!hasPermission(item.permission)) {
        return false;
      }

      // 检查角色
      if (item.roles && !item.roles.includes(role)) {
        return false;
      }

      // 递归过滤子菜单
      if (item.children) {
        item.children = filterMenuItems(item.children);
        // 如果所有子菜单都被过滤掉，则移除父菜单
        if (item.children.length === 0) {
          return false;
        }
      }

      return true;
    });
  };

  // 转换为 Ant Design Menu 格式
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertToMenuItems = (items: MenuConfig[]): any[] => {
    return items.map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: convertToMenuItems(item.children),
        };
      }
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
      };
    });
  };

  // 构建路径映射
  const buildPathMap = (
    items: MenuConfig[],
    map: Record<string, string> = {}
  ): Record<string, string> => {
    items.forEach((item) => {
      if (item.path) {
        map[item.key] = item.path;
      }
      if (item.children) {
        buildPathMap(item.children, map);
      }
    });
    return map;
  };

  const menuConfig = useMemo(
    () => filterMenuItems(getMenuConfig()),
    [role, permissions, isPrimary]
  );
  const menuItems = useMemo(() => convertToMenuItems(menuConfig), [menuConfig]);
  const pathMap = useMemo(() => buildPathMap(menuConfig), [menuConfig]);

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    const path = pathMap[key];
    if (path) {
      router.push(path);
    }
    onSelect?.(key);
  };

  return (
    <Menu
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
      selectedKeys={selectedKey ? [selectedKey] : undefined}
      items={menuItems}
      onClick={handleClick}
      style={{ borderRight: 0 }}
    />
  );
};

export default PermissionMenu;
