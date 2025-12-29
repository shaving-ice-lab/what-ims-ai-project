export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/select-role/index',
    'pages/market/index',
    'pages/cart/index',
    'pages/order/index',
    'pages/mine/index',
    // 供应商页面
    'pages/supplier/index/index',
    'pages/supplier/orders/index',
    'pages/supplier/orders/detail/index',
    'pages/supplier/price/index',
    'pages/supplier/profile/index',
    // 管理员页面
    'pages/admin/index/index',
    'pages/admin/orders/index',
    'pages/admin/stores/index',
    'pages/admin/suppliers/index',
    'pages/admin/search/index',
    'pages/admin/profile/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '供应链订货系统',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#666',
    selectedColor: '#1890ff',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png',
        text: '首页',
      },
      {
        pagePath: 'pages/market/index',
        iconPath: 'assets/icons/market.png',
        selectedIconPath: 'assets/icons/market-active.png',
        text: '行情',
      },
      {
        pagePath: 'pages/cart/index',
        iconPath: 'assets/icons/cart.png',
        selectedIconPath: 'assets/icons/cart-active.png',
        text: '购物车',
      },
      {
        pagePath: 'pages/order/index',
        iconPath: 'assets/icons/order.png',
        selectedIconPath: 'assets/icons/order-active.png',
        text: '订单',
      },
      {
        pagePath: 'pages/mine/index',
        iconPath: 'assets/icons/mine.png',
        selectedIconPath: 'assets/icons/mine-active.png',
        text: '我的',
      },
    ],
  },
});
