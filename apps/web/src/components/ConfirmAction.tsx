'use client';

/**
 * ConfirmAction - 敏感操作二次确认组件
 * 支持删除、批量操作确认和密码验证
 */

import { ExclamationCircleOutlined, LockOutlined } from '@ant-design/icons';
import { App, Input, Modal } from 'antd';
import React, { useState } from 'react';

export interface ConfirmActionProps {
  /** 是否显示对话框 */
  open: boolean;
  /** 确认类型 */
  type?: 'confirm' | 'password';
  /** 标题 */
  title?: string;
  /** 确认内容 */
  content?: React.ReactNode;
  /** 操作类型标签 */
  actionLabel?: string;
  /** 危险级别 */
  danger?: boolean;
  /** 确认按钮文字 */
  okText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 加载状态 */
  loading?: boolean;
  /** 确认回调 */
  onConfirm: (password?: string) => void | Promise<void>;
  /** 取消回调 */
  onCancel: () => void;
}

const ConfirmAction: React.FC<ConfirmActionProps> = ({
  open,
  type = 'confirm',
  title,
  content,
  actionLabel = '此操作',
  danger = true,
  okText = '确认',
  cancelText = '取消',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { message } = App.useApp();

  const handleConfirm = async () => {
    if (type === 'password' && !password.trim()) {
      message.error('请输入密码');
      return;
    }

    setConfirmLoading(true);
    try {
      await onConfirm(type === 'password' ? password : undefined);
      setPassword('');
    } catch (error) {
      // Error handling should be done in onConfirm
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    onCancel();
  };

  const defaultTitle = type === 'password' ? '安全验证' : '确认操作';
  const defaultContent =
    type === 'password' ? (
      <div>
        <p style={{ marginBottom: 16 }}>请输入您的登录密码以确认{actionLabel}：</p>
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onPressEnter={handleConfirm}
          autoFocus
        />
      </div>
    ) : (
      <p>
        确定要执行{actionLabel}吗？
        {danger && <span style={{ color: '#ff4d4f' }}>此操作不可撤销。</span>}
      </p>
    );

  return (
    <Modal
      open={open}
      title={
        <span>
          <ExclamationCircleOutlined
            style={{ color: danger ? '#ff4d4f' : '#faad14', marginRight: 8 }}
          />
          {title || defaultTitle}
        </span>
      }
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{
        danger,
        loading: loading || confirmLoading,
      }}
      onOk={handleConfirm}
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose
    >
      {content || defaultContent}
    </Modal>
  );
};

export default ConfirmAction;

/**
 * useConfirmAction - 敏感操作确认Hook
 */
export interface UseConfirmActionOptions {
  type?: 'confirm' | 'password';
  title?: string;
  content?: React.ReactNode;
  actionLabel?: string;
  danger?: boolean;
  okText?: string;
  cancelText?: string;
}

export interface UseConfirmActionReturn {
  open: boolean;
  showConfirm: (options?: UseConfirmActionOptions) => Promise<string | boolean>;
  hideConfirm: () => void;
  ConfirmModal: React.FC;
}

export function useConfirmAction(
  defaultOptions: UseConfirmActionOptions = {}
): UseConfirmActionReturn {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmActionOptions>(defaultOptions);
  const [resolveRef, setResolveRef] = useState<{
    resolve: (value: string | boolean) => void;
  } | null>(null);

  const showConfirm = (overrideOptions?: UseConfirmActionOptions): Promise<string | boolean> => {
    return new Promise((resolve) => {
      setOptions({ ...defaultOptions, ...overrideOptions });
      setResolveRef({ resolve });
      setOpen(true);
    });
  };

  const hideConfirm = () => {
    setOpen(false);
    if (resolveRef) {
      resolveRef.resolve(false);
      setResolveRef(null);
    }
  };

  const handleConfirm = (password?: string) => {
    setOpen(false);
    if (resolveRef) {
      resolveRef.resolve(options.type === 'password' ? password || '' : true);
      setResolveRef(null);
    }
  };

  const handleCancel = () => {
    hideConfirm();
  };

  const ConfirmModal: React.FC = () => (
    <ConfirmAction
      open={open}
      type={options.type}
      title={options.title}
      content={options.content}
      actionLabel={options.actionLabel}
      danger={options.danger}
      okText={options.okText}
      cancelText={options.cancelText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return {
    open,
    showConfirm,
    hideConfirm,
    ConfirmModal,
  };
}

/**
 * confirmDelete - 快捷删除确认函数
 */
export function confirmDelete(itemName: string): Promise<boolean> {
  return new Promise((resolve) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: `确定要删除"${itemName}"吗？此操作不可撤销。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}

/**
 * confirmBatchAction - 批量操作确认函数
 */
export function confirmBatchAction(
  action: string,
  count: number,
  itemType = '项'
): Promise<boolean> {
  return new Promise((resolve) => {
    Modal.confirm({
      title: '确认批量操作',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `确定要对选中的 ${count} ${itemType}执行"${action}"操作吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}
