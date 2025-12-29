import type {
    ChangePasswordRequest,
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    SelectRoleRequest,
    UpdateProfileRequest,
    User
} from '@/types/auth';
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
    const token = localStorage.getItem('accessToken');
    await axios.post(`${this.baseURL}/logout`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // 清除本地存储
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // 选择角色
  async selectRole(data: SelectRoleRequest): Promise<LoginResponse> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${this.baseURL}/select-role`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // 获取用户角色列表
  async getUserRoles(): Promise<any[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/user/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // 获取用户信息
  async getUserProfile(): Promise<User> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // 更新用户信息
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/user/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  // 修改密码
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.put(`${API_BASE_URL}/user/password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  // 获取当前用户
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // 获取Token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // 获取刷新Token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

export const authService = new AuthService();
