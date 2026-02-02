export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
  availableRoles?: RoleInfo[];
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'sub_admin' | 'supplier' | 'store';
  roleId?: number;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  lastLoginAt?: string;
  permissions?: string[];
  displayName?: string;
  isPrimary?: boolean;
}

export interface RoleInfo {
  role: string;
  roleId?: number;
  name: string;
  description?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  currentRole: 'admin' | 'sub_admin' | 'supplier' | 'store' | null;
  availableRoles?: RoleInfo[];
  loading: boolean;
  error: string | null;
  permissions?: string[];
  displayName?: string;
}

export interface SelectRoleRequest {
  role: string;
  roleId?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}
