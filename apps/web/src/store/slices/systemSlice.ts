import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SystemConfig {
  serviceFeeRate: number;
  minOrderAmount: number;
  maxLoginAttempts: number;
  loginLockDuration: number;
  tokenExpireHours: number;
  refreshTokenExpireDays: number;
  orderAutoConfirmHours: number;
  orderAutoCompleteDays: number;
  orderCancelThreshold: number;
  paymentTimeout: number;
  webhookRetryTimes: number;
  webhookRetryInterval: number;
}

interface SystemState {
  theme: 'light' | 'dark';
  locale: 'zh-CN' | 'en-US';
  sidebarCollapsed: boolean;
  loading: boolean;
  config: SystemConfig;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  timestamp: number;
  read: boolean;
}

const initialState: SystemState = {
  theme: 'light',
  locale: 'zh-CN',
  sidebarCollapsed: false,
  loading: false,
  config: {
    serviceFeeRate: 0.003,
    minOrderAmount: 100,
    maxLoginAttempts: 5,
    loginLockDuration: 15,
    tokenExpireHours: 2,
    refreshTokenExpireDays: 7,
    orderAutoConfirmHours: 24,
    orderAutoCompleteDays: 7,
    orderCancelThreshold: 60,
    paymentTimeout: 15,
    webhookRetryTimes: 3,
    webhookRetryInterval: 5,
  },
  notifications: [],
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLocale: (state, action: PayloadAction<'zh-CN' | 'en-US'>) => {
      state.locale = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setConfig: (state, action: PayloadAction<Partial<SystemConfig>>) => {
      state.config = { ...state.config, ...action.payload };
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: `${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        read: false,
      };
      state.notifications.unshift(notification);
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setTheme,
  setLocale,
  toggleSidebar,
  setSidebarCollapsed,
  setLoading,
  setConfig,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
} = systemSlice.actions;

export default systemSlice.reducer;
