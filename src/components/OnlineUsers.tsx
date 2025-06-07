import React from 'react';
import { User } from '../types';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';

export const OnlineUsers: React.FC = () => {
  const { users } = useChatStore();
  const { user: currentUser } = useAuthStore();

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Online Users</h3>
        <p className="text-sm text-gray-500 mt-1">{users.length} online</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                user.username === currentUser?.username 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.username}
                  </p>
                  {user.username === currentUser?.username && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};