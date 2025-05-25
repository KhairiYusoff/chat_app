import React from 'react';
import { format } from 'date-fns';
import { Message } from '../types';
import { useUserStore } from '../store/userStore';

interface Props {
  message: Message;
}

export const ChatMessage: React.FC<Props> = ({ message }) => {
  const { username } = useUserStore();
  const isOwnMessage = message.sender === username;
  const isSystemMessage = message.type === 'system';

  if (isSystemMessage) {
    return (
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 rounded-full px-4 py-1">
          <p className="text-sm text-gray-500">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwnMessage
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        {!isOwnMessage && (
          <div className="text-sm font-medium text-gray-600 mb-1">
            {message.sender}
          </div>
        )}
        <p className="text-sm">{message.content}</p>
        <div
          className={`text-xs mt-1 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {format(new Date(message.timestamp), 'HH:mm')}
        </div>
      </div>
    </div>
  );
};