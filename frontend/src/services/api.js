import axios from 'axios';


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://vistagram-ploa.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Posts API
export const postsAPI = {
  // Get posts with infinite scroll
  getPosts: async (page = 1, limit = 10, userId = null) => {
    const params = { page, limit };
    if (userId) params.userId = userId;
    
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Get feed (posts from followed users)
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get('/posts/feed', { 
      params: { page, limit } 
    });
    return response.data;
  },

  // Get single post
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Like/unlike post
  toggleLike: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  // Save/unsave post
  toggleSave: async (id) => {
    const response = await api.post(`/posts/${id}/save`);
    return response.data;
  },

  // Share post
  sharePost: async (id) => {
    const response = await api.post(`/posts/${id}/share`);
    return response.data;
  },

  // Delete post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Search posts
  searchPosts: async (query, page = 1, limit = 20) => {
    const response = await api.get('/posts/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  },

  // Get comments
  getComments: async (postId, page = 1, limit = 20) => {
    const response = await api.get(`/posts/${postId}/comments`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Add comment
  addComment: async (postId, content) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  }
};

// Users API
export const usersAPI = {
  // Get user profile
  getUserProfile: async (username) => {
    const response = await api.get(`/users/profile/${username}`);
    return response.data;
  },

  // Search users
  searchUsers: async (query, page = 1, limit = 20) => {
    const response = await api.get('/users/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  },

  // Get suggested users
  getSuggestedUsers: async (limit = 10) => {
    const response = await api.get('/users/suggested', {
      params: { limit }
    });
    return response.data;
  },

  // Follow user
  followUser: async (userId) => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  // Unfollow user
  unfollowUser: async (userId) => {
    const response = await api.delete(`/users/${userId}/follow`);
    return response.data;
  },

  // Get followers
  getFollowers: async (username, page = 1, limit = 20) => {
    const response = await api.get(`/users/${username}/followers`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get following
  getFollowing: async (username, page = 1, limit = 20) => {
    const response = await api.get(`/users/${username}/following`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get user posts
  getUserPosts: async (username, page = 1, limit = 20) => {
    const response = await api.get(`/users/${username}/posts`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Get saved posts
  getSavedPosts: async (page = 1, limit = 20) => {
    const response = await api.get('/users/saved', {
      params: { page, limit }
    });
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  }
};

// Auth API
export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/auth/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await api.delete('/auth/account', {
      data: { password }
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  }
};

// Upload API
export const uploadAPI = {
  // Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      return error.response.data.message || 'An error occurred';
    }
    return error.message || 'Network error';
  },

  // Format API response
  formatResponse: (response) => {
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message
    };
  },

  // Create query string
  createQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  }
};

export default api;

