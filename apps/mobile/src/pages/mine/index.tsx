import { Button, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

// 模拟用户数据
const userInfo = {
  name: '门店A - 朝阳店',
  code: 'STORE20240001',
};

// 模拟统计数据
const statsData = {
  monthOrders: 28,
  monthSpend: 8560.0,
  supplierCount: 5,
};

// 功能入口列表
const menuItems = [
  { icon: '📍', title: '收货地址', path: '/pages/address/index' },
  { icon: '❤️', title: '常购清单', path: '/pages/favorites/index' },
  { icon: '📊', title: '订货统计', path: '/pages/statistics/index' },
  { icon: '⚙️', title: '设置', path: '/pages/settings/index' },
];

export default function MinePage() {
  // 跳转菜单页面
  const handleMenuClick = (path: string) => {
    Taro.navigateTo({ url: path });
  };

  // 退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('token');
          Taro.reLaunch({ url: '/pages/login/index' });
        }
      },
    });
  };

  return (
    <View className="mine-page">
      {/* 用户信息头部 */}
      <View className="user-header">
        <View className="user-avatar">
          <Text className="avatar-text">🏪</Text>
        </View>
        <View className="user-info">
          <Text className="user-name">{userInfo.name}</Text>
          <Text className="user-code">{userInfo.code}</Text>
        </View>
      </View>

      {/* 数据统计 */}
      <View className="stats-section">
        <View className="stats-item">
          <Text className="stats-value">{statsData.monthOrders}</Text>
          <Text className="stats-label">本月订单</Text>
        </View>
        <View className="stats-divider" />
        <View className="stats-item">
          <Text className="stats-value">¥{statsData.monthSpend.toFixed(0)}</Text>
          <Text className="stats-label">本月消费</Text>
        </View>
        <View className="stats-divider" />
        <View className="stats-item">
          <Text className="stats-value">{statsData.supplierCount}</Text>
          <Text className="stats-label">供应商数</Text>
        </View>
      </View>

      {/* 功能入口 */}
      <View className="menu-section">
        {menuItems.map((item, index) => (
          <View key={index} className="menu-item" onClick={() => handleMenuClick(item.path)}>
            <View className="menu-left">
              <Text className="menu-icon">{item.icon}</Text>
              <Text className="menu-title">{item.title}</Text>
            </View>
            <Text className="menu-arrow">→</Text>
          </View>
        ))}
      </View>

      {/* 退出登录 */}
      <View className="logout-section">
        <Button className="logout-btn" onClick={handleLogout}>
          退出登录
        </Button>
      </View>
    </View>
  );
}
