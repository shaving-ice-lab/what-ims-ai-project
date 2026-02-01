/**
 * Notification Handlers
 * 通知处理工具 - 处理消息推送的展示和导航
 */

import Taro from '@tarojs/taro';

/**
 * 通知负载类型
 */
export interface NotificationPayload {
  /** 通知标题 */
  title: string;
  /** 通知内容 */
  content: string;
  /** 跳转路径 */
  path?: string;
  /** 额外数据 */
  data?: Record<string, any>;
  /** 通知类型 */
  type?: NotificationType;
}

/**
 * 通知类型枚举
 */
export type NotificationType =
  | 'order_status' // 订单状态变化
  | 'new_order' // 新订单（供应商）
  | 'payment_success' // 支付成功
  | 'delivery' // 配送通知
  | 'cancel_request' // 取消申请
  | 'system'; // 系统通知

/**
 * 处理收到的通知
 * @param payload - 通知负载
 */
export function handleNotification(payload: NotificationPayload): void {
  const { title, content, path, type, data } = payload;

  // 根据通知类型决定是否自动跳转
  const shouldAutoNavigate = type === 'payment_success';

  if (shouldAutoNavigate && path) {
    // 自动跳转场景（如支付成功）
    Taro.navigateTo({ url: path });
  } else {
    // 显示弹窗让用户选择
    Taro.showModal({
      title,
      content,
      confirmText: path ? '查看详情' : '知道了',
      cancelText: path ? '稍后查看' : undefined,
      showCancel: !!path,
      success: (res) => {
        if (res.confirm && path) {
          navigateToDetail(path);
        }
      },
    });
  }
}

/**
 * 根据通知类型获取跳转路径
 * @param type - 通知类型
 * @param data - 通知数据
 * @returns 跳转路径
 */
export function getNotificationPath(
  type: NotificationType,
  data: Record<string, any>
): string {
  const { orderId, supplierId } = data;

  switch (type) {
    case 'order_status':
      return `/pages/order/detail/index?id=${orderId}`;

    case 'new_order':
      return `/pages/supplier/orders/detail/index?id=${orderId}`;

    case 'payment_success':
      return `/pages/order/detail/index?id=${orderId}`;

    case 'delivery':
      return `/pages/order/detail/index?id=${orderId}`;

    case 'cancel_request':
      return `/pages/supplier/orders/detail/index?id=${orderId}`;

    case 'system':
    default:
      return '/pages/index/index';
  }
}

/**
 * 导航到详情页面
 * @param path - 目标路径
 */
export function navigateToDetail(path: string): void {
  // 检查是否为tabBar页面
  const tabBarPages = ['/pages/index/index', '/pages/mine/index'];
  const isTabBarPage = tabBarPages.some((tabPath) => path.startsWith(tabPath));

  if (isTabBarPage) {
    Taro.switchTab({ url: path.split('?')[0] as any });
  } else {
    Taro.navigateTo({ url: path });
  }
}

/**
 * 显示订单状态变化通知
 */
export function showOrderStatusNotification(
  orderId: string | number,
  newStatus: string,
  orderNo: string
): void {
  const statusText = getOrderStatusText(newStatus);

  handleNotification({
    title: '订单状态更新',
    content: `订单 ${orderNo} ${statusText}`,
    path: `/pages/order/detail/index?id=${orderId}`,
    type: 'order_status',
    data: { orderId },
  });
}

/**
 * 显示新订单通知（供应商端）
 */
export function showNewOrderNotification(
  orderId: string | number,
  orderNo: string,
  storeName: string
): void {
  handleNotification({
    title: '收到新订单',
    content: `来自 ${storeName} 的订单 ${orderNo}`,
    path: `/pages/supplier/orders/detail/index?id=${orderId}`,
    type: 'new_order',
    data: { orderId },
  });
}

/**
 * 显示支付成功通知
 */
export function showPaymentSuccessNotification(
  orderId: string | number,
  orderNo: string,
  amount: number
): void {
  handleNotification({
    title: '支付成功',
    content: `订单 ${orderNo} 支付成功，金额：¥${amount.toFixed(2)}`,
    path: `/pages/order/detail/index?id=${orderId}`,
    type: 'payment_success',
    data: { orderId },
  });
}

/**
 * 显示配送通知
 */
export function showDeliveryNotification(
  orderId: string | number,
  orderNo: string,
  message: string
): void {
  handleNotification({
    title: '配送通知',
    content: `订单 ${orderNo}: ${message}`,
    path: `/pages/order/detail/index?id=${orderId}`,
    type: 'delivery',
    data: { orderId },
  });
}

/**
 * 获取订单状态文本
 */
function getOrderStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending_payment: '待支付',
    pending_confirm: '待确认',
    confirmed: '已确认',
    preparing: '备货中',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消',
    refunding: '退款中',
    refunded: '已退款',
  };

  return statusMap[status] || status;
}

/**
 * 解析后端推送的通知数据
 * @param rawData - 原始数据
 */
export function parseNotificationData(rawData: any): NotificationPayload {
  const { title, body, data } = rawData;
  const type = data?.type as NotificationType || 'system';

  return {
    title: title || '系统通知',
    content: body || '',
    type,
    data: data || {},
    path: data?.type ? getNotificationPath(type, data) : undefined,
  };
}
