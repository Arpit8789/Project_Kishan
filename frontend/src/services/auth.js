import api from './api';
import Cookies from 'js-cookie';

// Authentication service
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store token
    localStorage.setItem('token', token);
    Cookies.set('token', token, { expires: 7 }); // 7 days
    
    // Store user info
    localStorage.setItem('user', JSON.stringify(user));
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    const { token, user } = response.data;
    
    // Store token
    localStorage.setItem('token', token);
    Cookies.set('token', token, { expires: 7 });
    
    // Store user info
    localStorage.setItem('user', JSON.stringify(user));
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  // Remove token and user data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  Cookies.remove('token');
  
  // Redirect to login
  window.location.href = '/auth';
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem('token') || Cookies.get('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  const user = getCurrentUser();
  return !!(token && user);
};

export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    const { token } = response.data;
    
    localStorage.setItem('token', token);
    Cookies.set('token', token, { expires: 7 });
    
    return token;
  } catch (error) {
    logout();
    throw error;
  }
};

// Check token expiry and refresh if needed
export const checkAndRefreshToken = async () => {
  const token = getToken();
  
  if (!token) {
    return false;
  }
  
  try {
    // Decode JWT to check expiry (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // If token expires in less than 5 minutes, refresh it
    if (payload.exp - currentTime < 300) {
      await refreshToken();
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    logout();
    return false;
  }
};
