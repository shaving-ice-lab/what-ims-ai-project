import { useState } from 'react';

import { Input, ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import './index.scss';

interface Store {
  id: number;
  name: string;
  code: string;
  contactName: string;
  contactPhone: string;
  address: string;
  status: 'active' | 'inactive';
  orderCount: number;
}

// 模拟门店数据
const mockStores: Store[] = [
  {
    id: 1,
    name: '门店A - 朝阳店',
    code: 'STR001',
    contactName: '张三',
    contactPhone: '138****8888',
    address: '北京市朝阳区XX路XX号',
    status: 'active',
    orderCount: 156,
  },
  {
    id: 2,
    name: '门店B - 海淀店',
    code: 'STR002',
    contactName: '李四',
    contactPhone: '139****9999',
    address: '北京市海淀区XX路XX号',
    status: 'active',
    orderCount: 89,
  },
  {
    id: 3,
    name: '门店C - 西城店',
    code: 'STR003',
    contactName: '王五',
    contactPhone: '137****7777',
    address: '北京市西城区XX路XX号',
    status: 'inactive',
    orderCount: 45,
  },
];

export default function AdminStoresPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // 过滤门店
  const filteredStores = mockStores.filter(
    (store) =>
      store.name.includes(searchKeyword) ||
      store.code.includes(searchKeyword) ||
      store.contactName.includes(searchKeyword)
  );

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'none' });
    }, 1000);
  };

  // 查看门店详情
  const handleStoreClick = (store: Store) => {
    Taro.showModal({
      title: store.name,
      content: `编号：${store.code}\n联系人：${store.contactName}\n电话：${store.contactPhone}\n地址：${store.address}\n本月订单：${store.orderCount}笔`,
      showCancel: false,
    });
  };

  return (
    <View className="admin-stores-page">
      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrap">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜索门店名称/编号/联系人"
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

      {/* 统计信息 */}
      <View className="stats-bar">
        <Text className="stats-text">共 {filteredStores.length} 家门店</Text>
      </View>

      {/* 门店列表 */}
      <ScrollView
        scrollY
        className="store-list"
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {filteredStores.length === 0 ? (
          <View className="empty-list">
            <Text className="empty-icon">🏪</Text>
            <Text className="empty-text">暂无门店</Text>
          </View>
        ) : (
          filteredStores.map((store) => (
            <View key={store.id} className="store-card" onClick={() => handleStoreClick(store)}>
              <View className="card-header">
                <Text className="store-name">{store.name}</Text>
                <View className={`status-badge ${store.status}`}>
                  <Text>{store.status === 'active' ? '正常' : '停用'}</Text>
                </View>
              </View>
              <View className="card-body">
                <View className="info-row">
                  <Text className="info-label">编号</Text>
                  <Text className="info-value">{store.code}</Text>
                </View>
                <View className="info-row">
                  <Text className="info-label">联系人</Text>
                  <Text className="info-value">
                    {store.contactName} {store.contactPhone}
                  </Text>
                </View>
                <View className="info-row">
                  <Text className="info-label">本月订单</Text>
                  <Text className="info-value highlight">{store.orderCount}笔</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
