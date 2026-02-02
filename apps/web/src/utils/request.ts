import { message } from '@/lib/toast';
import { store } from '@/store';
import { logout, updateToken } from '@/store/slices/authSlice';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API响应包装
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:16000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;

    // 如果是下载文件，直接返回
    if (response.config.responseType === 'blob') {
      return response;
    }

    // 业务错误处理（后端成功码为 0）
    if (res.code !== 0 && res.code !== 200) {
      message?.error(res.message || '请求失败');

      // 401: 未授权
      if (res.code === 401) {
        store.dispatch(logout());
        window.location.href = '/login';
      }

      return Promise.reject(new Error(res.message || 'Error'));
    }

    // Return the unwrapped data but keep it in response structure
    response.data = res.data;
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const { response, config } = error;

    // 网络错误
    if (!response) {
      message?.error('网络连接异常，请检查网络');
      return Promise.reject(error);
    }

    const { status, data } = response;

    switch (status) {
      case 401:
        // Token过期，尝试刷新
        if (config && !config.url?.includes('/auth/refresh')) {
          try {
            const refreshToken = store.getState().auth?.refreshToken;
            if (refreshToken) {
              const res = await refreshTokenRequest(refreshToken);
              const newAccessToken = res.data?.data?.accessToken;
              if (newAccessToken) {
                store.dispatch(updateToken(newAccessToken));
                // 重试原请求
                if (config.headers) {
                  config.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return request(config);
              }
            }
          } catch {
            // 刷新失败，退出登录
            store.dispatch(logout());
            window.location.href = '/login';
          }
        } else {
          store.dispatch(logout());
          window.location.href = '/login';
        }
        break;

      case 403:
        message?.error('没有权限访问');
        break;

      case 404:
        message?.error('请求的资源不存在');
        break;

      case 429:
        message?.error('请求过于频繁，请稍后再试');
        break;

      case 500:
        message?.error('服务器错误，请稍后再试');
        break;

      default:
        message?.error(data?.message || `请求失败: ${status}`);
    }

    return Promise.reject(error);
  }
);

// 刷新Token请求
async function refreshTokenRequest(refreshToken: string) {
  return axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:16000/api'}/auth/refresh`,
    { refreshToken }
  );
}

// 请求方法封装
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, config).then((res) => res.data);
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config).then((res) => res.data);
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config).then((res) => res.data);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config).then((res) => res.data);
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.patch(url, data, config).then((res) => res.data);
  },
};

export default request;
