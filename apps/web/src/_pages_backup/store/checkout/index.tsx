import MainLayout from '@/components/layouts/MainLayout';
import { RootState } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    PhoneOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Divider, Input, Modal, Space, Steps, Tag, message } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './checkout.module.css';

const { TextArea } = Input;

interface CheckoutItem {
  supplierId: number;
  supplierName: string;
  items: any[];
  subtotal: number;
  deliveryDays: string[];
  remark?: string;
}

interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  province: string;
}

const StoreCheckout: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => (state.cart as any)?.items || []);
  const [checkoutData, setCheckoutData] = useState<CheckoutItem[]>([]);
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentQRCode, setPaymentQRCode] = useState('');
  const [orderNumbers, setOrderNumbers] = useState<string[]>([]);
  
  // 模拟收货地址
  const deliveryAddress: DeliveryAddress = {
    name: '星巴克中关村店',
    phone: '13800138001',
    address: '中关村大街1号',
    district: '海淀区',
    city: '北京市',
    province: '北京市',
  };

  useEffect(() => {
    prepareCheckoutData();
  }, [cartItems]);

  const prepareCheckoutData = () => {
    const grouped: { [key: number]: CheckoutItem } = {};
    
    cartItems.forEach((item: any) => {
      if (!grouped[item.supplierId]) {
        grouped[item.supplierId] = {
          supplierId: item.supplierId,
          supplierName: item.supplierName,
          items: [],
          subtotal: 0,
          deliveryDays: ['周一', '周三', '周五'], // 模拟数据
          remark: '',
        };
      }
      
      const itemSubtotal = item.quantity * item.price;
      const group = grouped[item.supplierId];
      if (group) {
        group.items.push({ ...item, subtotal: itemSubtotal });
        group.subtotal += itemSubtotal;
      }
    });
    
    setCheckoutData(Object.values(grouped));
  };

  const handleRemarkChange = (supplierId: number, value: string) => {
    setRemarks({ ...remarks, [supplierId]: value });
  };

  const getTotalAmount = () => {
    return checkoutData.reduce((total, data) => total + data.subtotal, 0);
  };

  const getServiceFee = () => {
    return getTotalAmount() * 0.003; // 3‰服务费
  };

  const getFinalAmount = () => {
    return getTotalAmount() + getServiceFee();
  };

  const getExpectedDeliveryDate = (deliveryDays: string[]) => {
    // 计算预计送达日期（简化实现）
    const today = new Date();
    const dayMap: Record<string, number> = {
      '周日': 0, '周一': 1, '周二': 2, '周三': 3,
      '周四': 4, '周五': 5, '周六': 6,
    };
    
    const currentDay = today.getDay();
    let nearestDay = 7;
    
    deliveryDays.forEach(day => {
      const targetDay = dayMap[day];
      if (targetDay !== undefined) {
        const daysUntil = targetDay > currentDay 
          ? targetDay - currentDay 
          : 7 - currentDay + targetDay;
        nearestDay = Math.min(nearestDay, daysUntil);
      }
    });
    
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + nearestDay);
    
    return deliveryDate.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      weekday: 'long',
    });
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    
    // 模拟订单提交
    setTimeout(() => {
      // 生成订单号
      const orders = checkoutData.map((_data, index) => {
        const orderNo = `ORD${Date.now()}${index}`;
        return orderNo;
      });
      
      setOrderNumbers(orders);
      setCurrentStep(1);
      
      // 生成支付二维码
      setPaymentQRCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wxpay://pay/example');
      setPaymentModalVisible(true);
      
      // 清空购物车
      dispatch(clearCart());
      
      setLoading(false);
      message.success('订单提交成功，请支付');
    }, 1500);
  };

  const handlePaymentSuccess = () => {
    setPaymentModalVisible(false);
    setCurrentStep(2);
    message.success('支付成功！');
    
    // 跳转到订单列表
    setTimeout(() => {
      router.push('/store/orders');
    }, 2000);
  };

  if (cartItems.length === 0 && currentStep === 0) {
    return (
      <MainLayout>
        <div className={styles.container}>
          <Card>
            <Alert
              message="购物车为空"
              description="请先选择商品再进行结算"
              type="warning"
              showIcon
              action={
                <Button type="primary" onClick={() => router.push('/store/materials')}>
                  去选购
                </Button>
              }
            />
          </Card>
        </div>
      </MainLayout>
    );
  }

  const steps = [
    { title: '确认订单', icon: <ShoppingCartOutlined /> },
    { title: '支付订单', icon: <WalletOutlined /> },
    { title: '完成下单', icon: <CheckCircleOutlined /> },
  ];

  return (
    <MainLayout>
      <div className={styles.container}>
        <Card className={styles.stepsCard}>
          <Steps current={currentStep} items={steps} />
        </Card>

        {currentStep === 0 && (
          <>
            {/* 收货地址 */}
            <Card className={styles.addressCard}>
              <div className={styles.cardHeader}>
                <h3><EnvironmentOutlined /> 收货地址</h3>
              </div>
              <div className={styles.addressContent}>
                <div className={styles.addressInfo}>
                  <Space size="large">
                    <span><UserOutlined /> {deliveryAddress.name}</span>
                    <span><PhoneOutlined /> {deliveryAddress.phone}</span>
                  </Space>
                  <div className={styles.addressText}>
                    {deliveryAddress.province} {deliveryAddress.city} {deliveryAddress.district} {deliveryAddress.address}
                  </div>
                </div>
                <Alert
                  message="收货地址为门店注册地址，不可修改"
                  type="info"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              </div>
            </Card>

            {/* 订单商品 */}
            {checkoutData.map(data => (
              <Card key={data.supplierId} className={styles.orderCard}>
                <div className={styles.cardHeader}>
                  <h3>{data.supplierName}</h3>
                  <Tag color="blue">
                    <ClockCircleOutlined /> 预计 {getExpectedDeliveryDate(data.deliveryDays)} 送达
                  </Tag>
                </div>
                
                <div className={styles.orderItems}>
                  {data.items.map((item: any) => (
                    <div key={`${item.supplierId}_${item.skuId}`} className={styles.orderItem}>
                      <div className={styles.itemImage}>
                        <img src={item.imageUrl || 'https://via.placeholder.com/60'} alt={item.name} />
                      </div>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{item.name}</div>
                        <div className={styles.itemSpec}>{item.brand} | {item.spec}</div>
                      </div>
                      <div className={styles.itemQuantity}>
                        x{item.quantity}{item.unit}
                      </div>
                      <div className={styles.itemPrice}>
                        ¥{(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Divider />
                
                <div className={styles.remarkSection}>
                  <div className={styles.remarkLabel}>
                    <FileTextOutlined /> 订单备注：
                  </div>
                  <TextArea
                    placeholder="请输入订单备注（选填）"
                    value={remarks[data.supplierId] || ''}
                    onChange={(e) => handleRemarkChange(data.supplierId, e.target.value)}
                    rows={2}
                    maxLength={200}
                    showCount
                  />
                </div>
                
                <div className={styles.orderSummary}>
                  <div className={styles.summaryRow}>
                    <span>商品小计：</span>
                    <span className={styles.price}>¥{data.subtotal.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>配送日期：</span>
                    <span>{data.deliveryDays.join('、')}</span>
                  </div>
                </div>
              </Card>
            ))}

            {/* 结算信息 */}
            <Card className={styles.checkoutCard}>
              <div className={styles.cardHeader}>
                <h3>结算信息</h3>
              </div>
              <div className={styles.checkoutInfo}>
                <div className={styles.checkoutRow}>
                  <span>商品总额：</span>
                  <span>¥{getTotalAmount().toFixed(2)}</span>
                </div>
                <div className={styles.checkoutRow}>
                  <span>服务费（3‰）：</span>
                  <span>¥{getServiceFee().toFixed(2)}</span>
                </div>
                <Divider />
                <div className={styles.checkoutTotal}>
                  <span>实付金额：</span>
                  <span className={styles.totalPrice}>¥{getFinalAmount().toFixed(2)}</span>
                </div>
              </div>
              
              <div className={styles.checkoutActions}>
                <Button size="large" onClick={() => router.push('/store/cart')}>
                  返回购物车
                </Button>
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={handleSubmitOrder}
                >
                  提交订单
                </Button>
              </div>
            </Card>
          </>
        )}

        {currentStep === 2 && (
          <Card className={styles.successCard}>
            <div className={styles.successIcon}>
              <CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />
            </div>
            <h2>订单提交成功！</h2>
            <p>您的订单已成功提交，共生成 {orderNumbers.length} 个订单</p>
            <div className={styles.orderNumbers}>
              {orderNumbers.map(orderNo => (
                <div key={orderNo} className={styles.orderNumber}>
                  订单号：{orderNo}
                </div>
              ))}
            </div>
            <div className={styles.successActions}>
              <Button size="large" onClick={() => router.push('/store/materials')}>
                继续购物
              </Button>
              <Button type="primary" size="large" onClick={() => router.push('/store/orders')}>
                查看订单
              </Button>
            </div>
          </Card>
        )}

        {/* 支付模态框 */}
        <Modal
          title="订单支付"
          visible={paymentModalVisible}
          onCancel={() => setPaymentModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setPaymentModalVisible(false)}>
              稍后支付
            </Button>,
            <Button key="success" type="primary" onClick={handlePaymentSuccess}>
              模拟支付成功
            </Button>,
          ]}
        >
          <div style={{ textAlign: 'center' }}>
            <img src={paymentQRCode} alt="支付二维码" style={{ width: 200, height: 200 }} />
            <p style={{ marginTop: 16 }}>请使用微信扫码支付</p>
            <p style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
              ¥{getFinalAmount().toFixed(2)}
            </p>
            <Alert
              message="支付倒计时：14分59秒"
              type="warning"
              style={{ marginTop: 16 }}
            />
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default StoreCheckout;
