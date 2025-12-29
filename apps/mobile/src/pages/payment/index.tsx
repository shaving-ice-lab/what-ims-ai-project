import { Button, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

export default function PaymentPage() {
  const [payMethod, setPayMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [paying, setPaying] = useState(false);

  // 模拟订单金额
  const totalAmount = 205.5;

  // 发起支付
  const handlePay = async () => {
    setPaying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 模拟支付成功
      Taro.showToast({ title: '支付成功', icon: 'success' });
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/order/detail/index?id=1&status=success' });
      }, 1500);
    } catch {
      Taro.showToast({ title: '支付失败，请重试', icon: 'none' });
    } finally {
      setPaying(false);
    }
  };

  return (
    <View className="payment-page">
      {/* 金额展示 */}
      <View className="amount-section">
        <Text className="amount-label">支付金额</Text>
        <View className="amount-value">
          <Text className="currency">¥</Text>
          <Text className="number">{totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* 支付方式 */}
      <View className="method-section">
        <Text className="section-title">选择支付方式</Text>

        <View
          className={`method-item ${payMethod === 'wechat' ? 'selected' : ''}`}
          onClick={() => setPayMethod('wechat')}
        >
          <View className="method-icon wechat">
            <Text>微</Text>
          </View>
          <Text className="method-name">微信支付</Text>
          <View className={`radio ${payMethod === 'wechat' ? 'checked' : ''}`}>
            {payMethod === 'wechat' && <View className="radio-inner" />}
          </View>
        </View>

        <View
          className={`method-item ${payMethod === 'alipay' ? 'selected' : ''}`}
          onClick={() => setPayMethod('alipay')}
        >
          <View className="method-icon alipay">
            <Text>支</Text>
          </View>
          <Text className="method-name">支付宝</Text>
          <View className={`radio ${payMethod === 'alipay' ? 'checked' : ''}`}>
            {payMethod === 'alipay' && <View className="radio-inner" />}
          </View>
        </View>
      </View>

      {/* 支付按钮 */}
      <View className="pay-section">
        <Button className="pay-btn" onClick={handlePay} loading={paying} disabled={paying}>
          {paying ? '支付中...' : `确认支付 ¥${totalAmount.toFixed(2)}`}
        </Button>
      </View>
    </View>
  );
}
