import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'admin' | 'sub_admin' | 'supplier' | 'store';

interface User {
  id: number;
  username: string;
  role: UserRole;
  roleId?: number; // supplierId or storeId
  phone?: string;
  email?: string;
  avatar?: string;
  permissions?: string[]; // for admin
  name?: string;
  displayName?: string; // for supplier display
}

interface UserState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  availableRoles?: Array<{
    role: UserRole;
    roleId?: number;
    name: string;
  }>;
}

const initialState: UserState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  availableRoles: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{
      user: User;
      token: string;
      refreshToken: string;
      availableRoles?: UserState['availableRoles'];
    }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.availableRoles = action.payload.availableRoles;
    },
    selectRole: (state, action: PayloadAction<{
      role: UserRole;
      roleId?: number;
      token: string;
    }>) => {
      if (state.user) {
        state.user.role = action.payload.role;
        state.user.roleId = action.payload.roleId;
      }
      state.token = action.payload.token;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.availableRoles = undefined;
    },
  },
});

export const { loginSuccess, selectRole, updateToken, logout } = userSlice.actions;
export default userSlice.reducer;
