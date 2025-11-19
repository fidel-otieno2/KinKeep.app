import apiService from './api';

class MessageService {
  // Get all conversations for current user
  async getConversations() {
    try {
      const response = await apiService.get('/conversations');
      return response.data.conversations || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  // Get messages for a specific conversation
  async getMessages(conversationId, page = 1, limit = 50) {
    try {
      const response = await apiService.get(`/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
      return response.data.messages || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a text message
  async sendMessage(conversationId, content, messageType = 'text', mediaUrl = null, replyToId = null) {
    try {
      const response = await apiService.post(`/conversations/${conversationId}/messages`, {
        content,
        message_type: messageType,
        media_url: mediaUrl,
        reply_to_id: replyToId
      });
      return response.data.message_data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Create a new conversation
  async createConversation(participantIds, name = null) {
    try {
      const response = await apiService.post('/conversations', {
        participant_ids: participantIds,
        name
      });
      return response.data.conversation_id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Search users for new conversations
  async searchUsers(query) {
    try {
      const response = await apiService.get(`/search/users?q=${encodeURIComponent(query)}`);
      return response.data.users || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Upload media for messages
  async uploadMedia(file, type = 'image') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('folder', 'messages');

      const response = await apiService.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.url;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  // Send media message
  async sendMediaMessage(conversationId, file, caption = '') {
    try {
      // Determine file type
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'audio';
      
      // Upload the file first
      const mediaUrl = await this.uploadMedia(file, fileType);
      
      // Send the message with media
      return await this.sendMessage(conversationId, caption, fileType, mediaUrl);
    } catch (error) {
      console.error('Error sending media message:', error);
      throw error;
    }
  }

  // Format message time
  formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Format last message preview
  formatLastMessage(message) {
    if (!message) return 'Start a conversation';
    
    switch (message.message_type) {
      case 'image':
        return '📷 Photo';
      case 'video':
        return '🎥 Video';
      case 'audio':
        return '🎵 Voice message';
      default:
        return message.content || 'Message';
    }
  }
}

export default new MessageService();