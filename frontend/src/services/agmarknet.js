// src/services/agmarknet.js

import axios from 'axios';

// Base configuration for your backend API
// ✅ This works in React frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Commodity mapping
const commodityMapping = {
  'wheat': 'Wheat',
  'rice': 'Rice',
  'tomato': 'Tomato',
  'onion': 'Onion',
  'potato': 'Potato',
  'cotton': 'Cotton'
};

/**
 * Get market prices from your backend API
 * @param {Object} params - Parameters
 * @param {string} params.crop - Crop name
 * @param {string} params.state - State name
 */
export const getMarketPrices = async ({ crop, state }) => {
  try {
    const response = await api.get('/market/prices', {
      params: { crop, state }
    });
    return response.data;
  } catch (error) {
    console.error('Market prices fetch error:', error);
    
    // Return cached data or fallback
    return getCachedPrices(crop, state);
  }
};

/**
 * Get price trends from backend
 * @param {Object} params - Parameters
 * @param {string} params.crop - Crop name
 * @param {string} params.state - State name  
 * @param {number} params.days - Number of days
 */
export const getPriceTrends = async ({ crop, state, days = 30 }) => {
  try {
    const response = await api.get('/market/trends', {
      params: { crop, state, days }
    });
    return response.data;
  } catch (error) {
    console.error('Price trends fetch error:', error);
    return generateSyntheticTrends(crop, days);
  }
};

/**
 * Get selling recommendations from backend
 * @param {Object} params - Parameters
 * @param {string} params.crop - Crop name
 * @param {string} params.state - State name
 */
export const getOptimalSellingTime = async ({ crop, state }) => {
  try {
    const response = await api.get('/market/recommendations', {
      params: { crop, state }
    });
    return response.data;
  } catch (error) {
    console.error('Selling recommendations fetch error:', error);
    
    return {
      data: {
        recommendation: 'hold',
        confidence: 70,
        reason: 'Unable to fetch current market data',
        expectedTrend: 'uncertain',
        bestTime: 'monitor prices daily'
      }
    };
  }
};

/**
 * Get cached prices as fallback
 */
const getCachedPrices = (crop, state) => {
  try {
    const cached = localStorage.getItem(`prices_${crop}_${state}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Use cached data if less than 6 hours old
      if (Date.now() - timestamp < 6 * 60 * 60 * 1000) {
        return { data };
      }
    }
  } catch (error) {
    console.error('Cache retrieval error:', error);
  }

  // Return fallback data
  return {
    data: {
      minPrice: 1000,
      modalPrice: 1200,
      maxPrice: 1400,
      minPriceChange: 0,
      modalPriceChange: 0,
      maxPriceChange: 0,
      weeklyHigh: 1500,
      weeklyLow: 900,
      monthlyAvg: 1150,
      volatility: 10,
      markets: [
        { name: 'Local Market', price: 1200, change: 0, updatedAt: 'Data unavailable' }
      ]
    }
  };
};

/**
 * Generate synthetic trends for fallback
 */
const generateSyntheticTrends = (crop, days) => {
  const basePrice = 1200;
  const trends = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const randomChange = (Math.random() - 0.5) * 0.1;
    const seasonalFactor = Math.sin((i / days) * Math.PI * 2) * 0.05;
    const price = Math.round(basePrice * (1 + randomChange + seasonalFactor));
    
    trends.push({
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      modalPrice: price,
      minPrice: Math.round(price * 0.9),
      maxPrice: Math.round(price * 1.1)
    });
  }

  return { data: trends };
};

export default {
  getMarketPrices,
  getPriceTrends,
  getOptimalSellingTime
};
