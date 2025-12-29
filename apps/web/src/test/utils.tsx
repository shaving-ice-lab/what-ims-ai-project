import { render, RenderOptions } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React, { ReactElement } from 'react';

// Custom render function with providers
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
