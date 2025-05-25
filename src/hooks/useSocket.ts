import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';
import { Message, User } from '../types';

export const useSocket = () => {
  const socketRef = useRef<Socket>();
  const { username } = useUserStore();
  const { addMessage, setUsers } = useChatStore();

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      socketRef.current?.emit('user:join', username);
    });

    socketRef.current.on('message:received', (message: Message) => {
      addMessage(message);
    });

    socketRef.current.on('users:update', (users: User[]) => {
      setUsers(users);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [username, addMessage, setUsers]);

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