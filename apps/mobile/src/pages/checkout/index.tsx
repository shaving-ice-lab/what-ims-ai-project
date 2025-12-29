import { Button, Input, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

interface OrderGroup {
  supplierId: number;
  supplierName: string;
  deliveryDate: string;
  items: { name: string; spec: string; price: number; quantity: number }[];
  subtotal: number;
  serviceFee: number;
}

// 模拟订单数据
const mockOrderGroups: OrderGroup[] = [
  {
    supplierId: 1,
    supplierName: '粮油供应商A',
    deliveryDate: '2024-01-30 (周三)',
    items: [
      { name: '金龙鱼大豆油', spec: '5L/桶', price: 58.0, quantity: 2 },
      { name: '中粮大米', spec: '10kg/袋', price: 45.0, quantity: 1 },
    ],
    subtotal: 161.0,
    serviceFee: 5.0,
  },
  {
    supplierId: 2,
    supplierName: '调味品供应商B',
    deliveryDate: '2024-01-30 (周三)',
    items: [{ name: '海天酱油', spec: '500ml/瓶', price: 12.5, quantity: 3 }],
    subtotal: 37.5,
    serviceFee: 2.0,
  },
];

// 收货地址
const deliveryAddress = {
  name: '张三',
  phone: '138****8888',
  address: '北京市朝阳区XX路XX号XX商场B1层',
};

export default function CheckoutPage() {
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // 计算总金额
  const totalAmount = mockOrderGroups.reduce(
    (sum, group) => sum + group.subtotal + group.serviceFee,
    0
  );
  const totalServiceFee = mockOrderGroups.reduce((sum, group) => sum + group.serviceFee, 0);

  // 提交订单
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Taro.showToast({ title: '订单提交成功', icon: 'success' });
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/payment/index' });
      }, 1500);
    } catch {
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="checkout-page">
      {/* 收货地址 */}
      <View className="address-section">
        <View className="address-icon">📍</View>
        <View className="address-info">
          <View className="address-header">
            <Text className="receiver-name">{deliveryAddress.name}</Text>
            <Text className="receiver-phone">{deliveryAddress.phone}</Text>
          </View>
          <Text className="address-detail">{deliveryAddress.address}</Text>
        </View>
      </View>

      {/* 订单分组 */}
      {mockOrderGroups.map((group) => (
        <View key={group.supplierId} className="order-group">
          <View className="group-header">
            <Text className="supplier-name">{group.supplierName}</Text>
            <Text className="delivery-date">预计{group.deliveryDate}送达</Text>
          </View>

          {/* 商品列表 */}
          {group.items.map((item, idx) => (
            <View key={idx} className="order-item">
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

          {/* 备注 */}
          <View className="remark-row">
            <Text className="remark-label">备注</Text>
            <Input
              className="remark-input"
              placeholder="选填，请输入备注信息"
              value={remarks[group.supplierId] || ''}
              onInput={(e) =>
                setRemarks((prev) => ({ ...prev, [group.supplierId]: e.detail.value }))
              }
            />
          </View>

          {/* 金额汇总 */}
          <View className="group-footer">
            <View className="fee-row">
              <Text className="fee-label">商品小计</Text>
              <Text className="fee-value">¥{group.subtotal.toFixed(2)}</Text>
            </View>
            <View className="fee-row">
              <Text className="fee-label">服务费</Text>
              <Text className="fee-value">¥{group.serviceFee.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      ))}

      {/* 底部结算栏 */}
      <View className="bottom-bar">
        <View className="total-info">
          <Text className="total-label">共{mockOrderGroups.length}笔订单，合计：</Text>
          <Text className="total-amount">¥{totalAmount.toFixed(2)}</Text>
          <Text className="fee-hint">（含服务费¥{totalServiceFee.toFixed(2)}）</Text>
        </View>
        <Button
          className="submit-btn"
          onClick={handleSubmit}
          loading={submitting}
          disabled={submitting}
        >
          提交订单
        </Button>
      </View>
    </View>
  );
}
