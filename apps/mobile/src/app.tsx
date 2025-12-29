import { Component, PropsWithChildren } from 'react';

import Taro from '@tarojs/taro';
import { Provider } from 'react-redux';

import './app.scss';
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
      }
    }, 100);
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
