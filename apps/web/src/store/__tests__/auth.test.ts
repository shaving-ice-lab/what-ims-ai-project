import { beforeEach, describe, expect, it } from 'vitest';

// Mock auth store state and actions
interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const createAuthStore = () => {
  let state: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  return {
    getState: () => state,
    login: (user: User, token: string) => {
      state = { user, token, isAuthenticated: true };
    },
    logout: () => {
      state = { user: null, token: null, isAuthenticated: false };
    },
    setUser: (user: User) => {
      state = { ...state, user };
    },
  };
};

describe('Auth Store', () => {
  let authStore: ReturnType<typeof createAuthStore>;

  beforeEach(() => {
    authStore = createAuthStore();
  });

  describe('initial state', () => {
    it('should have no user', () => {
      expect(authStore.getState().user).toBeNull();
    });

    it('should have no token', () => {
      expect(authStore.getState().token).toBeNull();
    });

    it('should not be authenticated', () => {
      expect(authStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should set user and token', () => {
      const user = { id: 1, username: 'test', name: 'Test User', role: 'store' };
      const token = 'test-token';

      authStore.login(user, token);

      expect(authStore.getState().user).toEqual(user);
      expect(authStore.getState().token).toBe(token);
      expect(authStore.getState().isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear user and token', () => {
      const user = { id: 1, username: 'test', name: 'Test User', role: 'store' };
      authStore.login(user, 'test-token');
      authStore.logout();

      expect(authStore.getState().user).toBeNull();
      expect(authStore.getState().token).toBeNull();
      expect(authStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should update user info', () => {
      const user = { id: 1, username: 'test', name: 'Test User', role: 'store' };
      const updatedUser = { ...user, name: 'Updated Name' };

      authStore.login(user, 'test-token');
      authStore.setUser(updatedUser);

      expect(authStore.getState().user?.name).toBe('Updated Name');
    });
  });
});
