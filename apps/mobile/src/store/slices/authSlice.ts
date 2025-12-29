import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 用户角色类型
export type UserRole = 'admin' | 'sub_admin' | 'supplier' | 'store';

// 用户信息接口
export interface UserInfo {
  id: number;
  username: string;
  phone: string;
  avatar?: string;
  roles: UserRole[]; // 用户可能拥有多个角色
}

// 认证状态接口
interface AuthState {
  user: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  currentRole: UserRole | null; // 当前选中的角色
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  currentRole: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // 登录成功
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: UserInfo;
        token: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.loading = false;

      // 如果用户只有一个角色，自动设置为当前角色
      if (action.payload.user.roles.length === 1) {
        state.currentRole = action.payload.user.roles[0] ?? null;
      }
    },

    // 设置当前角色（角色切换）
    setCurrentRole: (state, action: PayloadAction<UserRole>) => {
      if (state.user?.roles.includes(action.payload)) {
        state.currentRole = action.payload;
      }
    },

    // 清除当前角色（返回角色选择页面）
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },

    // 更新Token
    updateToken: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
      }>
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },

    // 更新用户信息
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // 退出登录
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.currentRole = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  setCurrentRole,
  clearCurrentRole,
  updateToken,
  updateUserInfo,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

// 选择器
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentRole = (state: { auth: AuthState }) => state.auth.currentRole;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserRoles = (state: { auth: AuthState }) => state.auth.user?.roles ?? [];
export const selectHasMultipleRoles = (state: { auth: AuthState }) =>
  (state.auth.user?.roles.length ?? 0) > 1;
export const selectNeedsRoleSelection = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated && (state.auth.user?.roles.length ?? 0) > 1 && !state.auth.currentRole;
