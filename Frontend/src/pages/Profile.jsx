import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', { name, avatar });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        {message && <div className="bg-gray-700 p-2 rounded mb-4">{message}</div>}
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={avatar || `https://ui-avatars.com/api/?name=${user.name}&background=red&color=fff&size=80`}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-500">Role: {user.role}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Avatar URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
          >
            Update Profile
          </button>
        </form>

        <h3 className="text-xl font-bold mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-semibold transition"
          >
            Change Password
          </button>
        </form>
        <button
          onClick={logout}
          className="mt-6 text-red-500 hover:text-red-400 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;