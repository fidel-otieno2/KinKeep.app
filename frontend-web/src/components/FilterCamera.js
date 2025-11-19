import React, { useState, useRef, useEffect } from 'react';

const FilterCamera = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('none');

  const filters = [
    { id: 'none', name: 'Original', style: '' },
    { id: 'sepia', name: 'Vintage', style: 'sepia(100%)' },
    { id: 'grayscale', name: 'B&W', style: 'grayscale(100%)' },
    { id: 'blur', name: 'Soft', style: 'blur(2px)' },
    { id: 'brightness', name: 'Bright', style: 'brightness(150%)' },
    { id: 'contrast', name: 'Pop', style: 'contrast(150%)' },
  ];

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.filter = filters.find(f => f.id === selectedFilter)?.style || '';
    context.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      onCapture(file);
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ filter: filters.find(f => f.id === selectedFilter)?.style }}
        />
        
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button onClick={onClose} className="text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-white font-medium">Camera</h2>
          <div></div>
        </div>

        {/* Filters */}
        <div className="absolute bottom-32 left-0 right-0">
          <div className="flex space-x-2 px-4 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex-shrink-0 w-16 h-16 rounded-full border-2 ${
                  selectedFilter === filter.id ? 'border-white' : 'border-gray-400'
                } bg-gray-600 flex items-center justify-center`}
              >
                <span className="text-white text-xs">{filter.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Capture Button */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={capturePhoto}
            className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center"
          >
            <div className="w-12 h-12 bg-white rounded-full"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterCamera;