import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, logout as authLogout } from '../services/auth';

// Mock SUPPORTED_LANGUAGES since translation service might not be available
const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', native: 'English', code: 'en' },
  'hi': { name: 'Hindi', native: 'हिंदी', code: 'hi' },
  'te': { name: 'Telugu', native: 'తెలుగు', code: 'te' },
  'ta': { name: 'Tamil', native: 'தமிழ்', code: 'ta' },
  'bn': { name: 'Bengali', native: 'বাংলা', code: 'bn' },
  'gu': { name: 'Gujarati', native: 'ગુજરાતી', code: 'gu' },
  'mr': { name: 'Marathi', native: 'मराठी', code: 'mr' },
  'pa': { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', code: 'pa' }
};

// Mock translateText function
const translateText = async (text, fromLang, toLang) => {
  // Simple mock translation - in real app this would call translation service
  return text;
};

// Initial state
const initialState = {
  // User authentication
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  // Language and localization
  language: 'en',
  supportedLanguages: SUPPORTED_LANGUAGES,
  translations: {},
  
  // Theme
  theme: 'light',
  
  // App preferences
  preferences: {
    autoTranslate: true,
    voiceEnabled: true,
    notifications: true,
    location: '',
    favoriteCrops: []
  },
  
  // Search and filters
  searchHistory: [],
  recentQueries: [],
  
  // Cache for frequently accessed data
  cache: {
    prices: {},
    crops: {},
    diseases: {}
  },
  
  // Notifications
  notifications: [],
  
  // Error handling
  error: null,
  
  // Network status
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
};

// Action types
const ActionTypes = {
  // Authentication
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  LOGOUT: 'LOGOUT',
  
  // Language
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_TRANSLATIONS: 'SET_TRANSLATIONS',
  
  // Theme
  SET_THEME: 'SET_THEME',
  
  // Preferences
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  ADD_FAVORITE_CROP: 'ADD_FAVORITE_CROP',
  REMOVE_FAVORITE_CROP: 'REMOVE_FAVORITE_CROP',
  
  // Search
  ADD_SEARCH_QUERY: 'ADD_SEARCH_QUERY',
  CLEAR_SEARCH_HISTORY: 'CLEAR_SEARCH_HISTORY',
  
  // Cache
  UPDATE_CACHE: 'UPDATE_CACHE',
  CLEAR_CACHE: 'CLEAR_CACHE',
  
  // Notifications
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  
  // Error handling
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Network
  SET_ONLINE_STATUS: 'SET_ONLINE_STATUS'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        preferences: {
          ...initialState.preferences
        },
        cache: initialState.cache,
        searchHistory: [],
        recentQueries: []
      };
      
    case ActionTypes.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
      
    case ActionTypes.SET_TRANSLATIONS:
      return {
        ...state,
        translations: {
          ...state.translations,
          [action.payload.language]: action.payload.translations
        }
      };
      
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
      
    case ActionTypes.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      };
      
    case ActionTypes.ADD_FAVORITE_CROP:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          favoriteCrops: [...state.preferences.favoriteCrops, action.payload]
        }
      };
      
    case ActionTypes.REMOVE_FAVORITE_CROP:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          favoriteCrops: state.preferences.favoriteCrops.filter(
            crop => crop !== action.payload
          )
        }
      };
      
    case ActionTypes.ADD_SEARCH_QUERY:
      return {
        ...state,
        searchHistory: [
          action.payload,
          ...state.searchHistory.filter(query => query !== action.payload)
        ].slice(0, 10), // Keep only last 10 searches
        recentQueries: [
          action.payload,
          ...state.recentQueries.filter(query => query !== action.payload)
        ].slice(0, 5) // Keep only last 5 recent queries
      };
      
    case ActionTypes.CLEAR_SEARCH_HISTORY:
      return {
        ...state,
        searchHistory: [],
        recentQueries: []
      };
      
    case ActionTypes.UPDATE_CACHE:
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.payload.type]: {
            ...state.cache[action.payload.type],
            [action.payload.key]: {
              data: action.payload.data,
              timestamp: Date.now(),
              expiry: action.payload.expiry || 5 * 60 * 1000 // Default 5 minutes
            }
          }
        }
      };
      
    case ActionTypes.CLEAR_CACHE:
      return {
        ...state,
        cache: action.payload ? { ...state.cache, [action.payload]: {} } : initialState.cache
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...action.payload
          },
          ...state.notifications
        ].slice(0, 50) // Keep only last 50 notifications
      };
      
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
      
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
      
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case ActionTypes.SET_ONLINE_STATUS:
      return {
        ...state,
        isOnline: action.payload
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
    setupEventListeners();
    
    return () => {
      cleanupEventListeners();
    };
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (state.user && typeof localStorage !== 'undefined') {
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    }
  }, [state.preferences, state.user]);

  // Save language preference
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('selectedLanguage', state.language);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = state.language;
    }
  }, [state.language]);

  // Save theme preference
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('selectedTheme', state.theme);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.className = state.theme;
    }
  }, [state.theme]);

  const initializeApp = async () => {
    try {
      // Check authentication status
      const authenticated = isAuthenticated();
      
      if (authenticated) {
        const currentUser = getCurrentUser();
        dispatch({ type: ActionTypes.SET_USER, payload: currentUser });
        
        // Load user preferences
        if (typeof localStorage !== 'undefined') {
          const savedPreferences = localStorage.getItem('userPreferences');
          if (savedPreferences) {
            const preferences = JSON.parse(savedPreferences);
            dispatch({ type: ActionTypes.UPDATE_PREFERENCES, payload: preferences });
          }
        }
      } else {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
      
      // Load saved language
      if (typeof localStorage !== 'undefined') {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
          dispatch({ type: ActionTypes.SET_LANGUAGE, payload: savedLanguage });
        }
      }
      
      // Load saved theme
      if (typeof localStorage !== 'undefined') {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
          dispatch({ type: ActionTypes.SET_THEME, payload: savedTheme });
        }
      }
      
      // Load search history
      if (typeof localStorage !== 'undefined') {
        const savedSearchHistory = localStorage.getItem('searchHistory');
        if (savedSearchHistory) {
          const searchHistory = JSON.parse(savedSearchHistory);
          searchHistory.forEach(query => {
            dispatch({ type: ActionTypes.ADD_SEARCH_QUERY, payload: query });
          });
        }
      }
      
    } catch (error) {
      console.error('App initialization error:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to initialize app' });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  const setupEventListeners = () => {
    if (typeof window !== 'undefined') {
      // Online/offline status
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Before unload - save important data
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
  };

  const cleanupEventListeners = () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  };

  const handleOnline = () => {
    dispatch({ type: ActionTypes.SET_ONLINE_STATUS, payload: true });
    showNotification({
      type: 'info',
      title: 'Connection Restored',
      message: 'You are back online!'
    });
  };

  const handleOffline = () => {
    dispatch({ type: ActionTypes.SET_ONLINE_STATUS, payload: false });
    showNotification({
      type: 'warning',
      title: 'Connection Lost',
      message: 'You are offline. Some features may not work.'
    });
  };

  const handleBeforeUnload = () => {
    // Save search history
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory));
    }
  };

  // Action creators
  const setUser = (user) => {
    dispatch({ type: ActionTypes.SET_USER, payload: user });
  };

  const logout = () => {
    authLogout();
    dispatch({ type: ActionTypes.LOGOUT });
  };

  const setLanguage = async (language) => {
    dispatch({ type: ActionTypes.SET_LANGUAGE, payload: language });
    
    // Load translations if not already cached
    if (!state.translations[language]) {
      await loadTranslations(language);
    }
  };

  const loadTranslations = async (language) => {
    try {
      // Load common translations for the new language
      const commonPhrases = [
        'Hello', 'Thank you', 'Price', 'Crop', 'Disease', 'Weather',
        'Search', 'Login', 'Signup', 'Dashboard', 'Loading...'
      ];
      
      const translations = {};
      for (const phrase of commonPhrases) {
        translations[phrase] = await translateText(phrase, 'en', language);
      }
      
      dispatch({
        type: ActionTypes.SET_TRANSLATIONS,
        payload: { language, translations }
      });
    } catch (error) {
      console.error('Translation loading error:', error);
    }
  };

  const setTheme = (theme) => {
    dispatch({ type: ActionTypes.SET_THEME, payload: theme });
  };

  const updatePreferences = (preferences) => {
    dispatch({ type: ActionTypes.UPDATE_PREFERENCES, payload: preferences });
  };

  const addFavoriteCrop = (crop) => {
    if (!state.preferences.favoriteCrops.includes(crop)) {
      dispatch({ type: ActionTypes.ADD_FAVORITE_CROP, payload: crop });
    }
  };

  const removeFavoriteCrop = (crop) => {
    dispatch({ type: ActionTypes.REMOVE_FAVORITE_CROP, payload: crop });
  };

  const addSearchQuery = (query) => {
    dispatch({ type: ActionTypes.ADD_SEARCH_QUERY, payload: query });
  };

  const clearSearchHistory = () => {
    dispatch({ type: ActionTypes.CLEAR_SEARCH_HISTORY });
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('searchHistory');
    }
  };

  const updateCache = (type, key, data, expiry) => {
    dispatch({
      type: ActionTypes.UPDATE_CACHE,
      payload: { type, key, data, expiry }
    });
  };

  const getCachedData = (type, key) => {
    const cached = state.cache[type]?.[key];
    if (cached && Date.now() - cached.timestamp < cached.expiry) {
      return cached.data;
    }
    return null;
  };

  const clearCache = (type = null) => {
    dispatch({ type: ActionTypes.CLEAR_CACHE, payload: type });
  };

  const showNotification = (notification) => {
    dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });
    
    // Auto-remove notification after 5 seconds
    if (notification.autoRemove !== false) {
      setTimeout(() => {
        removeNotification(notification.id || Date.now());
      }, 5000);
    }
  };

  const removeNotification = (id) => {
    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Utility functions
  const translate = (text, targetLanguage = state.language) => {
    if (targetLanguage === 'en') return text;
    
    const translations = state.translations[targetLanguage];
    return translations?.[text] || text;
  };

  const isOnline = () => state.isOnline;

  const isFavoriteCrop = (crop) => {
    return state.preferences.favoriteCrops.includes(crop);
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    setUser,
    logout,
    setLanguage,
    setTheme,
    updatePreferences,
    addFavoriteCrop,
    removeFavoriteCrop,
    addSearchQuery,
    clearSearchHistory,
    updateCache,
    getCachedData,
    clearCache,
    showNotification,
    removeNotification,
    clearNotifications,
    setError,
    clearError,
    
    // Utilities
    translate,
    isOnline,
    isFavoriteCrop
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAuth must be used within an AppContextProvider');
  }
  
  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    setUser: context.setUser,
    logout: context.logout
  };
};

export const useLanguage = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useLanguage must be used within an AppContextProvider');
  }
  
  return {
    language: context.language,
    supportedLanguages: context.supportedLanguages,
    translations: context.translations,
    setLanguage: context.setLanguage,
    translate: context.translate
  };
};

export const useTheme = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useTheme must be used within an AppContextProvider');
  }
  
  return {
    theme: context.theme,
    setTheme: context.setTheme
  };
};

export const usePreferences = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('usePreferences must be used within an AppContextProvider');
  }
  
  return {
    preferences: context.preferences,
    updatePreferences: context.updatePreferences,
    addFavoriteCrop: context.addFavoriteCrop,
    removeFavoriteCrop: context.removeFavoriteCrop,
    isFavoriteCrop: context.isFavoriteCrop
  };
};

export const useNotifications = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useNotifications must be used within an AppContextProvider');
  }
  
  return {
    notifications: context.notifications,
    showNotification: context.showNotification,
    removeNotification: context.removeNotification,
    clearNotifications: context.clearNotifications
  };
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export default AppContext;
