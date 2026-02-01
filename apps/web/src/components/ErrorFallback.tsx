'use client';

import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

interface ErrorFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
}

/**
 * ErrorFallback - 错误降级UI组件
 * 在发生错误时显示用户友好的错误页面
 */
export default function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        padding: '40px',
      }}
    >
      <Result
        status="error"
        title="页面出错了"
        subTitle={
          process.env.NODE_ENV === 'development'
            ? error?.message || '发生了未知错误'
            : '抱歉，页面遇到了一些问题，请刷新重试'
        }
        extra={[
          <Button
            key="retry"
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRetry}
          >
            重新加载
          </Button>,
          <Button key="home" icon={<HomeOutlined />} onClick={handleGoHome}>
            返回首页
          </Button>,
        ]}
      >
        {process.env.NODE_ENV === 'development' && error?.stack && (
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px',
              textAlign: 'left',
              overflow: 'auto',
              maxHeight: '200px',
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: '12px',
                color: '#666',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {error.stack}
            </pre>
          </div>
        )}
      </Result>
    </div>
  );
}
