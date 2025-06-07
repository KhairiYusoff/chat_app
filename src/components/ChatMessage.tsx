import React from 'react';
import { format } from 'date-fns';
import { Message } from '../types';
import { useAuthStore } from '../store/authStore';

interface Props {
  message: Message;
}

export const ChatMessage: React.FC<Props> = ({ message }) => {
  const { user } = useAuthStore();
  const isOwnMessage = message.sender === user?.username;
  const isSystemMessage = message.type === 'system';

  if (isSystemMessage) {
    return (
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 rounded-full px-4 py-2">
          <p className="text-sm text-gray-500">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
        {!isOwnMessage && (
          <div className="flex-shrink-0 mr-3">
            <img
              src={message.senderAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.sender}`}
              alt={message.sender}
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            />
          </div>
        )}
        
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isOwnMessage
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
          }`}
        >
          {!isOwnMessage && (
            <div className="text-sm font-medium text-blue-600 mb-1">
              {message.sender}
            </div>
          )}
          <p className="text-sm leading-relaxed">{message.content}</p>
          <div
            className={`text-xs mt-2 ${
              isOwnMessage ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {format(new Date(message.timestamp), 'HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
};