import { ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

interface MarketItem {
  id: number;
  name: string;
  brand: string;
  spec: string;
  suppliers: {
    id: number;
    name: string;
    price: number;
    isLowest: boolean;
  }[];
}

// 模拟市场行情数据
const marketData: MarketItem[] = [
  {
    id: 1,
    name: '金龙鱼大豆油',
    brand: '金龙鱼',
    spec: '5L/桶',
    suppliers: [
      { id: 1, name: '粮油供应商A', price: 56.0, isLowest: true },
      { id: 2, name: '粮油供应商B', price: 58.0, isLowest: false },
      { id: 3, name: '粮油供应商C', price: 62.0, isLowest: false },
    ],
  },
  {
    id: 2,
    name: '海天酱油',
    brand: '海天',
    spec: '500ml/瓶',
    suppliers: [
      { id: 4, name: '调味品供应商A', price: 12.0, isLowest: true },
      { id: 5, name: '调味品供应商B', price: 13.5, isLowest: false },
    ],
  },
  {
    id: 3,
    name: '中粮大米',
    brand: '中粮',
    spec: '10kg/袋',
    suppliers: [
      { id: 1, name: '粮油供应商A', price: 45.0, isLowest: false },
      { id: 6, name: '粮油供应商D', price: 43.0, isLowest: true },
    ],
  },
];

export default function MarketPage() {
  // 加入购物车
  const handleAddCart = (materialId: number, supplierId: number) => {
    Taro.showToast({ title: '已加入购物车', icon: 'success' });
  };

  return (
    <View className="market-page">
      {/* 提示说明 */}
      <View className="tips-bar">
        <Text className="tips-icon">💡</Text>
        <Text className="tips-text">比较不同供应商的报价，选择最优价格</Text>
      </View>

      <ScrollView scrollY className="market-list">
        {marketData.map((item) => (
          <View key={item.id} className="market-card">
            <View className="card-header">
              <Text className="material-name">{item.name}</Text>
              <Text className="material-spec">
                {item.brand} · {item.spec}
              </Text>
            </View>

            <View className="supplier-list">
              {item.suppliers.map((supplier) => (
                <View
                  key={supplier.id}
                  className={`supplier-item ${supplier.isLowest ? 'lowest' : ''}`}
                >
                  <View className="supplier-info">
                    <Text className="supplier-name">{supplier.name}</Text>
                    {supplier.isLowest && <Text className="lowest-tag">最低价</Text>}
                  </View>
                  <View className="supplier-action">
                    <Text className="supplier-price">¥{supplier.price.toFixed(2)}</Text>
                    <View
                      className="add-cart-btn"
                      onClick={() => handleAddCart(item.id, supplier.id)}
                    >
                      <Text>+</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
