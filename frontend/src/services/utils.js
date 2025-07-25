// Utility functions for the application

// Date formatting utilities
export const formatDate = (date, language = 'en') => {
  const dateObj = new Date(date);
  
  if (language === 'hi') {
    return dateObj.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

// Number formatting utilities
export const formatIndianCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (number, decimals = 0) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals
  }).format(number);
};

export const convertUnits = (value, fromUnit, toUnit) => {
  const conversions = {
    'acre_to_hectare': 0.4047,
    'hectare_to_acre': 2.4711,
    'kg_to_quintal': 0.01,
    'quintal_to_kg': 100,
    'celsius_to_fahrenheit': (c) => (c * 9/5) + 32,
    'fahrenheit_to_celsius': (f) => (f - 32) * 5/9
  };
  
  const conversionKey = `${fromUnit}_to_${toUnit}`;
  const conversionFactor = conversions[conversionKey];
  
  if (typeof conversionFactor === 'function') {
    return conversionFactor(value);
  } else if (conversionFactor) {
    return value * conversionFactor;
  }
  
  return value; // No conversion needed
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    hasMinLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
};

// String utilities
export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
};

// Array utilities
export const removeDuplicates = (array, key = null) => {
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const keyValue = item[key];
      if (seen.has(keyValue)) {
        return false;
      }
      seen.add(keyValue);
      return true;
    });
  }
  return [...new Set(array)];
};

export const sortByKey = (array, key, order = 'asc') => {
  return array.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Local storage utilities
export const setStorageItem = (key, value, expiry = null) => {
  const item = {
    value,
    timestamp: Date.now(),
    expiry
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getStorageItem = (key) => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    
    // Check if item has expired
    if (item.expiry && Date.now() > item.timestamp + item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error('Error parsing storage item:', error);
    return null;
  }
};

export const removeStorageItem = (key) => {
  localStorage.removeItem(key);
};

// Image utilities
export const resizeImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return {
    isValid: allowedTypes.includes(file.type) && file.size <= maxSize,
    isValidType: allowedTypes.includes(file.type),
    isValidSize: file.size <= maxSize,
    size: file.size,
    type: file.type
  };
};

// URL utilities
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      searchParams.set(key, params[key]);
    }
  });
  
  return searchParams.toString();
};

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
};

// Error handling utilities
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};

export const logError = (error, context = '') => {
  console.error(`Error ${context}:`, error);
  
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service (e.g., Sentry)
  }
};

// Device detection utilities
export const isMobile = () => {
  return window.innerWidth <= 768;
};

export const isTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

export const isDesktop = () => {
  return window.innerWidth > 1024;
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Color utilities for charts
export const generateChartColors = (count) => {
  const colors = [
    '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];
  
  if (count <= colors.length) {
    return colors.slice(0, count);
  }
  
  // Generate additional colors if needed
  const additionalColors = [];
  for (let i = colors.length; i < count; i++) {
    const hue = (i * 137.5) % 360; // Golden angle approximation
    additionalColors.push(`hsl(${hue}, 70%, 60%)`);
  }
  
  return [...colors, ...additionalColors];
};

export default {
  formatDate,
  formatTime,
  getRelativeTime,
  formatIndianCurrency,
  formatNumber,
  convertUnits,
  validateEmail,
  validatePhone,
  validatePassword,
  capitalizeFirst,
  slugify,
  truncateText,
  removeDuplicates,
  sortByKey,
  groupBy,
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  resizeImage,
  validateImageFile,
  buildQueryString,
  parseQueryString,
  getErrorMessage,
  logError,
  isMobile,
  isTablet,
  isDesktop,
  debounce,
  throttle,
  generateChartColors
};
