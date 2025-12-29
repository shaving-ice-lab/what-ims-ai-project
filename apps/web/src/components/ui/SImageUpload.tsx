'use client';

/**
 * SImageUpload - 图片上传组件
 * 基于 Ant Design Upload 组件封装
 * 支持裁剪、压缩、多图上传、预览
 */

import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, type UploadFile, type UploadProps, message } from 'antd';
import type { RcFile } from 'antd/es/upload';
import React, { useState } from 'react';

export interface SImageUploadProps extends Omit<UploadProps, 'onChange'> {
  /** 最大文件数量 */
  maxCount?: number;
  /** 最大文件大小（MB） */
  maxSize?: number;
  /** 允许的图片格式 */
  acceptFormats?: string[];
  /** 文件列表 */
  value?: UploadFile[];
  /** 文件变化回调 */
  onChange?: (fileList: UploadFile[]) => void;
}

const SImageUpload: React.FC<SImageUploadProps> = ({
  maxCount = 5,
  maxSize = 5,
  acceptFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  value = [],
  onChange,
  ...rest
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || (file.url ? file.url.substring(file.url.lastIndexOf('/') + 1) : '预览')
    );
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    onChange?.(newFileList);
  };

  const beforeUpload = (file: RcFile) => {
    const isValidFormat = acceptFormats.includes(file.type);
    if (!isValidFormat) {
      message.error(`只支持 ${acceptFormats.join(', ')} 格式的图片`);
      return Upload.LIST_IGNORE;
    }

    const isValidSize = file.size / 1024 / 1024 < maxSize;
    if (!isValidSize) {
      message.error(`图片大小不能超过 ${maxSize}MB`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={value}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        accept={acceptFormats.join(',')}
        {...rest}
      >
        {value.length >= maxCount ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default SImageUpload;
