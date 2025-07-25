import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CurrencyRupeeIcon, 
  CloudIcon, 
  CameraIcon,
  CalculatorIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';
import PriceTracker from './priceTracker';
import { useAuth } from '../context/AppContext';
import { getPrices, getWeatherData } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentPrices, setRecentPrices] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pricesResponse, weatherResponse] = await Promise.all([
        getPrices('wheat', user?.location || 'Delhi'),
        getWeatherData(user?.location || 'Delhi')
      ]);
      setRecentPrices(pricesResponse.data.slice(0, 5));
      setWeather(weatherResponse.data);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Price Tracker',
      description: 'Real-time crop prices',
      icon: CurrencyRupeeIcon,
      color: 'bg-primary-500',
      path: '/prices',
      stats: '50+ Markets'
    },
    {
      title: 'Disease Detection',
      description: 'AI-powered diagnosis',
      icon: CameraIcon,
      color: 'bg-red-500',
      path: '/disease-detection',
      stats: '95% Accuracy'
    },
    {
      title: 'Cost Calculator',
      description: 'Farming cost estimation',
      icon: CalculatorIcon,
      color: 'bg-earth-500',
      path: '/cost-calculator',
      stats: 'Per Acre/Hectare'
    },
    {
      title: 'Crop Guide',
      description: 'Complete cultivation guide',
      icon: ChartBarIcon,
      color: 'bg-primary-600',
      path: '/crop-guide',
      stats: '100+ Crops'
    },
    {
      title: 'AI Assistant',
      description: 'Voice & text support',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-sky-500',
      path: '/chatbot',
      stats: '8 Languages'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-primary-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                नमस्ते, {user?.name || 'किसान भाई'}! 🌾
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome to your farming dashboard. Get real-time insights and AI-powered assistance.
              </p>
            </div>
            {weather && (
              <div className="text-right">
                <div className="flex items-center text-sky-600 mb-1">
                  <CloudIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">{weather.location}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{weather.temperature}°C</div>
                <div className="text-sm text-gray-500">{weather.condition}</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => window.location.href = action.path}
            >
              <div className="p-6">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <div className="text-xs font-medium text-primary-600">{action.stats}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity & Price Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Prices */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Today's Prices</h2>
              <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                View All →
              </button>
            </div>
            
            <div className="space-y-4">
              {recentPrices.map((price, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-medium text-sm">
                        {price.crop.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{price.crop}</div>
                      <div className="text-sm text-gray-500">{price.market}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{price.price}/quintal</div>
                    <div className={`text-sm flex items-center ${
                      price.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {price.change >= 0 ? '+' : ''}{price.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Activity</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Price Searches Today</span>
                </div>
                <span className="font-semibold text-gray-900">12</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Disease Detections</span>
                </div>
                <span className="font-semibold text-gray-900">3</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-earth-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Cost Calculations</span>
                </div>
                <span className="font-semibold text-gray-900">5</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-sky-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Chatbot Queries</span>
                </div>
                <span className="font-semibold text-gray-900">8</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">💡</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-primary-800">Pro Tip</p>
                  <p className="text-sm text-primary-700">
                    Check weather forecasts before planning your next harvest cycle.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mini Price Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <PriceTracker isWidget={true} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
