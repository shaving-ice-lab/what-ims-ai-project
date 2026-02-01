'use client';

import { Component, ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - 全局错误边界组件
 * 捕获子组件树中的 JavaScript 错误，显示降级 UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误日志
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 调用可选的错误处理回调
    this.props.onError?.(error, errorInfo);

    // 可以在这里集成错误监控服务，如 Sentry
    // if (typeof window !== 'undefined' && (window as any).Sentry) {
    //   (window as any).Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // 渲染自定义降级 UI 或默认的 ErrorFallback
      return (
        this.props.fallback || (
          <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
