import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CameraIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  LightBulbIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { detectDisease } from '../services/api';
import { useAuth } from '../context/AppContext';

const DiseaseDetector = () => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const supportedCrops = [
    { name: 'Wheat', value: 'wheat', icon: '🌾', diseases: ['Rust', 'Blight', 'Smut'], color: 'from-yellow-500 to-orange-500' },
    { name: 'Rice', value: 'rice', icon: '🌾', diseases: ['Blast', 'Blight', 'Sheath Rot'], color: 'from-green-500 to-emerald-500' },
    { name: 'Tomato', value: 'tomato', icon: '🍅', diseases: ['Late Blight', 'Early Blight', 'Mosaic Virus'], color: 'from-red-500 to-pink-500' },
    { name: 'Cotton', value: 'cotton', icon: '🌿', diseases: ['Bollworm', 'Wilt', 'Leaf Curl'], color: 'from-emerald-500 to-green-600' }
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      videoRef.current.srcObject = stream;
      setIsUsingCamera(true);
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access denied or not available');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      setSelectedImage(file);
      setPreviewUrl(canvas.toDataURL());
      stopCamera();
    });
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsUsingCamera(false);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('userId', user?.id);

      const response = await detectDisease(formData);
      const detectionResult = response.data;
      
      setResult(detectionResult);
      
      const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        image: previewUrl,
        result: detectionResult
      };
      setDetectionHistory(prev => [historyItem, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error('Disease detection error:', error);
      setResult({
        error: 'Failed to analyze image. Please try again.',
        confidence: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'severe':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
      case 'mild':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
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
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl mr-3 shadow-lg">
              🔬
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-700 to-pink-600 bg-clip-text text-transparent">
                रोग पहचान - Disease Detection
              </h1>
              <p className="text-sm text-gray-600">AI-Powered Crop Health Analysis</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Upload crop photos for instant disease identification with expert treatment recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          
          {/* Main Upload Section */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <PhotoIcon className="h-5 w-5 mr-2 text-emerald-600" />
                Upload Crop Image
              </h2>
              
              {!previewUrl ? (
                <div>
                  {/* Enhanced Upload Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 bg-gradient-to-br from-gray-50 to-white"
                    >
                      <PhotoIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3" />
                      <span className="text-base sm:text-lg font-semibold text-gray-900">Gallery</span>
                      <span className="text-xs sm:text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startCamera}
                      className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 bg-gradient-to-br from-gray-50 to-white"
                    >
                      <CameraIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3" />
                      <span className="text-base sm:text-lg font-semibold text-gray-900">Camera</span>
                      <span className="text-xs sm:text-sm text-gray-500 mt-1">Take live photo</span>
                    </motion.button>
                  </div>

                  {/* Enhanced Supported Crops */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center mb-3">
                      <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-bold text-blue-900">Supported Crops</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {supportedCrops.map((crop) => (
                        <div key={crop.value} className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
                          <div className="text-2xl mb-1">{crop.icon}</div>
                          <div className="text-sm font-bold text-blue-900">{crop.name}</div>
                          <div className="text-xs text-blue-700">{crop.diseases.length} diseases</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Enhanced Image Preview */}
                  <div className="relative mb-4">
                    <img
                      src={previewUrl}
                      alt="Selected crop"
                      className="w-full h-48 sm:h-64 object-cover rounded-2xl border-2 border-gray-200 shadow-lg"
                    />
                    <button
                      onClick={clearSelection}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Enhanced Analyze Button */}
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    onClick={analyzeImage}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 sm:py-4 px-6 rounded-2xl font-bold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center shadow-lg"
                  >
                    {loading ? (
                      <>
                        <SparklesIcon className="animate-spin h-5 w-5 mr-2" />
                        AI Analyzing...
                      </>
                    ) : (
                      <>
                        <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                        Analyze for Diseases
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {/* Enhanced Camera Modal */}
              <AnimatePresence>
                {isUsingCamera && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 max-w-md w-full mx-4 shadow-2xl border border-white/20"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                          <CameraIcon className="h-5 w-5 mr-2 text-emerald-600" />
                          Capture Photo
                        </h3>
                        <button
                          onClick={stopCamera}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                      
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-48 sm:h-64 bg-black rounded-2xl mb-4 shadow-lg"
                      />
                      
                      <button
                        onClick={capturePhoto}
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 px-6 rounded-2xl font-bold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center shadow-lg"
                      >
                        <CameraIcon className="h-5 w-5 mr-2" />
                        Capture Photo
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.div>

            {/* Enhanced Results Section */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-emerald-600" />
                    Detection Results
                  </h3>
                  
                  {result.error ? (
                    <div className="flex items-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-red-900">Analysis Failed</div>
                        <div className="text-sm text-red-700">{result.error}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Enhanced Primary Detection */}
                      <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center">
                            {result.isHealthy ? (
                              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3 flex-shrink-0" />
                            ) : (
                              <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3 flex-shrink-0" />
                            )}
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                {result.isHealthy ? '✅ Healthy Crop' : `🦠 ${result.disease}`}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Confidence: {(result.confidence * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          
                          {!result.isHealthy && (
                            <div className={`px-3 py-1.5 rounded-full text-sm font-bold border ${getSeverityColor(result.severity)}`}>
                              {result.severity} Severity
                            </div>
                          )}
                        </div>

                        {!result.isHealthy && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                              <h5 className="font-bold text-blue-900 mb-3 flex items-center">
                                <InformationCircleIcon className="h-4 w-4 mr-2" />
                                Symptoms
                              </h5>
                              <ul className="text-sm text-blue-800 space-y-2">
                                {result.symptoms?.map((symptom, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    {symptom}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                              <h5 className="font-bold text-green-900 mb-3 flex items-center">
                                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                                Treatment
                              </h5>
                              <div className="text-sm text-green-800 space-y-2">
                                {result.treatment?.immediate && (
                                  <div className="bg-red-100 p-2 rounded-lg border border-red-200">
                                    <span className="font-bold text-red-700">🚨 Immediate: </span>
                                    <span className="text-red-700">{result.treatment.immediate}</span>
                                  </div>
                                )}
                                {result.treatment?.longTerm && (
                                  <div className="bg-green-100 p-2 rounded-lg border border-green-200">
                                    <span className="font-bold text-green-700">🌱 Long-term: </span>
                                    <span className="text-green-700">{result.treatment.longTerm}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Recommendations */}
                      {result.recommendations && (
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
                          <h5 className="font-bold text-yellow-900 mb-3 flex items-center">
                            <LightBulbIcon className="h-4 w-4 mr-2" />
                            Expert Recommendations
                          </h5>
                          <ul className="text-sm text-yellow-800 space-y-2">
                            {result.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-yellow-600 mr-2">💡</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Compact Sidebar */}
          <div className="space-y-4 order-1 lg:order-2">
            
            {/* Compact Detection History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-white/20"
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                <ClockIcon className="h-4 w-4 mr-2 text-emerald-600" />
                Recent Scans
              </h3>
              
              {detectionHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  <CameraIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs">No scans yet</p>
                  <p className="text-xs text-gray-400">Upload to see history</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {detectionHistory.map((item) => (
                    <div key={item.id} className="flex items-center p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <img
                        src={item.image}
                        alt="Detection"
                        className="w-8 h-8 object-cover rounded-lg mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {item.result.isHealthy ? '✅ Healthy' : `🦠 ${item.result.disease}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        item.result.isHealthy ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Compact Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-white/20"
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                📸 Photo Tips
              </h3>
              
              <div className="space-y-2 text-xs text-gray-700">
                {[
                  'Good natural lighting',
                  'Focus on affected areas',
                  'Avoid blurry images',
                  'Multiple angles help',
                  'Clear background'
                ].map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircleIcon className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Accuracy Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border-2 border-emerald-200 text-center"
            >
              <div className="text-2xl font-bold text-emerald-600 mb-1">95%</div>
              <div className="text-xs font-bold text-emerald-900 mb-1">AI Accuracy</div>
              <div className="text-xs text-emerald-700">
                Trained on 50,000+ validated crop images
              </div>
              <div className="mt-2 flex justify-center">
                <div className="flex items-center text-xs text-emerald-600">
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  PlantVillage Dataset
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetector;
