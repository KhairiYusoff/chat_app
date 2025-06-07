import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { MessageSquare, Users, Shield, Zap } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <MessageSquare className="h-12 w-12 text-white mr-4" />
            <h1 className="text-4xl font-bold text-white">ChatApp</h1>
          </div>
          
          <h2 className="text-3xl font-light text-white mb-6">
            Connect with people around the world
          </h2>
          
          <p className="text-blue-100 text-lg mb-12 leading-relaxed">
            Experience real-time messaging with a beautiful, secure, and feature-rich platform designed for modern communication.
          </p>

          <div className="space-y-6">
            <div className="flex items-center text-white">
              <Users className="h-6 w-6 mr-4 text-blue-200" />
              <span className="text-lg">Real-time messaging</span>
            </div>
            <div className="flex items-center text-white">
              <Shield className="h-6 w-6 mr-4 text-blue-200" />
              <span className="text-lg">Secure & encrypted</span>
            </div>
            <div className="flex items-center text-white">
              <Zap className="h-6 w-6 mr-4 text-blue-200" />
              <span className="text-lg">Lightning fast</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="lg:hidden flex items-center justify-center mb-6">
                <MessageSquare className="h-10 w-10 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">ChatApp</h1>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome back!' : 'Create your account'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Sign in to continue your conversations' 
                  : 'Join thousands of users worldwide'
                }
              </p>
            </div>

            {isLogin ? <LoginForm /> : <RegisterForm />}

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};