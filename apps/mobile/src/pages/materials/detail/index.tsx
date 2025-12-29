import { Button, Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

interface SupplierQuote {
  id: number;
  name: string;
  price: number;
  minOrderAmount: number;
  minQuantity: number;
  deliveryDays: string[];
  isLowest: boolean;
}

// 模拟供应商报价数据
const supplierQuotes: SupplierQuote[] = [
  {
    id: 1,
    name: '粮油供应商A',
    price: 56.0,
    minOrderAmount: 100,
    minQuantity: 1,
    deliveryDays: ['周一', '周三', '周五'],
    isLowest: true,
  },
  {
    id: 2,
    name: '粮油供应商B',
    price: 58.0,
    minOrderAmount: 80,
    minQuantity: 2,
    deliveryDays: ['周二', '周四'],
    isLowest: false,
  },
  {
    id: 3,
    name: '粮油供应商C',
    price: 62.0,
    minOrderAmount: 50,
    minQuantity: 1,
    deliveryDays: ['周一', '周二', '周三', '周四', '周五'],
    isLowest: false,
  },
];

export default function MaterialDetailPage() {
  const router = useRouter();
  const materialId = router.params.id;

  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  // 物料信息
  const material = {
    id: materialId,
    name: '金龙鱼大豆油',
    brand: '金龙鱼',
    spec: '5L/桶',
  };

  // 修改数量
  const handleQuantityChange = (delta: number) => {
    const supplier = supplierQuotes.find((s) => s.id === selectedSupplier);
    const minQty = supplier?.minQuantity || 1;
    const newQty = quantity + delta;
    if (newQty >= minQty) {
      setQuantity(newQty);
    } else {
      Taro.showToast({ title: `最少购买${minQty}件`, icon: 'none' });
    }
  };

  // 加入购物车
  const handleAddCart = () => {
    if (!selectedSupplier) {
      Taro.showToast({ title: '请选择供应商', icon: 'none' });
      return;
    }
    Taro.showToast({ title: '已加入购物车', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const selectedQuote = supplierQuotes.find((s) => s.id === selectedSupplier);
  const totalPrice = selectedQuote ? selectedQuote.price * quantity : 0;

  return (
    <View className="material-detail-page">
      {/* 物料图片 */}
      <View className="material-image">
        <Text className="placeholder">📷</Text>
      </View>

      {/* 物料信息 */}
      <View className="material-info">
        <Text className="material-name">{material.name}</Text>
        <Text className="material-spec">
          {material.brand} · {material.spec}
        </Text>
      </View>

      {/* 供应商报价列表 */}
      <View className="supplier-section">
        <Text className="section-title">选择供应商</Text>
        {supplierQuotes.map((quote) => (
          <View
            key={quote.id}
            className={`supplier-card ${selectedSupplier === quote.id ? 'selected' : ''}`}
            onClick={() => {
              setSelectedSupplier(quote.id);
              if (quantity < quote.minQuantity) {
                setQuantity(quote.minQuantity);
              }
            }}
          >
            <View className="supplier-header">
              <View className="supplier-name-row">
                <Text className="supplier-name">{quote.name}</Text>
                {quote.isLowest && <Text className="lowest-tag">最低价</Text>}
              </View>
              <Text className="supplier-price">¥{quote.price.toFixed(2)}</Text>
            </View>
            <View className="supplier-details">
              <Text className="detail-item">起送¥{quote.minOrderAmount}</Text>
              <Text className="detail-item">起订{quote.minQuantity}件</Text>
              <Text className="detail-item">配送:{quote.deliveryDays.join('/')}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 数量选择 */}
      {selectedSupplier && (
        <View className="quantity-section">
          <Text className="section-title">购买数量</Text>
          <View className="quantity-row">
            <View className="quantity-ctrl">
              <Text className="qty-btn" onClick={() => handleQuantityChange(-1)}>
                -
              </Text>
              <Text className="qty-num">{quantity}</Text>
              <Text className="qty-btn" onClick={() => handleQuantityChange(1)}>
                +
              </Text>
            </View>
            <Text className="total-price">小计: ¥{totalPrice.toFixed(2)}</Text>
          </View>
          {selectedQuote && quantity < selectedQuote.minQuantity && (
            <Text className="min-qty-hint">最少购买{selectedQuote.minQuantity}件</Text>
          )}
        </View>
      )}

      {/* 底部按钮 */}
      <View className="bottom-bar">
        <Button className="add-cart-btn" onClick={handleAddCart}>
          加入购物车
        </Button>
      </View>
    </View>
  );
}
