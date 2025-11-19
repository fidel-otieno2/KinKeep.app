import React, { useState, useRef } from 'react';
import apiService from '../services/api';
import FilterCamera from './FilterCamera';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [step, setStep] = useState(1); // 1: select media, 2: add details
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isStory, setIsStory] = useState(false);
  const [isReel, setIsReel] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef();

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create previews
    const newPreviews = files.map(file => {
      let type = 'image';
      if (file.type.startsWith('video/')) {
        type = 'video';
      } else if (file.type.startsWith('audio/')) {
        type = 'audio';
      }
      
      const preview = {
        file,
        url: URL.createObjectURL(file),
        type: type
      };
      return preview;
    });
    
    setPreviews(newPreviews);
    if (files.length > 0) setStep(2);
  };

  const handleCameraCapture = (file) => {
    setSelectedFiles([file]);
    const preview = {
      file,
      url: URL.createObjectURL(file),
      type: 'image'
    };
    setPreviews([preview]);
    setShowCamera(false);
    setStep(2);
  };

  const uploadFiles = async () => {
    const uploadedUrls = [];
    
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type.startsWith('image/') ? 'image' : 
                              file.type.startsWith('video/') ? 'video' : 'audio');
      formData.append('folder', isStory ? 'stories' : 'posts');
      
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: formData
        });
        
        const result = await response.json();
        if (result.url) {
          uploadedUrls.push(result.url);
        }
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    try {
      // Upload files first
      const mediaUrls = await uploadFiles();
      
      // Create post
      const postData = {
        caption,
        location,
        media_urls: mediaUrls,
        media_type: previews.length === 1 ? previews[0].type : 'carousel',
        is_story: isStory,
        is_reel: isReel,
        visibility: 'public'
      };
      
      await apiService.createPost(postData);
      
      // Reset and close
      resetModal();
      onPostCreated();
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedFiles([]);
    setPreviews([]);
    setCaption('');
    setLocation('');
    setIsStory(false);
    setIsReel(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <button onClick={resetModal} className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">
            {step === 1 ? 'Create new post' : 'Share'}
          </h2>
          {step === 2 && (
            <button 
              onClick={handleSubmit}
              disabled={uploading}
              className="text-blue-500 font-medium disabled:opacity-50"
            >
              {uploading ? 'Sharing...' : 'Share'}
            </button>
          )}
        </div>

        {/* Step 1: Select Media */}
        {step === 1 && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Drag photos and videos here</h3>
              <p className="text-gray-600">or</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary w-full"
              >
                Select from computer
              </button>
              
              <button
                onClick={() => setShowCamera(true)}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Take Photo</span>
              </button>
            </div>
            
            {/* Post Type Options */}
            <div className="mt-6 space-y-2">
              <label className="flex items-center justify-center space-x-2">
                <input
                  type="checkbox"
                  checked={isStory}
                  onChange={(e) => setIsStory(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Share as Story (24h)</span>
              </label>
              <label className="flex items-center justify-center space-x-2">
                <input
                  type="checkbox"
                  checked={isReel}
                  onChange={(e) => setIsReel(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Share as Reel</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Add Details */}
        {step === 2 && (
          <div className="flex flex-col h-[500px]">
            {/* Media Preview */}
            <div className="flex-1 bg-black flex items-center justify-center relative">
              {previews[0] && (
                <div className="max-w-full max-h-full">
                  {previews[0].type === 'image' && (
                    <img 
                      src={previews[0].url} 
                      alt="Preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                  {previews[0].type === 'video' && (
                    <div className="relative">
                      <video 
                        src={previews[0].url} 
                        controls 
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="max-w-full max-h-full object-contain"
                        style={{ maxHeight: '400px', minHeight: '200px' }}
                        onError={(e) => {
                          console.error('Video error:', e);
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        VIDEO
                      </div>
                    </div>
                  )}
                  {previews[0].type === 'audio' && (
                    <div className="text-white p-8 text-center">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                      <p>Audio File</p>
                      <p className="text-sm text-gray-300 mb-4">{selectedFiles[0]?.name}</p>
                      <audio src={previews[0].url} controls className="mt-4" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Caption and Details */}
            <div className="p-4 border-t">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 instagram-gradient rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <textarea
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full border-0 resize-none focus:outline-none text-sm"
                    rows="3"
                  />
                  <input
                    type="text"
                    placeholder="Add location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border-0 focus:outline-none text-sm text-gray-600 mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Camera Modal */}
        {showCamera && (
          <FilterCamera 
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;