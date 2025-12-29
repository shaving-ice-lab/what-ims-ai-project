import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RoleInfo,
  SelectRoleRequest,
  UpdateProfileRequest,
  User,
} from '@/types/auth';
import { getAccessToken } from '@/utils/authHelpers';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/auth`;
  }

  // 登录
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post(`${this.baseURL}/login`, data);
    return response.data.data;
  }

  // 刷新Token
  async refreshToken(data: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await axios.post(`${this.baseURL}/refresh`, data);
    return response.data.data;
  }

  // 登出
  async logout(): Promise<void> {
    const token = getAccessToken();
    if (token) {
      await axios.post(`${this.baseURL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    // Note: Actual logout state clearing is handled by Redux action
  }

  // 选择角色
  async selectRole(data: SelectRoleRequest): Promise<LoginResponse> {
    const token = getAccessToken();
    const response = await axios.post(`${this.baseURL}/select-role`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // 获取用户角色列表
  async getUserRoles(): Promise<RoleInfo[]> {
    const token = getAccessToken();
    const response = await axios.get(`${API_BASE_URL}/user/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // 获取用户信息
  async getUserProfile(): Promise<User> {
    const token = getAccessToken();
    const response = await axios.get(`${API_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // 更新用户信息
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const token = getAccessToken();
    const response = await axios.put(`${API_BASE_URL}/user/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // 修改密码
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    const token = getAccessToken();
    await axios.put(`${API_BASE_URL}/user/password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Note: These methods are deprecated - use authHelpers instead
  // Kept for backward compatibility

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!getAccessToken();
  }

  // 获取Token
  getAccessToken(): string | null {
    return getAccessToken();
  }
}

export const authService = new AuthService();
