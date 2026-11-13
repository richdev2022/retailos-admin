import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser } from '../lib/types';

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AdminUser, token: string) => void;
  setUser: (user: AdminUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    { name: 'retailos-admin-auth' },
  ),
);
