import Taro from '@tarojs/taro';

import { store } from '../store';

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, unknown> | unknown[];
  header?: Record<string, string>;
  showLoading?: boolean;
  loadingText?: string;
}

interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp?: number;
}

class Request {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    // 使用Taro的环境变量或默认值
    this.baseUrl = 'http://localhost:8080/api';
    this.timeout = 30000;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const state = store.getState();
    const token = state.auth?.token;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(
    response: Taro.request.SuccessCallbackResult
  ): Promise<ApiResponse<T>> {
    const { statusCode, data } = response;

    if (statusCode >= 200 && statusCode < 300) {
      return data as ApiResponse<T>;
    }

    // Handle authentication errors
    if (statusCode === 401) {
      // Token expired or invalid
      Taro.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none',
        duration: 2000,
      });

      // Clear auth state and redirect to login
      store.dispatch({ type: 'auth/logout' });

      setTimeout(() => {
        Taro.redirectTo({
          url: '/pages/login/index',
        });
      }, 2000);

      throw new Error('Unauthorized');
    }

    // Handle other errors
    const errorMessage =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : `请求失败：${statusCode}`;
    throw new Error(errorMessage);
  }

  public async request<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> {
    const {
      url,
      method = 'GET',
      data,
      header = {},
      showLoading = true,
      loadingText = '加载中...',
    } = config;

    if (showLoading) {
      Taro.showLoading({
        title: loadingText,
        mask: true,
      });
    }

    try {
      const response = await Taro.request({
        url: `${this.baseUrl}${url}`,
        method,
        data,
        header: {
          ...this.getHeaders(),
          ...header,
        },
        timeout: this.timeout,
      });

      const result = await this.handleResponse<T>(response);

      if (result.code !== 0) {
        throw new Error(result.message || '请求失败');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '网络请求失败';
      Taro.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2000,
      });
      throw error;
    } finally {
      if (showLoading) {
        Taro.hideLoading();
      }
    }
  }

  // Convenience methods
  public get<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      data,
      ...config,
    });
  }

  public post<T = unknown>(
    url: string,
    data?: Record<string, unknown> | unknown[],
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config,
    });
  }

  public put<T = unknown>(
    url: string,
    data?: Record<string, unknown> | unknown[],
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config,
    });
  }

  public delete<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      data,
      ...config,
    });
  }
}

export default new Request();
