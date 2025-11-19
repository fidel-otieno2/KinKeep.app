import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import CreateFamilyModal from '../components/CreateFamilyModal';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const response = await apiService.getFamilies();
      setFamilies(response.families);
    } catch (error) {
      console.error('Error fetching families:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFamily = async (familyData) => {
    try {
      await apiService.createFamily(familyData);
      setShowCreateModal(false);
      await fetchFamilies(); // Refresh the list
    } catch (error) {
      console.error('Error creating family:', error);
      alert('Failed to create family. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Instagram-style Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">KinKeep</h1>
            
            {/* Search bar */}
            <div className="hidden md:block flex-1 max-w-xs mx-8">
              <input
                type="text"
                placeholder="Search families..."
                className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300"
              />
            </div>
            
            {/* User menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user?.name?.charAt(0)}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Instagram Feed Style */}
      <main className="max-w-2xl mx-auto pt-8">
        <div className="px-4">
          {/* Stories Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Families</h2>
              <button 
                onClick={() => {
                  // Create Family header button clicked
                  setShowCreateModal(true);
                }}
                className="font-medium text-sm hover:opacity-80"
                style={{color: '#0095f6'}}
              >
                + New Family
              </button>
            </div>
            
            {families.length === 0 ? (
              <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Family Story</h3>
                <p className="text-gray-600 mb-6">Create your first family to begin preserving precious memories</p>
                <button 
                  onClick={() => {
                    // Create Family button clicked
                    setShowCreateModal(true);
                  }}
                  className="btn-primary"
                >
                  Create Your First Family
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {families.map((family) => (
                  <Link
                    key={family.id}
                    to={`/family/${family.id}`}
                    className="block bg-white border border-gray-300 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-lg">{family.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{family.name}</h3>
                            <p className="text-sm text-gray-600">{family.member_count} members</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      {family.description && (
                        <p className="mt-3 text-sm text-gray-700 ml-15">{family.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <CreateFamilyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFamily}
      />
    </div>
  );
};

export default DashboardPage;