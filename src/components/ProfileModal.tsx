import React, { useState } from 'react';
import { X, User, Mail, Edit3, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface Props {
  onClose: () => void;
}

export const ProfileModal: React.FC<Props> = ({ onClose }) => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (bio.length > 200) {
      setError('Bio must be less than 200 characters');
      return;
    }

    try {
      await updateProfile({ bio });
      setIsEditing(false);
      setError('');
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setBio(user?.bio || '');
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <img
              src={user?.avatar}
              alt={user?.username}
              className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-sm"
            />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {user?.username}
            </h3>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Username</p>
                <p className="text-sm text-gray-900">{user?.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-900">{user?.email}</p>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    maxLength={200}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {bio.length}/200 characters
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg min-h-[60px]">
                  <p className="text-sm text-gray-900">
                    {user?.bio || 'No bio added yet.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};