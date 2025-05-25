import React from 'react';
import { LoginScreen } from './components/LoginScreen';
import { ChatScreen } from './components/ChatScreen';
import { useUserStore } from './store/userStore';

function App() {
  const { isLoggedIn } = useUserStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoggedIn ? <ChatScreen /> : <LoginScreen />}
    </div>
  );
}

export default App;