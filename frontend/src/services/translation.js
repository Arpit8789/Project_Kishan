import api from './api';

// Translation service using Bhashini API
const BHASHINI_API_URL = process.env.REACT_APP_BHASHINI_BASE_URL || 'https://dhruva-api.bhashini.gov.in';
const BHASHINI_API_KEY = process.env.REACT_APP_BHASHINI_API_KEY;

// Language codes mapping
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', native: 'English', code: 'en' },
  hi: { name: 'Hindi', native: 'हिंदी', code: 'hi' },
  te: { name: 'Telugu', native: 'తెలుగు', code: 'te' },
  ta: { name: 'Tamil', native: 'தமிழ்', code: 'ta' },
  bn: { name: 'Bengali', native: 'বাংলা', code: 'bn' },
  gu: { name: 'Gujarati', native: 'ગુજરાતી', code: 'gu' },
  mr: { name: 'Marathi', native: 'मराठी', code: 'mr' },
  pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', code: 'pa' }
};

// Cache for translations
const translationCache = new Map();

// Generate cache key
const getCacheKey = (text, fromLang, toLang) => {
  return `${text}_${fromLang}_${toLang}`;
};

// Translate text using Bhashini API
export const translateText = async (text, fromLanguage = 'en', toLanguage = 'hi') => {
  // Return original text if same language
  if (fromLanguage === toLanguage) {
    return text;
  }
  
  const cacheKey = getCacheKey(text, fromLanguage, toLanguage);
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  try {
    // Use backend translation service
    const response = await api.post('/translation/translate', {
      text,
      source_language: fromLanguage,
      target_language: toLanguage
    });
    
    const translatedText = response.data.translated_text;
    
    // Cache the result
    translationCache.set(cacheKey, translatedText);
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    
    // Fallback to static translations for common phrases
    const fallbackTranslations = getFallbackTranslations(text, toLanguage);
    if (fallbackTranslations) {
      return fallbackTranslations;
    }
    
    // Return original text if translation fails
    return text;
  }
};

// Batch translate multiple texts
export const translateBatch = async (texts, fromLanguage = 'en', toLanguage = 'hi') => {
  if (fromLanguage === toLanguage) {
    return texts;
  }
  
  try {
    const response = await api.post('/translation/translate-batch', {
      texts,
      source_language: fromLanguage,
      target_language: toLanguage
    });
    
    return response.data.translated_texts;
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts; // Return original texts on error
  }
};

// Speech to text using Bhashini API
export const speechToText = async (audioBlob, language = 'hi') => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language', language);
    
    const response = await api.post('/translation/speech-to-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.text;
  } catch (error) {
    console.error('Speech to text error:', error);
    throw error;
  }
};

// Text to speech using Bhashini API
export const textToSpeech = async (text, language = 'hi', voice = 'female') => {
  try {
    const response = await api.post('/translation/text-to-speech', {
      text,
      language,
      voice
    });
    
    return response.data.audio_url;
  } catch (error) {
    console.error('Text to speech error:', error);
    throw error;
  }
};

// Detect language of given text
export const detectLanguage = async (text) => {
  try {
    const response = await api.post('/translation/detect-language', { text });
    return response.data.language;
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English
  }
};

// Get fallback translations for common phrases
const getFallbackTranslations = (text, language) => {
  const fallbacks = {
    hi: {
      'Hello': 'नमस्ते',
      'Thank you': 'धन्यवाद',
      'Price': 'कीमत',
      'Crop': 'फसल',
      'Disease': 'रोग',
      'Weather': 'मौसम',
      'Loading...': 'लोड हो रहा है...',
      'Search': 'खोजें',
      'Login': 'लॉग इन',
      'Signup': 'साइन अप'
    },
    te: {
      'Hello': 'నమస్కారం',
      'Thank you': 'ధన్యవాదాలు',
      'Price': 'ధర',
      'Crop': 'పంట',
      'Disease': 'వ్యాధి',
      'Weather': 'వాతావరణం'
    },
    ta: {
      'Hello': 'வணக்கம்',
      'Thank you': 'நன்றி',
      'Price': 'விலை',
      'Crop': 'பயிர்',
      'Disease': 'நோய்',
      'Weather': 'வானிலை'
    }
  };
  
  return fallbacks[language]?.[text] || null;
};

// Get language direction (RTL/LTR)
export const getLanguageDirection = (language) => {
  const rtlLanguages = ['ar', 'ur', 'fa'];
  return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
};

// Format numbers according to Indian locale
export const formatIndianNumber = (number, language = 'en') => {
  if (language === 'hi' || language === 'mr' || language === 'gu') {
    return new Intl.NumberFormat('hi-IN').format(number);
  }
  return new Intl.NumberFormat('en-IN').format(number);
};

// Format currency according to language
export const formatCurrency = (amount, language = 'en') => {
  const locale = language === 'en' ? 'en-IN' : 'hi-IN';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Transliterate text (English to regional script)
export const transliterate = async (text, targetLanguage) => {
  try {
    const response = await api.post('/translation/transliterate', {
      text,
      target_language: targetLanguage
    });
    
    return response.data.transliterated_text;
  } catch (error) {
    console.error('Transliteration error:', error);
    return text;
  }
};

export default {
  translateText,
  translateBatch,
  speechToText,
  textToSpeech,
  detectLanguage,
  formatIndianNumber,
  formatCurrency,
  transliterate,
  SUPPORTED_LANGUAGES
};
