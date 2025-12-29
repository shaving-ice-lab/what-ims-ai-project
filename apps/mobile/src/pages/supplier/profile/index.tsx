import { useState } from 'react';

import { ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import './index.scss';

interface SupplierInfo {
  name: string;
  code: string;
  contactName: string;
  contactPhone: string;
  status: 'active' | 'inactive';
}

interface TodayStats {
  orderCount: number;
  orderAmount: number;
  pendingCount: number;
  completedCount: number;
}

interface DeliverySettings {
  minOrderAmount: number;
  deliveryDays: string[];
  deliveryAreas: string[];
  deliveryMode: 'self_delivery' | 'express_delivery';
}

export default function SupplierProfilePage() {
  const [refreshing, setRefreshing] = useState(false);

  // 模拟供应商信息
  const supplierInfo: SupplierInfo = {
    name: '粮油供应商A',
    code: 'SUP001',
    contactName: '李经理',
    contactPhone: '138****8888',
    status: 'active',
  };

  // 今日统计数据
  const todayStats: TodayStats = {
    orderCount: 12,
    orderAmount: 3568.0,
    pendingCount: 3,
    completedCount: 8,
  };

  // 配送设置
  const deliverySettings: DeliverySettings = {
    minOrderAmount: 100,
    deliveryDays: ['周一', '周三', '周五'],
    deliveryAreas: ['朝阳区', '海淀区', '西城区'],
    deliveryMode: 'self_delivery',
  };

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'none' });
    }, 1000);
  };

  // 查看配送设置
  const handleViewDelivery = () => {
    Taro.showModal({
      title: '配送设置',
      content: `起送价：¥${deliverySettings.minOrderAmount}\n配送日：${deliverySettings.deliveryDays.join('、')}\n配送区域：${deliverySettings.deliveryAreas.join('、')}\n配送模式：${deliverySettings.deliveryMode === 'self_delivery' ? '自配送' : '快递配送'}`,
      showCancel: false,
    });
  };

  // 设置
  const handleSettings = () => {
    Taro.showToast({ title: '设置功能开发中', icon: 'none' });
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
    <View className="supplier-profile-page">
      <ScrollView
        scrollY
        className="profile-content"
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {/* 供应商信息头部 */}
        <View className="profile-header">
          <View className="avatar">
            <Text className="avatar-text">🏭</Text>
          </View>
          <View className="info">
            <Text className="supplier-name">{supplierInfo.name}</Text>
            <Text className="supplier-code">编号：{supplierInfo.code}</Text>
          </View>
          <View className={`status-badge ${supplierInfo.status}`}>
            <Text>{supplierInfo.status === 'active' ? '正常' : '停用'}</Text>
          </View>
        </View>

        {/* 联系信息 */}
        <View className="contact-section">
          <View className="contact-item">
            <Text className="contact-label">联系人</Text>
            <Text className="contact-value">{supplierInfo.contactName}</Text>
          </View>
          <View className="contact-item">
            <Text className="contact-label">联系电话</Text>
            <Text className="contact-value">{supplierInfo.contactPhone}</Text>
          </View>
        </View>

        {/* 今日统计数据 */}
        <View className="stats-section">
          <View className="section-title">
            <Text>📊 今日数据</Text>
          </View>
          <View className="stats-grid">
            <View className="stat-item">
              <Text className="stat-value">{todayStats.orderCount}</Text>
              <Text className="stat-label">订单数</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-value">¥{todayStats.orderAmount.toFixed(0)}</Text>
              <Text className="stat-label">订单金额</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-value highlight">{todayStats.pendingCount}</Text>
              <Text className="stat-label">待处理</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-value success">{todayStats.completedCount}</Text>
              <Text className="stat-label">已完成</Text>
            </View>
          </View>
        </View>

        {/* 功能入口 */}
        <View className="menu-section">
          <View className="menu-item" onClick={handleViewDelivery}>
            <Text className="menu-icon">🚚</Text>
            <Text className="menu-text">配送设置</Text>
            <Text className="menu-arrow">›</Text>
          </View>
          <View className="menu-item" onClick={handleSettings}>
            <Text className="menu-icon">⚙️</Text>
            <Text className="menu-text">设置</Text>
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
