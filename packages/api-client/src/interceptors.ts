import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface InterceptorOptions {
  getToken?: () => string | null;
  onTokenExpired?: () => void;
  onError?: (error: Error) => void;
}

export const setupRequestInterceptor = (
  instance: AxiosInstance,
  options: InterceptorOptions
): number => {
  return instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 添加Token
      if (options.getToken) {
        const token = options.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // 添加时间戳防止缓存
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export const setupResponseInterceptor = (
  instance: AxiosInstance,
  options: InterceptorOptions
): number => {
  return instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      // 处理401错误
      if (error.response?.status === 401) {
        options.onTokenExpired?.();
      }

      // 处理其他错误
      if (error.response?.data?.message) {
        options.onError?.(new Error(error.response.data.message));
      } else if (error.message) {
        options.onError?.(error);
      }

      return Promise.reject(error);
    }
  );
};
