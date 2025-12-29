import { ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

interface PriceItem {
  id: number;
  name: string;
  brand: string;
  spec: string;
  price: number;
  originalPrice: number | null;
  stock: boolean;
  category: string;
}

// 模拟价格数据
const priceData: PriceItem[] = [
  {
    id: 1,
    name: '金龙鱼大豆油',
    brand: '金龙鱼',
    spec: '5L/桶',
    price: 56.0,
    originalPrice: 58.0,
    stock: true,
    category: '粮油',
  },
  {
    id: 2,
    name: '福临门花生油',
    brand: '福临门',
    spec: '5L/桶',
    price: 68.0,
    originalPrice: null,
    stock: true,
    category: '粮油',
  },
  {
    id: 3,
    name: '中粮大米',
    brand: '中粮',
    spec: '10kg/袋',
    price: 45.0,
    originalPrice: null,
    stock: true,
    category: '粮油',
  },
  {
    id: 4,
    name: '海天酱油',
    brand: '海天',
    spec: '500ml/瓶',
    price: 12.5,
    originalPrice: 13.0,
    stock: false,
    category: '调味品',
  },
  {
    id: 5,
    name: '太太乐鸡精',
    brand: '太太乐',
    spec: '200g/袋',
    price: 8.8,
    originalPrice: null,
    stock: true,
    category: '调味品',
  },
];

export default function SupplierPricePage() {
  const [refreshing, setRefreshing] = useState(false);

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'none' });
    }, 1000);
  };

  // 编辑价格
  const handleEditPrice = (item: PriceItem) => {
    Taro.navigateTo({
      url: `/pages/supplier/price/edit/index?id=${item.id}&name=${item.name}&price=${item.price}`,
    });
  };

  // 切换库存状态
  const handleToggleStock = (item: PriceItem) => {
    Taro.showModal({
      title: '库存状态',
      content: `确定将"${item.name}"设为${item.stock ? '缺货' : '有货'}？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '状态已更新', icon: 'success' });
        }
      },
    });
  };

  return (
    <View className="supplier-price-page">
      {/* 提示栏 */}
      <View className="tips-bar">
        <Text className="tips-text">💡 点击价格可快速修改，点击库存状态可切换</Text>
      </View>

      <ScrollView
        scrollY
        className="price-list"
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {priceData.map((item) => (
          <View key={item.id} className="price-card">
            <View className="card-main">
              <View className="item-info">
                <Text className="item-name">{item.name}</Text>
                <Text className="item-spec">
                  {item.brand} · {item.spec}
                </Text>
              </View>
              <View className="item-price" onClick={() => handleEditPrice(item)}>
                <Text className="price-value">¥{item.price.toFixed(2)}</Text>
                {item.originalPrice && (
                  <Text className="original-price">¥{item.originalPrice.toFixed(2)}</Text>
                )}
                <Text className="edit-hint">点击修改</Text>
              </View>
            </View>
            <View className="card-footer">
              <Text className="category-tag">{item.category}</Text>
              <View
                className={`stock-status ${item.stock ? 'in-stock' : 'out-stock'}`}
                onClick={() => handleToggleStock(item)}
              >
                <Text>{item.stock ? '有货' : '缺货'}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
