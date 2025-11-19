import React, { useState } from 'react';
import apiService from '../services/api';

const OnboardingFlow = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: '',
    profileImage: null,
    followedUsers: []
  });
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9._]{3,30}$/;
    if (!regex.test(username)) {
      return 'Username can only contain letters, numbers, dots, and underscores (3-30 characters)';
    }
    if (username.startsWith('.') || username.endsWith('.')) {
      return 'Username cannot start or end with a dot';
    }
    if (username.includes('..')) {
      return 'Username cannot contain consecutive dots';
    }
    return '';
  };

  const handleUsernameChange = (value) => {
    setFormData({...formData, username: value});
    setUsernameError(validateUsername(value));
  };

  const handleImageUpload = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('type', 'image');
    uploadFormData.append('folder', 'profiles');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: uploadFormData
      });
      
      const result = await response.json();
      if (result.url) {
        setFormData({...formData, profileImage: result.url});
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const response = await apiService.getPosts({ limit: 10 });
      const users = response.posts?.map(post => post.author).filter(Boolean) || [];
      setSuggestedUsers(users.slice(0, 6));
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const handleFollowUser = (userId) => {
    const isFollowing = formData.followedUsers.includes(userId);
    const newFollowed = isFollowing 
      ? formData.followedUsers.filter(id => id !== userId)
      : [...formData.followedUsers, userId];
    
    setFormData({...formData, followedUsers: newFollowed});
  };

  const handleNext = async () => {
    if (step === 2 && usernameError) return;
    
    if (step === 3) {
      await fetchSuggestedUsers();
    }
    
    if (step === 4) {
      await completeOnboarding();
      return;
    }
    
    setStep(step + 1);
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      await apiService.updateProfile({
        name: formData.name,
        username: formData.username,
        profile_image: formData.profileImage
      });

      for (const userId of formData.followedUsers) {
        try {
          await apiService.followUser(userId);
        } catch (error) {
          console.error('Error following user:', error);
        }
      }

      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="kinkeep-avatar w-24 h-24 mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Welcome to KinKeep</h2>
            <p className="text-gray-600 mb-8">Let's set up your profile to connect with family and preserve memories</p>
            <button 
              onClick={handleNext}
              className="kinkeep-btn-primary w-full py-3 font-medium"
            >
              Get Started
            </button>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Choose your name and username</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  style={{color: '#000000 !important', backgroundColor: '#ffffff !important', WebkitTextFillColor: '#000000 !important'}}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none ${usernameError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  style={{color: '#000000 !important', backgroundColor: '#ffffff !important', WebkitTextFillColor: '#000000 !important'}}
                  placeholder="username"
                />
                {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                <p className="text-gray-500 text-sm mt-1">Use letters, numbers, dots, and underscores only</p>
              </div>
            </div>
            
            <button 
              onClick={handleNext}
              disabled={!formData.name || !formData.username || usernameError}
              className="kinkeep-btn-primary w-full py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              Next
            </button>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Add a profile photo</h2>
            
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-200">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <label className="kinkeep-btn-primary inline-block px-6 py-3 font-medium cursor-pointer">
                {formData.profileImage ? 'Change Photo' : 'Add Photo'}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])} 
                  className="hidden" 
                />
              </label>
              
              <p className="text-gray-500 text-sm mt-4">Help people recognize you</p>
            </div>
            
            <button 
              onClick={handleNext}
              className="kinkeep-btn-primary w-full py-3 font-medium mt-8"
            >
              {formData.profileImage ? 'Next' : 'Skip for now'}
            </button>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Follow people you know</h2>
            
            <div className="space-y-3">
              {suggestedUsers.map((suggestedUser) => (
                <div key={suggestedUser.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="kinkeep-avatar w-12 h-12">
                      <span className="text-white font-medium">{suggestedUser.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{suggestedUser.name}</p>
                      <p className="text-sm text-gray-500">@{suggestedUser.username || 'user'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollowUser(suggestedUser.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.followedUsers.includes(suggestedUser.id)
                        ? 'kinkeep-btn-secondary'
                        : 'kinkeep-btn-primary'
                    }`}
                  >
                    {formData.followedUsers.includes(suggestedUser.id) ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              disabled={loading}
              className="kinkeep-btn-primary w-full py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Setting up...' : 'Continue'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="kinkeep-card w-full max-w-md p-8 kinkeep-fade-in">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step ? 'kinkeep-btn-primary' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%`, background: 'var(--kinkeep-gradient-primary)' }}
            ></div>
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingFlow;