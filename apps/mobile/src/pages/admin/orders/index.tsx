import { useState } from 'react';

import { Input, ScrollView, Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';

import './index.scss';

interface Order {
  id: number;
  orderNo: string;
  storeName: string;
  supplierName: string;
  amount: number;
  itemCount: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
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
  { key: 'shipping', label: '进行中' },
  { key: 'completed', label: '已完成' },
];

// 模拟订单数据
const mockOrders: Order[] = [
  {
    id: 1,
    orderNo: 'ORD202401290001',
    storeName: '门店A - 朝阳店',
    supplierName: '粮油供应商A',
    amount: 358.0,
    itemCount: 3,
    status: 'pending',
    createTime: '2024-01-29 10:30',
  },
  {
    id: 2,
    orderNo: 'ORD202401290002',
    storeName: '门店B - 海淀店',
    supplierName: '调味品供应商B',
    amount: 256.0,
    itemCount: 2,
    status: 'confirmed',
    createTime: '2024-01-29 09:15',
  },
  {
    id: 3,
    orderNo: 'ORD202401280001',
    storeName: '门店C - 西城店',
    supplierName: '粮油供应商A',
    amount: 425.0,
    itemCount: 5,
    status: 'shipping',
    createTime: '2024-01-28 16:00',
  },
  {
    id: 4,
    orderNo: 'ORD202401270001',
    storeName: '门店D - 东城店',
    supplierName: '肉禽供应商C',
    amount: 312.0,
    itemCount: 4,
    status: 'completed',
    createTime: '2024-01-27 14:30',
  },
  {
    id: 5,
    orderNo: 'ORD202401260001',
    storeName: '门店E - 丰台店',
    supplierName: '蔬菜供应商D',
    amount: 189.0,
    itemCount: 6,
    status: 'cancelled',
    createTime: '2024-01-26 11:20',
  },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const initialOrderNo = router.params.orderNo || '';

  const [activeTab, setActiveTab] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState(initialOrderNo);
  const [refreshing, setRefreshing] = useState(false);

  // 过滤订单
  const getFilteredOrders = () => {
    let filtered = mockOrders;

    // 按状态筛选
    if (activeTab !== 'all') {
      if (activeTab === 'shipping') {
        filtered = filtered.filter((o) => o.status === 'confirmed' || o.status === 'shipping');
      } else {
        filtered = filtered.filter((o) => o.status === activeTab);
      }
    }

    // 按关键词搜索
    if (searchKeyword) {
      filtered = filtered.filter(
        (o) =>
          o.orderNo.includes(searchKeyword) ||
          o.storeName.includes(searchKeyword) ||
          o.supplierName.includes(searchKeyword)
      );
    }

    return filtered;
  };

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'none' });
    }, 1000);
  };

  // 查看订单详情
  const handleOrderClick = (order: Order) => {
    Taro.showModal({
      title: `订单 ${order.orderNo}`,
      content: `门店：${order.storeName}\n供应商：${order.supplierName}\n金额：¥${order.amount.toFixed(2)}\n状态：${statusConfig[order.status].label}`,
      showCancel: false,
    });
  };

  const filteredOrders = getFilteredOrders();

  return (
    <View className="admin-orders-page">
      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrap">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜索订单号/门店/供应商"
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
          {searchKeyword && (
            <Text className="clear-btn" onClick={() => setSearchKeyword('')}>
              ✕
            </Text>
          )}
        </View>
      </View>

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
            <View key={order.id} className="order-card" onClick={() => handleOrderClick(order)}>
              <View className="card-header">
                <Text className="order-no">{order.orderNo}</Text>
                <Text className="order-status" style={{ color: statusConfig[order.status].color }}>
                  {statusConfig[order.status].label}
                </Text>
              </View>

              <View className="card-body">
                <View className="info-row">
                  <Text className="info-label">🏪 门店</Text>
                  <Text className="info-value">{order.storeName}</Text>
                </View>
                <View className="info-row">
                  <Text className="info-label">🏭 供应商</Text>
                  <Text className="info-value">{order.supplierName}</Text>
                </View>
                <View className="info-row">
                  <Text className="info-label">📦 商品数</Text>
                  <Text className="info-value">{order.itemCount}件</Text>
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
