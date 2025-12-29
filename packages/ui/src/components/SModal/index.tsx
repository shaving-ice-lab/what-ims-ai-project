import React from 'react';

import { Modal, ModalProps } from 'antd';

export interface SModalProps extends ModalProps {
  /** 是否显示底部按钮 */
  showFooter?: boolean;
}

export const SModal: React.FC<SModalProps> = ({
  showFooter = true,
  footer,
  width = 520,
  centered = true,
  destroyOnClose = true,
  maskClosable = false,
  ...restProps
}) => {
  return (
    <Modal
      width={width}
      centered={centered}
      destroyOnClose={destroyOnClose}
      maskClosable={maskClosable}
      footer={showFooter ? footer : null}
      {...restProps}
    />
  );
};

export default SModal;
