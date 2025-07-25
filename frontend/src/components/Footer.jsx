import React from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  GlobeAltIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'बाज़ार भाव - Market Prices', href: '/prices', icon: '📈' },
      { name: 'फसल गाइड - Crop Guide', href: '/crop-guide', icon: '🌱' },
      { name: 'रोग पहचान - Disease Detection', href: '/disease-detection', icon: '🔬' },
      { name: 'AI सहायक - AI Assistant', href: '/chatbot', icon: '🤖' }
    ],
    resources: [
      { name: 'Help Center', href: '/help' },
      { name: 'Farming Tips', href: '/tips' },
      { name: 'Weather Updates', href: '/weather' },
      { name: 'Community', href: '/community' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' }
    ]
  };

  const socialLinks = [
    { name: 'WhatsApp', href: '#', icon: '💬', color: 'hover:bg-green-600' },
    { name: 'Facebook', href: '#', icon: '📘', color: 'hover:bg-blue-600' },
    { name: 'YouTube', href: '#', icon: '📺', color: 'hover:bg-red-600' },
    { name: 'Instagram', href: '#', icon: '📷', color: 'hover:bg-pink-600' }
  ];

  const stats = [
    { label: 'Active Farmers', value: '50K+', icon: '👨‍🌾' },
    { label: 'Crops Supported', value: '100+', icon: '🌾' },
    { label: 'Languages', value: '8+', icon: '🗣️' },
    { label: 'Daily Updates', value: '24/7', icon: '⏰' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 80%, #059669 0%, transparent 50%)',
        }}></div>
      </div>

      {/* Stats Section */}
      <div className="relative border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center mb-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <span className="text-white font-bold text-2xl">🌾</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  कृषि सहायक
                </h2>
                <p className="text-gray-400 text-sm">Smart Farming Companion</p>
              </div>
            </motion.div>
            
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Empowering Indian farmers with AI-powered insights, real-time market data, and comprehensive agricultural guidance in their native language.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center text-gray-300 hover:text-emerald-400 transition-colors">
                <EnvelopeIcon className="h-4 w-4 mr-3 text-emerald-400" />
                <span>support@krishisahayak.com</span>
              </div>
              <div className="flex items-center text-gray-300 hover:text-emerald-400 transition-colors">
                <PhoneIcon className="h-4 w-4 mr-3 text-emerald-400" />
                <span>1800-KRISHI (Free Helpline)</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPinIcon className="h-4 w-4 mr-3 text-emerald-400" />
                <span>Chnadigarh University, Punjab</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 bg-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center ${social.color} transition-all duration-200 border border-gray-700/50 hover:border-emerald-500/50`}
                  title={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-400 flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2" />
              Platform
            </h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="mr-2 group-hover:scale-110 transition-transform">{link.icon}</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors text-sm hover:translate-x-1 transition-transform inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors text-sm hover:translate-x-1 transition-transform inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Trust Badge */}
            <div className="mt-6 p-3 bg-emerald-900/30 rounded-xl border border-emerald-700/30">
              <div className="flex items-center mb-2">
                <ShieldCheckIcon className="h-4 w-4 text-emerald-400 mr-2" />
                <span className="text-sm font-semibold text-emerald-400">Trusted Platform</span>
              </div>
              <p className="text-xs text-gray-300">
                Verified agricultural data from government sources
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-700/50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            
            <div className="flex items-center text-sm text-gray-400">
              <span>© {currentYear} Krishi Sahayak. Made with</span>
              <HeartIcon className="h-4 w-4 mx-1 text-red-500 animate-pulse" />
              <span>for Indian Farmers</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <div className="flex items-center text-gray-400">
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                <span>8+ Indian Languages</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-gray-400 text-xs">Live Data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Government Disclaimer */}
          <div className="mt-4 pt-3 border-t border-gray-800/50">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              🏛️ This platform aggregates publicly available agricultural data and provides AI-based insights. 
              Users are advised to verify information with local agricultural authorities. 
              <span className="text-emerald-400 font-medium"> Krishi Sahayak</span> is an independent platform serving Indian farmers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
