import React, { useState, useEffect, useRef } from 'react';
import InstagramLayout from '../components/InstagramLayout';
import apiService from '../services/api';

const ReelCard = ({ reel, isActive, onLike, onComment }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.media_urls?.[0]}
        className="h-full w-auto max-w-full object-contain"
        loop
        muted
        playsInline
        onClick={togglePlay}
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      )}

      {/* User Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 instagram-gradient rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {reel.author?.name?.charAt(0)}
                </span>
              </div>
              <span className="text-white font-medium text-sm">{reel.author?.name}</span>
              <button className="text-white text-sm border border-white px-2 py-1 rounded">
                Follow
              </button>
            </div>
            {reel.caption && (
              <p className="text-white text-sm mb-2">{reel.caption}</p>
            )}
            {reel.location && (
              <p className="text-white text-xs opacity-75">📍 {reel.location}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => onLike(reel.id)}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-white text-xs mt-1">{reel.likes_count}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-white text-xs mt-1">{reel.comments_count}</span>
            </button>

            <button className="flex flex-col items-center">
              <div className="w-12 h-12 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </button>

            <button className="flex flex-col items-center">
              <div className="w-12 h-12 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </button>

            <button className="w-8 h-8 border-2 border-white rounded-lg overflow-hidden">
              <img
                src={reel.media_urls?.[0]}
                alt="Reel thumbnail"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchReels();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const itemHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / itemHeight);
        setCurrentIndex(newIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const fetchReels = async () => {
    try {
      const response = await apiService.getPosts({ type: 'reels' });
      setReels(response.reels || []);
    } catch (error) {
      console.error('Error fetching reels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (reelId) => {
    try {
      await apiService.likePost(reelId);
      fetchReels(); // Refresh to update like count
    } catch (error) {
      console.error('Error liking reel:', error);
    }
  };

  const handleComment = async (reelId, content) => {
    try {
      await apiService.commentOnPost(reelId, content);
      fetchReels(); // Refresh to update comment count
    } catch (error) {
      console.error('Error commenting on reel:', error);
    }
  };

  if (loading) {
    return (
      <InstagramLayout>
        <div className="h-screen flex items-center justify-center bg-black">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      </InstagramLayout>
    );
  }

  if (reels.length === 0) {
    return (
      <InstagramLayout>
        <div className="h-screen flex items-center justify-center bg-black">
          <div className="text-center text-white">
            <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-medium mb-2">No Reels Yet</h3>
            <p className="text-gray-400">Start creating short family videos to see them here</p>
          </div>
        </div>
      </InstagramLayout>
    );
  }

  return (
    <InstagramLayout>
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {reels.map((reel, index) => (
          <div key={reel.id} className="snap-start">
            <ReelCard
              reel={reel}
              isActive={index === currentIndex}
              onLike={handleLike}
              onComment={handleComment}
            />
          </div>
        ))}
      </div>
    </InstagramLayout>
  );
};

export default ReelsPage;