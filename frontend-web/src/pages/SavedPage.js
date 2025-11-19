import React, { useState, useEffect } from 'react';
import InstagramLayout from '../components/InstagramLayout';
import { useAuth } from '../context/AuthContext';

const SavedPage = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedCollections();
  }, []);

  const fetchSavedCollections = async () => {
    // Mock saved collections
    const mockCollections = [
      {
        id: 'all',
        name: 'All Posts',
        count: 24,
        isDefault: true,
        posts: [
          { id: 1, media_url: 'https://picsum.photos/300/300?random=11', type: 'image' },
          { id: 2, media_url: 'https://picsum.photos/300/300?random=12', type: 'image' },
          { id: 3, media_url: 'https://picsum.photos/300/300?random=13', type: 'video' },
          { id: 4, media_url: 'https://picsum.photos/300/300?random=14', type: 'image' }
        ]
      },
      {
        id: 1,
        name: 'Family Recipes',
        count: 8,
        isDefault: false,
        posts: [
          { id: 5, media_url: 'https://picsum.photos/300/300?random=15', type: 'image' },
          { id: 6, media_url: 'https://picsum.photos/300/300?random=16', type: 'image' }
        ]
      },
      {
        id: 2,
        name: 'Holiday Memories',
        count: 12,
        isDefault: false,
        posts: [
          { id: 7, media_url: 'https://picsum.photos/300/300?random=17', type: 'image' },
          { id: 8, media_url: 'https://picsum.photos/300/300?random=18', type: 'video' }
        ]
      },
      {
        id: 3,
        name: 'Grandparents Stories',
        count: 6,
        isDefault: false,
        posts: [
          { id: 9, media_url: 'https://picsum.photos/300/300?random=19', type: 'image' },
          { id: 10, media_url: 'https://picsum.photos/300/300?random=20', type: 'audio' }
        ]
      }
    ];

    setCollections(mockCollections);
    setSelectedCollection(mockCollections[0]);
    setLoading(false);
  };

  const createCollection = () => {
    if (!newCollectionName.trim()) return;

    const newCollection = {
      id: Date.now(),
      name: newCollectionName,
      count: 0,
      isDefault: false,
      posts: []
    };

    setCollections([...collections, newCollection]);
    setNewCollectionName('');
    setShowCreateModal(false);
  };

  const deleteCollection = (collectionId) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      setCollections(collections.filter(c => c.id !== collectionId));
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(collections[0]);
      }
    }
  };

  const PostGrid = ({ posts }) => (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <div key={post.id} className="aspect-square bg-gray-200 relative group cursor-pointer">
          <img
            src={post.media_url}
            alt="Saved post"
            className="w-full h-full object-cover"
          />
          
          {/* Post Type Indicator */}
          {post.type === 'video' && (
            <div className="absolute top-2 right-2">
              <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
          
          {post.type === 'audio' && (
            <div className="absolute top-2 right-2">
              <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          )}

          {/* Remove from collection button */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-6 h-6 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <InstagramLayout>
        <div className="max-w-4xl mx-auto pt-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="flex space-x-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </InstagramLayout>
    );
  }

  return (
    <InstagramLayout>
      <div className="max-w-4xl mx-auto pt-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Saved</h1>
            <p className="text-gray-600">Keep your favorite family memories organized</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Collection</span>
          </button>
        </div>

        {/* Collections Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-4 mb-6 border-b border-gray-200">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => setSelectedCollection(collection)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCollection?.id === collection.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{collection.name}</span>
              <span className="text-xs opacity-75">({collection.count})</span>
              {!collection.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCollection(collection.id);
                  }}
                  className="ml-1 hover:text-red-500"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </button>
          ))}
        </div>

        {/* Collection Content */}
        {selectedCollection && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{selectedCollection.name}</h2>
              {!selectedCollection.isDefault && (
                <div className="flex items-center space-x-2">
                  <button className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => deleteCollection(selectedCollection.id)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {selectedCollection.posts.length > 0 ? (
              <PostGrid posts={selectedCollection.posts} />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No saved posts yet</h3>
                <p className="text-gray-600">Posts you save will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Create Collection Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Create New Collection</h3>
              <input
                type="text"
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={createCollection}
                  disabled={!newCollectionName.trim()}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstagramLayout>
  );
};

export default SavedPage;