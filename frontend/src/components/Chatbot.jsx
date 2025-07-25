import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  StopIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { getBotResponse, speechToText, textToSpeech } from '../services/api';
import { useAuth } from '../context/AppContext';

const Chatbot = () => {
  const { user, language } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const defaultSuggestions = {
    en: [
      "What is the current price of wheat?",
      "How to treat tomato blight?",
      "Best time to sow rice",
      "Calculate cost for 2 acres of cotton",
      "Weather forecast for farming",
      "Organic fertilizer recommendations"
    ],
    hi: [
      "गेहूं की वर्तमान कीमत क्या है?",
      "टमाटर के झुलसा रोग का इलाज कैसे करें?",
      "धान बोने का सबसे अच्छा समय",
      "2 एकड़ कपास की लागत की गणना करें",
      "खेती के लिए मौसम पूर्वानुमान",
      "जैविक उर्वरक की सिफारिशें"
    ]
  };

  const capabilities = [
    { icon: '💰', text: 'Real-time crop prices', color: 'bg-green-500' },
    { icon: '🔬', text: 'Disease diagnosis', color: 'bg-red-500' },
    { icon: '🌤️', text: 'Weather forecasts', color: 'bg-blue-500' },
    { icon: '📚', text: 'Farming practices', color: 'bg-purple-500' },
    { icon: '🧮', text: 'Cost calculations', color: 'bg-orange-500' },
    { icon: '🏛️', text: 'Government schemes', color: 'bg-indigo-500' }
  ];

  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      type: 'bot',
      text: getWelcomeMessage(),
      timestamp: new Date().toISOString(),
      suggestions: defaultSuggestions[language] || defaultSuggestions.en
    };
    setMessages([welcomeMessage]);
    setQuickSuggestions(defaultSuggestions[language] || defaultSuggestions.en);
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getWelcomeMessage = () => {
    const messages = {
      en: `🙏 Hello ${user?.name || 'Farmer'}! I'm your AI farming assistant.\n\nI can help you with:\n• Market prices & trends 📈\n• Disease identification 🔍\n• Weather forecasts 🌦️\n• Best practices 🌱\n• Cost calculations 💰\n\nHow can I help you today?`,
      hi: `🙏 नमस्ते ${user?.name || 'किसान भाई'}! मैं आपका AI कृषि सहायक हूं।\n\nमैं आपकी मदद कर सकता हूं:\n• बाजार की कीमतें 📈\n• रोग पहचान 🔍\n• मौसम पूर्वानुमान 🌦️\n• बेहतरीन तरीके 🌱\n• लागत गणना 💰\n\nआज मैं कैसे मदद कर सकता हूं?`
    };
    return messages[language] || messages.en;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await getBotResponse({
        query: text.trim(),
        language: language,
        userId: user?.id,
        context: {
          location: user?.location,
          previousMessages: messages.slice(-5)
        }
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.data.text,
        timestamp: new Date().toISOString(),
        suggestions: response.data.suggestions || [],
        actionButtons: response.data.actionButtons || [],
        attachments: response.data.attachments || []
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (response.data.autoSpeak && !isSpeaking) {
        speakText(response.data.text);
      }

    } catch (error) {
      console.error('Bot response error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: language === 'hi' ? 
          '❌ क्षमा करें, तकनीकी समस्या हो रही है। कृपया फिर से कोशिश करें।' :
          '❌ Sorry, I\'m experiencing technical issues. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceInput = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', language);

      const response = await speechToText(formData);
      const transcribedText = response.data.text;
      
      if (transcribedText.trim()) {
        sendMessage(transcribedText);
      }
    } catch (error) {
      console.error('Speech to text error:', error);
      alert('Voice recognition failed. Please try again.');
    }
  };

  const speakText = async (text) => {
    if (isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      const response = await textToSpeech({
        text: text,
        language: language,
        voice: language === 'hi' ? 'hi-IN-Wavenet-A' : 'en-IN-Wavenet-D'
      });
      
      const audio = new Audio(response.data.audioUrl);
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (error) {
      console.error('Text to speech error:', error);
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const MessageBubble = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex mb-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] sm:max-w-md px-4 py-3 shadow-lg ${
        message.type === 'user'
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl rounded-br-lg'
          : message.isError
          ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200 rounded-2xl rounded-bl-lg'
          : 'bg-gradient-to-r from-gray-50 to-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-lg'
      }`}>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.text}
        </div>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.attachments.map((attachment, index) => (
              <div key={index} className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                {attachment.type === 'image' && (
                  <img src={attachment.url} alt={attachment.title} className="w-full h-32 object-cover rounded-lg" />
                )}
                {attachment.type === 'link' && (
                  <a href={attachment.url} className="text-blue-600 underline text-sm font-medium hover:text-blue-700">
                    {attachment.title}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 space-y-1">
            {message.suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => sendMessage(suggestion)}
                className="block w-full text-left px-3 py-2 text-xs bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 font-medium"
              >
                💡 {suggestion}
              </button>
            ))}
          </div>
        )}

        {message.actionButtons && message.actionButtons.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actionButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => window.location.href = button.url}
                className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-semibold shadow-sm"
              >
                {button.text}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2 pt-1">
          <div className="text-xs opacity-70 flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          
          {message.type === 'bot' && !message.isError && (
            <button
              onClick={() => speakText(message.text)}
              disabled={isSpeaking}
              className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
              title="Listen to response"
            >
              <SpeakerWaveIcon className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

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
              🤖
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                AI कृषि सहायक
              </h1>
              <p className="text-sm text-gray-600">Smart Farming Assistant</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {language === 'hi' ? 'आपकी भाषा में स्मार्ट खेती गाइडेंस' : 'Smart farming guidance with voice support in your language'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          
          {/* Main Chat Interface */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                      <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Krishi AI</h3>
                      <div className="text-xs flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        {language === 'hi' ? 'ऑनलाइन • हिंदी' : 'Online • English'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden sm:flex items-center space-x-2 text-xs bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <GlobeAltIcon className="h-4 w-4" />
                    <span>{language === 'hi' ? 'बहुभाषी' : 'Multilingual'}</span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="h-[60vh] sm:h-96 overflow-y-auto p-4 bg-gradient-to-b from-gray-50/50 to-white/50 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-start mb-3"
                  >
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 rounded-2xl rounded-bl-lg border border-gray-200 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <SparklesIcon className="h-4 w-4 text-emerald-500 animate-spin" />
                        <span className="text-sm text-gray-600">
                          {language === 'hi' ? 'AI सोच रहा है...' : 'AI is thinking...'}
                        </span>
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={language === 'hi' ? 'अपना खेती का सवाल यहाँ लिखें...' : 'Ask your farming question...'}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none bg-white/90 backdrop-blur-sm text-sm transition-all"
                      rows="1"
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                      maxLength={500}
                    />
                    {inputText && (
                      <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                        {inputText.length}/500
                      </div>
                    )}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-3 rounded-xl transition-all duration-200 shadow-lg ${
                      isRecording
                        ? 'bg-red-500 text-white animate-pulse shadow-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isRecording ? <StopIcon className="h-5 w-5" /> : <MicrophoneIcon className="h-5 w-5" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage()}
                    disabled={!inputText.trim() || isTyping}
                    className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Compact Sidebar */}
          <div className="space-y-4 order-1 lg:order-2">
            
            {/* Quick Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-white/20"
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                <QuestionMarkCircleIcon className="h-4 w-4 mr-2 text-emerald-600" />
                {language === 'hi' ? 'त्वरित प्रश्न' : 'Quick Questions'}
              </h3>
              
              <div className="space-y-2">
                {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sendMessage(suggestion)}
                    className="w-full text-left p-2.5 text-xs bg-gradient-to-r from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 rounded-lg transition-all duration-200 border border-gray-200 hover:border-emerald-200 hover:shadow-sm"
                  >
                    💬 {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* AI Capabilities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-white/20"
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                <SparklesIcon className="h-4 w-4 mr-2 text-emerald-600" />
                {language === 'hi' ? 'AI क्षमताएं' : 'AI Capabilities'}
              </h3>
              
              <div className="space-y-2">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-700">
                    <div className={`w-2 h-2 ${capability.color} rounded-full mr-3`}></div>
                    <span className="text-base mr-2">{capability.icon}</span>
                    <span>{capability.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Voice Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border-2 border-emerald-200"
            >
              <h3 className="font-bold text-emerald-900 mb-3 flex items-center text-sm">
                <SpeakerWaveIcon className="h-4 w-4 mr-2" />
                {language === 'hi' ? 'वॉइस असिस्टेंट' : 'Voice Assistant'}
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-800">🎤 {language === 'hi' ? 'वॉइस इनपुट' : 'Voice Input'}</span>
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-800">🔊 {language === 'hi' ? 'टेक्स्ट-टू-स्पीच' : 'Text-to-Speech'}</span>
                  <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-800">🌐 {language === 'hi' ? 'भाषा' : 'Language'}</span>
                  <span className="text-xs text-emerald-900 font-bold">
                    {language === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
                  </span>
                </div>
              </div>

              <div className="mt-3 p-2 bg-emerald-100/50 rounded-lg">
                <div className="text-xs text-emerald-700 flex items-start">
                  <LightBulbIcon className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>
                    {language === 'hi' 
                      ? 'माइक बटन दबाकर अपनी भाषा में बोलें' 
                      : 'Press mic button & speak in your language'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
