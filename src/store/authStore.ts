import { create } from 'zustand';
import { authApi } from '../api/auth.api';
import type { User } from '../types/user';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  status: AuthStatus;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',

  checkAuth: async () => {
    set({ status: 'loading' });
    try {
      const user = await authApi.me();
      set({ user, status: 'authenticated' });
    } catch {
      set({ user: null, status: 'unauthenticated' });
    }
  },

  setUser: (user) => set({ user, status: 'authenticated' }),

  logout: async () => {
    await authApi.logout();
    set({ user: null, status: 'unauthenticated' });
  },
}));
