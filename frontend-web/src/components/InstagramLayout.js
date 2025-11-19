import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreatePostModal from './CreatePostModal';

const InstagramLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navItems = [
    { path: '/feed', icon: 'home', label: 'Home' },
    { path: '/explore', icon: 'search', label: 'Search' },
    { path: '/reels', icon: 'play', label: 'Reels' },
    { path: '/live', icon: 'live', label: 'Live' },
    { path: '/messages', icon: 'message', label: 'Messages' },
    { path: '/create', icon: 'plus', label: 'Create' },
    { path: '/shop', icon: 'shop', label: 'Shop' },
    { path: '/saved', icon: 'bookmark', label: 'Saved' },
    { path: '/profile', icon: 'user', label: 'Profile' },
  ];

  const getIcon = (iconName, isActive = false) => {
    const className = `w-6 h-6 ${isActive ? 'text-blue-500' : 'text-gray-600'}`;
    
    switch (iconName) {
      case 'home':
        return (
          <svg className={className} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'search':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'play':
        return (
          <svg className={className} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 5a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
        );
      case 'message':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'plus':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'live':
        return (
          <svg className={className} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'shop':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'bookmark':
        return (
          <svg className={className} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        );
      case 'user':
        return (
          <div className={`w-6 h-6 rounded-full ${isActive ? 'ring-2' : ''}`} style={isActive ? {borderColor: '#0095f6'} : {}}>
            <div className="w-full h-full rounded-full flex items-center justify-center" style={{background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'}}>
              <span className="text-white text-xs font-medium">{user?.name?.charAt(0)}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen kinkeep-fade-in" style={{backgroundColor: 'var(--kinkeep-neutral-50)'}}>
      {/* Header */}
      <header className="kinkeep-header sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/feed" className="kinkeep-brand-logo">
              KinKeep
            </Link>
            
            {/* Search bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-xs mx-8">
              <input
                type="text"
                placeholder="Search families..."
                className="kinkeep-input w-full px-4 py-2 text-sm focus:outline-none"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.slice(0, 4).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {getIcon(item.icon, location.pathname === item.path)}
                </Link>
              ))}
              
              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {getIcon('plus')}
              </button>
              
              {/* More Menu */}
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/shop" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 first:rounded-t-lg">
                    {getIcon('shop')}
                    <span>Shop</span>
                  </Link>
                  <Link to="/saved" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50">
                    {getIcon('bookmark')}
                    <span>Saved</span>
                  </Link>
                  <hr className="border-gray-200" />
                  <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50">
                    {getIcon('user', location.pathname === '/profile')}
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-left last:rounded-b-lg"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 kinkeep-header">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full"
            >
              {getIcon(item.icon, location.pathname === item.path)}
            </Link>
          ))}
          
          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            {getIcon('plus')}
          </button>
          
          {navItems.slice(5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full"
            >
              {getIcon(item.icon, location.pathname === item.path)}
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={() => {
          setShowCreateModal(false);
          window.location.reload();
        }}
      />
    </div>
  );
};

export default InstagramLayout;