import { ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

interface Order {
  id: number;
  orderNo: string;
  storeName: string;
  amount: number;
  itemCount: number;
  createTime: string;
}

// 模拟统计数据
const statsData = {
  todayAmount: 2580.0,
  pendingCount: 5,
  processingCount: 3,
  completedCount: 28,
};

// 模拟待处理订单
const pendingOrders: Order[] = [
  {
    id: 1,
    orderNo: 'ORD202401290001',
    storeName: '门店A - 朝阳店',
    amount: 358.0,
    itemCount: 3,
    createTime: '10:30',
  },
  {
    id: 2,
    orderNo: 'ORD202401290002',
    storeName: '门店B - 海淀店',
    amount: 256.0,
    itemCount: 2,
    createTime: '09:15',
  },
  {
    id: 3,
    orderNo: 'ORD202401290003',
    storeName: '门店C - 西城店',
    amount: 425.0,
    itemCount: 5,
    createTime: '08:45',
  },
];

export default function SupplierIndexPage() {
  // 确认订单
  const handleConfirm = (orderId: number) => {
    Taro.showModal({
      title: '确认订单',
      content: '确定接受此订单？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '订单已确认', icon: 'success' });
        }
      },
    });
  };

  // 开始配送
  const handleShip = (orderId: number) => {
    Taro.showModal({
      title: '开始配送',
      content: '确定开始配送此订单？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已开始配送', icon: 'success' });
        }
      },
    });
  };

  // 查看详情
  const handleDetail = (orderId: number) => {
    Taro.navigateTo({ url: `/pages/supplier/orders/detail/index?id=${orderId}` });
  };

  return (
    <View className="supplier-index-page">
      {/* 统计Banner */}
      <View className="stats-banner">
        <View className="main-stat">
          <Text className="stat-label">今日订单金额</Text>
          <Text className="stat-value">¥{statsData.todayAmount.toFixed(2)}</Text>
        </View>
        <View className="sub-stats">
          <View className="sub-stat-item">
            <Text className="sub-value">{statsData.pendingCount}</Text>
            <Text className="sub-label">待处理</Text>
          </View>
          <View className="sub-stat-item">
            <Text className="sub-value">{statsData.processingCount}</Text>
            <Text className="sub-label">进行中</Text>
          </View>
          <View className="sub-stat-item">
            <Text className="sub-value">{statsData.completedCount}</Text>
            <Text className="sub-label">已完成</Text>
          </View>
        </View>
      </View>

      {/* 待处理订单 */}
      <View className="section-header">
        <Text className="section-title">待处理订单</Text>
        <Text
          className="section-more"
          onClick={() => Taro.switchTab({ url: '/pages/supplier/orders/index' })}
        >
          查看全部 →
        </Text>
      </View>

      <ScrollView scrollY className="order-list">
        {pendingOrders.map((order) => (
          <View key={order.id} className="order-card">
            <View className="card-header">
              <Text className="store-name">{order.storeName}</Text>
              <Text className="order-time">{order.createTime}</Text>
            </View>
            <View className="card-body">
              <Text className="order-no">订单号：{order.orderNo}</Text>
              <View className="order-info">
                <Text className="info-text">{order.itemCount}件商品</Text>
                <Text className="order-amount">¥{order.amount.toFixed(2)}</Text>
              </View>
            </View>
            <View className="card-actions">
              <View className="action-btn detail-btn" onClick={() => handleDetail(order.id)}>
                <Text>详情</Text>
              </View>
              <View className="action-btn confirm-btn" onClick={() => handleConfirm(order.id)}>
                <Text>确认</Text>
              </View>
              <View className="action-btn ship-btn" onClick={() => handleShip(order.id)}>
                <Text>配送</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
