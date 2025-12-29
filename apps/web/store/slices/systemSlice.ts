import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SystemState {
  loading: boolean;
  loadingMessage?: string;
  notification?: {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    description?: string;
  };
  config: {
    orderCancelThreshold: number; // minutes
    paymentTimeout: number; // minutes
    serviceFeeRate: number; // 0.003 for 3‰
    webhookRetryTimes: number;
    webhookRetryInterval: number; // minutes
  };
}

const initialState: SystemState = {
  loading: false,
  config: {
    orderCancelThreshold: 60,
    paymentTimeout: 15,
    serviceFeeRate: 0.003,
    webhookRetryTimes: 3,
    webhookRetryInterval: 5,
  },
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean; message?: string }>) => {
      state.loading = action.payload.loading;
      state.loadingMessage = action.payload.message;
    },
    showNotification: (state, action: PayloadAction<SystemState['notification']>) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = undefined;
    },
    updateConfig: (state, action: PayloadAction<Partial<SystemState['config']>>) => {
      state.config = { ...state.config, ...action.payload };
    },
  },
});

export const { setLoading, showNotification, clearNotification, updateConfig } = systemSlice.actions;
export default systemSlice.reducer;
