import React, { useState } from 'react';

import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload';

const { Dragger } = Upload;

export interface SFileUploadProps extends Omit<UploadProps, 'onChange'> {
  /** 最大上传数量 */
  maxCount?: number;
  /** 文件最大尺寸（MB） */
  maxSize?: number;
  /** 上传回调 */
  onChange?: (fileList: UploadFile[]) => void;
  /** 初始文件列表 */
  value?: UploadFile[];
  /** 是否使用拖拽上传 */
  dragger?: boolean;
  /** 提示文字 */
  hint?: string;
}

export const SFileUpload: React.FC<SFileUploadProps> = ({
  maxCount = 10,
  maxSize = 10,
  onChange,
  value = [],
  dragger = true,
  hint = '支持单个或批量上传',
  accept,
  ...restProps
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(value);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    onChange?.(newFileList);
  };

  const beforeUpload = (file: RcFile) => {
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      console.error(`文件大小不能超过 ${maxSize}MB!`);
      return false;
    }
    return true;
  };

  if (dragger) {
    return (
      <Dragger
        accept={accept}
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
        {...restProps}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">{hint}</p>
      </Dragger>
    );
  }

  return (
    <Upload
      accept={accept}
      fileList={fileList}
      onChange={handleChange}
      beforeUpload={beforeUpload}
      maxCount={maxCount}
      {...restProps}
    />
  );
};

export default SFileUpload;
