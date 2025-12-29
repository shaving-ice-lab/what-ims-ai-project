import { configureStore } from '@reduxjs/toolkit';
import { MMKV } from 'react-native-mmkv';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import systemReducer from './slices/systemSlice';

// MMKV storage for React Native / Taro
const storage = new MMKV();

const reduxMMKVStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const authPersistConfig = {
  key: 'auth',
  storage: reduxMMKVStorage,
  whitelist: ['user', 'token', 'refreshToken', 'currentRole']
};

const cartPersistConfig = {
  key: 'cart',
  storage: reduxMMKVStorage,
  whitelist: ['items']
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
