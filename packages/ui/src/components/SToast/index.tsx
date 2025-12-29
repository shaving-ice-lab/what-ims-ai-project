import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

export interface SToastOptions {
  content: string;
  duration?: number;
  onClose?: () => void;
}

let messageApi: MessageInstance | null = null;

export const SToast = {
  setMessageApi: (api: MessageInstance) => {
    messageApi = api;
  },

  success: (content: string, duration = 2) => {
    if (messageApi) {
      messageApi.success(content, duration);
    } else {
      message.success(content, duration);
    }
  },

  error: (content: string, duration = 3) => {
    if (messageApi) {
      messageApi.error(content, duration);
    } else {
      message.error(content, duration);
    }
  },

  warning: (content: string, duration = 2) => {
    if (messageApi) {
      messageApi.warning(content, duration);
    } else {
      message.warning(content, duration);
    }
  },

  info: (content: string, duration = 2) => {
    if (messageApi) {
      messageApi.info(content, duration);
    } else {
      message.info(content, duration);
    }
  },

  loading: (content: string, duration = 0) => {
    if (messageApi) {
      return messageApi.loading(content, duration);
    } else {
      return message.loading(content, duration);
    }
  },

  destroy: () => {
    message.destroy();
  },
};

export default SToast;
