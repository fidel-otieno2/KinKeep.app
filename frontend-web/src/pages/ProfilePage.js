import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InstagramLayout from '../components/InstagramLayout';
import { useAuth } from '../context/AuthContext';
import ProfessionalDashboard from '../components/ProfessionalDashboard';
import EditProfileModal from '../components/EditProfileModal';
import ShareModal from '../components/ShareModal';
import apiService from '../services/api';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [reels, setReels] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserContent();
      fetchFollowData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserContent = async () => {
    try {
      const [postsRes, storiesRes, reelsRes] = await Promise.all([
        apiService.getPosts({ user_id: user.id }),
        apiService.getPosts({ type: 'stories', user_id: user.id }),
        apiService.getPosts({ type: 'reels', user_id: user.id })
      ]);
      
      setPosts(postsRes.posts || []);
      setStories(storiesRes.stories || []);
      setReels(reelsRes.reels || []);
    } catch (error) {
      console.error('Error fetching user content:', error);
      setPosts([]);
      setStories([]);
      setReels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowData = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        apiService.getFollowers(user.id),
        apiService.getFollowing(user.id)
      ]);
      
      setFollowers(followersRes.followers || []);
      setFollowing(followingRes.following || []);
    } catch (error) {
      console.error('Error fetching follow data:', error);
      setFollowers([]);
      setFollowing([]);
    }
  };

  const PostGrid = ({ posts }) => {
    return (
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
        <div key={post.id} className="aspect-square bg-gray-200 relative group cursor-pointer">
          {post.media_urls && post.media_urls[0] ? (
            <>
              {post.media_type === 'video' || post.is_reel ? (
                <video
                  src={post.media_urls[0]}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
              ) : (
                <img
                  src={post.media_urls[0]}
                  alt="Post"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">Image failed to load</div>';
                  }}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}
          
          {/* Post Type Indicators */}
          {(post.media_type === 'video' || post.is_reel) && (
            <div className="absolute top-2 right-2">
              <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
          
          {post.is_reel && (
            <div className="absolute top-2 left-2">
              <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium">
                REEL
              </div>
            </div>
          )}
          
          {post.media_urls && post.media_urls.length > 1 && (
            <div className="absolute top-2 right-2">
              <svg className="w-4 h-4 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-sm font-medium">{post.likes_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21,6H3A1,1 0 0,0 2,7V17A1,1 0 0,0 3,18H21A1,1 0 0,0 22,17V7A1,1 0 0,0 21,6M13.5,16L10.5,14L7.5,16V7H13.5V16Z"/>
                </svg>
                <span className="text-sm font-medium">{post.comments_count}</span>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <InstagramLayout>
        <div className="max-w-4xl mx-auto pt-8 px-4">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </InstagramLayout>
    );
  }

  return (
    <InstagramLayout>
      <div className="max-w-4xl mx-auto pt-8 px-4">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
          {/* Profile Picture */}
          <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
            {user?.profile_image ? (
              <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'}}>
                <span className="text-white text-4xl font-medium">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-4">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-light">{user?.username || user?.name}</h1>
                {user?.account_type === 'business' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    Business
                  </span>
                )}
                {user?.verified && (
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 9H14V4H19V9Z"/>
                  </svg>
                )}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer"
                >
                  Edit profile
                </button>
                {user?.account_type === 'business' ? (
                  <>
                    <button 
                      onClick={() => alert('Analytics feature coming soon!')}
                      className="btn-secondary"
                    >
                      View insights
                    </button>
                    <button 
                      onClick={() => alert('Promotion feature coming soon!')}
                      className="text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:opacity-90"
                      style={{backgroundColor: '#0095f6'}}
                    >
                      Promote
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="btn-secondary"
                  >
                    Share profile
                  </button>
                )}
                <Link 
                  to="/settings"
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 mb-4">
              <div className="text-center">
                <span className="font-semibold">{posts.length}</span>
                <span className="text-gray-600 ml-1">posts</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{followers.length}</span>
                <span className="text-gray-600 ml-1">followers</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{following.length}</span>
                <span className="text-gray-600 ml-1">following</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="font-medium">{user?.name}</p>
              {user?.bio && <p className="text-gray-600">{user.bio}</p>}
              <p className="text-gray-600">📧 {user?.email}</p>
              {user?.website && (
                <a href={user.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  🔗 {user.website}
                </a>
              )}
            </div>

            {/* Business Contact Buttons */}
            {user?.account_type === 'business' && (
              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={() => window.location.href = `mailto:${user?.email}`}
                  className="btn-primary flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact</span>
                </button>
                <button 
                  onClick={() => alert('Directions feature coming soon!')}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Directions</span>
                </button>
                <button 
                  onClick={() => window.location.href = `tel:${user?.phone || '+1234567890'}`}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Professional Dashboard */}
        {user?.account_type === 'business' && (
          <ProfessionalDashboard user={user} />
        )}

        {/* Stories Highlights */}
        {stories.length > 0 && (
          <div className="flex space-x-4 overflow-x-auto pb-4 mb-8">
            {stories.slice(0, 5).map((story) => (
              <div key={story.id} className="flex-shrink-0 text-center">
                <div className="w-16 h-16 instagram-gradient rounded-full p-0.5 mb-2">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    {story.media_urls && story.media_urls[0] ? (
                      <img
                        src={story.media_urls[0]}
                        alt="Story highlight"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {story.author?.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs truncate w-16">Story {story.id}</p>
              </div>
            ))}
          </div>
        )}

        {/* Content Tabs */}
        <div className="border-t border-gray-300">
          <div className="flex justify-center space-x-16">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center space-x-1 py-3 text-sm font-medium ${
                activeTab === 'posts'
                  ? 'text-gray-900 border-t border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>POSTS</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`flex items-center space-x-1 py-3 text-sm font-medium ${
                activeTab === 'reels'
                  ? 'text-gray-900 border-t border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>REELS</span>
            </button>

            <button
              onClick={() => setActiveTab('tagged')}
              className={`flex items-center space-x-1 py-3 text-sm font-medium ${
                activeTab === 'tagged'
                  ? 'text-gray-900 border-t border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>TAGGED</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mt-6">
          {activeTab === 'posts' && (
            <>
              {posts.length > 0 ? (
                <PostGrid posts={posts} />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light mb-2">Share Photos</h3>
                  <p className="text-gray-600">When you share photos, they will appear on your profile.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'reels' && (
            <>
              {reels.length > 0 ? (
                <PostGrid posts={reels} />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light mb-2">Share Reels</h3>
                  <p className="text-gray-600">When you share reels, they will appear on your profile.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'tagged' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-light mb-2">Photos of you</h3>
              <p className="text-gray-600">When people tag you in photos, they'll appear here.</p>
            </div>
          )}
        </div>

        {/* Modals */}
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
          onUpdate={(updatedUser) => setUser(updatedUser)}
        />
        
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareData={{
            title: user?.name || 'Profile',
            description: `Check out ${user?.name}'s profile on KinKeep`,
            url: window.location.href
          }}
        />
      </div>
    </InstagramLayout>
  );
};

export default ProfilePage;