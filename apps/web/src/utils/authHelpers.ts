/**
 * Auth Helper Utilities
 * Simplified helper functions that work with Redux store
 * This replaces the duplicate logic in auth.ts
 */

import { store } from '@/store';
import { logout as logoutAction } from '@/store/slices/authSlice';

/**
 * Get access token from Redux store
 */
export function getAccessToken(): string | null {
  return store.getState().auth.accessToken;
}

/**
 * Get refresh token from Redux store
 */
export function getRefreshToken(): string | null {
  return store.getState().auth.refreshToken;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return store.getState().auth.isAuthenticated;
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return store.getState().auth.user;
}

/**
 * Get current role
 */
export function getCurrentRole() {
  return store.getState().auth.currentRole;
}

/**
 * Logout helper - dispatches Redux action
 */
export function logout(): void {
  store.dispatch(logoutAction());

  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

/**
 * Cookie utilities for middleware (SSR-safe)
 */
export const cookieUtils = {
  /**
   * Set a cookie (client-side only)
   */
  setCookie(name: string, value: string, days: number): void {
    if (typeof document === 'undefined') return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  },

  /**
   * Get a cookie value (client-side only)
   */
  getCookie(name: string): string | null {
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
  },

  /**
   * Delete a cookie (client-side only)
   */
  deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },
};

/**
 * Sync auth state to cookies for middleware access
 * Called automatically by Redux middleware
 */
export function syncAuthToCookies(): void {
  const state = store.getState().auth;

  if (state.isAuthenticated && state.accessToken) {
    cookieUtils.setCookie('accessToken', state.accessToken, 1);
    if (state.refreshToken) {
      cookieUtils.setCookie('refreshToken', state.refreshToken, 7);
    }
    if (state.currentRole) {
      cookieUtils.setCookie('userRole', state.currentRole, 7);
    }
  } else {
    // Clear cookies on logout
    cookieUtils.deleteCookie('accessToken');
    cookieUtils.deleteCookie('refreshToken');
    cookieUtils.deleteCookie('userRole');
    cookieUtils.deleteCookie('selectedRole');
    cookieUtils.deleteCookie('hasMultipleRoles');
  }
}
