/**
 * Auth utilities - 认证相关工具函数
 * 处理Token存储、登出、Cookie清除等操作
 */

// Cookie names
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ROLE_KEY = 'userRole';
const SELECTED_ROLE_KEY = 'selectedRole';
const HAS_MULTIPLE_ROLES_KEY = 'hasMultipleRoles';

// Token expiration times
const ACCESS_TOKEN_EXPIRY_DAYS = 1; // 1 day (2 hours in reality, but cookie lasts longer)
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const REMEMBER_ME_EXPIRY_DAYS = 30;

/**
 * Set a cookie
 */
export function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

/**
 * Save access token
 */
export function saveAccessToken(token: string, rememberMe = false): void {
  const days = rememberMe ? REMEMBER_ME_EXPIRY_DAYS : ACCESS_TOKEN_EXPIRY_DAYS;
  setCookie(ACCESS_TOKEN_KEY, token, days);

  // Also save to localStorage for easy access
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

/**
 * Save refresh token
 */
export function saveRefreshToken(token: string, rememberMe = false): void {
  const days = rememberMe ? REMEMBER_ME_EXPIRY_DAYS : REFRESH_TOKEN_EXPIRY_DAYS;
  setCookie(REFRESH_TOKEN_KEY, token, days);

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

/**
 * Save user role
 */
export function saveUserRole(role: string): void {
  setCookie(USER_ROLE_KEY, role, REFRESH_TOKEN_EXPIRY_DAYS);

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(USER_ROLE_KEY, role);
  }
}

/**
 * Save selected role (for multi-role users)
 */
export function saveSelectedRole(role: string): void {
  setCookie(SELECTED_ROLE_KEY, role, REFRESH_TOKEN_EXPIRY_DAYS);

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SELECTED_ROLE_KEY, role);
  }
}

/**
 * Save has multiple roles flag
 */
export function saveHasMultipleRoles(hasMultiple: boolean): void {
  setCookie(HAS_MULTIPLE_ROLES_KEY, hasMultiple ? 'true' : 'false', REFRESH_TOKEN_EXPIRY_DAYS);

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(HAS_MULTIPLE_ROLES_KEY, hasMultiple ? 'true' : 'false');
  }
}

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  // Try cookie first, then localStorage
  return (
    getCookie(ACCESS_TOKEN_KEY) ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null)
  );
}

/**
 * Get refresh token
 */
export function getRefreshToken(): string | null {
  return (
    getCookie(REFRESH_TOKEN_KEY) ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null)
  );
}

/**
 * Get user role
 */
export function getUserRole(): string | null {
  return (
    getCookie(USER_ROLE_KEY) ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem(USER_ROLE_KEY) : null)
  );
}

/**
 * Get selected role
 */
export function getSelectedRole(): string | null {
  return (
    getCookie(SELECTED_ROLE_KEY) ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem(SELECTED_ROLE_KEY) : null)
  );
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Clear all auth data (logout)
 */
export function clearAuthData(): void {
  // Clear cookies
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
  deleteCookie(USER_ROLE_KEY);
  deleteCookie(SELECTED_ROLE_KEY);
  deleteCookie(HAS_MULTIPLE_ROLES_KEY);

  // Clear localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(SELECTED_ROLE_KEY);
    localStorage.removeItem(HAS_MULTIPLE_ROLES_KEY);

    // Clear any user-related data
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
  }

  // Clear sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
  }
}

/**
 * Full logout - clear data and redirect
 */
export async function logout(callApi = true): Promise<void> {
  // Call logout API if needed
  if (callApi) {
    try {
      const token = getAccessToken();
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      // Ignore API errors during logout
      console.error('Logout API error:', error);
    }
  }

  // Clear all auth data
  clearAuthData();

  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

/**
 * Save all auth data after login
 */
export function saveAuthData(data: {
  accessToken: string;
  refreshToken: string;
  role: string;
  hasMultipleRoles?: boolean;
  rememberMe?: boolean;
}): void {
  saveAccessToken(data.accessToken, data.rememberMe);
  saveRefreshToken(data.refreshToken, data.rememberMe);
  saveUserRole(data.role);

  if (data.hasMultipleRoles !== undefined) {
    saveHasMultipleRoles(data.hasMultipleRoles);
  }
}
