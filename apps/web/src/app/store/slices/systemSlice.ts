import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SystemConfig {
  orderCancelThreshold: number; // in hours
  paymentTimeout: number; // in minutes
  serviceFeeRate: number; // percentage
  webhookRetryTimes: number;
  webhookRetryInterval: number; // in minutes
}

interface SystemState {
  config: SystemConfig;
  loading: boolean;
  error: string | null;
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: number;
  }>;
}

const initialState: SystemState = {
  config: {
    orderCancelThreshold: 1,
    paymentTimeout: 15,
    serviceFeeRate: 0.003,
    webhookRetryTimes: 3,
    webhookRetryInterval: 5,
  },
  loading: false,
  error: null,
  notifications: [],
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setSystemConfig: (state, action: PayloadAction<Partial<SystemConfig>>) => {
      state.config = { ...state.config, ...action.payload };
    },
    addNotification: (state, action: PayloadAction<{
      type: 'info' | 'success' | 'warning' | 'error';
      message: string;
    }>) => {
      state.notifications.push({
        id: Date.now().toString(),
        type: action.payload.type,
        message: action.payload.message,
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSystemConfig,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setError,
} = systemSlice.actions;

export default systemSlice.reducer;
