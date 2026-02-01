'use client';

/**
 * SFileUpload - 文件上传组件
 * 基于 Ant Design Upload 组件封装
 * 支持拖拽上传、文件类型限制、大小限制
 */

import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { App, Button, Upload, type UploadFile, type UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import React from 'react';

const { Dragger } = Upload;

export interface SFileUploadProps extends Omit<UploadProps, 'onChange'> {
  /** 是否启用拖拽上传 */
  dragger?: boolean;
  /** 最大文件数量 */
  maxCount?: number;
  /** 最大文件大小（MB） */
  maxSize?: number;
  /** 允许的文件类型 */
  acceptTypes?: string[];
  /** 文件列表 */
  value?: UploadFile[];
  /** 文件变化回调 */
  onChange?: (fileList: UploadFile[]) => void;
  /** 按钮文字 */
  buttonText?: string;
  /** 拖拽区域提示文字 */
  draggerText?: string;
  /** 拖拽区域提示说明 */
  draggerHint?: string;
}

const SFileUpload: React.FC<SFileUploadProps> = ({
  dragger = false,
  maxCount = 10,
  maxSize = 10,
  acceptTypes,
  value = [],
  onChange,
  buttonText = '点击上传',
  draggerText = '点击或将文件拖拽到此区域上传',
  draggerHint = '支持单个或批量上传',
  ...rest
}) => {
  const { message } = App.useApp();
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    onChange?.(newFileList);
  };

  const beforeUpload = (file: RcFile) => {
    if (acceptTypes && acceptTypes.length > 0) {
      const isValidType = acceptTypes.some((type) => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type === type;
      });
      if (!isValidType) {
        message.error(`只支持 ${acceptTypes.join(', ')} 格式的文件`);
        return Upload.LIST_IGNORE;
      }
    }

    const isValidSize = file.size / 1024 / 1024 < maxSize;
    if (!isValidSize) {
      message.error(`文件大小不能超过 ${maxSize}MB`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  if (dragger) {
    return (
      <Dragger
        fileList={value}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
        accept={acceptTypes?.join(',')}
        {...rest}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{draggerText}</p>
        <p className="ant-upload-hint">{draggerHint}</p>
      </Dragger>
    );
  }

  return (
    <Upload
      fileList={value}
      onChange={handleChange}
      beforeUpload={beforeUpload}
      maxCount={maxCount}
      accept={acceptTypes?.join(',')}
      {...rest}
    >
      <Button icon={<UploadOutlined />}>{buttonText}</Button>
    </Upload>
  );
};

export default SFileUpload;
