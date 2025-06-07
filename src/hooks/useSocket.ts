import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { Message, User } from '../types';

export const useSocket = () => {
  const socketRef = useRef<Socket>();
  const { user, token } = useAuthStore();
  const { addMessage, setUsers, addSystemMessage } = useChatStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    // Initialize audio
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
    
    socketRef.current = io('http://localhost:3000', {
      auth: {
        token
      }
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('message:received', (message: Message) => {
      addMessage(message);
      audioRef.current?.play().catch(err => console.log('Audio play failed:', err));
    });

    socketRef.current.on('users:update', (users: User[]) => {
      setUsers(users);
    });

    socketRef.current.on('user:left', (username: string) => {
      addSystemMessage(`${username} has left the chat`);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, token, addMessage, setUsers, addSystemMessage]);

  const sendMessage = (content: string) => {
    if (socketRef.current && user) {
      const message: Message = {
        id: crypto.randomUUID(),
        content,
        sender: user.username,
        senderAvatar: user.avatar,
        timestamp: new Date(),
      };
      socketRef.current.emit('message:send', message);
      addMessage(message);
    }
  };

  return { sendMessage };
};