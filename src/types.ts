export interface Message {
  id: string;
  content: string;
  sender: string;
  senderAvatar?: string;
  timestamp: Date;
  type?: 'system';
}

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar: string;
  bio?: string;
  isOnline: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
}

export interface ChatState {
  messages: Message[];
  users: User[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}