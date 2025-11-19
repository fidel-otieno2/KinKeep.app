import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        website: user.website || '',
        phone: user.phone || '',
        gender: user.gender || '',
        email: user.email || ''
      });
      setProfileImage(user.profile_image || null);
    }
  }, [user, isOpen]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profile_image || null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
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
        setProfileImage(result.url);
        setFormData({...formData, profile_image: result.url});
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiService.updateProfile({...formData, profile_image: profileImage});
      localStorage.setItem('user', JSON.stringify(response.user));
      onUpdate(response.user);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={onClose} className="text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">Edit profile</h2>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="text-blue-500 font-semibold disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Done'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" 
                     style={{background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'}}>
                  <span className="text-white text-xl font-medium">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <label className="text-blue-500 font-semibold cursor-pointer">
              Change profile photo
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              style={{color: '#000000', backgroundColor: '#f8f9fa', WebkitTextFillColor: '#000000'}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              style={{color: '#000000', backgroundColor: '#f8f9fa', WebkitTextFillColor: '#000000'}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              style={{color: '#000000', backgroundColor: '#f8f9fa', WebkitTextFillColor: '#000000'}}
              placeholder="Tell your story..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              style={{color: '#000000', backgroundColor: '#f8f9fa', WebkitTextFillColor: '#000000'}}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              style={{color: '#000000', backgroundColor: '#f8f9fa', WebkitTextFillColor: '#000000'}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              style={{color: '#000000', backgroundColor: '#f8f9fa', WebkitTextFillColor: '#000000'}}
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              style={{color: '#000000', backgroundColor: '#f8f9fa', WebkitTextFillColor: '#000000'}}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;