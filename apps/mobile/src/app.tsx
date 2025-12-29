import { Component, PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import Taro from '@tarojs/taro'
import { store } from './store'
import './app.scss'

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    // 检查登录状态
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
