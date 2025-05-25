import { create } from 'zustand';
import { Message, User } from '../types';

interface ChatStore {
  messages: Message[];
  users: User[];
  addMessage: (message: Message) => void;
  addSystemMessage: (content: string) => void;
  setUsers: (users: User[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  users: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  addSystemMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          content,
          sender: 'system',
          timestamp: new Date(),
          type: 'system'
        },
      ],
    })),
  setUsers: (users) => set({ users }),
}));