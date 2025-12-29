import { ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

interface Order {
  id: number;
  orderNo: string;
  storeName: string;
  amount: number;
  itemCount: number;
  deliveryTime: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'completed';
  createTime: string;
}

// 状态配置
const statusConfig = {
  pending: { label: '待处理', color: '#faad14' },
  confirmed: { label: '已确认', color: '#1890ff' },
  shipping: { label: '配送中', color: '#52c41a' },
  completed: { label: '已完成', color: '#999' },
};

// Tab配置
const tabs = [
  { key: 'pending', label: '待处理' },
  { key: 'shipping', label: '进行中' },
  { key: 'completed', label: '已完成' },
];

// 模拟订单数据
const mockOrders: Order[] = [
  {
    id: 1,
    orderNo: 'ORD202401290001',
    storeName: '门店A - 朝阳店',
    amount: 358.0,
    itemCount: 3,
    deliveryTime: '2024-01-30',
    status: 'pending',
    createTime: '2024-01-29 10:30',
  },
  {
    id: 2,
    orderNo: 'ORD202401290002',
    storeName: '门店B - 海淀店',
    amount: 256.0,
    itemCount: 2,
    deliveryTime: '2024-01-30',
    status: 'confirmed',
    createTime: '2024-01-29 09:15',
  },
  {
    id: 3,
    orderNo: 'ORD202401280001',
    storeName: '门店C - 西城店',
    amount: 425.0,
    itemCount: 5,
    deliveryTime: '2024-01-29',
    status: 'shipping',
    createTime: '2024-01-28 16:00',
  },
  {
    id: 4,
    orderNo: 'ORD202401270001',
    storeName: '门店D - 东城店',
    amount: 312.0,
    itemCount: 4,
    deliveryTime: '2024-01-28',
    status: 'completed',
    createTime: '2024-01-27 14:30',
  },
];

export default function SupplierOrdersPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [refreshing, setRefreshing] = useState(false);

  // 过滤订单
  const getFilteredOrders = () => {
    if (activeTab === 'pending') {
      return mockOrders.filter((o) => o.status === 'pending' || o.status === 'confirmed');
    }
    if (activeTab === 'shipping') {
      return mockOrders.filter((o) => o.status === 'shipping');
    }
    return mockOrders.filter((o) => o.status === 'completed');
  };

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'none' });
    }, 1000);
  };

  // 跳转订单详情
  const handleOrderClick = (orderId: number) => {
    Taro.navigateTo({ url: `/pages/supplier/orders/detail/index?id=${orderId}` });
  };

  const filteredOrders = getFilteredOrders();

  return (
    <View className="supplier-orders-page">
      {/* Tab栏 */}
      <View className="tab-bar">
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className="tab-text">{tab.label}</Text>
            {activeTab === tab.key && <View className="tab-line" />}
          </View>
        ))}
      </View>

      {/* 订单列表 */}
      <ScrollView
        scrollY
        className="order-list"
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {filteredOrders.length === 0 ? (
          <View className="empty-list">
            <Text className="empty-icon">📋</Text>
            <Text className="empty-text">暂无订单</Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View key={order.id} className="order-card" onClick={() => handleOrderClick(order.id)}>
              <View className="card-header">
                <Text className="store-name">{order.storeName}</Text>
                <Text className="order-status" style={{ color: statusConfig[order.status].color }}>
                  {statusConfig[order.status].label}
                </Text>
              </View>

              <View className="card-body">
                <View className="info-row">
                  <Text className="info-label">订单号</Text>
                  <Text className="info-value">{order.orderNo}</Text>
                </View>
                <View className="info-row">
                  <Text className="info-label">商品数</Text>
                  <Text className="info-value">{order.itemCount}件</Text>
                </View>
                <View className="info-row">
                  <Text className="info-label">配送日期</Text>
                  <Text className="info-value">{order.deliveryTime}</Text>
                </View>
              </View>

              <View className="card-footer">
                <Text className="order-amount">¥{order.amount.toFixed(2)}</Text>
                <Text className="create-time">{order.createTime}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
