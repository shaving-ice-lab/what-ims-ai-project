import Taro from '@tarojs/taro';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store';
import {
  UserRole,
  clearCurrentRole,
  logout,
  selectCurrentRole,
  selectHasMultipleRoles,
  selectNeedsRoleSelection,
  selectUserRoles,
  setCurrentRole,
} from '../store/slices/authSlice';

// 角色对应的TabBar配置
const ROLE_TABBAR_CONFIG: Record<UserRole, { pagePath: string; text: string }[]> = {
  store: [
    { pagePath: 'pages/index/index', text: '首页' },
    { pagePath: 'pages/market/index', text: '行情' },
    { pagePath: 'pages/cart/index', text: '购物车' },
    { pagePath: 'pages/order/index', text: '订单' },
    { pagePath: 'pages/mine/index', text: '我的' },
  ],
  supplier: [
    { pagePath: 'pages/supplier/index', text: '首页' },
    { pagePath: 'pages/supplier/orders/index', text: '订单' },
    { pagePath: 'pages/supplier/price/index', text: '价格' },
    { pagePath: 'pages/mine/index', text: '我的' },
  ],
  admin: [
    { pagePath: 'pages/admin/index', text: '首页' },
    { pagePath: 'pages/admin/orders/index', text: '订单' },
    { pagePath: 'pages/admin/stores/index', text: '门店' },
    { pagePath: 'pages/admin/suppliers/index', text: '供应商' },
    { pagePath: 'pages/mine/index', text: '我的' },
  ],
  sub_admin: [
    { pagePath: 'pages/admin/index', text: '首页' },
    { pagePath: 'pages/admin/orders/index', text: '订单' },
    { pagePath: 'pages/mine/index', text: '我的' },
  ],
};

// 角色名称映射
export const ROLE_NAMES: Record<UserRole, string> = {
  admin: '管理员',
  sub_admin: '子管理员',
  supplier: '供应商',
  store: '门店',
};

// 角色图标映射
export const ROLE_ICONS: Record<UserRole, string> = {
  admin: '👑',
  sub_admin: '🔧',
  supplier: '🏭',
  store: '🏪',
};

export function useRole() {
  const dispatch = useDispatch<AppDispatch>();
  const currentRole = useSelector(selectCurrentRole);
  const userRoles = useSelector(selectUserRoles);
  const needsRoleSelection = useSelector(selectNeedsRoleSelection);
  const hasMultipleRoles = useSelector(selectHasMultipleRoles);

  // 切换角色
  const switchRole = useCallback(
    (role: UserRole) => {
      dispatch(setCurrentRole(role));

      // 保存当前选中角色到本地存储
      Taro.setStorageSync('currentRole', role);

      // 刷新TabBar（根据角色配置）
      const tabBarConfig = ROLE_TABBAR_CONFIG[role];
      if (tabBarConfig && tabBarConfig.length > 0) {
        // 跳转到对应角色的首页
        const firstPage = tabBarConfig[0];
        if (firstPage) {
          Taro.reLaunch({ url: `/${firstPage.pagePath}` });
        }
      }
    },
    [dispatch]
  );

  // 返回角色选择页面
  const goToRoleSelection = useCallback(() => {
    dispatch(clearCurrentRole());
    Taro.removeStorageSync('currentRole');
    Taro.reLaunch({ url: '/pages/select-role/index' });
  }, [dispatch]);

  // 退出登录
  const handleLogout = useCallback(() => {
    dispatch(logout());
    Taro.removeStorageSync('currentRole');
    Taro.removeStorageSync('token');
    Taro.removeStorageSync('refreshToken');
    Taro.reLaunch({ url: '/pages/login/index' });
  }, [dispatch]);

  // 获取当前角色的TabBar配置
  const getCurrentTabBarConfig = useCallback(() => {
    if (!currentRole) return [];
    return ROLE_TABBAR_CONFIG[currentRole] || [];
  }, [currentRole]);

  // 检查是否有权限访问某个功能
  const hasPermission = useCallback(
    (requiredRole: UserRole | UserRole[]) => {
      if (!currentRole) return false;

      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(currentRole);
      }
      return currentRole === requiredRole;
    },
    [currentRole]
  );

  return {
    currentRole,
    userRoles,
    needsRoleSelection,
    hasMultipleRoles,
    switchRole,
    goToRoleSelection,
    handleLogout,
    getCurrentTabBarConfig,
    hasPermission,
    getRoleName: (role: UserRole) => ROLE_NAMES[role],
    getRoleIcon: (role: UserRole) => ROLE_ICONS[role],
  };
}
