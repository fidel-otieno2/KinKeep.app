import React, { useState, useEffect } from 'react';
import InstagramLayout from '../components/InstagramLayout';
import apiService from '../services/api';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // posts, users, families

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchExplorePosts = async () => {
    try {
      const response = await apiService.getPosts({ type: 'explore' });
      setPosts(response.posts || []);
    } catch (error) {
      console.error('Error fetching explore posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      // Mock search - replace with actual API call
      const mockResults = {
        users: [
          { id: 1, name: 'John Doe', username: 'johndoe', followers: 150 },
          { id: 2, name: 'Jane Smith', username: 'janesmith', followers: 89 }
        ],
        families: [
          { id: 1, name: 'The Johnsons', members: 12, description: 'Our family adventures' },
          { id: 2, name: 'Smith Family', members: 8, description: 'Making memories together' }
        ],
        posts: posts.filter(post => 
          post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      };
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const PostGrid = ({ posts }) => (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <div key={post.id} className="aspect-square bg-gray-200 relative group cursor-pointer">
          {post.media_urls && post.media_urls[0] ? (
            <img
              src={post.media_urls[0]}
              alt="Post"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://picsum.photos/300/300?random=${post.id}`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-sm font-medium">{post.likes_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21,6H3A1,1 0 0,0 2,7V17A1,1 0 0,0 3,18H21A1,1 0 0,0 22,17V7A1,1 0 0,0 21,6M13.5,16L10.5,14L7.5,16V7H13.5V16Z"/>
                </svg>
                <span className="text-sm font-medium">{post.comments_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const UserCard = ({ user }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 instagram-gradient rounded-full flex items-center justify-center">
          <span className="text-white font-medium">{user.name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-600">@{user.username}</p>
          <p className="text-xs text-gray-500">{user.followers} followers</p>
        </div>
      </div>
      <button 
        onClick={async () => {
          try {
            await apiService.followUser(user.id);
            alert('Now following ' + user.name);
          } catch (error) {
            console.error('Error following user:', error);
            alert('Failed to follow user');
          }
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
      >
        Follow
      </button>
    </div>
  );

  const FamilyCard = ({ family }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 instagram-gradient rounded-full flex items-center justify-center">
          <span className="text-white font-medium">{family.name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium">{family.name}</p>
          <p className="text-sm text-gray-600">{family.members} members</p>
          <p className="text-xs text-gray-500">{family.description}</p>
        </div>
      </div>
      <button 
        onClick={() => alert('Family view feature coming soon!')}
        className="btn-secondary"
      >
        View
      </button>
    </div>
  );

  if (loading) {
    return (
      <InstagramLayout>
        <div className="max-w-4xl mx-auto pt-8 px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-3 gap-1">
              {[...Array(12)].map((_, i) => (
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
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search families, people, and stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-100 border-0 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery.trim() && searchResults && (
          <div className="mb-8">
            {/* Search Tabs */}
            <div className="flex space-x-8 border-b border-gray-200 mb-6">
              {['posts', 'users', 'families'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Results Content */}
            <div className="bg-white rounded-lg border border-gray-200">
              {activeTab === 'users' && (
                <div>
                  {searchResults.users?.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              )}

              {activeTab === 'families' && (
                <div>
                  {searchResults.families?.map((family) => (
                    <FamilyCard key={family.id} family={family} />
                  ))}
                </div>
              )}

              {activeTab === 'posts' && (
                <div className="p-4">
                  <PostGrid posts={searchResults.posts || []} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Explore Posts */}
        {!searchQuery.trim() && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Explore</h2>
            {posts.length > 0 ? (
              <PostGrid posts={posts} />
            ) : (
              <div className="text-center py-12">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Discover Family Stories</h3>
                <p className="text-gray-600">Explore posts from families around the world</p>
              </div>
            )}
          </div>
        )}
      </div>
    </InstagramLayout>
  );
};

export default ExplorePage;