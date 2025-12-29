import { syncAuthToCookies } from '@/utils/authHelpers';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import systemReducer from './slices/systemSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: [
    'user',
    'accessToken',
    'refreshToken',
    'currentRole',
    'availableRoles',
    'isAuthenticated',
  ],
};

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'totalCount', 'totalAmount'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

// Middleware to sync auth state to cookies for middleware access
const authCookieSyncMiddleware: Middleware = () => (next) => (action: any) => {
  const result = next(action);

  // Sync to cookies after auth actions
  if (typeof action.type === 'string' && action.type.startsWith('auth/')) {
    syncAuthToCookies();
  }

  return result;
};

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
        ignoredPaths: ['auth.user.lastLoginAt'],
      },
    }).concat(authCookieSyncMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
