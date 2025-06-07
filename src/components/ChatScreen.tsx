import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, LogOut } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { OnlineUsers } from './OnlineUsers';
import { ProfileModal } from './ProfileModal';
import { useSocket } from '../hooks/useSocket';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';

export const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const { messages } = useChatStore();
  const { user, logout } = useAuthStore();
  const { sendMessage } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">ChatApp</h1>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <div className="hidden sm:block text-sm text-gray-500">
              Global Chat Room
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar}
                alt={user?.username}
                className="w-8 h-8 rounded-full border-2 border-gray-200"
              />
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user?.username}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowProfile(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Profile Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-500">Start the conversation by sending the first message!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full rounded-full border border-gray-300 px-6 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-blue-600 text-white rounded-full px-6 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <OnlineUsers />
      
      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};