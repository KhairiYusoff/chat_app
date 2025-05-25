import React from 'react';
import { User } from '../types';
import { useChatStore } from '../store/chatStore';

export const OnlineUsers: React.FC = () => {
  const { users } = useChatStore();

  return (
    <div className="w-64 bg-gray-50 p-4 border-l border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Online Users</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-2 text-gray-700"
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};