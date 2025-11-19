import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InstagramLayout from '../components/InstagramLayout';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import '../components/SettingsStyles.css';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Account Settings
  const [accountData, setAccountData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
    bio: user?.bio || '',
    website: user?.website || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    birthday: user?.birthday || ''
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    accountPrivacy: 'public',
    storySharing: true,
    activityStatus: true,
    readReceipts: true,
    allowTagging: 'everyone',
    allowMentions: 'everyone',
    hideStoryFrom: [],
    restrictedAccounts: []
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    passwordChangeAlerts: true,
    suspiciousActivityAlerts: true,
    trustedDevices: []
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    directMessages: true,
    liveVideos: false,
    reminders: true
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.updateProfile(accountData);
      setMessage('Account updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update account');
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await apiService.changePassword(passwordData);
      setMessage('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage('Failed to change password');
    }
    setLoading(false);
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);
    try {
      await apiService.updatePrivacySettings(privacySettings);
      setMessage('Privacy settings updated');
    } catch (error) {
      setMessage('Failed to update privacy settings');
    }
    setLoading(false);
  };

  const handleSecurityUpdate = async () => {
    setLoading(true);
    try {
      await apiService.updateSecuritySettings(securitySettings);
      setMessage('Security settings updated');
    } catch (error) {
      setMessage('Failed to update security settings');
    }
    setLoading(false);
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      await apiService.updateNotificationSettings(notificationSettings);
      setMessage('Notification settings updated');
    } catch (error) {
      setMessage('Failed to update notification settings');
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await apiService.deleteAccount();
        logout();
        navigate('/');
      } catch (error) {
        setMessage('Failed to delete account');
      }
    }
  };

  const menuItems = [
    { id: 'account', label: 'Edit Profile', icon: 'user' },
    { id: 'privacy', label: 'Privacy', icon: 'shield' },
    { id: 'security', label: 'Security', icon: 'lock' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'password', label: 'Password', icon: 'key' },
    { id: 'blocked', label: 'Blocked Accounts', icon: 'ban' },
    { id: 'data', label: 'Data & Storage', icon: 'database' },
    { id: 'help', label: 'Help & Support', icon: 'help' },
    { id: 'about', label: 'About', icon: 'info' }
  ];

  const getIcon = (iconName) => {
    const icons = {
      user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
      shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
      lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
      bell: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
      key: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
      ban: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />,
      database: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />,
      help: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
      info: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    };
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icons[iconName]}</svg>;
  };

  return (
    <InstagramLayout>
      <div className="max-w-6xl mx-auto pt-8 px-4 settings-container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 p-4" style={{backgroundColor: '#ffffff', color: '#111827'}}>
              <h2 className="text-xl font-semibold mb-4" style={{color: '#111827'}}>Settings</h2>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {getIcon(item.icon)}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg border border-gray-200 p-6" style={{backgroundColor: '#ffffff', color: '#111827'}}>
              {message && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {message}
                </div>
              )}

              {/* Account Settings */}
              {activeSection === 'account' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6" style={{color: '#111827'}}>Edit Profile</h3>
                  <form onSubmit={handleAccountUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{color: '#374151'}}>Name</label>
                        <input
                          type="text"
                          value={accountData.name}
                          onChange={(e) => setAccountData({...accountData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{color: '#111827', backgroundColor: '#ffffff'}}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                          type="text"
                          value={accountData.username}
                          onChange={(e) => setAccountData({...accountData, username: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={accountData.email}
                          onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={accountData.phone}
                          onChange={(e) => setAccountData({...accountData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={accountData.bio}
                        onChange={(e) => setAccountData({...accountData, bio: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={accountData.website}
                        onChange={(e) => setAccountData({...accountData, website: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                          value={accountData.gender}
                          onChange={(e) => setAccountData({...accountData, gender: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
                        <input
                          type="date"
                          value={accountData.birthday}
                          onChange={(e) => setAccountData({...accountData, birthday: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Security Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <button
                        onClick={() => setSecuritySettings({...securitySettings, twoFactorEnabled: !securitySettings.twoFactorEnabled})}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          securitySettings.twoFactorEnabled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Login Alerts</h4>
                          <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.loginAlerts}
                            onChange={(e) => setSecuritySettings({...securitySettings, loginAlerts: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Password Change Alerts</h4>
                          <p className="text-sm text-gray-500">Get notified when your password is changed</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.passwordChangeAlerts}
                            onChange={(e) => setSecuritySettings({...securitySettings, passwordChangeAlerts: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Suspicious Activity Alerts</h4>
                          <p className="text-sm text-gray-500">Get notified of unusual account activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.suspiciousActivityAlerts}
                            onChange={(e) => setSecuritySettings({...securitySettings, suspiciousActivityAlerts: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-3">Active Sessions</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Current Device</p>
                            <p className="text-sm text-gray-500">Chrome on Windows • Active now</p>
                          </div>
                          <span className="text-green-600 text-sm font-medium">Current</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSecurityUpdate}
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Update Security Settings'}
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeSection === 'privacy' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Privacy Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Privacy</label>
                      <select
                        value={privacySettings.accountPrivacy}
                        onChange={(e) => setPrivacySettings({...privacySettings, accountPrivacy: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                      <p className="text-sm text-gray-500 mt-1">
                        {privacySettings.accountPrivacy === 'public' 
                          ? 'Anyone can see your posts and profile' 
                          : 'Only approved followers can see your posts'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Story Sharing</h4>
                          <p className="text-sm text-gray-500">Allow others to share your stories</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.storySharing}
                            onChange={(e) => setPrivacySettings({...privacySettings, storySharing: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Activity Status</h4>
                          <p className="text-sm text-gray-500">Show when you're active</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.activityStatus}
                            onChange={(e) => setPrivacySettings({...privacySettings, activityStatus: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Read Receipts</h4>
                          <p className="text-sm text-gray-500">Show when you've read messages</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.readReceipts}
                            onChange={(e) => setPrivacySettings({...privacySettings, readReceipts: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handlePrivacyUpdate}
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Update Privacy Settings'}
                    </button>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Notification Settings</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium mb-3">Push Notifications</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.pushNotifications}
                            onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium mb-3">Email Notifications</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium mb-3">SMS Notifications</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.smsNotifications}
                            onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Activity Notifications</h4>
                      {[
                        { key: 'likes', label: 'Likes on your posts' },
                        { key: 'comments', label: 'Comments on your posts' },
                        { key: 'follows', label: 'New followers' },
                        { key: 'mentions', label: 'Mentions in posts' },
                        { key: 'directMessages', label: 'Direct messages' },
                        { key: 'liveVideos', label: 'Live videos from people you follow' },
                        { key: 'reminders', label: 'Reminders about people you follow' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span>{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key]}
                              onChange={(e) => setNotificationSettings({...notificationSettings, [item.key]: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleNotificationUpdate}
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Update Notification Settings'}
                    </button>
                  </div>
                </div>
              )}

              {/* Password Change */}
              {activeSection === 'password' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              )}

              {/* Blocked Accounts */}
              {activeSection === 'blocked' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Blocked Accounts</h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">You haven't blocked anyone yet.</p>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium mb-2">Block Someone</h4>
                      <p className="text-sm text-gray-500 mb-3">Enter a username to block them from seeing your content</p>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Username"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                          Block
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Storage */}
              {activeSection === 'data' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Data & Storage</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium mb-2">Download Your Data</h4>
                        <p className="text-sm text-gray-500 mb-3">Get a copy of all your posts, stories, and account information</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                          Request Download
                        </button>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium mb-2">Storage Usage</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Photos</span>
                            <span className="text-sm font-medium">245 MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Videos</span>
                            <span className="text-sm font-medium">1.2 GB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Messages</span>
                            <span className="text-sm font-medium">89 MB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-600 mb-3">Permanently delete your account and all associated data</p>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Help & Support */}
              {activeSection === 'help' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Help & Support</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium mb-2">Help Center</h4>
                        <p className="text-sm text-gray-500">Find answers to common questions</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium mb-2">Contact Support</h4>
                        <p className="text-sm text-gray-500">Get help from our support team</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium mb-2">Report a Problem</h4>
                        <p className="text-sm text-gray-500">Report bugs or issues</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-medium mb-2">Community Guidelines</h4>
                        <p className="text-sm text-gray-500">Learn about our community rules</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* About */}
              {activeSection === 'about' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">About KinKeep</h3>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">K</span>
                      </div>
                      <h4 className="text-xl font-semibold mb-2">KinKeep v1.0.0</h4>
                      <p className="text-gray-600">Preserving family memories for generations</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium mb-2">Privacy Policy</h4>
                        <p className="text-sm text-gray-500">Learn how we protect your data</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium mb-2">Terms of Service</h4>
                        <p className="text-sm text-gray-500">Read our terms and conditions</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium mb-2">Open Source</h4>
                        <p className="text-sm text-gray-500">View our code on GitHub</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium mb-2">Acknowledgments</h4>
                        <p className="text-sm text-gray-500">Thanks to our contributors</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </InstagramLayout>
  );
};

export default SettingsPage;