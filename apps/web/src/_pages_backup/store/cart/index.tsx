import MainLayout from '@/components/layouts/MainLayout';
import { RootState } from '@/store';
import { clearCart, removeItem, updateQuantity } from '@/store/slices/cartSlice';
import {
    ArrowRightOutlined,
    CheckCircleOutlined,
    ClearOutlined,
    DeleteOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Col, Divider, Empty, InputNumber, message, Modal, Row, Tag } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './cart.module.css';

interface GroupedCart {
  supplierId: number;
  supplierName: string;
  items: any[];
  subtotal: number;
  minOrderAmount: number;
  reachMinOrder: boolean;
}

const StoreCart: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => (state.cart as any)?.items || []);
  const [groupedCarts, setGroupedCarts] = useState<GroupedCart[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);

  useEffect(() => {
    groupCartBySupplier();
  }, [cartItems]);

  const groupCartBySupplier = () => {
    const grouped: { [key: number]: GroupedCart } = {};
    
    cartItems.forEach((item: any) => {
      if (!grouped[item.supplierId]) {
        grouped[item.supplierId] = {
          supplierId: item.supplierId,
          supplierName: item.supplierName,
          items: [],
          subtotal: 0,
          minOrderAmount: item.minOrderAmount,
          reachMinOrder: false,
        };
      }
      
      const itemSubtotal = item.quantity * item.price;
      const group = grouped[item.supplierId];
      if (group) {
        group.items.push({ ...item, subtotal: itemSubtotal });
        group.subtotal += itemSubtotal;
      }
    });
    
    // 检查是否达到起送价
    Object.values(grouped).forEach(group => {
      group.reachMinOrder = group.subtotal >= group.minOrderAmount;
    });
    
    setGroupedCarts(Object.values(grouped));
    
    // 默认选中达到起送价的供应商
    const reachedSuppliers = Object.values(grouped)
      .filter(g => g.reachMinOrder)
      .map(g => g.supplierId);
    setSelectedSuppliers(reachedSuppliers);
  };

  const handleQuantityChange = (supplierId: number, skuId: number, quantity: number) => {
    dispatch(updateQuantity({ supplierId, skuId, quantity }));
  };

  const handleRemoveItem = (supplierId: number, skuId: number) => {
    dispatch(removeItem({ supplierId, skuId }));
    message.success('已从购物车移除');
  };

  const handleClearCart = () => {
    Modal.confirm({
      title: '清空购物车',
      content: '确定要清空购物车吗？',
      onOk: () => {
        dispatch(clearCart());
        message.success('购物车已清空');
      },
    });
  };

  const handleCheckout = () => {
    if (selectedSuppliers.length === 0) {
      message.warning('请至少选择一个供应商进行结算');
      return;
    }
    
    const selectedCarts = groupedCarts.filter(cart => 
      selectedSuppliers.includes(cart.supplierId)
    );
    
    const unreachedCarts = selectedCarts.filter(cart => !cart.reachMinOrder);
    if (unreachedCarts.length > 0) {
      message.warning('部分供应商未达到起送价，无法结算');
      return;
    }
    
    // 跳转到结算页面
    router.push('/store/checkout');
  };

  const handleSupplierSelect = (supplierId: number) => {
    const cart = groupedCarts.find(c => c.supplierId === supplierId);
    if (!cart?.reachMinOrder) {
      message.warning('该供应商未达到起送价，无法选择');
      return;
    }
    
    if (selectedSuppliers.includes(supplierId)) {
      setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplierId));
    } else {
      setSelectedSuppliers([...selectedSuppliers, supplierId]);
    }
  };

  const getTotalAmount = () => {
    return groupedCarts
      .filter(cart => selectedSuppliers.includes(cart.supplierId))
      .reduce((total, cart) => total + cart.subtotal, 0);
  };

  const getTotalItems = () => {
    return cartItems.length;
  };

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className={styles.container}>
          <Card>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="购物车为空"
            >
              <Button type="primary" onClick={() => router.push('/store/materials')}>
                去选购
              </Button>
            </Empty>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            <ShoppingCartOutlined /> 购物车（{getTotalItems()} 件商品）
          </h2>
          <Button danger icon={<ClearOutlined />} onClick={handleClearCart}>
            清空购物车
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={18}>
            {groupedCarts.map(cart => (
              <Card
                key={cart.supplierId}
                className={`${styles.supplierCard} ${cart.reachMinOrder ? styles.reached : styles.unreached}`}
                title={
                  <div className={styles.supplierHeader}>
                    <div className={styles.supplierInfo}>
                      <input
                        type="checkbox"
                        checked={selectedSuppliers.includes(cart.supplierId)}
                        onChange={() => handleSupplierSelect(cart.supplierId)}
                        disabled={!cart.reachMinOrder}
                      />
                      <ShopOutlined style={{ marginLeft: 8 }} />
                      <span style={{ marginLeft: 8 }}>{cart.supplierName}</span>
                      {cart.reachMinOrder ? (
                        <Tag color="green" style={{ marginLeft: 8 }}>
                          <CheckCircleOutlined /> 已达起送价
                        </Tag>
                      ) : (
                        <Tag color="red" style={{ marginLeft: 8 }}>
                          <WarningOutlined /> 差 ¥{(cart.minOrderAmount - cart.subtotal).toFixed(2)} 起送
                        </Tag>
                      )}
                    </div>
                    <div className={styles.supplierTotal}>
                      <span>小计：</span>
                      <span className={styles.price}>¥{cart.subtotal.toFixed(2)}</span>
                      <span className={styles.minOrder}>（起送价：¥{cart.minOrderAmount}）</span>
                    </div>
                  </div>
                }
              >
                {!cart.reachMinOrder && (
                  <Alert
                    message={`当前订单金额：¥${cart.subtotal.toFixed(2)}，还差 ¥${(cart.minOrderAmount - cart.subtotal).toFixed(2)} 达到起送价`}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}
                
                {cart.items.map((item: any) => (
                  <div key={`${item.supplierId}_${item.skuId}`} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img src={item.imageUrl || 'https://via.placeholder.com/80'} alt={item.name} />
                    </div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemSpec}>
                        {item.brand} | {item.spec}
                      </div>
                      <div className={styles.itemPrice}>
                        ¥{item.price.toFixed(2)}/{item.unit}
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <InputNumber
                        min={item.minOrderQuantity}
                        value={item.quantity}
                        onChange={(value) => handleQuantityChange(item.supplierId, item.skuId, value || item.minOrderQuantity)}
                        addonAfter={item.unit}
                        style={{ width: 150 }}
                      />
                      <div className={styles.itemSubtotal}>
                        ¥{(item.quantity * item.price).toFixed(2)}
                      </div>
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem(item.supplierId, item.skuId)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                ))}
                
                {!cart.reachMinOrder && (
                  <div className={styles.addMoreTip}>
                    <Button type="primary" ghost onClick={() => router.push('/store/materials')}>
                      继续选购，凑单满起送价
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </Col>
          
          <Col xs={24} lg={6}>
            <Card className={styles.checkoutCard}>
              <h3>结算信息</h3>
              <Divider />
              
              <div className={styles.checkoutSuppliers}>
                <div className={styles.checkoutLabel}>已选供应商：</div>
                {groupedCarts
                  .filter(cart => selectedSuppliers.includes(cart.supplierId))
                  .map(cart => (
                    <div key={cart.supplierId} className={styles.checkoutSupplier}>
                      <span>{cart.supplierName}</span>
                      <span>¥{cart.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
              
              {groupedCarts.some(cart => selectedSuppliers.includes(cart.supplierId)) && (
                <>
                  <Divider />
                  <div className={styles.checkoutTotal}>
                    <span>合计金额：</span>
                    <span className={styles.totalPrice}>¥{getTotalAmount().toFixed(2)}</span>
                  </div>
                  <div className={styles.checkoutFee}>
                    <span>预估服务费（3‰）：</span>
                    <span>¥{(getTotalAmount() * 0.003).toFixed(2)}</span>
                  </div>
                  <div className={styles.checkoutActual}>
                    <span>预估实付：</span>
                    <span className={styles.actualPrice}>
                      ¥{(getTotalAmount() * 1.003).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
              
              <Divider />
              
              <Button
                type="primary"
                size="large"
                block
                icon={<ArrowRightOutlined />}
                onClick={handleCheckout}
                disabled={selectedSuppliers.length === 0}
              >
                去结算（{selectedSuppliers.length}）
              </Button>
              
              <div className={styles.checkoutTips}>
                <p>提示：</p>
                <ul>
                  <li>只有达到起送价的供应商才能结算</li>
                  <li>可以分别选择不同供应商结算</li>
                  <li>服务费按实际订单金额的3‰收取</li>
                </ul>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default StoreCart;
