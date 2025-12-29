import { Button, Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import './index.scss';

// 状态配置
const statusConfig = {
  pending: { label: '待确认', color: '#faad14', desc: '订单待供应商确认' },
  confirmed: { label: '已确认', color: '#1890ff', desc: '供应商已确认，准备配送' },
  shipping: { label: '配送中', color: '#52c41a', desc: '商品正在配送中' },
  completed: { label: '已完成', color: '#999', desc: '订单已完成' },
  cancelled: { label: '已取消', color: '#ff4d4f', desc: '订单已取消' },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const orderId = router.params.id;

  // 模拟订单数据
  const order = {
    id: orderId,
    orderNo: 'ORD202401290001',
    status: 'confirmed' as keyof typeof statusConfig,
    supplierName: '粮油供应商A',
    createTime: '2024-01-29 10:30:00',
    items: [
      { name: '金龙鱼大豆油', spec: '5L/桶', price: 58.0, quantity: 2 },
      { name: '中粮大米', spec: '10kg/袋', price: 45.0, quantity: 1 },
    ],
    subtotal: 161.0,
    serviceFee: 5.0,
    totalAmount: 166.0,
    address: {
      name: '张三',
      phone: '138****8888',
      detail: '北京市朝阳区XX路XX号XX商场B1层',
    },
  };

  const currentStatus = statusConfig[order.status];

  // 再来一单
  const handleReorder = () => {
    Taro.showToast({ title: '已加入购物车', icon: 'success' });
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/cart/index' });
    }, 1500);
  };

  // 取消订单
  const handleCancel = () => {
    Taro.showModal({
      title: '取消订单',
      content: '确定要取消此订单吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '取消申请已提交', icon: 'success' });
        }
      },
    });
  };

  return (
    <View className="order-detail-page">
      {/* 订单状态 */}
      <View className="status-section" style={{ background: currentStatus.color }}>
        <Text className="status-label">{currentStatus.label}</Text>
        <Text className="status-desc">{currentStatus.desc}</Text>
      </View>

      {/* 收货信息 */}
      <View className="address-section">
        <View className="section-header">
          <Text className="section-title">📍 收货信息</Text>
        </View>
        <View className="address-content">
          <View className="address-row">
            <Text className="receiver-name">{order.address.name}</Text>
            <Text className="receiver-phone">{order.address.phone}</Text>
          </View>
          <Text className="address-detail">{order.address.detail}</Text>
        </View>
      </View>

      {/* 订单信息 */}
      <View className="order-section">
        <View className="section-header">
          <Text className="section-title">📦 订单信息</Text>
          <Text className="supplier-name">{order.supplierName}</Text>
        </View>

        {/* 商品列表 */}
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
              <Text className="item-price">¥{item.price.toFixed(2)}</Text>
              <Text className="item-qty">x{item.quantity}</Text>
            </View>
          </View>
        ))}

        {/* 金额明细 */}
        <View className="amount-detail">
          <View className="amount-row">
            <Text className="amount-label">商品小计</Text>
            <Text className="amount-value">¥{order.subtotal.toFixed(2)}</Text>
          </View>
          <View className="amount-row">
            <Text className="amount-label">服务费</Text>
            <Text className="amount-value">¥{order.serviceFee.toFixed(2)}</Text>
          </View>
          <View className="amount-row total">
            <Text className="amount-label">订单总额</Text>
            <Text className="amount-value total-value">¥{order.totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* 订单编号 */}
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
      <View className="action-section">
        <Button className="action-btn secondary" onClick={handleCancel}>
          取消订单
        </Button>
        <Button className="action-btn primary" onClick={handleReorder}>
          再来一单
        </Button>
      </View>
    </View>
  );
}
