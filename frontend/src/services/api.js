import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Cache for storing API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Automatically attach JWT if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for caching
api.interceptors.response.use(
  (response) => {
    // Cache GET requests
    if (response.config.method === 'get') {
      const cacheKey = response.config.url;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get cached data
const getCachedData = (url) => {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Enhanced API functions with caching
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);

// Profile with caching
export const getUserProfile = async () => {
  const cached = getCachedData('/user/profile');
  if (cached) {
    return { data: cached };
  }
  return api.get('/user/profile');
};

export const updateUserProfile = (data) => {
  // Clear cache when updating profile
  cache.delete('/user/profile');
  return api.put('/user/profile', data);
};

// Enhanced functions for common data fetching
export const getSwapRequests = async () => {
  const cached = getCachedData('/swap');
  if (cached) {
    return { data: cached };
  }
  return api.get('/swap');
};

export const getSkillPosts = async () => {
  const cached = getCachedData('/skill-posts');
  if (cached) {
    return { data: cached };
  }
  return api.get('/skill-posts');
};

export const getLearningSessions = async () => {
  const cached = getCachedData('/learning/sessions');
  if (cached) {
    return { data: cached };
  }
  return api.get('/learning/sessions');
};

// Clear cache function
export const clearCache = () => {
  cache.clear();
};

export default api;
