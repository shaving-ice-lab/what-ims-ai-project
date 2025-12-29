import { useState } from 'react';

import { Input, ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import './index.scss';

interface Supplier {
  id: number;
  name: string;
  code: string;
  category: string;
  contactName: string;
  contactPhone: string;
  minOrderAmount: number;
  status: 'active' | 'inactive' | 'pending';
  orderCount: number;
}

// 模拟供应商数据
const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: '粮油供应商A',
    code: 'SUP001',
    category: '粮油',
    contactName: '李经理',
    contactPhone: '138****1111',
    minOrderAmount: 100,
    status: 'active',
    orderCount: 256,
  },
  {
    id: 2,
    name: '调味品供应商B',
    code: 'SUP002',
    category: '调味品',
    contactName: '王经理',
    contactPhone: '139****2222',
    minOrderAmount: 80,
    status: 'active',
    orderCount: 189,
  },
  {
    id: 3,
    name: '蔬菜供应商C',
    code: 'SUP003',
    category: '蔬菜',
    contactName: '张经理',
    contactPhone: '137****3333',
    minOrderAmount: 50,
    status: 'pending',
    orderCount: 0,
  },
];

const statusConfig = {
  active: { label: '正常', color: '#52c41a', bg: '#f6ffed' },
  inactive: { label: '停用', color: '#ff4d4f', bg: '#fff1f0' },
  pending: { label: '审核中', color: '#faad14', bg: '#fffbe6' },
};

export default function AdminSuppliersPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // 过滤供应商
  const filteredSuppliers = mockSuppliers.filter(
    (supplier) =>
      supplier.name.includes(searchKeyword) ||
      supplier.code.includes(searchKeyword) ||
      supplier.category.includes(searchKeyword)
  );

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'none' });
    }, 1000);
  };

  // 查看供应商详情
  const handleSupplierClick = (supplier: Supplier) => {
    Taro.showModal({
      title: supplier.name,
      content: `编号：${supplier.code}\n主营：${supplier.category}\n联系人：${supplier.contactName}\n电话：${supplier.contactPhone}\n起送价：¥${supplier.minOrderAmount}\n本月订单：${supplier.orderCount}笔`,
      showCancel: false,
    });
  };

  return (
    <View className="admin-suppliers-page">
      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrap">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            placeholder="搜索供应商名称/编号/分类"
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
        <Text className="stats-text">共 {filteredSuppliers.length} 家供应商</Text>
      </View>

      {/* 供应商列表 */}
      <ScrollView
        scrollY
        className="supplier-list"
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {filteredSuppliers.length === 0 ? (
          <View className="empty-list">
            <Text className="empty-icon">🏭</Text>
            <Text className="empty-text">暂无供应商</Text>
          </View>
        ) : (
          filteredSuppliers.map((supplier) => (
            <View
              key={supplier.id}
              className="supplier-card"
              onClick={() => handleSupplierClick(supplier)}
            >
              <View className="card-header">
                <View className="header-left">
                  <Text className="supplier-name">{supplier.name}</Text>
                  <Text className="category-tag">{supplier.category}</Text>
                </View>
                <View
                  className="status-badge"
                  style={{
                    background: statusConfig[supplier.status].bg,
                    color: statusConfig[supplier.status].color,
                  }}
                >
                  <Text>{statusConfig[supplier.status].label}</Text>
                </View>
              </View>
              <View className="card-body">
                <View className="info-row">
                  <Text className="info-label">编号</Text>
                  <Text className="info-value">{supplier.code}</Text>
                </View>
                <View className="info-row">
                  <Text className="info-label">联系人</Text>
                  <Text className="info-value">
                    {supplier.contactName} {supplier.contactPhone}
                  </Text>
                </View>
                <View className="info-row">
                  <Text className="info-label">起送价</Text>
                  <Text className="info-value">¥{supplier.minOrderAmount}</Text>
                </View>
                <View className="info-row">
                  <Text className="info-label">本月订单</Text>
                  <Text className="info-value highlight">{supplier.orderCount}笔</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
