/**
 * Ant Design 主题配置
 * 配置品牌主色、组件默认样式等
 */

import type { ThemeConfig } from 'antd';

// 品牌色 - 供应链行业主题
export const BRAND_COLORS = {
  primary: '#2563eb', // Modern blue
  secondary: '#0891b2', // Teal accent
  success: '#059669', // Green
  warning: '#d97706', // Amber
  error: '#dc2626', // Red
  info: '#0284c7', // Light blue
};

// 旧版兼容导出
export const PRIMARY_COLOR = BRAND_COLORS.primary;
export const SUCCESS_COLOR = BRAND_COLORS.success;
export const WARNING_COLOR = BRAND_COLORS.warning;
export const ERROR_COLOR = BRAND_COLORS.error;
export const INFO_COLOR = BRAND_COLORS.info;

// 字体配置 - 中文友好
const fontFamily = `'HarmonyOS Sans SC', 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

// 增强亮色主题配置
export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: BRAND_COLORS.primary,
    colorSuccess: BRAND_COLORS.success,
    colorWarning: BRAND_COLORS.warning,
    colorError: BRAND_COLORS.error,
    colorInfo: BRAND_COLORS.info,
    colorLink: BRAND_COLORS.primary,
    borderRadius: 8,
    fontFamily,

    // Spacing
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginMD: 20,
    marginLG: 24,
    marginXL: 32,

    // Shadows
    boxShadow:
      '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    boxShadowSecondary:
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  components: {
    Button: {
      controlHeight: 40,
      borderRadius: 8,
      primaryShadow: '0 2px 0 rgba(37, 99, 235, 0.1)',
      fontWeight: 500,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
      activeShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)',
    },
    Select: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Card: {
      borderRadiusLG: 12,
      boxShadowTertiary: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#334155',
      rowHoverBg: '#f1f5f9',
      borderRadius: 8,
    },
    Modal: {
      borderRadiusLG: 12,
    },
    Menu: {
      itemBorderRadius: 8,
      itemSelectedBg: 'rgba(37, 99, 235, 0.1)',
      itemSelectedColor: BRAND_COLORS.primary,
      itemHoverBg: 'rgba(37, 99, 235, 0.05)',
    },
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 28,
    },
    Tag: {
      borderRadiusSM: 4,
    },
    Badge: {
      statusSize: 8,
    },
    Breadcrumb: {
      itemColor: '#64748b',
      lastItemColor: '#1e293b',
      linkColor: '#64748b',
      linkHoverColor: BRAND_COLORS.primary,
    },
    Tabs: {
      itemSelectedColor: BRAND_COLORS.primary,
      inkBarColor: BRAND_COLORS.primary,
      itemHoverColor: BRAND_COLORS.primary,
    },
    Form: {
      labelColor: '#374151',
      labelFontSize: 14,
    },
    Pagination: {
      itemBg: 'transparent',
      itemActiveBg: BRAND_COLORS.primary,
      borderRadius: 6,
    },
    Divider: {
      colorSplit: '#e2e8f0',
    },
    Drawer: {
      footerPaddingBlock: 16,
      footerPaddingInline: 24,
    },
    Message: {
      contentBg: '#ffffff',
      contentPadding: '12px 20px',
    },
    Notification: {
      width: 384,
    },
  },
};

// 暗色主题配置
export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: BRAND_COLORS.primary,
    colorSuccess: BRAND_COLORS.success,
    colorWarning: BRAND_COLORS.warning,
    colorError: BRAND_COLORS.error,
    colorInfo: BRAND_COLORS.info,
    borderRadius: 8,
    colorBgContainer: '#1e293b',
    colorBgElevated: '#1e293b',
    colorBgLayout: '#0f172a',
    colorText: 'rgba(255, 255, 255, 0.85)',
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
    colorBorder: '#334155',
    fontFamily,
  },
  components: {
    Button: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Select: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Table: {
      headerBg: '#1e293b',
      headerColor: 'rgba(255, 255, 255, 0.85)',
      rowHoverBg: '#334155',
      borderRadius: 8,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Modal: {
      borderRadiusLG: 12,
    },
    Menu: {
      itemBorderRadius: 8,
      itemSelectedBg: 'rgba(37, 99, 235, 0.2)',
      itemSelectedColor: '#60a5fa',
    },
  },
};

// 紧凑主题配置
export const compactTheme: ThemeConfig = {
  token: {
    colorPrimary: BRAND_COLORS.primary,
    borderRadius: 6,
    controlHeight: 32,
    fontSize: 13,
    fontFamily,
  },
  components: {
    Button: {
      controlHeight: 32,
      borderRadius: 6,
    },
    Input: {
      controlHeight: 32,
      borderRadius: 6,
    },
    Select: {
      controlHeight: 32,
      borderRadius: 6,
    },
    Table: {
      cellPaddingBlock: 8,
      cellPaddingInline: 12,
    },
  },
};

// 默认导出亮色主题
export default lightTheme;
