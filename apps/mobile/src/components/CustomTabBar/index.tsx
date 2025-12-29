import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import './index.scss';

export type UserRole = 'store' | 'supplier' | 'admin';

interface TabItem {
  key: string;
  icon: string;
  activeIcon: string;
  label: string;
  path: string;
}

// 门店用户TabBar配置
const storeTabBarConfig: TabItem[] = [
  { key: 'home', icon: '🏠', activeIcon: '🏠', label: '首页', path: '/pages/index/index' },
  { key: 'market', icon: '📊', activeIcon: '📊', label: '行情', path: '/pages/market/index' },
  { key: 'cart', icon: '🛒', activeIcon: '🛒', label: '购物车', path: '/pages/cart/index' },
  { key: 'order', icon: '📋', activeIcon: '📋', label: '订单', path: '/pages/order/index' },
  { key: 'mine', icon: '👤', activeIcon: '👤', label: '我的', path: '/pages/mine/index' },
];

// 供应商TabBar配置
const supplierTabBarConfig: TabItem[] = [
  { key: 'home', icon: '🏠', activeIcon: '🏠', label: '首页', path: '/pages/supplier/index/index' },
  {
    key: 'orders',
    icon: '📋',
    activeIcon: '📋',
    label: '订单',
    path: '/pages/supplier/orders/index',
  },
  {
    key: 'price',
    icon: '💰',
    activeIcon: '💰',
    label: '价格',
    path: '/pages/supplier/price/index',
  },
  {
    key: 'mine',
    icon: '👤',
    activeIcon: '👤',
    label: '我的',
    path: '/pages/supplier/profile/index',
  },
];

// 管理员TabBar配置
const adminTabBarConfig: TabItem[] = [
  { key: 'home', icon: '🏠', activeIcon: '🏠', label: '首页', path: '/pages/admin/index/index' },
  { key: 'orders', icon: '📋', activeIcon: '📋', label: '订单', path: '/pages/admin/orders/index' },
  { key: 'stores', icon: '🏪', activeIcon: '🏪', label: '门店', path: '/pages/admin/stores/index' },
  {
    key: 'suppliers',
    icon: '🏭',
    activeIcon: '🏭',
    label: '供应商',
    path: '/pages/admin/suppliers/index',
  },
  { key: 'mine', icon: '👤', activeIcon: '👤', label: '我的', path: '/pages/admin/profile/index' },
];

// 获取TabBar配置
export const getTabBarConfig = (role: UserRole): TabItem[] => {
  switch (role) {
    case 'supplier':
      return supplierTabBarConfig;
    case 'admin':
      return adminTabBarConfig;
    default:
      return storeTabBarConfig;
  }
};

interface CustomTabBarProps {
  role: UserRole;
  current: string;
}

export default function CustomTabBar({ role, current }: CustomTabBarProps) {
  const tabList = getTabBarConfig(role);

  const handleTabClick = (item: TabItem) => {
    if (item.key === current) return;
    Taro.redirectTo({ url: item.path });
  };

  return (
    <View className="custom-tabbar">
      {tabList.map((item) => (
        <View
          key={item.key}
          className={`tabbar-item ${current === item.key ? 'active' : ''}`}
          onClick={() => handleTabClick(item)}
        >
          <Text className="tabbar-icon">{current === item.key ? item.activeIcon : item.icon}</Text>
          <Text className="tabbar-label">{item.label}</Text>
        </View>
      ))}
    </View>
  );
}
