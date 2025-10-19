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

/**
 * AI Shopping Assistant with RAG-like Context Awareness
 * 
 * This component provides an intelligent chatbot that has access to:
 * - Current page context (detected automatically from URL)
 * - User's financial profile (income, credit score, employment)
 * - User's vehicle preferences (budget, type, family size, etc.)
 * - Selected vehicle details
 * - Additional page-specific data (passed via pageContext prop)
 * 
 * @param {Object} selectedVehicle - Currently selected/viewed vehicle
 * @param {Object} financialInfo - User's financial profile from Neptune
 * @param {Object} userProfile - Complete user profile from Firebase
 * @param {Object} pageContext - Additional page-specific context (optional)
 * 
 * @example
 * // Basic usage:
 * <AIShoppingAssistant 
 *   selectedVehicle={selectedVehicle}
 *   financialInfo={financialInfo}
 *   userProfile={userProfile}
 * />
 * 
 * @example
 * // With additional page context:
 * <AIShoppingAssistant 
 *   selectedVehicle={selectedVehicle}
 *   financialInfo={financialInfo}
 *   userProfile={userProfile}
 *   pageContext={{
 *     allRecommendations: vehicles,
 *     totalRecommendations: vehicles.length,
 *     customData: { ... }
 *   }}
 * />
 */
const AIShoppingAssistant = ({ selectedVehicle, financialInfo, userProfile, pageContext = {} }) => {
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

  // Detect current page and extract context
  const getCurrentPageContext = () => {
    const pathname = window.location.pathname;
    const url = window.location.href;
    
    let pageName = 'Unknown';
    let pageDescription = '';
    let relevantData = {};
    
    // Extract page-specific context
    if (url.includes('saturn') || pathname.includes('saturn')) {
      pageName = 'Saturn - Vehicle Recommendations';
      pageDescription = 'This page shows AI-recommended vehicles based on your financial profile and preferences.';
      if (selectedVehicle) {
        relevantData.currentVehicle = {
          name: selectedVehicle.name,
          type: selectedVehicle.type,
          year: selectedVehicle.year,
          price: selectedVehicle.priceNew,
          fuelEconomy: selectedVehicle.fuelEconomy,
          matchScore: selectedVehicle.matchScore
        };
      }
      
      // Extract visible page headings for additional context
      try {
        const mainHeading = document.querySelector('h1, h2')?.textContent;
        if (mainHeading) relevantData.pageHeading = mainHeading;
      } catch (e) {
        // Silently fail if DOM access fails
      }
    } else if (url.includes('jupiter') || pathname.includes('jupiter')) {
      pageName = 'Jupiter - Purchase Planning';
      pageDescription = 'This page helps users create a detailed purchase plan including financing, timeline, and documents needed.';
      relevantData.stage = 'purchase_planning';
    } else if (url.includes('uranus') || pathname.includes('uranus')) {
      pageName = 'Uranus - Vehicle Preferences';
      pageDescription = 'This page collects user preferences: budget, vehicle type, family size, primary use, and fuel type.';
      relevantData.stage = 'preference_collection';
    } else if (url.includes('neptune') || pathname.includes('neptune')) {
      pageName = 'Neptune - Financial Information';
      pageDescription = 'This page collects user financial details: employment, income, credit score, and financial goals.';
      relevantData.stage = 'financial_collection';
    } else if (url.includes('mars') || pathname.includes('mars')) {
      pageName = 'Mars - Payment Simulations';
      pageDescription = 'This page provides detailed payment scenarios and financial simulations.';
      relevantData.stage = 'payment_simulation';
    } else {
      pageName = 'Landing Page';
      pageDescription = 'The main page where users start their car-buying journey through the solar system.';
    }
    
    // Merge with any additional pageContext passed from parent
    return {
      pageName,
      pageDescription,
      relevantData: {
        ...relevantData,
        ...(pageContext?.relevantData || {})
      },
      ...pageContext
    };
  };

  // Build comprehensive user context for AI
  const buildUserContext = () => {
    const pageCtx = getCurrentPageContext();
    
    return {
      // Financial Information
      financial: financialInfo ? {
        employmentStatus: financialInfo.employmentStatus,
        occupation: financialInfo.occupation,
        annualIncome: financialInfo.annualIncome,
        creditScore: financialInfo.creditScore,
        financialGoal: financialInfo.financialGoal,
        hasData: true
      } : { hasData: false },
      
      // Vehicle Preferences
      preferences: userProfile?.vehiclePreferences || {},
      
      // Current Vehicle Selection
      selectedVehicle: selectedVehicle ? {
        name: selectedVehicle.name,
        type: selectedVehicle.type,
        price: selectedVehicle.priceNew,
        year: selectedVehicle.year,
        matchScore: selectedVehicle.matchScore
      } : null,
      
      // Page Context
      currentPage: pageCtx,
      
      // User Profile
      userInfo: {
        email: userProfile?.email,
        zipCode: userProfile?.zipCode || '78701',
        journeyStarted: userProfile?.journeyStarted || false
      }
    };
  };

  // Initialize with context-aware welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const userContext = buildUserContext();
      const pageCtx = userContext.currentPage;
      
      // Build personalized welcome message
      let welcomeContent = `👋 Hi! I'm your AI Shopping Assistant.\n\n`;
      
      // Add page-specific context
      welcomeContent += `📍 You're on: **${pageCtx.pageName}**\n${pageCtx.pageDescription}\n\n`;
      
      // Add personalized context if available
      if (userContext.selectedVehicle) {
        welcomeContent += `🚗 You're looking at: **${userContext.selectedVehicle.name}**\n`;
        welcomeContent += `💰 Price: ${userContext.selectedVehicle.price}\n\n`;
      }
      
      if (userContext.financial.hasData && userContext.financial.annualIncome) {
        const monthlyBudget = Math.round(parseInt(userContext.financial.annualIncome) * 0.15 / 12);
        welcomeContent += `💵 Based on your income, your recommended monthly budget is ~$${monthlyBudget}\n\n`;
      }
      
      welcomeContent += `I can help you with:\n• Finding cars on Toyota.com\n• Getting insurance quotes\n• Finding nearby dealers\n• Financial advice specific to your situation\n• Navigating to helpful resources\n\nWhat would you like help with?`;
      
      const welcomeMessage = {
        role: 'assistant',
        content: welcomeContent,
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

      // Build comprehensive context-aware prompt using RAG approach
      const userContext = buildUserContext();
      
      // Log context for debugging (helps developers see what AI knows)
      console.log('🧠 AI Context Sent:', {
        page: userContext.currentPage.pageName,
        hasFinancialData: userContext.financial.hasData,
        hasVehicle: !!userContext.selectedVehicle,
        hasPreferences: Object.keys(userContext.preferences).length > 0
      });
      
      const contextPrompt = `You are an AI shopping assistant helping a user through their car-buying journey. You have access to their complete profile and current page context.

=== CURRENT PAGE CONTEXT ===
Page: ${userContext.currentPage.pageName}
Description: ${userContext.currentPage.pageDescription}
${userContext.currentPage.relevantData ? `Additional Context: ${JSON.stringify(userContext.currentPage.relevantData)}` : ''}

=== USER'S FINANCIAL PROFILE ===
${userContext.financial.hasData ? `
- Employment: ${userContext.financial.employmentStatus}
- Occupation: ${userContext.financial.occupation || 'Not specified'}
- Annual Income: $${userContext.financial.annualIncome}
- Credit Score: ${userContext.financial.creditScore}
- Financial Goal: ${userContext.financial.financialGoal}
- Recommended Monthly Budget: $${Math.round(parseInt(userContext.financial.annualIncome || 0) * 0.15 / 12)}
` : '- Financial information not yet provided'}

=== VEHICLE PREFERENCES ===
${Object.keys(userContext.preferences).length > 0 ? `
- Budget Range: ${userContext.preferences.budget}
- Vehicle Type: ${userContext.preferences.vehicleType}
- Family Size: ${userContext.preferences.familySize}
- Primary Use: ${userContext.preferences.primaryUse}
- Fuel Type: ${userContext.preferences.fuelType}
` : '- Preferences not yet collected'}

=== SELECTED VEHICLE ===
${userContext.selectedVehicle ? `
- Model: ${userContext.selectedVehicle.name}
- Type: ${userContext.selectedVehicle.type}
- Year: ${userContext.selectedVehicle.year}
- Price: ${userContext.selectedVehicle.price}
- Match Score: ${userContext.selectedVehicle.matchScore}%
` : '- No vehicle selected yet'}

${userContext.currentPage.allRecommendations ? `
=== ALL RECOMMENDED VEHICLES (${userContext.currentPage.totalRecommendations} total) ===
${userContext.currentPage.allRecommendations.slice(0, 5).map((v, i) => 
  `${i + 1}. ${v.name} - ${v.price} (Match: ${v.matchScore}%, ${v.fuelEconomy})`
).join('\n')}
${userContext.currentPage.totalRecommendations > 5 ? '... and more' : ''}
` : ''}

=== USER LOCATION ===
- ZIP Code: ${userContext.userInfo.zipCode}

=== YOUR ROLE ===
You are a knowledgeable car-buying advisor called "Cam" with access to the user's complete profile. Your job is to:

1. **Provide Page-Specific Help**: Give advice relevant to where they are in their journey
2. **Use Their Data**: Reference their income, credit score, preferences, and selected vehicle in your responses
3. **Guide to External Resources**: Direct them to Toyota.com, insurance sites, dealer sites, financing tools
4. **Be Specific & Actionable**: Give concrete next steps with actual URLs when possible
5. **Be Concise**: 2-4 sentences max unless they ask for detailed explanation
6. **Show You Know Them**: Reference their specific situation to build trust

Available External Resources:
- Toyota.com inventory search (pre-filled with their vehicle/ZIP)
- Insurance quotes: TheZebra, Progressive, Geico
- Toyota Financial Services calculator
- Local dealer finder
- KBB/Edmunds for trade-in values
- Credit Karma for credit building
- NerdWallet for financial advice

User's Question: "${userMessage}"

Respond conversationally, reference their specific situation, and provide actionable next steps. If recommending a website, explain WHY based on their profile.`;

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
      {/* Floating Alien Button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          y: [0, -8, 0]
        }}
        transition={{ 
          delay: 0.3, 
          type: 'spring',
          y: {
            repeat: Infinity,
            duration: 2.5,
            ease: "easeInOut"
          }
        }}
        onClick={() => {
          console.log('🤖 AI Assistant clicked!');
          setIsOpen(true);
        }}
        className="fixed bottom-6 right-6 z-[9999] cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Main avatar body - matches AvatarGuide from solar system */}
        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg flex items-center justify-center relative overflow-hidden">
          {/* Cute face */}
          <div className="relative">
            {/* Eyes */}
            <div className="flex gap-2 mb-1">
              <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
              <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
            
            {/* Mouth */}
            <div className="w-4 h-2 border-2 border-white border-t-0 rounded-b-full"></div>
          </div>

          {/* Antennae */}
          <div className="absolute -top-2 left-3">
            <div className="w-0.5 h-4 bg-red-300"></div>
            <div className="w-2 h-2 bg-white rounded-full -mt-1 ml-[-3px] shadow-sm"></div>
          </div>
          <div className="absolute -top-2 right-3">
            <div className="w-0.5 h-4 bg-red-300"></div>
            <div className="w-2 h-2 bg-white rounded-full -mt-1 ml-[-3px] shadow-sm"></div>
          </div>

          {/* Shine effect */}
          <div className="absolute top-1 left-2 w-4 h-4 bg-white/30 rounded-full blur-sm"></div>
        </div>

        {/* Notification badge */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        )}

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-red-400/20 blur-xl -z-10 scale-150"></div>
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
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-red-900/20 to-red-600/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-900 to-red-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Cam</h3>
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
                        ? 'bg-gradient-to-r from-red-900 to-red-600 text-white'
                        : 'bg-white/5 text-gray-200 border border-white/10'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                      {message.isStreaming && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-red-400 animate-pulse" />
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && messages.every(m => !m.isStreaming) && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
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
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="w-12 h-12 bg-gradient-to-r from-red-900 to-red-600 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all"
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

