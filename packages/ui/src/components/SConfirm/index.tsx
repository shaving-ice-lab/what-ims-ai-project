import { Modal } from 'antd';
import type { ModalFuncProps } from 'antd/es/modal';

export interface SConfirmOptions extends ModalFuncProps {
  type?: 'confirm' | 'info' | 'success' | 'error' | 'warning';
}

export const SConfirm = {
  show: (options: SConfirmOptions) => {
    const { type = 'confirm', ...restOptions } = options;

    const defaultOptions: ModalFuncProps = {
      centered: true,
      okText: '确定',
      cancelText: '取消',
      ...restOptions,
    };

    switch (type) {
      case 'info':
        return Modal.info(defaultOptions);
      case 'success':
        return Modal.success(defaultOptions);
      case 'error':
        return Modal.error(defaultOptions);
      case 'warning':
        return Modal.warning(defaultOptions);
      default:
        return Modal.confirm(defaultOptions);
    }
  },

  confirm: (options: ModalFuncProps) => SConfirm.show({ type: 'confirm', ...options }),
  info: (options: ModalFuncProps) => SConfirm.show({ type: 'info', ...options }),
  success: (options: ModalFuncProps) => SConfirm.show({ type: 'success', ...options }),
  error: (options: ModalFuncProps) => SConfirm.show({ type: 'error', ...options }),
  warning: (options: ModalFuncProps) => SConfirm.show({ type: 'warning', ...options }),

  delete: (options: ModalFuncProps) =>
    SConfirm.show({
      type: 'confirm',
      title: '确认删除',
      content: '确定要删除吗？此操作不可撤销。',
      okText: '删除',
      okButtonProps: { danger: true },
      ...options,
    }),
};

export default SConfirm;
