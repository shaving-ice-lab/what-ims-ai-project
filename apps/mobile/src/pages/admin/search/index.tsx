import { useState } from 'react';

import { Input, ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import './index.scss';

type SearchType = 'store' | 'supplier' | 'order';

interface SearchResult {
  id: number;
  type: SearchType;
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
}

// 搜索类型配置
const searchTypes = [
  { key: 'store', label: '门店', icon: '🏪' },
  { key: 'supplier', label: '供应商', icon: '🏭' },
  { key: 'order', label: '订单', icon: '📋' },
];

// 模拟搜索数据
const mockData: Record<SearchType, SearchResult[]> = {
  store: [
    {
      id: 1,
      type: 'store',
      title: '门店A - 朝阳店',
      subtitle: '联系人：张三 | 138****8888',
      status: '正常',
      statusColor: '#52c41a',
    },
    {
      id: 2,
      type: 'store',
      title: '门店B - 海淀店',
      subtitle: '联系人：李四 | 139****9999',
      status: '正常',
      statusColor: '#52c41a',
    },
    {
      id: 3,
      type: 'store',
      title: '门店C - 西城店',
      subtitle: '联系人：王五 | 137****7777',
      status: '停用',
      statusColor: '#ff4d4f',
    },
  ],
  supplier: [
    {
      id: 1,
      type: 'supplier',
      title: '粮油供应商A',
      subtitle: '主营：粮油 | 起送价：¥100',
      status: '正常',
      statusColor: '#52c41a',
    },
    {
      id: 2,
      type: 'supplier',
      title: '调味品供应商B',
      subtitle: '主营：调味品 | 起送价：¥80',
      status: '正常',
      statusColor: '#52c41a',
    },
    {
      id: 3,
      type: 'supplier',
      title: '蔬菜供应商C',
      subtitle: '主营：蔬菜 | 起送价：¥50',
      status: '审核中',
      statusColor: '#faad14',
    },
  ],
  order: [
    {
      id: 1,
      type: 'order',
      title: 'ORD202401290001',
      subtitle: '门店A → 粮油供应商A | ¥358.00',
      status: '待确认',
      statusColor: '#faad14',
    },
    {
      id: 2,
      type: 'order',
      title: 'ORD202401290002',
      subtitle: '门店B → 调味品供应商B | ¥256.00',
      status: '配送中',
      statusColor: '#52c41a',
    },
    {
      id: 3,
      type: 'order',
      title: 'ORD202401280001',
      subtitle: '门店C → 粮油供应商A | ¥425.00',
      status: '已完成',
      statusColor: '#999',
    },
  ],
};

export default function AdminSearchPage() {
  const [activeType, setActiveType] = useState<SearchType>('store');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // 过滤搜索结果
  const getFilteredResults = () => {
    const data = mockData[activeType];
    if (!searchKeyword) return data;
    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  };

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'none' });
    }, 1000);
  };

  // 点击结果项
  const handleResultClick = (item: SearchResult) => {
    const typeLabels = { store: '门店', supplier: '供应商', order: '订单' };
    Taro.showModal({
      title: `${typeLabels[item.type]}详情`,
      content: `${item.title}\n${item.subtitle}\n状态：${item.status}`,
      showCancel: false,
    });
  };

  const filteredResults = getFilteredResults();

  return (
    <View className="admin-search-page">
      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrap">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder={`搜索${searchTypes.find((t) => t.key === activeType)?.label || ''}`}
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

      {/* 类型切换 */}
      <View className="type-tabs">
        {searchTypes.map((type) => (
          <View
            key={type.key}
            className={`type-tab ${activeType === type.key ? 'active' : ''}`}
            onClick={() => {
              setActiveType(type.key as SearchType);
              setSearchKeyword('');
            }}
          >
            <Text className="tab-icon">{type.icon}</Text>
            <Text className="tab-label">{type.label}</Text>
          </View>
        ))}
      </View>

      {/* 搜索结果 */}
      <ScrollView
        scrollY
        className="result-list"
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {filteredResults.length === 0 ? (
          <View className="empty-list">
            <Text className="empty-icon">🔍</Text>
            <Text className="empty-text">未找到相关结果</Text>
          </View>
        ) : (
          filteredResults.map((item) => (
            <View key={item.id} className="result-card" onClick={() => handleResultClick(item)}>
              <View className="result-icon">
                <Text>{searchTypes.find((t) => t.key === item.type)?.icon}</Text>
              </View>
              <View className="result-content">
                <Text className="result-title">{item.title}</Text>
                <Text className="result-subtitle">{item.subtitle}</Text>
              </View>
              <View className="result-status" style={{ color: item.statusColor }}>
                <Text>{item.status}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
