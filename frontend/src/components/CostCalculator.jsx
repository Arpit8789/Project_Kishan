import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getMarketPrices, getPriceTrends, getOptimalSellingTime } from '../services/agmarknet';
import { useAuth } from '../context/AppContext';

const MarketIntelligence = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedState, setSelectedState] = useState(user?.location || 'Delhi');
  const [marketData, setMarketData] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [sellingRecommendation, setSellingRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  // Popular crops for quick access
  const popularCrops = [
    { name: 'Wheat', value: 'wheat', icon: '🌾', season: 'Rabi' },
    { name: 'Rice', value: 'rice', icon: '🌾', season: 'Kharif' },
    { name: 'Onion', value: 'onion', icon: '🧅', season: 'Rabi' },
    { name: 'Tomato', value: 'tomato', icon: '🍅', season: 'Year Round' },
    { name: 'Potato', value: 'potato', icon: '🥔', season: 'Rabi' },
    { name: 'Cotton', value: 'cotton', icon: '🌿', season: 'Kharif' }
  ];

  // Search functionality
  const searchCropPrices = async () => {
    setLoading(true);
    try {
      // Fetch current market prices from AgMarkNet API
      const priceResponse = await getMarketPrices({
        crop: selectedCrop,
        state: selectedState
      });
      
      // Get price trends for the last 30 days
      const trendsResponse = await getPriceTrends({
        crop: selectedCrop,
        state: selectedState,
        days: 30
      });
      
      // Get optimal selling recommendation
      const recommendationResponse = await getOptimalSellingTime({
        crop: selectedCrop,
        state: selectedState
      });

      setMarketData(priceResponse.data);
      setPriceHistory(trendsResponse.data);
      setSellingRecommendation(recommendationResponse.data);
    } catch (error) {
      console.error('Market data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPriceChangeIcon = (change) => {
    if (change > 0) return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />;
    return <span className="h-4 w-4 text-gray-600">-</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl mr-3 shadow-lg">
              📈
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                बाज़ार भाव - Market Intelligence
              </h1>
              <p className="text-sm text-gray-600">Real-time crop prices & selling insights</p>
            </div>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Crop Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                {popularCrops.map(crop => (
                  <option key={crop.value} value={crop.value}>
                    {crop.icon} {crop.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                <option value="Delhi">Delhi</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                {/* Add more states */}
              </select>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2 flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={searchCropPrices}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2.5 px-6 rounded-xl font-bold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                    Search Prices
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        {marketData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Current Prices */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Price Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-700">Minimum Price</span>
                    {getPriceChangeIcon(marketData.minPriceChange)}
                  </div>
                  <div className="text-2xl font-bold text-green-800">
                    {formatCurrency(marketData.minPrice)}/quintal
                  </div>
                  <div className="text-xs text-green-600">
                    {marketData.minPriceChange > 0 ? '+' : ''}{marketData.minPriceChange}% from yesterday
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-700">Modal Price</span>
                    {getPriceChangeIcon(marketData.modalPriceChange)}
                  </div>
                  <div className="text-2xl font-bold text-blue-800">
                    {formatCurrency(marketData.modalPrice)}/quintal
                  </div>
                  <div className="text-xs text-blue-600">
                    {marketData.modalPriceChange > 0 ? '+' : ''}{marketData.modalPriceChange}% from yesterday
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-orange-700">Maximum Price</span>
                    {getPriceChangeIcon(marketData.maxPriceChange)}
                  </div>
                  <div className="text-2xl font-bold text-orange-800">
                    {formatCurrency(marketData.maxPrice)}/quintal
                  </div>
                  <div className="text-xs text-orange-600">
                    {marketData.maxPriceChange > 0 ? '+' : ''}{marketData.maxPriceChange}% from yesterday
                  </div>
                </div>
              </motion.div>

              {/* Price Trend Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-emerald-600" />
                  30-Day Price Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Price']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line type="monotone" dataKey="modalPrice" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Market Centers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-emerald-600" />
                  Top Markets in {selectedState}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-xs font-semibold text-gray-600 uppercase">
                        <th className="text-left pb-2">Market</th>
                        <th className="text-left pb-2">Price</th>
                        <th className="text-left pb-2">Change</th>
                        <th className="text-left pb-2">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {marketData.markets?.map((market, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="py-2 font-medium text-gray-900">{market.name}</td>
                          <td className="py-2 font-bold text-emerald-600">{formatCurrency(market.price)}</td>
                          <td className="py-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              market.change > 0 ? 'bg-green-100 text-green-700' : 
                              market.change < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {market.change > 0 ? '+' : ''}{market.change}%
                            </span>
                          </td>
                          <td className="py-2 text-gray-500 text-xs">{market.updatedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Selling Recommendations */}
            <div className="space-y-4">
              
              {/* Selling Recommendation */}
              {sellingRecommendation && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200"
                >
                  <h3 className="font-bold text-yellow-900 mb-3 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Selling Recommendation
                  </h3>
                  
                  <div className={`text-center p-3 rounded-xl mb-3 ${
                    sellingRecommendation.recommendation === 'sell' 
                      ? 'bg-green-100 border border-green-300' 
                      : sellingRecommendation.recommendation === 'hold'
                      ? 'bg-yellow-100 border border-yellow-300'
                      : 'bg-red-100 border border-red-300'
                  }`}>
                    <div className="text-2xl mb-1">
                      {sellingRecommendation.recommendation === 'sell' ? '✅' : 
                       sellingRecommendation.recommendation === 'hold' ? '⏳' : '⏸️'}
                    </div>
                    <div className="font-bold text-sm">
                      {sellingRecommendation.recommendation === 'sell' ? 'SELL NOW' : 
                       sellingRecommendation.recommendation === 'hold' ? 'HOLD' : 'WAIT'}
                    </div>
                    <div className="text-xs opacity-80">
                      {sellingRecommendation.confidence}% confidence
                    </div>
                  </div>

                  <div className="text-xs text-yellow-800 space-y-1">
                    <p><strong>Reason:</strong> {sellingRecommendation.reason}</p>
                    <p><strong>Expected trend:</strong> {sellingRecommendation.expectedTrend}</p>
                    <p><strong>Best time:</strong> {sellingRecommendation.bestTime}</p>
                  </div>
                </motion.div>
              )}

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-white/20"
              >
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Stats</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly High:</span>
                    <span className="font-bold text-green-600">{formatCurrency(marketData.weeklyHigh)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly Low:</span>
                    <span className="font-bold text-red-600">{formatCurrency(marketData.weeklyLow)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Avg:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(marketData.monthlyAvg)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volatility:</span>
                    <span className={`font-bold ${
                      marketData.volatility > 15 ? 'text-red-600' : 
                      marketData.volatility > 8 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {marketData.volatility}%
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Market Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200"
              >
                <h3 className="font-bold text-emerald-900 mb-3 text-sm">💡 Market Tips</h3>
                <div className="space-y-2 text-xs text-emerald-800">
                  <div className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span>Check prices daily for better timing</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span>Compare multiple markets</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span>Consider transportation costs</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span>Monitor seasonal patterns</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Popular Crops Quick Access */}
        {!marketData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 text-center"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Crops</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularCrops.map((crop) => (
                <motion.button
                  key={crop.value}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCrop(crop.value);
                    searchCropPrices();
                  }}
                  className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-emerald-200 hover:from-emerald-50 hover:to-green-50 transition-all duration-200"
                >
                  <div className="text-2xl mb-2">{crop.icon}</div>
                  <div className="font-semibold text-gray-900 text-sm">{crop.name}</div>
                  <div className="text-xs text-gray-500">{crop.season}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MarketIntelligence;
