export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

export interface ChatState {
  messages: Message[];
  users: User[];
}