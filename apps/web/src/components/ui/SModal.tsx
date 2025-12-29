'use client';

/**
 * SModal - 统一弹窗组件
 * 基于 Ant Design Modal 组件封装
 * 支持拖拽、全屏
 */

import { CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import { Button, Modal, type ModalProps } from 'antd';
import React, { useState } from 'react';

export interface SModalProps extends ModalProps {
  /** 是否支持全屏 */
  allowFullscreen?: boolean;
}

const SModal: React.FC<SModalProps> = ({
  title,
  allowFullscreen = false,
  width,
  style,
  children,
  ...rest
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fullscreenStyle: React.CSSProperties = isFullscreen
    ? {
        top: 0,
        margin: 0,
        maxWidth: '100vw',
        paddingBottom: 0,
      }
    : {};

  const modalTitle = allowFullscreen ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 32,
      }}
    >
      <span>{title}</span>
      <Button
        type="text"
        size="small"
        icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
        onClick={() => setIsFullscreen(!isFullscreen)}
      />
    </div>
  ) : (
    title
  );

  return (
    <Modal
      title={modalTitle}
      width={isFullscreen ? '100vw' : width}
      style={{ ...style, ...fullscreenStyle }}
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default SModal;
