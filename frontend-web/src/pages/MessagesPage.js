import React, { useState, useEffect, useRef } from 'react';
import InstagramLayout from '../components/InstagramLayout';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const MessageBubble = ({ message, isOwn, currentUser }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1 group`}>
      {!isOwn && (
        <img 
          src={message.sender?.profile_image || `https://picsum.photos/seed/${message.sender?.id}/150/150`}
          alt={message.sender?.username}
          className="w-6 h-6 rounded-full mr-2 mt-auto flex-shrink-0"
        />
      )}
      <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl relative ${
        isOwn 
          ? 'message-bubble' 
          : 'message-bubble received'
      }`}>
        {message.message_type === 'text' && (
          <p className="text-sm break-words">{message.content}</p>
        )}
        {message.message_type === 'image' && (
          <div>
            <img 
              src={message.media_url} 
              alt="Shared content" 
              className="rounded-lg max-w-full h-auto cursor-pointer"
              onClick={() => window.open(message.media_url, '_blank')}
            />
            {message.content && <p className="text-sm mt-2 break-words">{message.content}</p>}
          </div>
        )}
        {message.message_type === 'video' && (
          <div>
            <video 
              src={message.media_url} 
              controls 
              className="rounded-lg max-w-full h-auto"
            />
            {message.content && <p className="text-sm mt-2 break-words">{message.content}</p>}
          </div>
        )}
        {message.message_type === 'audio' && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <audio src={message.media_url} controls className="max-w-full" />
          </div>
        )}
        <div className={`text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
          isOwn ? 'text-white/70' : 'text-gray-500'
        }`}>
          {formatTime(message.created_at)}
        </div>
      </div>
    </div>
  );
};

const ConversationItem = ({ conversation, isActive, onClick }) => {
  const formatLastMessage = (message) => {
    if (!message) return 'Start a conversation';
    
    switch (message.message_type) {
      case 'image': return '📷 Photo';
      case 'video': return '🎥 Video';
      case 'audio': return '🎵 Voice message';
      default: return message.content || 'Message';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className={`flex items-center p-3 cursor-pointer conversation-item ${
        isActive ? 'active' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={conversation.avatar}
          alt={conversation.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        {conversation.unread_count > 0 && (
          <div className="absolute -top-1 -right-1 unread-badge text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
          </div>
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className={`text-sm font-medium truncate ${
            conversation.unread_count > 0 ? 'text-gray-900' : 'text-gray-700'
          }`}>
            {conversation.name}
          </h3>
          <span className="text-xs text-gray-500 ml-2">
            {formatTime(conversation.updated_at)}
          </span>
        </div>
        <p className={`text-sm truncate mt-1 ${
          conversation.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
        }`}>
          {formatLastMessage(conversation.last_message)}
        </p>
      </div>
    </div>
  );
};

const NewMessageModal = ({ isOpen, onClose, onStartConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiService.get(`/search/users?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data.users || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleStartConversation = async (userId) => {
    try {
      const response = await apiService.post('/conversations', {
        participant_ids: [userId]
      });
      onStartConversation(response.data.conversation_id);
      onClose();
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">New Message</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full search-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kinkeep-primary"
            autoFocus
          />
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-kinkeep-primary mx-auto"></div>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map(user => (
              <div 
                key={user.id}
                className="flex items-center p-3 user-search-item cursor-pointer"
                onClick={() => handleStartConversation(user.id)}
              >
                <img 
                  src={user.profile_image}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="font-medium text-sm">{user.username}</p>
                  {user.full_name && (
                    <p className="text-gray-500 text-sm">{user.full_name}</p>
                  )}
                </div>
              </div>
            ))
          ) : searchQuery && !loading ? (
            <div className="p-4 text-center text-gray-500">
              No users found
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await apiService.get('/conversations');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await apiService.get(`/conversations/${conversationId}/messages`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    loadMessages(conversation.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || sendingMessage) return;

    setSendingMessage(true);
    try {
      const response = await apiService.post(`/conversations/${activeConversation.id}/messages`, {
        content: newMessage,
        message_type: 'text'
      });
      
      setMessages(prev => [...prev, response.data.message_data]);
      setNewMessage('');
      
      // Update conversation list
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!activeConversation) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('folder', 'messages');

    try {
      const uploadResponse = await apiService.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const messageResponse = await apiService.post(`/conversations/${activeConversation.id}/messages`, {
        media_url: uploadResponse.data.url,
        message_type: type
      });
      
      setMessages(prev => [...prev, messageResponse.data.message_data]);
      loadConversations();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleStartConversation = (conversationId) => {
    loadConversations().then(() => {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        handleConversationClick(conversation);
      }
    });
  };

  if (loading) {
    return (
      <InstagramLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kinkeep-primary"></div>
        </div>
      </InstagramLayout>
    );
  }

  return (
    <InstagramLayout>
      <div className="h-screen flex bg-white">
        {/* Conversations List */}
        <div className="w-full md:w-96 messages-sidebar flex flex-col">
          <div className="p-4 chat-header flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">{user?.username}</h2>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <button 
              onClick={() => setShowNewMessageModal(true)}
              className="p-2 attachment-button rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map(conversation => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation?.id === conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600 mb-4">Start a conversation with your family members</p>
                <button 
                  onClick={() => setShowNewMessageModal(true)}
                  className="bg-kinkeep-primary text-white px-4 py-2 rounded-lg hover:bg-kinkeep-secondary transition-colors"
                >
                  Send Message
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 chat-header flex items-center">
                <img 
                  src={activeConversation.avatar}
                  alt={activeConversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="font-semibold">{activeConversation.name}</h3>
                  <p className="text-sm text-gray-500">
                    {activeConversation.is_group ? 
                      `${activeConversation.participants.length} members` : 
                      'Active now'
                    }
                  </p>
                </div>
                <div className="ml-auto flex space-x-2">
                  <button className="p-2 attachment-button rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="p-2 attachment-button rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-2 attachment-button rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map(message => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.sender_id === user?.id}
                    currentUser={user}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 chat-header">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 attachment-button rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Message..."
                      className="w-full message-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-kinkeep-primary focus:border-transparent"
                      disabled={sendingMessage}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="send-button font-semibold"
                  >
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </form>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,audio/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const type = file.type.startsWith('image/') ? 'image' : 
                                  file.type.startsWith('video/') ? 'video' : 'audio';
                      handleFileUpload(file, type);
                    }
                  }}
                  className="hidden"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Your Messages</h3>
                <p className="text-gray-600 mb-4">Send private photos and messages to a friend or group.</p>
                <button 
                  onClick={() => setShowNewMessageModal(true)}
                  className="kinkeep-btn-primary px-6 py-2"
                >
                  Send Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <NewMessageModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onStartConversation={handleStartConversation}
      />
    </InstagramLayout>
  );
};

export default MessagesPage;