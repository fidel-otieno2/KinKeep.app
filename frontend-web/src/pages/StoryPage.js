import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api';

const StoryPage = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  const fetchStory = async () => {
    try {
      const response = await apiService.getStory(storyId);
      setStory(response.story);
    } catch (error) {
      console.error('Error fetching story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // TODO: Open edit modal or navigate to edit page
    alert('Edit functionality coming soon!');
  };

  const handleShare = () => {
    // Copy story URL to clipboard
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Story link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  const handleEnhanceStory = async () => {
    setEnhancing(true);
    try {
      const response = await apiService.enhanceStory(storyId);
      // Refresh story to show enhanced content
      await fetchStory();
      alert('Story enhanced successfully! Review the changes below.');
    } catch (error) {
      console.error('Error enhancing story:', error);
      alert('Failed to enhance story. Please try again.');
    } finally {
      setEnhancing(false);
    }
  };

  const handleAcceptEnhancement = async (accept) => {
    try {
      await apiService.acceptEnhancement(storyId, accept);
      await fetchStory();
      if (accept) {
        alert('Enhancement accepted!');
      } else {
        alert('Enhancement rejected. Original content restored.');
      }
    } catch (error) {
      console.error('Error updating enhancement preference:', error);
      alert('Failed to update preference.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-900"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Story not found</h2>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link 
              to={`/family/${story.family_id}`} 
              className="text-amber-600 hover:text-amber-500"
            >
              ← Back to Family
            </Link>
            <div className="flex space-x-3">
              <button onClick={handleEdit} className="btn-secondary">Edit</button>
              <button onClick={handleShare} className="btn-primary">Share</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <article className="bg-white shadow rounded-lg overflow-hidden">
            {/* Story Header */}
            <div className="px-6 py-8 border-b border-amber-100">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                  {story.type}
                </span>
                <span className="text-sm text-amber-600">
                  {new Date(story.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-amber-900 mb-4">{story.title}</h1>
              
              <div className="flex items-center text-sm text-amber-700">
                <span>Shared by {story.author}</span>
                {story.ai_enhanced && (
                  <span className="ml-4 inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    AI Enhanced
                  </span>
                )}
              </div>
            </div>

            {/* Media */}
            {story.media_url && (
              <div className="px-6 py-4 bg-amber-50">
                {story.type === 'audio' && (
                  <audio controls className="w-full">
                    <source src={story.media_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {story.type === 'video' && (
                  <video controls className="w-full max-h-96">
                    <source src={story.media_url} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                )}
              </div>
            )}

            {/* Story Content */}
            <div className="px-6 py-8">
              {story.enhanced_content && story.enhancement_accepted ? (
                <div>
                  <div className="prose prose-amber max-w-none">
                    <div className="whitespace-pre-wrap text-amber-900 leading-relaxed">
                      {story.enhanced_content}
                    </div>
                  </div>
                  
                  {story.content && (
                    <details className="mt-8 p-4 bg-amber-50 rounded-lg">
                      <summary className="cursor-pointer text-sm font-medium text-amber-800 mb-2">
                        View Original Transcript
                      </summary>
                      <div className="text-sm text-amber-700 whitespace-pre-wrap">
                        {story.content}
                      </div>
                    </details>
                  )}
                </div>
              ) : (
                <div className="prose prose-amber max-w-none">
                  <div className="whitespace-pre-wrap text-amber-900 leading-relaxed">
                    {story.content}
                  </div>
                </div>
              )}
            </div>

            {/* Enhancement Review */}
            {story.enhanced_content && !story.enhancement_accepted && (
              <div className="px-6 py-4 bg-green-50 border-t border-green-100">
                <h4 className="text-sm font-medium text-green-900 mb-2">AI Enhanced Version Ready for Review</h4>
                <div className="bg-white p-4 rounded border mb-4">
                  <div className="text-sm text-gray-900 whitespace-pre-wrap">
                    {story.enhanced_content}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleAcceptEnhancement(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Accept Enhancement
                  </button>
                  <button 
                    onClick={() => handleAcceptEnhancement(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Keep Original
                  </button>
                </div>
              </div>
            )}

            {/* AI Enhancement Offer */}
            {story.content && !story.ai_enhanced && (
              <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Enhance this story with AI</h4>
                    <p className="text-sm text-blue-700">Polish grammar and readability while preserving your voice</p>
                  </div>
                  <button 
                    onClick={handleEnhanceStory}
                    disabled={enhancing}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {enhancing ? 'Enhancing...' : 'Enhance Story'}
                  </button>
                </div>
              </div>
            )}
          </article>

          {/* Comments Section */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-amber-900 mb-4">Family Comments</h3>
            <div className="text-center py-8 text-amber-600">
              <p>Comments feature coming soon...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryPage;