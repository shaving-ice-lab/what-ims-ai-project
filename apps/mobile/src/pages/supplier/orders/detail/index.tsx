import { useState } from 'react';

import { Button, Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';

import './index.scss';

// 状态配置
const statusConfig = {
  pending: { label: '待处理', color: '#faad14', desc: '订单待确认', nextAction: '确认订单' },
  confirmed: { label: '已确认', color: '#1890ff', desc: '已确认，待配送', nextAction: '开始配送' },
  shipping: { label: '配送中', color: '#52c41a', desc: '商品正在配送中', nextAction: '完成订单' },
  completed: { label: '已完成', color: '#999', desc: '订单已完成', nextAction: null },
  cancelled: { label: '已取消', color: '#ff4d4f', desc: '订单已取消', nextAction: null },
};

interface OrderItem {
  name: string;
  spec: string;
  originalPrice: number;
  quantity: number;
}

interface OrderDetail {
  id: string;
  orderNo: string;
  status: keyof typeof statusConfig;
  storeName: string;
  createTime: string;
  items: OrderItem[];
  totalAmount: number;
  address: {
    name: string;
    phone: string;
    detail: string;
  };
}

export default function SupplierOrderDetailPage() {
  const router = useRouter();
  const orderId = router.params.id;
  const [loading, setLoading] = useState(false);

  // 模拟订单数据（供应商视角：显示原价）
  const [order, setOrder] = useState<OrderDetail>({
    id: orderId || '1',
    orderNo: 'ORD202401290001',
    status: 'pending',
    storeName: '门店A - 朝阳店',
    createTime: '2024-01-29 10:30:00',
    items: [
      { name: '金龙鱼大豆油', spec: '5L/桶', originalPrice: 55.0, quantity: 2 },
      { name: '中粮大米', spec: '10kg/袋', originalPrice: 42.0, quantity: 1 },
      { name: '海天酱油', spec: '500ml/瓶', originalPrice: 12.0, quantity: 3 },
    ],
    totalAmount: 188.0,
    address: {
      name: '张三',
      phone: '138****8888',
      detail: '北京市朝阳区XX路XX号XX商场B1层',
    },
  });

  const currentStatus = statusConfig[order.status];

  // 确认订单
  const handleConfirm = () => {
    Taro.showModal({
      title: '确认订单',
      content: '确定接受此订单吗？',
      success: (res) => {
        if (res.confirm) {
          setLoading(true);
          setTimeout(() => {
            setOrder({ ...order, status: 'confirmed' });
            setLoading(false);
            Taro.showToast({ title: '订单已确认', icon: 'success' });
          }, 500);
        }
      },
    });
  };

  // 开始配送
  const handleStartDelivery = () => {
    Taro.showModal({
      title: '开始配送',
      content: '确定开始配送此订单吗？',
      success: (res) => {
        if (res.confirm) {
          setLoading(true);
          setTimeout(() => {
            setOrder({ ...order, status: 'shipping' });
            setLoading(false);
            Taro.showToast({ title: '已开始配送', icon: 'success' });
          }, 500);
        }
      },
    });
  };

  // 完成订单
  const handleComplete = () => {
    Taro.showModal({
      title: '完成订单',
      content: '确定此订单已送达并完成吗？',
      success: (res) => {
        if (res.confirm) {
          setLoading(true);
          setTimeout(() => {
            setOrder({ ...order, status: 'completed' });
            setLoading(false);
            Taro.showToast({ title: '订单已完成', icon: 'success' });
          }, 500);
        }
      },
    });
  };

  // 处理主按钮点击
  const handleMainAction = () => {
    if (loading) return;
    switch (order.status) {
      case 'pending':
        handleConfirm();
        break;
      case 'confirmed':
        handleStartDelivery();
        break;
      case 'shipping':
        handleComplete();
        break;
    }
  };

  // 联系门店
  const handleContact = () => {
    Taro.makePhoneCall({
      phoneNumber: order.address.phone.replace(/\*/g, '0'),
      fail: () => {
        Taro.showToast({ title: '拨打失败', icon: 'none' });
      },
    });
  };

  // 计算商品小计
  const subtotal = order.items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);

  return (
    <View className="supplier-order-detail-page">
      {/* 订单状态 */}
      <View className="status-section" style={{ background: currentStatus.color }}>
        <Text className="status-label">{currentStatus.label}</Text>
        <Text className="status-desc">{currentStatus.desc}</Text>
      </View>

      {/* 门店收货信息 */}
      <View className="address-section">
        <View className="section-header">
          <Text className="section-title">🏪 门店收货信息</Text>
          <Text className="contact-btn" onClick={handleContact}>
            📞 联系门店
          </Text>
        </View>
        <View className="address-content">
          <Text className="store-name">{order.storeName}</Text>
          <View className="address-row">
            <Text className="receiver-name">{order.address.name}</Text>
            <Text className="receiver-phone">{order.address.phone}</Text>
          </View>
          <Text className="address-detail">{order.address.detail}</Text>
        </View>
      </View>

      {/* 商品明细（显示供应商原价） */}
      <View className="order-section">
        <View className="section-header">
          <Text className="section-title">📦 商品明细</Text>
          <Text className="item-count">共{order.items.length}件商品</Text>
        </View>

        {order.items.map((item, idx) => (
          <View key={idx} className="order-item">
            <View className="item-image">
              <Text className="placeholder">📷</Text>
            </View>
            <View className="item-info">
              <Text className="item-name">{item.name}</Text>
              <Text className="item-spec">{item.spec}</Text>
            </View>
            <View className="item-price-qty">
              <Text className="item-price">¥{item.originalPrice.toFixed(2)}</Text>
              <Text className="item-qty">x{item.quantity}</Text>
            </View>
          </View>
        ))}

        {/* 金额明细 */}
        <View className="amount-detail">
          <View className="amount-row">
            <Text className="amount-label">商品金额</Text>
            <Text className="amount-value">¥{subtotal.toFixed(2)}</Text>
          </View>
          <View className="amount-row total">
            <Text className="amount-label">订单总额</Text>
            <Text className="amount-value total-value">¥{order.totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* 订单信息 */}
      <View className="info-section">
        <View className="info-row">
          <Text className="info-label">订单编号</Text>
          <Text className="info-value">{order.orderNo}</Text>
        </View>
        <View className="info-row">
          <Text className="info-label">下单时间</Text>
          <Text className="info-value">{order.createTime}</Text>
        </View>
      </View>

      {/* 操作按钮 */}
      {currentStatus.nextAction && (
        <View className="action-section">
          <Button className="action-btn secondary" onClick={handleContact}>
            联系门店
          </Button>
          <Button
            className={`action-btn primary ${loading ? 'loading' : ''}`}
            onClick={handleMainAction}
            disabled={loading}
          >
            {loading ? '处理中...' : currentStatus.nextAction}
          </Button>
        </View>
      )}

      {/* 已完成/已取消状态无操作按钮 */}
      {!currentStatus.nextAction && (
        <View className="action-section">
          <Button className="action-btn full" onClick={() => Taro.navigateBack()}>
            返回列表
          </Button>
        </View>
      )}
    </View>
  );
}
