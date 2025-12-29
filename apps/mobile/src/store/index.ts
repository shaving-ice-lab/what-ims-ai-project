import { configureStore } from '@reduxjs/toolkit';
import Taro from '@tarojs/taro';
import { persistReducer, persistStore } from 'redux-persist';

import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import systemReducer from './slices/systemSlice';

// Taro storage adapter for redux-persist
const taroStorage = {
  setItem: (key: string, value: string) => {
    try {
      Taro.setStorageSync(key, value);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getItem: (key: string) => {
    try {
      const value = Taro.getStorageSync(key);
      return Promise.resolve(value);
    } catch (error) {
      return Promise.resolve(undefined);
    }
  },
  removeItem: (key: string) => {
    try {
      Taro.removeStorageSync(key);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

const authPersistConfig = {
  key: 'auth',
  storage: taroStorage,
  whitelist: ['user', 'token', 'refreshToken', 'currentRole'],
};

const cartPersistConfig = {
  key: 'cart',
  storage: taroStorage,
  whitelist: ['items'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    system: systemReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
