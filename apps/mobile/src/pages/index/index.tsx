import { Input, ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

// 分类数据
const categories = [
  { id: 1, name: '粮油', icon: '🌾' },
  { id: 2, name: '肉禽蛋', icon: '🥩' },
  { id: 3, name: '蔬菜', icon: '🥬' },
  { id: 4, name: '调味品', icon: '🧂' },
  { id: 5, name: '水产', icon: '🐟' },
  { id: 6, name: '冷冻', icon: '❄️' },
  { id: 7, name: '饮料', icon: '🥤' },
  { id: 8, name: '包材', icon: '📦' },
];

// 模拟热门物料数据
const hotMaterials = [
  { id: 1, name: '金龙鱼大豆油', image: '', brandCount: 3, specCount: 2, minPrice: 56.0 },
  { id: 2, name: '海天酱油', image: '', brandCount: 1, specCount: 4, minPrice: 12.0 },
  { id: 3, name: '中粮大米', image: '', brandCount: 2, specCount: 3, minPrice: 45.0 },
  { id: 4, name: '太太乐鸡精', image: '', brandCount: 1, specCount: 2, minPrice: 8.8 },
  { id: 5, name: '福临门花生油', image: '', brandCount: 2, specCount: 2, minPrice: 65.0 },
  { id: 6, name: '老干妈辣酱', image: '', brandCount: 1, specCount: 3, minPrice: 9.9 },
];

export default function IndexPage() {
  const [searchValue, setSearchValue] = useState('');

  // 跳转分类页
  const handleCategoryClick = (categoryId: number) => {
    Taro.navigateTo({ url: `/pages/materials/index?categoryId=${categoryId}` });
  };

  // 跳转物料详情
  const handleMaterialClick = (materialId: number) => {
    Taro.navigateTo({ url: `/pages/materials/detail/index?id=${materialId}` });
  };

  // 搜索
  const handleSearch = () => {
    if (searchValue.trim()) {
      Taro.navigateTo({ url: `/pages/materials/index?keyword=${searchValue}` });
    }
  };

  return (
    <View className="index-page">
      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrap">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜索物料名称"
            value={searchValue}
            onInput={(e) => setSearchValue(e.detail.value)}
            onConfirm={handleSearch}
          />
        </View>
      </View>

      <ScrollView scrollY className="scroll-content">
        {/* 分类入口 */}
        <View className="category-section">
          <View className="section-title">
            <Text className="title-text">商品分类</Text>
          </View>
          <View className="category-grid">
            {categories.map((cat) => (
              <View
                key={cat.id}
                className="category-item"
                onClick={() => handleCategoryClick(cat.id)}
              >
                <View className="category-icon">
                  <Text>{cat.icon}</Text>
                </View>
                <Text className="category-name">{cat.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 热门物料 */}
        <View className="hot-section">
          <View className="section-title">
            <Text className="title-text">热门商品</Text>
            <Text className="more-text">查看更多 →</Text>
          </View>
          <View className="material-list">
            {hotMaterials.map((material) => (
              <View
                key={material.id}
                className="material-card"
                onClick={() => handleMaterialClick(material.id)}
              >
                <View className="material-image">
                  <Text className="placeholder-icon">📷</Text>
                </View>
                <View className="material-info">
                  <Text className="material-name">{material.name}</Text>
                  <Text className="material-spec">
                    {material.brandCount}个品牌 · {material.specCount}种规格
                  </Text>
                  <View className="material-price">
                    <Text className="price-label">¥</Text>
                    <Text className="price-value">{material.minPrice.toFixed(2)}</Text>
                    <Text className="price-suffix">起</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
