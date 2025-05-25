import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';
import { Message, User } from '../types';

export const useSocket = () => {
  const socketRef = useRef<Socket>();
  const { username } = useUserStore();
  const { addMessage, setUsers, addSystemMessage } = useChatStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
    
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      socketRef.current?.emit('user:join', username);
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

    return () => {
      socketRef.current?.disconnect();
    };
  }, [username, addMessage, setUsers, addSystemMessage]);

  const sendMessage = (content: string) => {
    if (socketRef.current) {
      const message: Message = {
        id: crypto.randomUUID(),
        content,
        sender: username,
        timestamp: new Date(),
      };
      socketRef.current.emit('message:send', message);
      addMessage(message);
    }
  };

  return { sendMessage };
};