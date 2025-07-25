import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getPrices, getPriceHistory, getForecast } from '../services/api';
import { useAuth } from '../context/AppContext';

const PriceTracker = ({ isWidget = false }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedLocation, setSelectedLocation] = useState(user?.location || 'Delhi');
  const [currentPrices, setCurrentPrices] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');

  const popularCrops = [
    { name: 'Wheat', value: 'wheat', icon: '🌾' },
    { name: 'Rice', value: 'rice', icon: '🌾' },
    { name: 'Tomato', value: 'tomato', icon: '🍅' },
    { name: 'Onion', value: 'onion', icon: '🧅' },
    { name: 'Cotton', value: 'cotton', icon: '🌿' },
    { name: 'Sugarcane', value: 'sugarcane', icon: '🎋' },
  ];

  const locations = [
    'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'
  ];

  useEffect(() => {
    if (selectedCrop && selectedLocation) {
      fetchPriceData();
    }
  }, [selectedCrop, selectedLocation]);

  const fetchPriceData = async () => {
    setLoading(true);
    try {
      const [pricesRes, historyRes, forecastRes] = await Promise.all([
        getPrices(selectedCrop, selectedLocation),
        getPriceHistory(selectedCrop, selectedLocation),
        getForecast(selectedCrop, selectedLocation)
      ]);

      setCurrentPrices(pricesRes.data);
      setPriceHistory(historyRes.data);
      setForecast(forecastRes.data);
    } catch (error) {
      console.error('Price data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPriceChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(2);
  };

  if (isWidget) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Price Check</h3>
          <a href="/prices" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
            View Full Tracker →
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {popularCrops.map(crop => (
              <option key={crop.value} value={crop.value}>
                {crop.icon} {crop.name}
              </option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {currentPrices.length > 0 && (
          <div className="space-y-2">
            {currentPrices.slice(0, 3).map((price, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{price.market}</div>
                  <div className="text-sm text-gray-500">{price.variety}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatPrice(price.price)}/qtl</div>
                  <div className={`text-sm flex items-center ${
                    price.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {price.change >= 0 ? <ArrowTrendingUpIcon className="h-3 w-3 mr-1" /> : <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />}
                    {Math.abs(price.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real-Time Crop Prices 📈
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get accurate, up-to-date market prices from across India with AI-powered forecasts
          </p>
        </motion.div>

        {/* Search Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            {/* Crop Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Crop</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Market Location</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchPriceData}
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Get Prices'}
              </motion.button>
            </div>
          </div>

          {/* Popular Crops */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Popular Crops</label>
            <div className="flex flex-wrap gap-2">
              {popularCrops.map(crop => (
                <motion.button
                  key={crop.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCrop(crop.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCrop === crop.value
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {crop.icon} {crop.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {['current', 'history', 'forecast'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Prices
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'current' && (
            <motion.div
              key="current"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Current Prices List */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Market Prices</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Updated 5 mins ago
                  </div>
                </div>

                <div className="space-y-4">
                  {currentPrices.map((price, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">{price.market}</div>
                        <div className="text-sm text-gray-600">{price.variety}</div>
                        <div className="text-xs text-gray-500 mt-1">Quality: {price.quality}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatPrice(price.price)}
                        </div>
                        <div className="text-sm text-gray-500">per quintal</div>
                        <div className={`text-sm font-medium flex items-center mt-1 ${
                          price.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {price.change >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
                          {Math.abs(price.change)}% from yesterday
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Price Comparison Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Price Comparison</h3>
                
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentPrices}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="market" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatPrice(value), 'Price']}
                      labelFormatter={(label) => `Market: ${label}`}
                    />
                    <Bar dataKey="price" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Price History (Last 30 Days)</h3>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatPrice(value), 'Price']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#16a34a" 
                    strokeWidth={3}
                    dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {activeTab === 'forecast' && (
            <motion.div
              key="forecast"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">AI Price Forecast (Next 7 Days)</h3>
                <div className="flex items-center text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                  <ChartBarIcon className="h-4 w-4 mr-1" />
                  AI Prediction
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatPrice(value), 'Predicted Price']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predictedPrice" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">⚠️</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800">Prediction Disclaimer</p>
                    <p className="text-sm text-yellow-700">
                      These are AI-generated predictions based on historical data and market trends. 
                      Actual prices may vary due to various market factors.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PriceTracker;
