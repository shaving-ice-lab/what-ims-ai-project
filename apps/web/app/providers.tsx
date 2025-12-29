'use client';

import { persistor, store } from '@/store';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

dayjs.locale('zh-cn');

// Ant Design 主题配置
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4,
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
  },
  components: {
    Button: {
      borderRadius: 4,
    },
    Card: {
      borderRadius: 4,
    },
    Table: {
      borderRadius: 4,
    },
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider locale={zhCN} theme={theme}>
          {children}
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}
