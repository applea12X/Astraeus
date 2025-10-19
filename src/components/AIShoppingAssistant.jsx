import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  ExternalLink, 
  Sparkles, 
  X,
  Send,
  Loader2,
  Car,
  Shield,
  Calculator,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import RedAlienLogo from './ui/RedAlienLogo';

const AIShoppingAssistant = ({ selectedVehicle, financialInfo, userProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedLinks, setSuggestedLinks] = useState([]);
  const messagesEndRef = useRef(null);

  // Safety check for API key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('⚠️ VITE_GEMINI_API_KEY is not set in environment variables');
  }
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        role: 'assistant',
        content: `👋 Hi! I'm your AI Shopping Assistant. I can help you navigate to the best resources for buying your ${selectedVehicle?.name || 'Toyota'}.\n\nI can help you with:\n• Finding your car on Toyota.com\n• Getting insurance quotes\n• Finding nearby dealers\n• Calculating financing options\n• Comparing prices across sites\n\nWhat would you like to do first?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      generateSmartLinks();
    }
  }, [isOpen]);

  // Generate smart links based on user profile
  const generateSmartLinks = async () => {
    if (!selectedVehicle) return;

    const links = [
      {
        id: 'toyota-search',
        icon: <Car className="w-5 h-5" />,
        title: 'Find on Toyota.com',
        description: 'Pre-configured search with your preferences',
        color: 'from-red-600 to-red-700',
        url: generateToyotaSearchURL(),
        category: 'vehicle'
      },
      {
        id: 'insurance-quote',
        icon: <Shield className="w-5 h-5" />,
        title: 'Get Insurance Quotes',
        description: 'Compare rates from top providers',
        color: 'from-blue-600 to-blue-700',
        url: generateInsuranceURL(),
        category: 'insurance'
      },
      {
        id: 'financing-calc',
        icon: <Calculator className="w-5 h-5" />,
        title: 'Financing Calculator',
        description: 'Toyota Financial Services calculator',
        color: 'from-green-600 to-green-700',
        url: 'https://www.toyotafinancial.com/us/en/finance/calculator.html',
        category: 'finance'
      },
      {
        id: 'find-dealers',
        icon: <MapPin className="w-5 h-5" />,
        title: 'Find Nearby Dealers',
        description: 'Locate Toyota dealerships near you',
        color: 'from-purple-600 to-purple-700',
        url: generateDealerSearchURL(),
        category: 'dealers'
      },
      {
        id: 'trade-in',
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Trade-In Value',
        description: 'Get an estimate for your current vehicle',
        color: 'from-orange-600 to-orange-700',
        url: 'https://www.kbb.com/trade-in-value/',
        category: 'trade-in'
      }
    ];

    setSuggestedLinks(links);
  };

  const generateToyotaSearchURL = () => {
    if (!selectedVehicle) return 'https://www.toyota.com/search-inventory/';
    
    // Extract model name from vehicle name
    const modelMatch = selectedVehicle.name.match(/(RAV4|Camry|Highlander|Corolla|Tacoma|Tundra|4Runner|Prius|Sienna)/i);
    const model = modelMatch ? modelMatch[1] : '';
    
    const params = new URLSearchParams({
      zipCode: userProfile?.zipCode || '78701',
      model: model,
      year: selectedVehicle.year || '2024',
    });

    return `https://www.toyota.com/search-inventory/?${params.toString()}`;
  };

  const generateInsuranceURL = () => {
    // Use a meta-search like TheZebra that compares multiple insurers
    const params = new URLSearchParams({
      vehicle_year: selectedVehicle?.year || '2024',
      vehicle_make: 'Toyota',
      zip: userProfile?.zipCode || '78701'
    });
    
    return `https://www.thezebra.com/auto-insurance/?${params.toString()}`;
  };

  const generateDealerSearchURL = () => {
    const zipCode = userProfile?.zipCode || '78701';
    return `https://www.toyota.com/dealers/?zip=${zipCode}`;
  };

  // Send message to Gemini AI with streaming
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Add user message
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add placeholder for streaming response
    const streamingMessageId = Date.now();
    const streamingMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      id: streamingMessageId,
      isStreaming: true
    };
    setMessages(prev => [...prev, streamingMessage]);

    try {
      if (!genAI) {
        throw new Error('Gemini API not configured. Please set VITE_GEMINI_API_KEY.');
      }
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      // Build context-aware prompt
      const contextPrompt = `You are an AI shopping assistant helping a user buy a car. 

User's Profile:
- Selected Vehicle: ${selectedVehicle?.name || 'Toyota vehicle'}
- Budget: ${financialInfo?.annualIncome ? `$${financialInfo.annualIncome}/year income` : 'Not specified'}
- Credit Score: ${financialInfo?.creditScore || 'Not specified'}
- Vehicle Preferences: ${userProfile?.vehiclePreferences || 'Not specified'}

Your job is to:
1. Guide them to relevant external websites (Toyota.com, insurance sites, dealer sites, financing calculators)
2. Provide SPECIFIC, ACTIONABLE advice
3. Generate exact URLs when possible
4. Be concise but helpful (2-3 sentences max)

Available resources you can direct them to:
- Toyota.com for vehicle search
- Insurance quote sites (TheZebra, Progressive, Geico)
- Toyota Financial Services calculators
- Local dealer lookups
- KBB/Edmunds for trade-in values
- Credit Karma for credit score improvement

User question: "${userMessage}"

Respond conversationally and include specific next steps. If recommending a website, explain WHY they should visit it.`;

      // Stream the response
      const result = await model.generateContentStream(contextPrompt);
      let fullText = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        
        // Update the streaming message with accumulated text
        setMessages(prev => prev.map(msg => 
          msg.id === streamingMessageId 
            ? { ...msg, content: fullText }
            : msg
        ));
      }

      // Mark streaming as complete
      setMessages(prev => prev.map(msg => 
        msg.id === streamingMessageId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

      // Extract any URLs from AI response and suggest them
      extractAndSuggestLinks(fullText);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Remove streaming placeholder and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== streamingMessageId);
        return [...filtered, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or click one of the suggested links below.',
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractAndSuggestLinks = (text) => {
    // Simple URL extraction - in production, you'd use Gemini to generate structured links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex) || [];
    
    // Update suggested links if new ones found
    if (urls.length > 0) {
      const newLinks = urls.map((url, idx) => ({
        id: `extracted-${idx}`,
        icon: <ExternalLink className="w-5 h-5" />,
        title: 'Recommended Resource',
        description: url,
        color: 'from-indigo-600 to-purple-600',
        url: url,
        category: 'recommended'
      }));
      setSuggestedLinks(prev => [...newLinks, ...prev]);
    }
  };

  const handleLinkClick = (link) => {
    console.log('🔗 Opening link:', link.title, link.url);
    
    // Open in new tab
    const newWindow = window.open(link.url, '_blank', 'noopener,noreferrer');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      console.warn('⚠️ Popup blocked! Please allow popups for this site.');
      // Add message about popup blocker
      const blockedMessage = {
        role: 'assistant',
        content: `⚠️ Popup blocked! Please allow popups in your browser settings, then click the link again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, blockedMessage]);
    } else {
      console.log('✅ Link opened successfully!');
      // Add message about navigation
      const navMessage = {
        role: 'assistant',
        content: `🚀 Opening ${link.title} in a new tab! I'll be here if you need any help while browsing.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, navMessage]);
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: 'Find my car', query: 'Help me find this car on Toyota.com' },
    { label: 'Get insurance quotes', query: 'Where can I get insurance quotes?' },
    { label: 'Find dealers near me', query: 'Show me nearby Toyota dealers' },
    { label: 'Calculate payments', query: 'Help me calculate monthly payments' }
  ];

  console.log('🤖 AI Assistant Rendering:', { selectedVehicle: selectedVehicle?.name, isOpen });

  return (
    <>
      {/* Floating Red Alien Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0, rotate: -20 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          rotate: 0,
          y: [0, -10, 0]
        }}
        transition={{ 
          delay: 0.5, 
          type: 'spring',
          y: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }
        }}
        onClick={() => {
          console.log('🤖 AI Assistant clicked!');
          setIsOpen(true);
        }}
        className="fixed bottom-8 right-8 z-[9999] w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group cursor-pointer"
        style={{ 
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4), 0 0 60px rgba(239, 68, 68, 0.3)',
          backdropFilter: 'blur(10px)'
        }}
        whileHover={{ 
          scale: 1.15,
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="group-hover:scale-110 transition-transform duration-300">
          <RedAlienLogo size={64} />
        </div>
        {/* Active indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg" style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }} />
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full border-2 border-red-400/30 animate-ping" style={{
          animationDuration: '3s'
        }} />
      </motion.button>

      {/* Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-8 bottom-28 z-50 w-[480px] h-[680px] bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Shopping Assistant</h3>
                  <p className="text-xs text-gray-400">Powered by Gemini AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-white/5 text-gray-200 border border-white/10'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                      {message.isStreaming && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse" />
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && messages.every(m => !m.isStreaming) && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span className="text-sm text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />

              {/* Suggested Links */}
              {suggestedLinks.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-400 mb-3 font-semibold uppercase">Quick Actions</p>
                  <div className="space-y-2">
                    {suggestedLinks.slice(0, 4).map((link) => (
                      <button
                        key={link.id}
                        onClick={() => handleLinkClick(link)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${link.color} bg-opacity-10 border border-white/10 hover:border-white/20 transition-all group text-left`}
                      >
                        <div className={`w-10 h-10 bg-gradient-to-r ${link.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {link.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{link.title}</p>
                          <p className="text-xs text-gray-400 truncate">{link.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="pt-4">
                  <p className="text-xs text-gray-400 mb-3 font-semibold uppercase">Try asking</p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(action.query)}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 hover:text-white transition-all"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(inputMessage);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIShoppingAssistant;

