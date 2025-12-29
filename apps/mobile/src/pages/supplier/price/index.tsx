import { useState } from 'react';

import { Input, ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

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

interface EditModalData {
  visible: boolean;
  item: PriceItem | null;
  newPrice: string;
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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [materials, setMaterials] = useState<PriceItem[]>(priceData);
  const [editModal, setEditModal] = useState<EditModalData>({
    visible: false,
    item: null,
    newPrice: '',
  });

  // 搜索过滤
  const filteredMaterials = materials.filter(
    (item) =>
      item.name.includes(searchKeyword) ||
      item.brand.includes(searchKeyword) ||
      item.category.includes(searchKeyword)
  );

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'none' });
    }, 1000);
  };

  // 打开编辑价格弹窗
  const handleEditPrice = (item: PriceItem) => {
    setEditModal({
      visible: true,
      item,
      newPrice: item.price.toString(),
    });
  };

  // 关闭编辑弹窗
  const handleCloseModal = () => {
    setEditModal({ visible: false, item: null, newPrice: '' });
  };

  // 保存价格
  const handleSavePrice = () => {
    if (!editModal.item || !editModal.newPrice) return;

    const newPrice = parseFloat(editModal.newPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      Taro.showToast({ title: '请输入有效价格', icon: 'none' });
      return;
    }

    setMaterials((prev) =>
      prev.map((m) => (m.id === editModal.item!.id ? { ...m, price: newPrice } : m))
    );
    handleCloseModal();
    Taro.showToast({ title: '价格已更新', icon: 'success' });
  };

  // 切换库存状态
  const handleToggleStock = (item: PriceItem) => {
    Taro.showModal({
      title: '库存状态',
      content: `确定将"${item.name}"设为${item.stock ? '缺货' : '有货'}？`,
      success: (res) => {
        if (res.confirm) {
          setMaterials((prev) =>
            prev.map((m) => (m.id === item.id ? { ...m, stock: !m.stock } : m))
          );
          Taro.showToast({ title: '状态已更新', icon: 'success' });
        }
      },
    });
  };

  return (
    <View className="supplier-price-page">
      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrap">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜索物料名称/品牌/分类"
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
          {searchKeyword && (
            <Text className="clear-btn" onClick={() => setSearchKeyword('')}>
              ✕
            </Text>
          )}
        </View>
      </View>

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
        {filteredMaterials.length === 0 ? (
          <View className="empty-list">
            <Text className="empty-icon">📦</Text>
            <Text className="empty-text">暂无物料</Text>
          </View>
        ) : (
          filteredMaterials.map((item) => (
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
          ))
        )}
      </ScrollView>

      {/* 编辑价格弹窗 */}
      {editModal.visible && editModal.item && (
        <View className="modal-overlay" onClick={handleCloseModal}>
          <View className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <View className="modal-header">
              <Text className="modal-title">修改价格</Text>
              <Text className="modal-close" onClick={handleCloseModal}>
                ✕
              </Text>
            </View>
            <View className="modal-body">
              <Text className="item-name">{editModal.item.name}</Text>
              <Text className="item-spec">
                {editModal.item.brand} · {editModal.item.spec}
              </Text>
              <View className="price-input-wrap">
                <Text className="price-label">价格</Text>
                <View className="price-input-box">
                  <Text className="currency">¥</Text>
                  <Input
                    className="price-input"
                    type="digit"
                    value={editModal.newPrice}
                    onInput={(e) => setEditModal({ ...editModal, newPrice: e.detail.value })}
                    focus
                  />
                </View>
              </View>
            </View>
            <View className="modal-footer">
              <View className="modal-btn cancel" onClick={handleCloseModal}>
                <Text>取消</Text>
              </View>
              <View className="modal-btn confirm" onClick={handleSavePrice}>
                <Text>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
