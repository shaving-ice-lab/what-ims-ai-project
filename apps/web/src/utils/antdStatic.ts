import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

// 静态方法实例holder
let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;

// 设置静态方法实例
export const setAntdStaticInstance = (
  messageInstance: MessageInstance,
  notificationInstance: NotificationInstance,
  modalInstance: Omit<ModalStaticFunctions, 'warn'>
) => {
  message = messageInstance;
  notification = notificationInstance;
  modal = modalInstance;
};

// 导出静态方法
export { message, modal, notification };

