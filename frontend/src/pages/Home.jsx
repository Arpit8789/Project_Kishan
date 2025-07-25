import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  CameraIcon,
  CalculatorIcon,
  ChatBubbleLeftRightIcon,
  CurrencyRupeeIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  SunIcon,
  CloudIcon,
  BeakerIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AppContext';

const Home = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "कृषि सहायक - Your Farming Companion",
      subtitle: "AI-powered insights for modern Indian farming",
      image: "/assets/images/hero-farmer.jpg",
      highlight: "🌱 Smart Farming Solutions"
    },
    {
      title: "Real-Time Market Intelligence",
      subtitle: "Get accurate crop prices from mandis across India",
      image: "/assets/images/hero-market.jpg",
      highlight: "📈 Market Insights"
    },
    {
      title: "AI-Powered Crop Health",
      subtitle: "Identify diseases and get treatment recommendations",
      image: "/assets/images/hero-disease.jpg",
      highlight: "🔬 Advanced AI Technology"
    }
  ];

  const features = [
    {
      icon: CurrencyRupeeIcon,
      title: "Live Price Tracking",
      description: "Real-time crop prices from major mandis with historical trends and market forecasts",
      color: "bg-gradient-to-br from-green-50 to-green-100 text-green-700 border-green-200",
      badge: "Live Data"
    },
    {
      icon: CameraIcon,
      title: "AI Disease Detection",
      description: "Upload crop photos for instant disease identification and expert treatment recommendations",
      color: "bg-gradient-to-br from-red-50 to-red-100 text-red-700 border-red-200",
      badge: "AI Powered"
    },
    {
      icon: CalculatorIcon,
      title: "Cost Calculator",
      description: "Calculate accurate farming costs per acre/hectare with detailed profit analysis",
      color: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200",
      badge: "Smart Analysis"
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Multilingual AI Assistant",
      description: "Voice-enabled chatbot support in Hindi, English, and regional Indian languages",
      color: "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 border-purple-200",
      badge: "Voice Enabled"
    },
    {
      icon: ChartBarIcon,
      title: "Crop Guidance",
      description: "Comprehensive cultivation guides with soil management and pest control strategies",
      color: "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 border-orange-200",
      badge: "Expert Tips"
    },
    {
      icon: GlobeAltIcon,
      title: "Weather Intelligence",
      description: "Hyperlocal weather forecasts with farming-specific alerts and recommendations",
      color: "bg-gradient-to-br from-sky-50 to-sky-100 text-sky-700 border-sky-200",
      badge: "Hyperlocal"
    }
  ];

  const capabilities = [
    {
      icon: SunIcon,
      title: "Weather Integration",
      description: "Real-time weather data from meteorological sources"
    },
    {
      icon: BeakerIcon,
      title: "Soil Analysis",
      description: "Advanced soil health monitoring and recommendations"
    },
    {
      icon: ShieldCheckIcon,
      title: "Crop Protection",
      description: "Early warning systems for pests and diseases"
    },
    {
      icon: CloudIcon,
      title: "Cloud Sync",
      description: "Secure data backup and multi-device access"
    }
  ];

  const testimonials = [
    {
      name: "राम सिंह",
      location: "Punjab",
      crop: "Wheat Farmer",
      quote: "इस ऐप ने मेरी खेती में बहुत मदद की है। मार्केट की जानकारी सही समय पर मिल जाती है।",
      avatar: "👨‍🌾",
      verified: true
    },
    {
      name: "सुनीता देवी",
      location: "Maharashtra", 
      crop: "Cotton Farmer",
      quote: "Disease detection feature बहुत काम का है। फसल बचाने में मदद मिली है।",
      avatar: "👩‍🌾",
      verified: true
    },
    {
      name: "करीम खान",
      location: "Uttar Pradesh",
      crop: "Sugarcane Farmer", 
      quote: "Cost calculator से खर्च का सही हिसाब रखने में मदद मिलती है।",
      avatar: "👨‍🌾",
      verified: true
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleGetStarted = () => {
    if (user) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/auth';
    }
  };

  const handleAuthRedirect = () => {
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-emerald-900/80 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ 
            backgroundImage: `url('${heroSlides[currentSlide].image}')`,
            backgroundAttachment: 'fixed'
          }}
        ></div>
        
        <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-12">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent"
            >
              {heroSlides[currentSlide].title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg md:text-2xl mb-6 text-green-100"
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6"
            >
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center shadow-xl"
              >
                {user ? 'Go to Dashboard' : 'शुरू करें - Start Free'}
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
              
              <button className="border-2 border-white/80 text-white hover:bg-white hover:text-green-800 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm">
                Demo देखें
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="inline-flex items-center bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2 text-green-100"
            >
              <span className="text-xl mr-2">🌟</span>
              {heroSlides[currentSlide].highlight}
            </motion.div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Capabilities Banner */}
      <section className="py-8 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {capabilities.map((capability, index) => {
              const IconComponent = capability.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center text-white"
                >
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-green-100" />
                  <div className="font-semibold text-sm mb-1">{capability.title}</div>
                  <div className="text-xs text-green-100 opacity-90">{capability.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              स्मार्ट खेती के लिए सब कुछ
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI-powered tools designed specifically for Indian farmers to maximize productivity and profits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`${feature.color} p-6 rounded-2xl border-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                >
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/80 text-xs font-semibold px-2 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center mr-4 backdrop-blur-sm">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed opacity-90">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              किसान समुदाय का भरोसा
            </h2>
            <p className="text-lg text-gray-600">
              Real feedback from farmers using Krishi Sahayak
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100"
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3" role="img" aria-label="Farmer avatar">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <CheckCircleIcon className="h-4 w-4 text-green-500 ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {testimonial.crop} • {testimonial.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex mb-3" role="img" aria-label="5 star rating">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 text-sm italic leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              अपनी खेती को बदलने के लिए तैयार हैं?
            </h2>
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join the smart farming revolution with AI-powered insights and real-time market intelligence
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleAuthRedirect}
                className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-xl"
              >
                अभी शुरू करें - Start Free
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
              
              <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                संपर्क करें
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-green-100 max-w-2xl mx-auto">
              <div className="flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 mr-2 text-green-300" />
                <span>बिल्कुल मुफ्त</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 mr-2 text-green-300" />
                <span>तुरंत इस्तेमाल करें</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 mr-2 text-green-300" />
                <span>24/7 सहायता</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
