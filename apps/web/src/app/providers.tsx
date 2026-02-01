'use client';

import { persistor, store } from '@/store';
import { setAntdStaticInstance } from '@/utils/antdStatic';
import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React, { useEffect } from 'react';
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

// 设置 Ant Design 静态方法实例
function AntdStaticSetup({ children }: { children: React.ReactNode }) {
  const { message, notification, modal } = App.useApp();

  useEffect(() => {
    setAntdStaticInstance(message, notification, modal);
  }, [message, notification, modal]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider locale={zhCN} theme={theme}>
          <App>
            <AntdStaticSetup>{children}</AntdStaticSetup>
          </App>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}
