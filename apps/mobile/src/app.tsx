import { Component, PropsWithChildren } from 'react';

import Taro from '@tarojs/taro';
import { Provider } from 'react-redux';

import './app.scss';
import { subscribeOrderUpdates, subscribeNewOrderNotice } from './services/push';
import { store } from './store';

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    // 等待Redux持久化恢复完成后检查登录状态
    setTimeout(() => {
      const state = store.getState();
      const { isAuthenticated, currentRole, user } = state.auth;

      // 未登录，跳转登录页
      if (!isAuthenticated || !user) {
        Taro.redirectTo({
          url: '/pages/login/index',
        });
        return;
      }

      // 已登录但未选择角色（多角色用户）
      if (user.roles.length > 1 && !currentRole) {
        Taro.redirectTo({
          url: '/pages/select-role/index',
        });
        return;
      }

      // 初始化推送订阅（静默方式，不打扰用户）
      this.initPushSubscription(currentRole);
    }, 100);
  }

  /**
   * 初始化推送订阅
   * 根据用户角色订阅不同的消息模板
   */
  async initPushSubscription(role?: string) {
    try {
      if (role === 'store') {
        // 门店用户：订阅订单更新通知
        await subscribeOrderUpdates();
      } else if (role === 'supplier') {
        // 供应商用户：订阅新订单通知
        await subscribeNewOrderNotice();
      }
    } catch (error) {
      // 静默失败，不影响用户体验
      console.log('Push subscription skipped:', error);
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
