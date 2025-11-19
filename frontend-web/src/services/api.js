import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken && !error.config.url.includes('/auth/refresh')) {
            try {
              const response = await this.refreshToken();
              localStorage.setItem('access_token', response.data.access_token);
              error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
              return this.api.request(error.config);
            } catch (refreshError) {
              this.logout();
              return Promise.reject(error);
            }
          } else {
            this.logout();
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async register(userData) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async login(credentials) {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.api.post('/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // User methods
  async getCurrentUser() {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await this.api.put('/users/me', profileData);
    return response.data;
  }

  async changePassword(passwordData) {
    const response = await this.api.post('/users/change-password', passwordData);
    return response.data;
  }

  async updatePrivacySettings(settings) {
    const response = await this.api.put('/users/settings', { privacy: settings });
    return response.data;
  }

  async updateSecuritySettings(settings) {
    const response = await this.api.put('/users/settings', { security: settings });
    return response.data;
  }

  async updateNotificationSettings(settings) {
    const response = await this.api.put('/users/settings', { notifications: settings });
    return response.data;
  }

  async deleteAccount() {
    const response = await this.api.delete('/users/me');
    return response.data;
  }

  // Family methods
  async getFamilies() {
    const response = await this.api.get('/families');
    return response.data;
  }

  async createFamily(familyData) {
    const response = await this.api.post('/families', familyData);
    return response.data;
  }

  async getFamily(familyId) {
    const response = await this.api.get(`/families/${familyId}`);
    return response.data;
  }

  // Story methods
  async getStories(params = {}) {
    const response = await this.api.get('/stories', { params });
    return response.data;
  }

  async createStory(storyData) {
    const response = await this.api.post('/stories', storyData);
    return response.data;
  }

  async getStory(storyId) {
    const response = await this.api.get(`/stories/${storyId}`);
    return response.data;
  }

  async updateStory(storyId, storyData) {
    const response = await this.api.put(`/stories/${storyId}`, storyData);
    return response.data;
  }

  // AI Enhancement methods
  async enhanceStory(storyId) {
    const response = await this.api.post(`/stories/${storyId}/enhance`);
    return response.data;
  }

  async acceptEnhancement(storyId, accept) {
    const response = await this.api.post(`/stories/${storyId}/accept-enhancement`, { accept });
    return response.data;
  }

  // Instagram-style Posts
  async getPosts(params = {}) {
    const response = await this.api.get('/posts', { params });
    return response.data;
  }

  async createPost(postData) {
    const response = await this.api.post('/posts', postData);
    return response.data;
  }

  async likePost(postId) {
    const response = await this.api.post(`/posts/${postId}/like`);
    return response.data;
  }

  async commentOnPost(postId, content) {
    const response = await this.api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  }

  // Follow system
  async followUser(userId) {
    const response = await this.api.post(`/users/${userId}/follow`);
    return response.data;
  }

  async getFollowers(userId) {
    const response = await this.api.get(`/users/${userId}/followers`);
    return response.data;
  }

  async getFollowing(userId) {
    const response = await this.api.get(`/users/${userId}/following`);
    return response.data;
  }

  // Messaging
  async getConversations() {
    const response = await this.api.get('/conversations');
    return response.data;
  }

  async createConversation(participantIds, name) {
    const response = await this.api.post('/conversations', { participant_ids: participantIds, name });
    return response.data;
  }

  async getMessages(conversationId, params = {}) {
    const response = await this.api.get(`/conversations/${conversationId}/messages`, { params });
    return response.data;
  }

  async sendMessage(conversationId, messageData) {
    const response = await this.api.post(`/conversations/${conversationId}/messages`, messageData);
    return response.data;
  }
}

export default new ApiService();