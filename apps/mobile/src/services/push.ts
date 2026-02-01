/**
 * Push Notification Service
 * 消息推送服务 - 支持微信小程序订阅消息
 */

import Taro from '@tarojs/taro';

// 订阅消息模板ID配置
// 请在微信小程序后台配置对应的订阅消息模板，并填入模板ID
export const TEMPLATE_IDS = {
  /** 订单状态更新通知 */
  ORDER_STATUS: 'your_order_status_template_id',
  /** 配送通知 */
  DELIVERY_NOTICE: 'your_delivery_notice_template_id',
  /** 支付成功通知 */
  PAYMENT_SUCCESS: 'your_payment_success_template_id',
  /** 新订单通知（供应商） */
  NEW_ORDER: 'your_new_order_template_id',
  /** 取消申请通知 */
  CANCEL_REQUEST: 'your_cancel_request_template_id',
};

/**
 * 订阅结果类型
 */
export interface SubscriptionResult {
  success: boolean;
  acceptedTemplates: string[];
  rejectedTemplates: string[];
  error?: string;
}

/**
 * 请求订阅消息权限
 * @param templateIds - 要订阅的模板ID数组
 * @returns 订阅结果
 */
export async function requestSubscription(
  templateIds: string[]
): Promise<SubscriptionResult> {
  // 过滤掉空的模板ID
  const validTemplateIds = templateIds.filter((id) => id && !id.startsWith('your_'));

  if (validTemplateIds.length === 0) {
    console.warn('No valid template IDs provided for subscription');
    return {
      success: false,
      acceptedTemplates: [],
      rejectedTemplates: [],
      error: '没有有效的模板ID',
    };
  }

  try {
    const res = await Taro.requestSubscribeMessage({
      tmplIds: validTemplateIds,
    });

    const acceptedTemplates: string[] = [];
    const rejectedTemplates: string[] = [];

    // 解析订阅结果
    validTemplateIds.forEach((id) => {
      const status = (res as Record<string, string>)[id];
      if (status === 'accept') {
        acceptedTemplates.push(id);
      } else {
        rejectedTemplates.push(id);
      }
    });

    return {
      success: acceptedTemplates.length > 0,
      acceptedTemplates,
      rejectedTemplates,
    };
  } catch (error: any) {
    console.error('Failed to request subscription:', error);
    return {
      success: false,
      acceptedTemplates: [],
      rejectedTemplates: validTemplateIds,
      error: error.errMsg || '订阅失败',
    };
  }
}

/**
 * 订阅订单更新通知
 * 用于门店端 - 订阅订单状态变化和配送通知
 */
export async function subscribeOrderUpdates(): Promise<SubscriptionResult> {
  return requestSubscription([
    TEMPLATE_IDS.ORDER_STATUS,
    TEMPLATE_IDS.DELIVERY_NOTICE,
  ]);
}

/**
 * 订阅支付通知
 * 用于订单提交后 - 订阅支付成功通知
 */
export async function subscribePaymentNotice(): Promise<SubscriptionResult> {
  return requestSubscription([TEMPLATE_IDS.PAYMENT_SUCCESS]);
}

/**
 * 订阅新订单通知
 * 用于供应商端 - 订阅新订单通知
 */
export async function subscribeNewOrderNotice(): Promise<SubscriptionResult> {
  return requestSubscription([
    TEMPLATE_IDS.NEW_ORDER,
    TEMPLATE_IDS.CANCEL_REQUEST,
  ]);
}

/**
 * 订阅所有可用通知
 * 用于首次登录 - 一次性请求所有订阅权限
 */
export async function subscribeAllNotifications(): Promise<SubscriptionResult> {
  return requestSubscription([
    TEMPLATE_IDS.ORDER_STATUS,
    TEMPLATE_IDS.DELIVERY_NOTICE,
    TEMPLATE_IDS.PAYMENT_SUCCESS,
  ]);
}

/**
 * 获取当前订阅状态
 * @returns 订阅设置信息
 */
export async function getSubscriptionStatus(): Promise<Record<string, string>> {
  try {
    const setting = await Taro.getSetting({ withSubscriptions: true });
    return (setting.subscriptionsSetting as any)?.itemSettings || {};
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    return {};
  }
}

/**
 * 检查是否已订阅某个模板
 * @param templateId - 模板ID
 */
export async function isSubscribed(templateId: string): Promise<boolean> {
  const status = await getSubscriptionStatus();
  return status[templateId] === 'accept';
}

/**
 * 显示订阅引导弹窗
 * 当用户拒绝订阅后，引导用户去设置页面开启
 */
export function showSubscriptionGuide(): void {
  Taro.showModal({
    title: '开启消息通知',
    content: '为了及时接收订单状态更新，请开启消息通知',
    confirmText: '去设置',
    cancelText: '暂不开启',
    success: (res) => {
      if (res.confirm) {
        Taro.openSetting();
      }
    },
  });
}

/**
 * 智能请求订阅（带引导）
 * 如果用户之前拒绝过，显示引导弹窗
 */
export async function smartSubscribe(
  templateIds: string[]
): Promise<SubscriptionResult> {
  const result = await requestSubscription(templateIds);

  // 如果所有模板都被拒绝，显示引导
  if (result.rejectedTemplates.length === templateIds.length) {
    showSubscriptionGuide();
  }

  return result;
}
