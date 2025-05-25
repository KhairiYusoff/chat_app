import { create } from 'zustand';
import { Message, User } from '../types';

interface ChatStore {
  messages: Message[];
  users: User[];
  addMessage: (message: Message) => void;
  setUsers: (users: User[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  users: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setUsers: (users) => set({ users }),
}));