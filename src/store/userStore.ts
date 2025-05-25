import { create } from 'zustand';

interface UserState {
  username: string;
  setUsername: (username: string) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  username: '',
  isLoggedIn: false,
  setUsername: (username) => set({ username }),
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false, username: '' }),
}));