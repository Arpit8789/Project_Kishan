import React from 'react';
import { motion } from 'framer-motion';
import { 
  CpuChipIcon,
  SignalIcon,
  BeakerIcon,
  CloudIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const IoTPlaceholder = () => {
  const mockSensorData = [
    {
      id: 1,
      name: 'Soil Moisture',
      value: '45%',
      status: 'normal',
      icon: '💧',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 2,
      name: 'Temperature',
      value: '28°C',
      status: 'optimal',
      icon: '🌡️',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 3,
      name: 'Humidity',
      value: '62%',
      status: 'high',
      icon: '💨',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 4,
      name: 'Light Intensity',
      value: '850 lux',
      status: 'normal',
      icon: '☀️',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 5,
      name: 'pH Level',
      value: '6.8',
      status: 'optimal',
      icon: '⚗️',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 6,
      name: 'NPK Levels',
      value: 'N:12 P:8 K:15',
      status: 'low',
      icon: '🧪',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const upcomingFeatures = [
    {
      title: 'Smart Irrigation System',
      description: 'Automated watering based on soil moisture and weather data',
      icon: '🚿',
      timeline: 'Q2 2025'
    },
    {
      title: 'Drone Monitoring',
      description: 'Aerial crop health monitoring and pest detection',
      icon: '🚁',
      timeline: 'Q3 2025'
    },
    {
      title: 'Weather Stations',
      description: 'Hyperlocal weather monitoring and alerts',
      icon: '⛈️',
      timeline: 'Q4 2025'
    },
    {
      title: 'Livestock Tracking',
      description: 'GPS-enabled animal health and location monitoring',
      icon: '🐄',
      timeline: 'Q1 2026'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600';
      case 'normal':
        return 'text-blue-600';
      case 'high':
        return 'text-yellow-600';
      case 'low':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 text-green-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            IoT Smart Farming 🌐
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor your farm in real-time with advanced IoT sensors and automated systems
          </p>
        </motion.div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-6 mb-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">Coming Soon</h2>
          </div>
          <p className="text-lg opacity-90 mb-4">
            IoT integration is currently in development. Preview the dashboard below!
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm opacity-80">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              <span>Real-time Monitoring</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              <span>Automated Controls</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              <span>Smart Alerts</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Mock Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Sensor Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Live Sensor Data</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Demo
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mockSensorData.map((sensor, index) => (
                  <motion.div
                    key={sensor.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 ${sensor.bgColor} ${sensor.borderColor} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{sensor.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{sensor.name}</div>
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadge(sensor.status)}`}>
                            {sensor.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`text-2xl font-bold ${sensor.color} mb-2`}>
                      {sensor.value}
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          sensor.status === 'optimal' ? 'from-green-400 to-green-600' :
                          sensor.status === 'normal' ? 'from-blue-400 to-blue-600' :
                          sensor.status === 'high' ? 'from-yellow-400 to-yellow-600' :
                          'from-red-400 to-red-600'
                        }`}
                        style={{ width: `${Math.random() * 40 + 30}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Mock Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Trends (24 Hours)</h3>
              
              {/* Mock Chart Placeholder */}
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <div className="text-gray-500 font-medium">Interactive Charts</div>
                  <div className="text-sm text-gray-400 mt-1">Real-time data visualization coming soon</div>
                </div>
              </div>
            </motion.div>

            {/* Control Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Automated Controls</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🚿</span>
                      <span className="font-medium text-gray-900">Irrigation System</span>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full p-1 cursor-not-allowed opacity-50">
                      <div className="w-4 h-4 bg-white rounded-full shadow transform transition-transform"></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Auto-watering based on soil moisture</div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🌡️</span>
                      <span className="font-medium text-gray-900">Climate Control</span>
                    </div>
                    <div className="w-12 h-6 bg-green-500 rounded-full p-1 cursor-not-allowed opacity-50">
                      <div className="w-4 h-4 bg-white rounded-full shadow transform translate-x-6 transition-transform"></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Temperature & humidity regulation</div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💡</span>
                      <span className="font-medium text-gray-900">LED Grow Lights</span>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full p-1 cursor-not-allowed opacity-50">
                      <div className="w-4 h-4 bg-white rounded-full shadow transform transition-transform"></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Automated lighting control</div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🔔</span>
                      <span className="font-medium text-gray-900">Alert System</span>
                    </div>
                    <div className="w-12 h-6 bg-purple-500 rounded-full p-1 cursor-not-allowed opacity-50">
                      <div className="w-4 h-4 bg-white rounded-full shadow transform translate-x-6 transition-transform"></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Smart notifications & warnings</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Setup Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">IoT Setup Guide</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-primary-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Sensor Installation</div>
                    <div className="text-sm text-gray-600">Place sensors across your farm for optimal coverage</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-primary-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Network Setup</div>
                    <div className="text-sm text-gray-600">Connect sensors to your WiFi or cellular network</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-primary-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Dashboard Configuration</div>
                    <div className="text-sm text-gray-600">Customize alerts and automation rules</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-primary-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Start Monitoring</div>
                    <div className="text-sm text-gray-600">Begin real-time farm monitoring and control</div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                Coming Soon
              </button>
            </motion.div>

            {/* Hardware Requirements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hardware Requirements</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <CpuChipIcon className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">IoT Gateway</span>
                  </div>
                  <span className="text-sm text-gray-500">₹15,000</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <BeakerIcon className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Soil Sensors (4x)</span>
                  </div>
                  <span className="text-sm text-gray-500">₹8,000</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <CloudIcon className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Weather Station</span>
                  </div>
                  <span className="text-sm text-gray-500">₹12,000</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <SignalIcon className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Connectivity Kit</span>
                  </div>
                  <span className="text-sm text-gray-500">₹5,000</span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Total Package</span>
                    <span className="font-bold text-primary-600">₹40,000</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">One-time setup cost</div>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary-50 rounded-xl p-6 border border-primary-200"
            >
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Upcoming Features</h3>
              
              <div className="space-y-4">
                {upcomingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-2xl mr-3">{feature.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-primary-900">{feature.title}</div>
                      <div className="text-sm text-primary-700 mb-1">{feature.description}</div>
                      <div className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded-full inline-block">
                        {feature.timeline}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">IoT Benefits</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>30% water savings with smart irrigation</span>
                </div>
                <div className="flex items-center text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>25% increase in crop yield</span>
                </div>
                <div className="flex items-center text-yellow-700">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span>50% reduction in manual monitoring</span>
                </div>
                <div className="flex items-center text-purple-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span>Early disease detection & prevention</span>
                </div>
                <div className="flex items-center text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Real-time alerts for critical issues</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-center mb-4">
            <InformationCircleIcon className="h-6 w-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Interested in IoT Integration?</h3>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Join our beta program to be among the first to access IoT features when they launch.
              We'll provide early access and special pricing for beta testers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Join Beta Program
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IoTPlaceholder;
