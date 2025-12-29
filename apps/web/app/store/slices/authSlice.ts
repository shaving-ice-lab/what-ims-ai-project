import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'supplier' | 'store';
  phone?: string;
  email?: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  currentRole: 'admin' | 'supplier' | 'store' | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  currentRole: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{
      user: User;
      token: string;
      refreshToken: string;
    }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.currentRole = action.payload.user.role;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.currentRole = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.currentRole = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
    },
    selectRole: (state, action: PayloadAction<'admin' | 'supplier' | 'store'>) => {
      state.currentRole = action.payload;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  selectRole,
  updateToken,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
