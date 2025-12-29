import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  getToken?: () => string | null;
  onTokenExpired?: () => void;
  onError?: (error: Error) => void;
}

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
  retry?: number;
  retryDelay?: number;
}

export class ApiClient {
  private instance: AxiosInstance;
  private config: ApiClientConfig;
  private pendingRequests: Map<string, AbortController> = new Map();

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加Token
        if (!config.headers?.skipAuth && this.config.getToken) {
          const token = this.config.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // 添加请求取消控制
        const requestKey = `${config.method}:${config.url}`;
        if (this.pendingRequests.has(requestKey)) {
          this.pendingRequests.get(requestKey)?.abort();
        }
        const controller = new AbortController();
        config.signal = controller.signal;
        this.pendingRequests.set(requestKey, controller);

        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 移除pending请求
        const requestKey = `${response.config.method}:${response.config.url}`;
        this.pendingRequests.delete(requestKey);

        // 检查业务状态码
        if (response.data.code !== 0 && response.data.code !== 200) {
          return Promise.reject(new Error(response.data.message || '请求失败'));
        }

        return response;
      },
      async (error) => {
        // 移除pending请求
        if (error.config) {
          const requestKey = `${error.config.method}:${error.config.url}`;
          this.pendingRequests.delete(requestKey);
        }

        // Token过期处理
        if (error.response?.status === 401) {
          this.config.onTokenExpired?.();
        }

        // 请求重试
        const config = error.config as RequestConfig;
        if (config?.retry && config.retry > 0) {
          config.retry -= 1;
          await new Promise((resolve) => setTimeout(resolve, config.retryDelay || 1000));
          return this.instance.request(config);
        }

        // 错误回调
        if (!config?.skipErrorHandler) {
          this.config.onError?.(error);
        }

        return Promise.reject(error);
      }
    );
  }

  // GET请求
  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  // POST请求
  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  // PUT请求
  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  // DELETE请求
  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  // 取消所有pending请求
  cancelAllRequests(): void {
    this.pendingRequests.forEach((controller) => controller.abort());
    this.pendingRequests.clear();
  }

  // 获取axios实例
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// 工厂函数
export const createApiClient = (config: ApiClientConfig): ApiClient => {
  return new ApiClient(config);
};
