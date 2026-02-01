/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    // API Configuration
    /** 后端API地址 */
    NEXT_PUBLIC_API_URL: string;
    /** 文件上传地址 */
    NEXT_PUBLIC_UPLOAD_URL?: string;

    // Environment
    /** 应用环境 */
    NEXT_PUBLIC_APP_ENV: 'development' | 'staging' | 'production';
    /** Node环境 */
    NODE_ENV: 'development' | 'production' | 'test';

    // Feature Flags
    /** 是否启用Mock数据 */
    NEXT_PUBLIC_ENABLE_MOCK?: 'true' | 'false';
    /** 是否启用调试模式 */
    NEXT_PUBLIC_ENABLE_DEBUG?: 'true' | 'false';

    // Third-party Services
    /** Sentry DSN (错误监控) */
    NEXT_PUBLIC_SENTRY_DSN?: string;
    /** Google Analytics ID */
    NEXT_PUBLIC_GA_ID?: string;
    /** 百度统计ID */
    NEXT_PUBLIC_BAIDU_ANALYTICS_ID?: string;

    // Payment Configuration
    /** 支付结果回调页面URL */
    NEXT_PUBLIC_PAYMENT_RETURN_URL?: string;
  }
}

// Extend Window interface for global variables
declare global {
  interface Window {
    /** Redux DevTools Extension */
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof import('redux').compose;
    /** 百度统计 */
    _hmt?: Array<Array<string>>;
  }
}

export {};
