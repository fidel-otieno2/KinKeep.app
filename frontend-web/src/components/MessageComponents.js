import React from 'react';

export const TypingIndicator = ({ username }) => (
  <div className="flex items-center space-x-2 p-3">
    <img 
      src={`https://picsum.photos/seed/${username}/150/150`}
      alt={username}
      className="w-6 h-6 rounded-full"
    />
    <div className="typing-indicator px-4 py-2">
      <div className="flex space-x-1">
        <div className="typing-dot w-2 h-2 rounded-full"></div>
        <div className="typing-dot w-2 h-2 rounded-full" style={{animationDelay: '0.2s'}}></div>
        <div className="typing-dot w-2 h-2 rounded-full" style={{animationDelay: '0.4s'}}></div>
      </div>
    </div>
  </div>
);

export const MessageReaction = ({ emoji, count, isActive, onClick }) => (
  <button 
    className={`message-reaction px-2 py-1 text-xs ${isActive ? 'bg-kinkeep-primary text-white' : ''}`}
    onClick={onClick}
  >
    {emoji} {count > 0 && count}
  </button>
);

export const OnlineIndicator = ({ isOnline }) => (
  isOnline && (
    <div className="online-indicator absolute bottom-0 right-0 w-3 h-3 rounded-full"></div>
  )
);

export const MessageStatus = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'delivered':
        return (
          <div className="flex">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <svg className="w-4 h-4 text-gray-400 -ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'read':
        return (
          <div className="flex">
            <svg className="w-4 h-4 text-kinkeep-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <svg className="w-4 h-4 text-kinkeep-primary -ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="flex items-center ml-2">{getStatusIcon()}</div>;
};

export const VoiceMessagePlayer = ({ audioUrl, duration }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const audioRef = React.useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-kinkeep-neutral-100 rounded-2xl max-w-xs">
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-kinkeep-primary text-white flex items-center justify-center"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <div className="flex-1 h-1 bg-kinkeep-neutral-300 rounded-full overflow-hidden">
            <div 
              className="h-full bg-kinkeep-primary transition-all duration-300"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
          <span className="text-xs text-kinkeep-neutral-600">
            {formatTime(duration || 0)}
          </span>
        </div>
      </div>
      
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export const MessageContextMenu = ({ isOpen, onClose, onReply, onForward, onDelete, onReact }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <button 
        onClick={onReply}
        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg"
      >
        Reply
      </button>
      <button 
        onClick={onForward}
        className="w-full text-left px-4 py-2 hover:bg-gray-50"
      >
        Forward
      </button>
      <button 
        onClick={onReact}
        className="w-full text-left px-4 py-2 hover:bg-gray-50"
      >
        React
      </button>
      <hr className="border-gray-200" />
      <button 
        onClick={onDelete}
        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 last:rounded-b-lg"
      >
        Delete
      </button>
    </div>
  );
};