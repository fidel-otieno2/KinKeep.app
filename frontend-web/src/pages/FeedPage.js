import React, { useState, useEffect } from 'react';
import InstagramLayout from '../components/InstagramLayout';
import ShareModal from '../components/ShareModal';
import apiService from '../services/api';

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    onLike(post.id);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="rounded-lg mb-6" style={{backgroundColor: 'white', border: '1px solid #dbdbdb'}}>
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'}}>
            <span className="text-white text-sm font-medium">
              {post.author?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-sm">{post.author?.name}</p>
            {post.location && (
              <p className="text-xs text-gray-500">{post.location}</p>
            )}
          </div>
        </div>
        <button className="text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Post Media */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className="aspect-square bg-gray-100 relative">
          {post.media_type === 'video' || post.is_reel ? (
            <>
              <video
                src={post.media_urls[0]}
                className="w-full h-full object-cover"
                controls
                muted
                loop
                playsInline
              />
              {post.is_reel && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  REEL
                </div>
              )}
            </>
          ) : (
            <img
              src={post.media_urls[0]}
              alt="Post content"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike} 
              className={`hover:text-gray-600 transition-colors ${post.user_liked ? 'text-red-500' : ''}`}
            >
              <svg className="w-6 h-6" fill={post.user_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button 
              onClick={() => onShare(post)}
              className="hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <button 
            onClick={() => alert('Save feature coming soon!')}
            className="hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Likes */}
        <p className="font-medium text-sm mb-2">{post.likes_count} likes</p>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm mb-2">
            <span className="font-medium">{post.author?.name}</span> {post.caption}
          </p>
        )}

        {/* Comments */}
        {post.comments_count > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 text-sm mb-2"
          >
            View all {post.comments_count} comments
          </button>
        )}

        {/* Add Comment */}
        <form onSubmit={handleComment} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 text-sm border-0 focus:outline-none bg-transparent"
          />
          {newComment.trim() && (
            <button type="submit" className="text-blue-500 font-medium text-sm">
              Post
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    fetchFeed();
    fetchStories();
  }, []);

  const fetchFeed = async () => {
    try {
      // Enhanced algorithmic feed with engagement metrics including reels
      const response = await apiService.getPosts({ 
        type: 'feed',
        include_reels: true,
        algorithm: 'engagement',
        include_metrics: true,
        personalized: true
      });
      setPosts(response.posts || []);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await apiService.getPosts({ type: 'stories' });
      setStories(response.stories || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await apiService.likePost(postId);
      // Refresh the specific post or update state
      fetchFeed();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      await apiService.commentOnPost(postId, content);
      fetchFeed();
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleShare = (post) => {
    setShareData({
      title: `${post.author?.name}'s post`,
      description: post.caption || 'Check out this family story on KinKeep',
      url: `${window.location.origin}/post/${post.id}`
    });
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <InstagramLayout>
        <div className="max-w-2xl mx-auto pt-8 px-4">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </InstagramLayout>
    );
  }

  return (
    <InstagramLayout>
      <div className="max-w-2xl mx-auto pt-8 px-4">
        {/* Stories */}
        {stories.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
            <div className="flex space-x-4 overflow-x-auto">
              {stories.map((story) => (
                <div key={story.id} className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 instagram-gradient rounded-full p-0.5">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {story.author?.name?.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs mt-1 truncate w-16">{story.author?.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to KinKeep!</h3>
            <p className="text-gray-600 mb-4">Start following family members to see their stories in your feed.</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))
        )}
        
        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareData={shareData}
        />
      </div>
    </InstagramLayout>
  );
};

export default FeedPage;