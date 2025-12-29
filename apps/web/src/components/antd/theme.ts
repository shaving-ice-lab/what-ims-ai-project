/**
 * Ant Design 主题配置
 * 配置品牌主色、组件默认样式等
 */

import type { ThemeConfig } from 'antd';

// 品牌主色
export const PRIMARY_COLOR = '#1890ff';
export const SUCCESS_COLOR = '#52c41a';
export const WARNING_COLOR = '#faad14';
export const ERROR_COLOR = '#ff4d4f';
export const INFO_COLOR = '#1890ff';

// 亮色主题配置
export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: PRIMARY_COLOR,
    colorSuccess: SUCCESS_COLOR,
    colorWarning: WARNING_COLOR,
    colorError: ERROR_COLOR,
    colorInfo: INFO_COLOR,
    borderRadius: 6,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
  },
  components: {
    Button: {
      controlHeight: 36,
      borderRadius: 6,
    },
    Input: {
      controlHeight: 36,
      borderRadius: 6,
    },
    Select: {
      controlHeight: 36,
      borderRadius: 6,
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: 'rgba(0, 0, 0, 0.85)',
      rowHoverBg: '#f5f5f5',
    },
    Card: {
      borderRadiusLG: 8,
    },
    Modal: {
      borderRadiusLG: 8,
    },
    Menu: {
      itemBorderRadius: 6,
    },
  },
};

// 暗色主题配置
export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: PRIMARY_COLOR,
    colorSuccess: SUCCESS_COLOR,
    colorWarning: WARNING_COLOR,
    colorError: ERROR_COLOR,
    colorInfo: INFO_COLOR,
    borderRadius: 6,
    colorBgContainer: '#141414',
    colorBgElevated: '#1f1f1f',
    colorBgLayout: '#000000',
    colorText: 'rgba(255, 255, 255, 0.85)',
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
    colorBorder: '#434343',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
  },
  components: {
    Button: {
      controlHeight: 36,
      borderRadius: 6,
    },
    Input: {
      controlHeight: 36,
      borderRadius: 6,
    },
    Select: {
      controlHeight: 36,
      borderRadius: 6,
    },
    Table: {
      headerBg: '#1f1f1f',
      headerColor: 'rgba(255, 255, 255, 0.85)',
      rowHoverBg: '#262626',
    },
    Card: {
      borderRadiusLG: 8,
    },
    Modal: {
      borderRadiusLG: 8,
    },
    Menu: {
      itemBorderRadius: 6,
    },
  },
};

// 紧凑主题配置
export const compactTheme: ThemeConfig = {
  token: {
    colorPrimary: PRIMARY_COLOR,
    borderRadius: 4,
    controlHeight: 28,
    fontSize: 12,
  },
  components: {
    Button: {
      controlHeight: 28,
      borderRadius: 4,
    },
    Input: {
      controlHeight: 28,
      borderRadius: 4,
    },
    Select: {
      controlHeight: 28,
      borderRadius: 4,
    },
    Table: {
      cellPaddingBlock: 8,
      cellPaddingInline: 8,
    },
  },
};

// 默认导出亮色主题
export default lightTheme;
