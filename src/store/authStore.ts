import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '../types';
import { authAPI } from '../services/api';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { bio?: string; avatar?: string }) => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });
          const { token, user } = response;
          
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.error || 'Login failed',
            isLoading: false
          });
          throw error;
        }
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register({ username, email, password });
          const { token, user } = response;
          
          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.error || 'Registration failed',
            isLoading: false
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null
          });
        }
      },

      updateProfile: async (data: { bio?: string; avatar?: string }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.updateProfile(data);
          set({
            user: response.user,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.error || 'Profile update failed',
            isLoading: false
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      initializeAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await authAPI.getProfile();
          set({
            user: response.user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);