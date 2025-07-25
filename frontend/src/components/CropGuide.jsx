import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  SunIcon,
  BeakerIcon,
  BugAntIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  SparklesIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { getCropInfo } from '../services/api';

// Mock data for fallback
const mockCropData = {
  scientificName: 'Not available',
  family: 'Not available',
  origin: 'Not available',
  producingStates: 'Not available',
  season: 'Not available',
  duration: 'Not available',
  averageYield: 'Not available',
  soilType: 'Not available',
  phRange: 'Not available',
  drainage: 'Not available',
  temperature: 'Not available',
  rainfall: 'Not available',
  humidity: 'Not available',
  diseases: [
    {
      name: 'Common Disease',
      symptoms: 'Various symptoms may occur',
      treatment: 'Consult agricultural expert'
    }
  ],
  pests: [
    {
      name: 'Common Pest',
      damage: 'May cause damage to crops',
      control: 'Use appropriate pest control methods'
    }
  ]
};

const CropGuide = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const cropCategories = [
    {
      name: 'Cereals',
      crops: ['wheat', 'rice', 'maize', 'barley', 'millet'],
      icon: '🌾',
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    },
    {
      name: 'Pulses',
      crops: ['gram', 'lentil', 'pea', 'bean', 'cowpea'],
      icon: '🫘',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      name: 'Vegetables',
      crops: ['tomato', 'onion', 'potato', 'cabbage', 'carrot'],
      icon: '🥕',
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      name: 'Fruits',
      crops: ['mango', 'apple', 'banana', 'grapes', 'orange'],
      icon: '🍎',
      color: 'bg-gradient-to-r from-red-500 to-pink-500'
    },
    {
      name: 'Cash Crops',
      crops: ['cotton', 'sugarcane', 'tobacco', 'jute', 'tea'],
      icon: '🌿',
      color: 'bg-gradient-to-r from-emerald-500 to-green-600'
    }
  ];

  const sectionTabs = [
    { id: 'overview', name: 'Overview', icon: '📋', color: 'text-blue-600' },
    { id: 'soil', name: 'Soil & Climate', icon: '🌍', color: 'text-green-600' },
    { id: 'diseases', name: 'Diseases & Pests', icon: '🐛', color: 'text-red-600' }
  ];

  useEffect(() => {
    if (selectedCrop) {
      fetchCropData(selectedCrop);
    }
  }, [selectedCrop]);

  const fetchCropData = async (crop) => {
    setLoading(true);
    try {
      const response = await getCropInfo(crop);
      setCropData(response.data || mockCropData);
    } catch (error) {
      console.error('Crop data fetch error:', error);
      setCropData(mockCropData);
    } finally {
      setLoading(false);
    }
  };

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    setActiveSection('overview');
  };

  const filteredCrops = cropCategories.map(category => ({
    ...category,
    crops: category.crops.filter(crop => 
      crop.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.crops.length > 0);

  const getCropIcon = (crop) => {
    const iconMap = {
      wheat: '🌾', rice: '🌾', maize: '🌽', barley: '🌾', millet: '🌾',
      gram: '🫘', lentil: '🫛', pea: '🫛', bean: '🫘', cowpea: '🫛',
      tomato: '🍅', onion: '🧅', potato: '🥔', cabbage: '🥬', carrot: '🥕',
      mango: '🥭', apple: '🍎', banana: '🍌', grapes: '🍇', orange: '🍊',
      cotton: '🌿', sugarcane: '🎋', tobacco: '🍃', jute: '🌿', tea: '🍃'
    };
    return iconMap[crop] || '🌱';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl mr-3 shadow-lg">
              🌱
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                फसल गाइड - Crop Guide
              </h1>
              <p className="text-sm text-gray-600">Complete Cultivation Guide</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Comprehensive farming guidance for 100+ crops with soil, climate & pest management
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          
          {/* Mobile-Optimized Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 lg:sticky lg:top-20 border border-white/20">
              
              {/* Enhanced Search */}
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm transition-all"
                />
              </div>

              {/* Compact Crop Categories */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent">
                {filteredCrops.map((category) => (
                  <div key={category.name}>
                    <div className="flex items-center mb-2">
                      <div className={`w-7 h-7 ${category.color} rounded-lg flex items-center justify-center mr-2 shadow-sm`}>
                        <span className="text-white text-xs">{category.icon}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">{category.name}</h3>
                    </div>
                    
                    <div className="space-y-1 ml-9">
                      {category.crops.map((crop) => (
                        <motion.button
                          key={crop}
                          whileHover={{ scale: 1.02, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCropSelect(crop)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                            selectedCrop === crop
                              ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 font-semibold border border-emerald-200 shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                          }`}
                        >
                          <span className="mr-2">{getCropIcon(crop)}</span>
                          {crop.charAt(0).toUpperCase() + crop.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {!selectedCrop ? (
              // Enhanced Welcome Screen
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-white/20"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl">🌱</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  फसल चुनें - Select a Crop
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
                  Choose any crop to access comprehensive cultivation guidance, soil requirements, and pest management strategies.
                </p>
                
                {/* Enhanced Popular Crops */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-emerald-600" />
                    Popular Crops
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['wheat', 'rice', 'tomato', 'cotton'].map((crop) => (
                      <motion.button
                        key={crop}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCropSelect(crop)}
                        className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:from-emerald-50 hover:to-green-50 border-2 border-gray-200 hover:border-emerald-200 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="text-2xl mb-2">{getCropIcon(crop)}</div>
                        <div className="font-semibold text-gray-900 capitalize text-sm">{crop}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              // Enhanced Crop Details
              <div className="space-y-4">
                
                {/* Compact Crop Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                        <span className="text-2xl">{getCropIcon(selectedCrop)}</span>
                      </div>
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">
                          {selectedCrop} Guide
                        </h1>
                        <p className="text-gray-600 text-sm">
                          Complete farming guidance
                        </p>
                      </div>
                    </div>
                    
                    {cropData && (
                      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-3 border border-blue-200">
                        <div className="text-xs text-gray-500">Growing Season</div>
                        <div className="font-bold text-gray-900">{cropData.season}</div>
                        <div className="text-xs text-gray-500">Duration: {cropData.duration}</div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Enhanced Section Tabs */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex overflow-x-auto">
                      {sectionTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSection(tab.id)}
                          className={`flex items-center px-4 py-4 border-b-3 font-semibold text-sm whitespace-nowrap transition-all ${
                            activeSection === tab.id
                              ? `border-emerald-500 ${tab.color} bg-white shadow-sm`
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="mr-2 text-base">{tab.icon}</span>
                          {tab.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Section Content */}
                  <div className="p-4 sm:p-6">
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-3 border-emerald-600 border-t-transparent"></div>
                            <span className="text-gray-600 font-medium">Loading crop data...</span>
                          </div>
                        </div>
                      ) : cropData && (
                        <motion.div
                          key={activeSection}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {activeSection === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                  <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-600" />
                                  Crop Information
                                </h3>
                                <div className="space-y-3">
                                  {[
                                    { label: 'Scientific Name', value: cropData?.scientificName, style: 'italic' },
                                    { label: 'Family', value: cropData?.family },
                                    { label: 'Origin', value: cropData?.origin },
                                    { label: 'Main Producing States', value: cropData?.producingStates }
                                  ].map(({ label, value, style }) => (
                                    <div key={label} className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                                      <dt className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</dt>
                                      <dd className={`text-gray-900 font-medium ${style || ''}`}>{value || 'Not available'}</dd>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                  <SparklesIcon className="h-5 w-5 mr-2 text-emerald-600" />
                                  Key Facts
                                </h3>
                                
                                {[
                                  { icon: CalendarIcon, color: 'blue', label: 'Growing Season', value: cropData?.season },
                                  { icon: ClockIcon, color: 'green', label: 'Maturity Period', value: cropData?.duration },
                                  { icon: CurrencyRupeeIcon, color: 'yellow', label: 'Average Yield', value: cropData?.averageYield }
                                ].map(({ icon: Icon, color, label, value }) => (
                                  <div key={label} className={`flex items-center p-3 bg-${color}-50 rounded-xl border border-${color}-200 shadow-sm`}>
                                    <Icon className={`h-5 w-5 text-${color}-600 mr-3 flex-shrink-0`} />
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900 text-sm">{label}</div>
                                      <div className="text-xs text-gray-600">{value || 'Not available'}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {activeSection === 'soil' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                                <div className="flex items-center mb-3">
                                  <BeakerIcon className="h-5 w-5 text-amber-600 mr-2" />
                                  <h3 className="text-lg font-bold text-gray-900">Soil Requirements</h3>
                                </div>
                                <div className="space-y-3">
                                  {[
                                    { label: 'Soil Type', value: cropData?.soilType },
                                    { label: 'pH Range', value: cropData?.phRange },
                                    { label: 'Drainage', value: cropData?.drainage }
                                  ].map(({ label, value }) => (
                                    <div key={label} className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                                      <dt className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</dt>
                                      <dd className="text-gray-900 font-medium">{value || 'Not available'}</dd>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4 border border-sky-200">
                                <div className="flex items-center mb-3">
                                  <SunIcon className="h-5 w-5 text-sky-600 mr-2" />
                                  <h3 className="text-lg font-bold text-gray-900">Climate Requirements</h3>
                                </div>
                                <div className="space-y-3">
                                  {[
                                    { label: 'Temperature', value: cropData?.temperature },
                                    { label: 'Rainfall', value: cropData?.rainfall },
                                    { label: 'Humidity', value: cropData?.humidity }
                                  ].map(({ label, value }) => (
                                    <div key={label} className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                                      <dt className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</dt>
                                      <dd className="text-gray-900 font-medium">{value || 'Not available'}</dd>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {activeSection === 'diseases' && (
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
                              <div className="flex items-center mb-4">
                                <BugAntIcon className="h-5 w-5 text-red-600 mr-2" />
                                <h3 className="text-lg font-bold text-gray-900">Common Diseases & Pests</h3>
                              </div>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                    <ShieldCheckIcon className="h-4 w-4 mr-2 text-red-600" />
                                    Major Diseases
                                  </h4>
                                  <div className="space-y-2">
                                    {cropData?.diseases && cropData.diseases.length > 0 ? (
                                      cropData.diseases.map((disease, index) => (
                                        <div key={index} className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-red-100 shadow-sm">
                                          <div className="font-semibold text-gray-900 text-sm">{disease.name}</div>
                                          <div className="text-xs text-gray-600 mt-1">{disease.symptoms}</div>
                                          <div className="text-xs text-emerald-600 mt-1 font-medium">
                                            💊 Treatment: {disease.treatment}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200">
                                        <div className="text-sm text-gray-500">No disease information available</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                    <BugAntIcon className="h-4 w-4 mr-2 text-red-600" />
                                    Common Pests
                                  </h4>
                                  <div className="space-y-2">
                                    {cropData?.pests && cropData.pests.length > 0 ? (
                                      cropData.pests.map((pest, index) => (
                                        <div key={index} className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-red-100 shadow-sm">
                                          <div className="font-semibold text-gray-900 text-sm">{pest.name}</div>
                                          <div className="text-xs text-gray-600 mt-1">{pest.damage}</div>
                                          <div className="text-xs text-emerald-600 mt-1 font-medium">
                                            🛡️ Control: {pest.control}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200">
                                        <div className="text-sm text-gray-500">No pest information available</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropGuide;
