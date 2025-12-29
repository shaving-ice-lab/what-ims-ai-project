'use client';

/**
 * Ant Design Provider 组件
 * 提供主题配置、国际化配置等
 */

import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React, { createContext, useContext, useState } from 'react';
import { darkTheme, lightTheme } from './theme';

// 设置 dayjs 语言
dayjs.locale('zh-cn');

// 主题模式类型
export type ThemeMode = 'light' | 'dark';

// 主题上下文
interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  setThemeMode: () => {},
  toggleTheme: () => {},
});

// 使用主题的 Hook
export const useTheme = () => useContext(ThemeContext);

interface AntdProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}

/**
 * Ant Design Provider
 * 包装应用提供主题、国际化等配置
 */
const AntdProvider: React.FC<AntdProviderProps> = ({ children, defaultTheme = 'light' }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultTheme);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, toggleTheme }}>
      <ConfigProvider theme={currentTheme} locale={zhCN}>
        <App>{children}</App>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default AntdProvider;
