import { Button, ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

interface CartItem {
  id: number;
  name: string;
  spec: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartGroup {
  supplierId: number;
  supplierName: string;
  minOrderAmount: number;
  items: CartItem[];
}

// 模拟购物车数据
const mockCartData: CartGroup[] = [
  {
    supplierId: 1,
    supplierName: '粮油供应商A',
    minOrderAmount: 100,
    items: [
      { id: 1, name: '金龙鱼大豆油', spec: '5L/桶', price: 58.0, quantity: 2, image: '' },
      { id: 2, name: '中粮大米', spec: '10kg/袋', price: 45.0, quantity: 1, image: '' },
    ],
  },
  {
    supplierId: 2,
    supplierName: '调味品供应商B',
    minOrderAmount: 50,
    items: [{ id: 3, name: '海天酱油', spec: '500ml/瓶', price: 12.5, quantity: 3, image: '' }],
  },
];

export default function CartPage() {
  const [cartData, setCartData] = useState<CartGroup[]>(mockCartData);

  // 计算每组小计
  const getGroupTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // 检查是否达到起送价
  const isReachMinOrder = (group: CartGroup) => {
    return getGroupTotal(group.items) >= group.minOrderAmount;
  };

  // 修改数量
  const handleQuantityChange = (groupIndex: number, itemIndex: number, delta: number) => {
    const newData = [...cartData];
    const item = newData[groupIndex].items[itemIndex];
    const newQuantity = item.quantity + delta;

    if (newQuantity <= 0) {
      // 删除商品
      newData[groupIndex].items.splice(itemIndex, 1);
      if (newData[groupIndex].items.length === 0) {
        newData.splice(groupIndex, 1);
      }
    } else {
      item.quantity = newQuantity;
    }

    setCartData(newData);
  };

  // 删除商品
  const handleDelete = (groupIndex: number, itemIndex: number) => {
    Taro.showModal({
      title: '提示',
      content: '确定删除该商品？',
      success: (res) => {
        if (res.confirm) {
          handleQuantityChange(
            groupIndex,
            itemIndex,
            -cartData[groupIndex].items[itemIndex].quantity
          );
        }
      },
    });
  };

  // 计算可结算金额
  const getSettleAmount = () => {
    return cartData
      .filter(isReachMinOrder)
      .reduce((sum, group) => sum + getGroupTotal(group.items), 0);
  };

  // 结算
  const handleSettle = () => {
    const settleGroups = cartData.filter(isReachMinOrder);
    if (settleGroups.length === 0) {
      Taro.showToast({ title: '没有可结算的订单', icon: 'none' });
      return;
    }
    Taro.navigateTo({ url: '/pages/checkout/index' });
  };

  return (
    <View className="cart-page">
      <ScrollView scrollY className="cart-content">
        {cartData.length === 0 ? (
          <View className="empty-cart">
            <Text className="empty-icon">🛒</Text>
            <Text className="empty-text">购物车是空的</Text>
            <Button
              className="go-shop-btn"
              onClick={() => Taro.switchTab({ url: '/pages/index/index' })}
            >
              去选购
            </Button>
          </View>
        ) : (
          cartData.map((group, groupIndex) => {
            const groupTotal = getGroupTotal(group.items);
            const reachMin = isReachMinOrder(group);
            const diff = group.minOrderAmount - groupTotal;

            return (
              <View
                key={group.supplierId}
                className={`cart-group ${reachMin ? 'reach' : 'not-reach'}`}
              >
                <View className="group-header">
                  <Text className="supplier-name">{group.supplierName}</Text>
                  <Text className="min-order">起送¥{group.minOrderAmount}</Text>
                </View>

                {group.items.map((item, itemIndex) => (
                  <View key={item.id} className="cart-item">
                    <View className="item-image">
                      <Text className="placeholder">📷</Text>
                    </View>
                    <View className="item-info">
                      <Text className="item-name">{item.name}</Text>
                      <Text className="item-spec">{item.spec}</Text>
                      <Text className="item-price">¥{item.price.toFixed(2)}</Text>
                    </View>
                    <View className="item-actions">
                      <View className="quantity-ctrl">
                        <Text
                          className="qty-btn"
                          onClick={() => handleQuantityChange(groupIndex, itemIndex, -1)}
                        >
                          -
                        </Text>
                        <Text className="qty-num">{item.quantity}</Text>
                        <Text
                          className="qty-btn"
                          onClick={() => handleQuantityChange(groupIndex, itemIndex, 1)}
                        >
                          +
                        </Text>
                      </View>
                      <Text
                        className="delete-btn"
                        onClick={() => handleDelete(groupIndex, itemIndex)}
                      >
                        删除
                      </Text>
                    </View>
                  </View>
                ))}

                <View className="group-footer">
                  <Text className="subtotal">小计：¥{groupTotal.toFixed(2)}</Text>
                  {reachMin ? (
                    <Text className="status-tag reach-tag">可结算</Text>
                  ) : (
                    <Text className="status-tag not-reach-tag">还差¥{diff.toFixed(2)}起送</Text>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {cartData.length > 0 && (
        <View className="settle-bar">
          <View className="settle-info">
            <Text className="settle-label">可结算金额：</Text>
            <Text className="settle-amount">¥{getSettleAmount().toFixed(2)}</Text>
          </View>
          <Button className="settle-btn" onClick={handleSettle}>
            去结算
          </Button>
        </View>
      )}
    </View>
  );
}
