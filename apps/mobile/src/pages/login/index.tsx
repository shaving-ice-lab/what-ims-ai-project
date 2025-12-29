import { Button, Input, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // 处理登录
  const handleLogin = async () => {
    if (!username.trim()) {
      Taro.showToast({ title: '请输入账号', icon: 'none' });
      return;
    }
    if (!password.trim()) {
      Taro.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }

    setLoading(true);
    try {
      // 模拟登录请求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 保存登录状态
      if (rememberMe) {
        Taro.setStorageSync('rememberMe', true);
        Taro.setStorageSync('username', username);
      }

      Taro.setStorageSync('token', 'mock_token_xxx');

      // 模拟判断用户角色数量
      const mockRoles = ['store']; // 模拟单角色用户

      if (mockRoles.length > 1) {
        // 多角色用户跳转角色选择页
        Taro.redirectTo({ url: '/pages/select-role/index' });
      } else {
        // 单角色用户直接跳转首页
        Taro.switchTab({ url: '/pages/index/index' });
      }
    } catch (error) {
      Taro.showToast({ title: '登录失败，请重试', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  // 演示账号快捷登录
  const handleDemoLogin = (role: 'store' | 'supplier') => {
    if (role === 'store') {
      setUsername('store_demo');
      setPassword('123456');
    } else {
      setUsername('supplier_demo');
      setPassword('123456');
    }
  };

  return (
    <View className="login-page">
      {/* Logo区域 */}
      <View className="logo-section">
        <View className="logo">
          <Text className="logo-text">📦</Text>
        </View>
        <Text className="app-name">供应链订货系统</Text>
        <Text className="app-slogan">高效便捷的采购管理平台</Text>
      </View>

      {/* 登录表单 */}
      <View className="login-form">
        <View className="input-group">
          <View className="input-icon">👤</View>
          <Input
            className="input"
            placeholder="请输入账号"
            value={username}
            onInput={(e) => setUsername(e.detail.value)}
          />
        </View>

        <View className="input-group">
          <View className="input-icon">🔒</View>
          <Input
            className="input"
            placeholder="请输入密码"
            password
            value={password}
            onInput={(e) => setPassword(e.detail.value)}
          />
        </View>

        <View className="remember-row">
          <View
            className={`checkbox ${rememberMe ? 'checked' : ''}`}
            onClick={() => setRememberMe(!rememberMe)}
          >
            {rememberMe && <Text className="check-icon">✓</Text>}
          </View>
          <Text className="remember-text">记住登录状态</Text>
        </View>

        <Button className="login-btn" onClick={handleLogin} loading={loading} disabled={loading}>
          登 录
        </Button>
      </View>

      {/* 演示账号 */}
      <View className="demo-section">
        <Text className="demo-title">开发测试账号</Text>
        <View className="demo-btns">
          <View className="demo-btn" onClick={() => handleDemoLogin('store')}>
            <Text>门店账号</Text>
          </View>
          <View className="demo-btn" onClick={() => handleDemoLogin('supplier')}>
            <Text>供应商账号</Text>
          </View>
        </View>
      </View>

      {/* 底部版权 */}
      <View className="footer">
        <Text className="copyright">© 2024 供应链订货系统</Text>
      </View>
    </View>
  );
}
