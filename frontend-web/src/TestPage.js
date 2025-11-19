import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-300 p-4">
        <h1 className="text-2xl font-bold text-gray-900">Instagram Style Test</h1>
      </div>
      
      <div className="max-w-2xl mx-auto pt-8 px-4">
        <div className="bg-white border border-gray-300 rounded-lg mb-6">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">T</span>
              </div>
              <span className="font-medium">Test User</span>
            </div>
          </div>
          
          <div className="aspect-square bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Test Image Area</span>
          </div>
          
          <div className="p-4">
            <div className="flex items-center space-x-4 mb-3">
              <button className="hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
            <p className="font-medium text-sm mb-2">123 likes</p>
            <p className="text-sm">
              <span className="font-medium">testuser</span> This is a test post to verify Instagram styling is working correctly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;