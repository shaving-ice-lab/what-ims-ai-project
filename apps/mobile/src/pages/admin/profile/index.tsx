import { useState } from 'react';

import { ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import './index.scss';

interface AdminInfo {
  name: string;
  account: string;
  role: 'super_admin' | 'sub_admin';
  permissions: string[];
}

interface KeyMetrics {
  totalOrders: number;
  totalAmount: number;
  activeStores: number;
  activeSuppliers: number;
}

export default function AdminProfilePage() {
  const [refreshing, setRefreshing] = useState(false);

  // 管理员信息
  const adminInfo: AdminInfo = {
    name: '系统管理员',
    account: 'admin',
    role: 'super_admin',
    permissions: ['订单管理', '门店管理', '供应商管理', '系统设置'],
  };

  // 关键指标
  const keyMetrics: KeyMetrics = {
    totalOrders: 1256,
    totalAmount: 186500,
    activeStores: 45,
    activeSuppliers: 18,
  };

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'none' });
    }, 1000);
  };

  // 设置
  const handleSettings = () => {
    Taro.showToast({ title: '设置功能开发中', icon: 'none' });
  };

  // 关于
  const handleAbout = () => {
    Taro.showModal({
      title: '关于系统',
      content: '供应链订货系统 v1.0.0\n\n© 2024 All Rights Reserved',
      showCancel: false,
    });
  };

  // 退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.clearStorageSync();
          Taro.reLaunch({ url: '/pages/login/index' });
        }
      },
    });
  };

  return (
    <View className="admin-profile-page">
      <ScrollView
        scrollY
        className="profile-content"
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {/* 管理员信息头部 */}
        <View className="profile-header">
          <View className="avatar">
            <Text className="avatar-text">👤</Text>
          </View>
          <View className="info">
            <Text className="admin-name">{adminInfo.name}</Text>
            <Text className="admin-account">账号：{adminInfo.account}</Text>
          </View>
          <View className={`role-badge ${adminInfo.role}`}>
            <Text>{adminInfo.role === 'super_admin' ? '主管理员' : '子管理员'}</Text>
          </View>
        </View>

        {/* 权限信息 */}
        <View className="permissions-section">
          <View className="section-title">
            <Text>🔐 权限列表</Text>
          </View>
          <View className="permissions-list">
            {adminInfo.permissions.map((perm, idx) => (
              <View key={idx} className="permission-tag">
                <Text>{perm}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 关键指标 */}
        <View className="metrics-section">
          <View className="section-title">
            <Text>📊 平台数据（本月）</Text>
          </View>
          <View className="metrics-grid">
            <View className="metric-item">
              <Text className="metric-value">{keyMetrics.totalOrders}</Text>
              <Text className="metric-label">总订单数</Text>
            </View>
            <View className="metric-item">
              <Text className="metric-value">¥{(keyMetrics.totalAmount / 10000).toFixed(1)}万</Text>
              <Text className="metric-label">总金额</Text>
            </View>
            <View className="metric-item">
              <Text className="metric-value">{keyMetrics.activeStores}</Text>
              <Text className="metric-label">活跃门店</Text>
            </View>
            <View className="metric-item">
              <Text className="metric-value">{keyMetrics.activeSuppliers}</Text>
              <Text className="metric-label">活跃供应商</Text>
            </View>
          </View>
        </View>

        {/* 功能入口 */}
        <View className="menu-section">
          <View className="menu-item" onClick={handleSettings}>
            <Text className="menu-icon">⚙️</Text>
            <Text className="menu-text">设置</Text>
            <Text className="menu-arrow">›</Text>
          </View>
          <View className="menu-item" onClick={handleAbout}>
            <Text className="menu-icon">ℹ️</Text>
            <Text className="menu-text">关于</Text>
            <Text className="menu-arrow">›</Text>
          </View>
        </View>

        {/* 退出登录按钮 */}
        <View className="logout-section">
          <View className="logout-btn" onClick={handleLogout}>
            <Text>退出登录</Text>
          </View>
        </View>

        {/* 版本信息 */}
        <View className="version-info">
          <Text>版本 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
