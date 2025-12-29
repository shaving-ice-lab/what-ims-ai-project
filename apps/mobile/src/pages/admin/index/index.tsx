import { useState } from 'react';

import { ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import './index.scss';

interface TodayStats {
  orderCount: number;
  orderAmount: number;
  pendingCount: number;
  activeStores: number;
  activeSuppliers: number;
}

interface AlertItem {
  id: number;
  type: 'cancel_request' | 'payment_timeout' | 'delivery_delay';
  title: string;
  orderNo: string;
  time: string;
}

// 预警类型配置
const alertTypeConfig = {
  cancel_request: { label: '取消申请', color: '#faad14', icon: '⚠️' },
  payment_timeout: { label: '支付超时', color: '#ff4d4f', icon: '💰' },
  delivery_delay: { label: '配送延迟', color: '#1890ff', icon: '🚚' },
};

export default function AdminIndexPage() {
  const [refreshing, setRefreshing] = useState(false);

  // 今日统计数据
  const todayStats: TodayStats = {
    orderCount: 156,
    orderAmount: 28650.0,
    pendingCount: 12,
    activeStores: 45,
    activeSuppliers: 18,
  };

  // 异常订单预警
  const alerts: AlertItem[] = [
    {
      id: 1,
      type: 'cancel_request',
      title: '门店A申请取消订单',
      orderNo: 'ORD202401290015',
      time: '10分钟前',
    },
    {
      id: 2,
      type: 'payment_timeout',
      title: '订单支付即将超时',
      orderNo: 'ORD202401290018',
      time: '5分钟前',
    },
    {
      id: 3,
      type: 'delivery_delay',
      title: '供应商B配送延迟',
      orderNo: 'ORD202401290008',
      time: '30分钟前',
    },
  ];

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'none' });
    }, 1000);
  };

  // 快捷入口
  const quickActions = [
    { icon: '📋', label: '订单管理', url: '/pages/admin/orders/index' },
    { icon: '🏪', label: '门店管理', url: '/pages/admin/stores/index' },
    { icon: '🏭', label: '供应商管理', url: '/pages/admin/suppliers/index' },
    { icon: '🔍', label: '快捷查询', url: '/pages/admin/search/index' },
  ];

  // 跳转页面
  const handleNavigate = (url: string) => {
    Taro.navigateTo({ url });
  };

  // 查看预警详情
  const handleAlertClick = (alert: AlertItem) => {
    Taro.navigateTo({ url: `/pages/admin/orders/index?orderNo=${alert.orderNo}` });
  };

  return (
    <View className="admin-index-page">
      <ScrollView
        scrollY
        className="page-content"
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {/* 数据统计Banner */}
        <View className="stats-banner">
          <View className="banner-title">
            <Text>📊 今日数据概览</Text>
          </View>
          <View className="stats-row">
            <View className="stat-item main">
              <Text className="stat-value">{todayStats.orderCount}</Text>
              <Text className="stat-label">订单数</Text>
            </View>
            <View className="stat-item main">
              <Text className="stat-value">¥{(todayStats.orderAmount / 1000).toFixed(1)}k</Text>
              <Text className="stat-label">订单金额</Text>
            </View>
          </View>
          <View className="stats-row secondary">
            <View className="stat-item">
              <Text className="stat-value highlight">{todayStats.pendingCount}</Text>
              <Text className="stat-label">待处理</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-value">{todayStats.activeStores}</Text>
              <Text className="stat-label">活跃门店</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-value">{todayStats.activeSuppliers}</Text>
              <Text className="stat-label">活跃供应商</Text>
            </View>
          </View>
        </View>

        {/* 快速操作入口 */}
        <View className="quick-actions">
          <View className="section-title">
            <Text>⚡ 快速操作</Text>
          </View>
          <View className="actions-grid">
            {quickActions.map((action, idx) => (
              <View key={idx} className="action-item" onClick={() => handleNavigate(action.url)}>
                <Text className="action-icon">{action.icon}</Text>
                <Text className="action-label">{action.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 异常订单提醒 */}
        <View className="alerts-section">
          <View className="section-title">
            <Text>🔔 异常提醒</Text>
            <Text className="alert-count">{alerts.length}条</Text>
          </View>
          {alerts.length === 0 ? (
            <View className="empty-alerts">
              <Text>暂无异常提醒</Text>
            </View>
          ) : (
            alerts.map((alert) => (
              <View key={alert.id} className="alert-card" onClick={() => handleAlertClick(alert)}>
                <View
                  className="alert-icon"
                  style={{ background: alertTypeConfig[alert.type].color }}
                >
                  <Text>{alertTypeConfig[alert.type].icon}</Text>
                </View>
                <View className="alert-content">
                  <Text className="alert-title">{alert.title}</Text>
                  <Text className="alert-order">订单号：{alert.orderNo}</Text>
                </View>
                <View className="alert-meta">
                  <Text className="alert-type" style={{ color: alertTypeConfig[alert.type].color }}>
                    {alertTypeConfig[alert.type].label}
                  </Text>
                  <Text className="alert-time">{alert.time}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
