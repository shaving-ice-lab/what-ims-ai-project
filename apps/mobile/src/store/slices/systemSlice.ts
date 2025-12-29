import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 系统配置状态
interface SystemState {
  theme: 'light' | 'dark';
  language: string;
  apiBaseUrl: string;
  appVersion: string;
  networkStatus: 'online' | 'offline';
  lastSyncTime: number | null;
}

const initialState: SystemState = {
  theme: 'light',
  language: 'zh-CN',
  apiBaseUrl: '',
  appVersion: '1.0.0',
  networkStatus: 'online',
  lastSyncTime: null,
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    // 设置主题
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },

    // 设置语言
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },

    // 设置API基础URL
    setApiBaseUrl: (state, action: PayloadAction<string>) => {
      state.apiBaseUrl = action.payload;
    },

    // 设置网络状态
    setNetworkStatus: (state, action: PayloadAction<'online' | 'offline'>) => {
      state.networkStatus = action.payload;
    },

    // 更新最后同步时间
    updateLastSyncTime: (state) => {
      state.lastSyncTime = Date.now();
    },

    // 重置系统设置
    resetSystem: () => initialState,
  },
});

export const {
  setTheme,
  setLanguage,
  setApiBaseUrl,
  setNetworkStatus,
  updateLastSyncTime,
  resetSystem,
} = systemSlice.actions;

export default systemSlice.reducer;

// 选择器
export const selectTheme = (state: { system: SystemState }) => state.system.theme;
export const selectLanguage = (state: { system: SystemState }) => state.system.language;
export const selectNetworkStatus = (state: { system: SystemState }) => state.system.networkStatus;
export const selectIsOnline = (state: { system: SystemState }) =>
  state.system.networkStatus === 'online';
