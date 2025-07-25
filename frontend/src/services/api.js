import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      Cookies.remove('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Price related APIs
export const getPrices = async (crop, location) => {
  return api.get(`/prices`, {
    params: { crop, location }
  });
};

export const getPriceHistory = async (crop, location, days = 30) => {
  return api.get(`/prices/history`, {
    params: { crop, location, days }
  });
};

export const getForecast = async (crop, location, days = 7) => {
  return api.get(`/prices/forecast`, {
    params: { crop, location, days }
  });
};

// Crop related APIs
export const getCrops = async () => {
  return api.get('/crops');
};

export const getCropInfo = async (crop) => {
  return api.get(`/crops/${crop}`);
};

export const createCrop = async (cropData) => {
  return api.post('/crops', cropData);
};

export const updateCrop = async (id, cropData) => {
  return api.put(`/crops/${id}`, cropData);
};

export const deleteCrop = async (id) => {
  return api.delete(`/crops/${id}`);
};

// Disease detection APIs
export const detectDisease = async (formData) => {
  return api.post('/diseases/detect', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // Longer timeout for image processing
  });
};

export const getDiseases = async () => {
  return api.get('/diseases');
};

export const createDisease = async (diseaseData) => {
  return api.post('/diseases', diseaseData);
};

export const updateDisease = async (id, diseaseData) => {
  return api.put(`/diseases/${id}`, diseaseData);
};

export const deleteDisease = async (id) => {
  return api.delete(`/diseases/${id}`);
};

// Cost calculation APIs
export const calculateCost = async (costData) => {
  return api.post('/calculator/cost', costData);
};

export const getCostTemplates = async () => {
  return api.get('/calculator/templates');
};

export const createCostTemplate = async (templateData) => {
  return api.post('/calculator/templates', templateData);
};

export const updateCostTemplate = async (id, templateData) => {
  return api.put(`/calculator/templates/${id}`, templateData);
};

export const deleteCostTemplate = async (id) => {
  return api.delete(`/calculator/templates/${id}`);
};

// Chatbot APIs
export const getBotResponse = async (queryData) => {
  return api.post('/chatbot/query', queryData);
};

export const speechToText = async (audioData) => {
  return api.post('/chatbot/speech-to-text', audioData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const textToSpeech = async (textData) => {
  return api.post('/chatbot/text-to-speech', textData);
};

// User profile APIs
export const updateProfile = async (profileData) => {
  return api.put('/auth/profile', profileData);
};

export const getUserActivity = async () => {
  return api.get('/auth/activity');
};

export const getUserFavorites = async () => {
  return api.get('/auth/favorites');
};

// Weather APIs
export const getWeatherData = async (location) => {
  return api.get('/weather', {
    params: { location }
  });
};

// Admin APIs
export const getUserAnalytics = async () => {
  return api.get('/admin/analytics');
};

// Generic error handler
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return { error: data.message || 'Invalid request data' };
      case 401:
        return { error: 'Authentication required' };
      case 403:
        return { error: 'Access denied' };
      case 404:
        return { error: 'Resource not found' };
      case 429:
        return { error: 'Too many requests. Please try again later.' };
      case 500:
        return { error: 'Server error. Please try again later.' };
      default:
        return { error: data.message || 'Something went wrong' };
    }
  } else if (error.request) {
    // Network error
    return { error: 'Network error. Please check your connection.' };
  } else {
    // Other error
    return { error: 'An unexpected error occurred' };
  }
};

export default api;
