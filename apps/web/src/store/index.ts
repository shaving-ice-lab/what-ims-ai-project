import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import systemReducer from './slices/systemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    system: systemReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setCredentials', 'auth/setUser'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'payload.user.lastLoginAt'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user.lastLoginAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
