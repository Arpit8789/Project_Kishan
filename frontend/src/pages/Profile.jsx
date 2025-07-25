import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CogIcon,
  HeartIcon,
  ChartBarIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AppContext';
import { updateProfile, getUserActivity, getUserFavorites } from '../services/api';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    farmSize: user?.farmSize || '',
    primaryCrops: user?.primaryCrops || []
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'activity', name: 'Activity', icon: ChartBarIcon },
    { id: 'favorites', name: 'Favorites', icon: HeartIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon }
  ];

  const states = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telugu',
    'Uttar Pradesh', 'West Bengal'
  ];

  const cropOptions = [
    'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Bajra', 'Jowar',
    'Barley', 'Gram', 'Arhar', 'Moong', 'Urad', 'Mustard', 'Groundnut'
  ];

  useEffect(() => {
    if (activeTab === 'activity') {
      fetchActivity();
    } else if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab]);

  const fetchActivity = async () => {
    try {
      const response = await getUserActivity();
      setActivity(response.data);
    } catch (error) {
      console.error('Activity fetch error:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await getUserFavorites();
      setFavorites(response.data);
    } catch (error) {
      console.error('Favorites fetch error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await updateProfile(formData);
      setUser(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      farmSize: user?.farmSize || '',
      primaryCrops: user?.primaryCrops || []
    });
    setEditing(false);
  };

  const handleCropToggle = (crop) => {
    setFormData(prev => ({
      ...prev,
      primaryCrops: prev.primaryCrops.includes(crop)
        ? prev.primaryCrops.filter(c => c !== crop)
        : [...prev.primaryCrops, crop]
    }));
  };

  const renderProfile = () => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center px-4 py-2 text-primary-600 hover:text-primary-800 font-medium"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-16 w-16 text-primary-600" />
            </div>
            {editing && (
              <button className="absolute bottom-4 right-4 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                <CameraIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{user?.name}</h3>
          <p className="text-gray-600">{user?.location}</p>
          <p className="text-sm text-primary-600 mt-2">
            Member since {new Date(user?.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {editing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user?.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user?.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              {editing ? (
                <select
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select state</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900">{user?.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size</label>
              {editing ? (
                <select
                  value={formData.farmSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select farm size</option>
                  <option value="small">Small (0-2 acres)</option>
                  <option value="medium">Medium (2-10 acres)</option>
                  <option value="large">Large (10+ acres)</option>
                </select>
              ) : (
                <p className="text-gray-900 capitalize">{user?.farmSize || 'Not specified'}</p>
              )}
            </div>
          </div>

          {/* Primary Crops */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Primary Crops</label>
            {editing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cropOptions.map(crop => (
                  <label key={crop} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.primaryCrops.includes(crop)}
                      onChange={() => handleCropToggle(crop)}
                      className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{crop}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user?.primaryCrops?.length > 0 ? (
                  user.primaryCrops.map(crop => (
                    <span key={crop} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                      {crop}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No crops selected</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      
      {activity.length > 0 ? (
        <div className="space-y-4">
          {activity.map((item, index) => (
            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-primary-600 font-medium">
                  {item.type === 'price' ? '₹' : item.type === 'disease' ? '🔬' : '💬'}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(item.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h3>
          <p className="text-gray-600">Start using Krishi Sahayak to see your activity here</p>
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Crops</h2>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((crop, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{crop.name}</h3>
                <HeartIcon className="h-5 w-5 text-red-500 fill-current" />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Current Price: ₹{crop.currentPrice}/quintal</div>
                <div>Last Updated: {new Date(crop.lastUpdated).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Favorites Yet</h3>
          <p className="text-gray-600">Mark crops as favorites to quickly access them</p>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">Email Notifications</div>
            <div className="text-sm text-gray-600">Receive price alerts and updates</div>
          </div>
          <div className="w-12 h-6 bg-primary-500 rounded-full p-1">
            <div className="w-4 h-4 bg-white rounded-full shadow transform translate-x-6 transition-transform"></div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">Voice Notifications</div>
            <div className="text-sm text-gray-600">Enable voice alerts and responses</div>
          </div>
          <div className="w-12 h-6 bg-gray-300 rounded-full p-1">
            <div className="w-4 h-4 bg-white rounded-full shadow transform transition-transform"></div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">Data Sharing</div>
            <div className="text-sm text-gray-600">Help improve our AI models</div>
          </div>
          <div className="w-12 h-6 bg-primary-500 rounded-full p-1">
            <div className="w-4 h-4 bg-white rounded-full shadow transform translate-x-6 transition-transform"></div>
          </div>
        </div>

        <hr className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
          
          <button className="w-full text-left p-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            Change Password
          </button>
          
          <button className="w-full text-left p-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

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
            My Profile 👤
          </h1>
          <p className="text-xl text-gray-600">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'activity' && renderActivity()}
          {activeTab === 'favorites' && renderFavorites()}
          {activeTab === 'settings' && renderSettings()}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
