import React, { useState } from 'react';
import InstagramLayout from '../components/InstagramLayout';

const LivePage = () => {
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [comments, setComments] = useState([]);

  return (
    <InstagramLayout>
      <div className="max-w-md mx-auto bg-black h-screen relative">
        {!isLive ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Go Live</h2>
              <p className="text-gray-300 mb-6">Share what you're up to with your family</p>
              <button 
                onClick={() => setIsLive(true)}
                className="bg-red-500 text-white px-8 py-3 rounded-full font-medium"
              >
                Start Live Video
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full relative">
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                LIVE
              </div>
            </div>
            
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                👁 {viewers}
              </div>
            </div>

            <div className="absolute bottom-20 left-4 right-4 z-10">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {comments.map((comment, i) => (
                  <div key={i} className="bg-black bg-opacity-50 text-white p-2 rounded-lg text-sm">
                    <span className="font-medium">{comment.user}: </span>
                    {comment.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-10 flex space-x-2">
              <input 
                placeholder="Add a comment..."
                className="flex-1 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full placeholder-gray-300"
              />
              <button 
                onClick={() => setIsLive(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-full"
              >
                End
              </button>
            </div>
          </div>
        )}
      </div>
    </InstagramLayout>
  );
};

export default LivePage;