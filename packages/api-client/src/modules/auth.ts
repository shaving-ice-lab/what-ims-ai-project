import { ApiClient } from '../client';

export interface LoginParams {
  username: string;
  password: string;
  role?: 'store' | 'supplier' | 'admin';
}

export interface LoginResult {
  token: string;
  refreshToken: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  id: number;
  username: string;
  name: string;
  role: string;
  permissions: string[];
}

export const createAuthApi = (client: ApiClient) => ({
  login: (params: LoginParams) => client.post<LoginResult>('/auth/login', params),

  logout: () => client.post<void>('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    client.post<{ token: string }>('/auth/refresh', { refreshToken }),

  getUserInfo: () => client.get<UserInfo>('/auth/user'),

  updatePassword: (oldPassword: string, newPassword: string) =>
    client.post<void>('/auth/password', { oldPassword, newPassword }),
});

export type AuthApi = ReturnType<typeof createAuthApi>;
