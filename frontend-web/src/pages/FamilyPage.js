import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api';
import CreateStoryModal from '../components/CreateStoryModal';

const FamilyPage = () => {
  const { familyId } = useParams();
  const [family, setFamily] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [familyId]);

  const fetchData = async () => {
    try {
      const [familyResponse, storiesResponse] = await Promise.all([
        apiService.getFamily(familyId),
        apiService.getStories({ family_id: familyId })
      ]);
      
      setFamily(familyResponse.family);
      setStories(storiesResponse.stories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (storyData) => {
    try {
      await apiService.createStory(storyData);
      setShowCreateModal(false);
      await fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    }
  };

  const handleManageFamily = () => {
    // TODO: Open family management modal
    alert('Family management feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-amber-600 hover:text-amber-500">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-amber-900">{family?.name}</h1>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Add Story
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Family Info */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-amber-900 mb-2">{family?.name}</h2>
                {family?.description && (
                  <p className="text-amber-700 mb-4">{family.description}</p>
                )}
                <p className="text-sm text-amber-600">{family?.member_count} members</p>
              </div>
              <button onClick={handleManageFamily} className="btn-secondary">
                Manage Family
              </button>
            </div>
          </div>

          {/* Stories Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-amber-900 mb-4">Family Stories</h3>
            
            {stories.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <div className="text-amber-600 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-amber-900 mb-2">No stories yet</h4>
                <p className="text-amber-700 mb-4">Start preserving your family memories</p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  Create First Story
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <Link
                    key={story.id}
                    to={`/story/${story.id}`}
                    className="story-card p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-medium text-amber-900 truncate">{story.title}</h4>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        {story.type}
                      </span>
                    </div>
                    <p className="text-amber-700 text-sm mb-3 line-clamp-3">
                      {story.content?.substring(0, 150)}...
                    </p>
                    <div className="flex justify-between items-center text-xs text-amber-600">
                      <span>By {story.author}</span>
                      <span>{new Date(story.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <CreateStoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateStory}
        familyId={parseInt(familyId)}
      />
    </div>
  );
};

export default FamilyPage;