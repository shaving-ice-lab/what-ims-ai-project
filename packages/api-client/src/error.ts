export class ApiError extends Error {
  code: number;
  status?: number;
  data?: unknown;

  constructor(message: string, code: number, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.data = data;
  }

  static fromResponse(response: { code: number; message: string; data?: unknown }): ApiError {
    return new ApiError(response.message, response.code, undefined, response.data);
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}

export const handleApiError = (error: unknown): string => {
  if (ApiError.isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    // 网络错误
    if (error.message.includes('Network Error')) {
      return '网络连接失败，请检查网络设置';
    }

    // 超时错误
    if (error.message.includes('timeout')) {
      return '请求超时，请稍后重试';
    }

    return error.message;
  }

  return '未知错误';
};

// 错误码映射
export const ERROR_CODE_MAP: Record<number, string> = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '没有权限访问',
  404: '请求的资源不存在',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂时不可用',
  504: '网关超时',
};

export const getErrorMessage = (code: number): string => {
  return ERROR_CODE_MAP[code] || '请求失败';
};
