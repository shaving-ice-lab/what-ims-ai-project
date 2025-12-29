import type { AuthState, User } from '@/types/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  currentRole: null,
  availableRoles: undefined,
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
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
        availableRoles?: AuthState['availableRoles'];
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.currentRole = action.payload.user.role;
      state.availableRoles = action.payload.availableRoles;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.currentRole = null;
      state.availableRoles = undefined;
      state.loading = false;
      state.error = action.payload;
    },
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.currentRole = action.payload.role;
    },
    selectRole: (
      state,
      action: PayloadAction<{
        role: 'admin' | 'sub_admin' | 'supplier' | 'store';
        roleId?: number;
        accessToken?: string;
      }>
    ) => {
      if (state.user) {
        state.user.role = action.payload.role;
        state.user.roleId = action.payload.roleId;
      }
      state.currentRole = action.payload.role;
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.currentRole = null;
      state.availableRoles = undefined;
      state.loading = false;
      state.error = null;
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
  setCredentials,
  setUser,
  selectRole,
  updateToken,
  setLoading,
  setError,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
