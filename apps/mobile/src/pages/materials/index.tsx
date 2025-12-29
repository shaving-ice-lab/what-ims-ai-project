import { Input, ScrollView, Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

// 分类数据
const categories = [
  { id: 0, name: '全部' },
  { id: 1, name: '粮油' },
  { id: 2, name: '肉禽蛋' },
  { id: 3, name: '蔬菜' },
  { id: 4, name: '调味品' },
  { id: 5, name: '水产' },
];

// 模拟物料数据
const materialsData = [
  { id: 1, name: '金龙鱼大豆油', brand: '金龙鱼', spec: '5L/桶', minPrice: 56.0, categoryId: 1 },
  { id: 2, name: '海天酱油', brand: '海天', spec: '500ml/瓶', minPrice: 12.0, categoryId: 4 },
  { id: 3, name: '中粮大米', brand: '中粮', spec: '10kg/袋', minPrice: 45.0, categoryId: 1 },
  { id: 4, name: '太太乐鸡精', brand: '太太乐', spec: '200g/袋', minPrice: 8.8, categoryId: 4 },
  { id: 5, name: '福临门花生油', brand: '福临门', spec: '5L/桶', minPrice: 65.0, categoryId: 1 },
  { id: 6, name: '老干妈辣酱', brand: '老干妈', spec: '280g/瓶', minPrice: 9.9, categoryId: 4 },
  { id: 7, name: '新鲜猪肉', brand: '-', spec: '500g', minPrice: 18.0, categoryId: 2 },
  { id: 8, name: '土鸡蛋', brand: '-', spec: '30枚/盒', minPrice: 35.0, categoryId: 2 },
];

export default function MaterialsPage() {
  const router = useRouter();
  const initialCategory = router.params.categoryId ? parseInt(router.params.categoryId) : 0;
  const initialKeyword = router.params.keyword || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchValue, setSearchValue] = useState(initialKeyword);
  const [refreshing, setRefreshing] = useState(false);

  // 过滤物料
  const filteredMaterials = materialsData.filter((item) => {
    if (activeCategory !== 0 && item.categoryId !== activeCategory) return false;
    if (searchValue && !item.name.includes(searchValue) && !item.brand.includes(searchValue))
      return false;
    return true;
  });

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'none' });
    }, 1000);
  };

  // 跳转物料详情
  const handleMaterialClick = (materialId: number) => {
    Taro.navigateTo({ url: `/pages/materials/detail/index?id=${materialId}` });
  };

  return (
    <View className="materials-page">
      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrap">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜索物料"
            value={searchValue}
            onInput={(e) => setSearchValue(e.detail.value)}
          />
          {searchValue && (
            <Text className="clear-icon" onClick={() => setSearchValue('')}>
              ✕
            </Text>
          )}
        </View>
      </View>

      {/* 分类Tab */}
      <ScrollView scrollX className="category-tabs">
        {categories.map((cat) => (
          <View
            key={cat.id}
            className={`tab-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <Text className="tab-text">{cat.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 物料列表 */}
      <ScrollView
        scrollY
        className="materials-list"
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
            <View
              key={item.id}
              className="material-item"
              onClick={() => handleMaterialClick(item.id)}
            >
              <View className="item-image">
                <Text className="placeholder">📷</Text>
              </View>
              <View className="item-info">
                <Text className="item-name">{item.name}</Text>
                <Text className="item-spec">
                  {item.brand} · {item.spec}
                </Text>
                <View className="item-price">
                  <Text className="price-symbol">¥</Text>
                  <Text className="price-value">{item.minPrice.toFixed(2)}</Text>
                  <Text className="price-suffix">起</Text>
                </View>
              </View>
              <View className="item-arrow">
                <Text>→</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
