import { ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

interface Order {
  id: number;
  orderNo: string;
  supplierName: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
  itemCount: number;
  totalAmount: number;
  serviceFee: number;
  createTime: string;
}

// 状态配置
const statusConfig = {
  pending: { label: '待确认', color: '#faad14' },
  confirmed: { label: '已确认', color: '#1890ff' },
  shipping: { label: '配送中', color: '#52c41a' },
  completed: { label: '已完成', color: '#999' },
  cancelled: { label: '已取消', color: '#ff4d4f' },
};

// Tab配置
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待确认' },
  { key: 'shipping', label: '配送中' },
  { key: 'completed', label: '已完成' },
];

// 模拟订单数据
const mockOrders: Order[] = [
  {
    id: 1,
    orderNo: 'ORD202401290001',
    supplierName: '粮油供应商A',
    status: 'pending',
    itemCount: 3,
    totalAmount: 161.0,
    serviceFee: 5.0,
    createTime: '2024-01-29 10:30',
  },
  {
    id: 2,
    orderNo: 'ORD202401290002',
    supplierName: '调味品供应商B',
    status: 'confirmed',
    itemCount: 2,
    totalAmount: 37.5,
    serviceFee: 2.0,
    createTime: '2024-01-29 09:15',
  },
  {
    id: 3,
    orderNo: 'ORD202401280001',
    supplierName: '粮油供应商A',
    status: 'shipping',
    itemCount: 5,
    totalAmount: 280.0,
    serviceFee: 8.0,
    createTime: '2024-01-28 16:00',
  },
  {
    id: 4,
    orderNo: 'ORD202401270001',
    supplierName: '生鲜供应商C',
    status: 'completed',
    itemCount: 4,
    totalAmount: 156.0,
    serviceFee: 5.0,
    createTime: '2024-01-27 14:30',
  },
];

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // 过滤订单
  const filteredOrders =
    activeTab === 'all' ? mockOrders : mockOrders.filter((order) => order.status === activeTab);

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
    Taro.navigateTo({ url: `/pages/order/detail/index?id=${orderId}` });
  };

  return (
    <View className="order-page">
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
                <Text className="supplier-name">{order.supplierName}</Text>
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
                  <Text className="info-label">下单时间</Text>
                  <Text className="info-value">{order.createTime}</Text>
                </View>
              </View>

              <View className="card-footer">
                <View className="amount-info">
                  <Text className="amount-label">合计：</Text>
                  <Text className="amount-value">¥{order.totalAmount.toFixed(2)}</Text>
                  <Text className="fee-text">（含服务费¥{order.serviceFee.toFixed(2)}）</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
