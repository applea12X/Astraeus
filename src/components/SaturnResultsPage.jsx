import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Loader2, Car, DollarSign, Calendar, Zap, ArrowRight, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PetCompanion from './ui/PetCompanion';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateUserProgress } from '../utils/userProgress';

const SaturnPage = ({ onNavigate, preferences, financialInfo, userProfile }) => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [error, setError] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  
  // State for Firebase-loaded data
  const [loadedPreferences, setLoadedPreferences] = useState(null);
  const [loadedFinancialInfo, setLoadedFinancialInfo] = useState(null);
  const [loadedUserProfile, setLoadedUserProfile] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [savingSelection, setSavingSelection] = useState(false);
  const [savedVehicleSelection, setSavedVehicleSelection] = useState(null);

  // Local storage key for caching recommendations
  const getStorageKey = (finalPreferences, finalFinancialInfo, finalUserProfile) => {
    const user = auth.currentUser;
    if (!user) return null;
    
    // Create a simplified hash of the input data to determine if recommendations need to be regenerated
    const inputData = {
      userId: user.uid,
      preferences: finalPreferences ? {
        budget: finalPreferences.budget,
        vehicleType: finalPreferences.vehicleType,
        familySize: finalPreferences.familySize,
        primaryUse: finalPreferences.primaryUse,
        fuelType: finalPreferences.fuelType
      } : null,
      financialInfo: finalFinancialInfo ? {
        annualIncome: finalFinancialInfo.annualIncome,
        creditScore: finalFinancialInfo.creditScore,
        employmentStatus: finalFinancialInfo.employmentStatus,
        financialGoal: finalFinancialInfo.financialGoal
      } : null,
      userProfile: finalUserProfile ? {
        firstName: finalUserProfile.firstName,
        lastName: finalUserProfile.lastName
      } : null
    };
    
    // Create a more reliable hash
    try {
      const jsonString = JSON.stringify(inputData, Object.keys(inputData).sort());
      const hash = btoa(jsonString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      return `saturn_recs_${user.uid}_${hash}`;
    } catch (error) {
      console.error('Error creating storage key:', error);
      return `saturn_recs_${user.uid}_fallback`;
    }
  };

  // Save recommendations to local storage
  const saveRecommendationsToStorage = (storageKey, recommendations) => {
    try {
      console.log('💾 Saving recommendations to cache...');
      console.log('🔑 Cache key:', storageKey);
      console.log('📊 Recommendations count:', recommendations?.length || 0);
      
      const data = {
        recommendations,
        timestamp: Date.now(),
        version: '1.0'
      };
      
      const serializedData = JSON.stringify(data);
      localStorage.setItem(storageKey, serializedData);
      
      console.log('✅ Recommendations saved to local storage successfully');
      console.log('📏 Serialized data size:', serializedData.length, 'characters');
      
      // Verify the save worked
      const verification = localStorage.getItem(storageKey);
      if (verification) {
        console.log('✅ Cache save verified - data exists in localStorage');
      } else {
        console.error('❌ Cache save verification failed - data not found');
      }
    } catch (error) {
      console.error('❌ Error saving recommendations to storage:', error);
      if (error.name === 'QuotaExceededError') {
        console.error('💾 LocalStorage quota exceeded - clearing old cache entries');
        // Clear old cache entries
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('saturn_recs_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
    }
  };

  // Load recommendations from local storage
  const loadRecommendationsFromStorage = (storageKey) => {
    try {
      console.log('🔍 Checking cache with key:', storageKey);
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) {
        console.log('📭 No cached data found for key:', storageKey);
        return null;
      }
      
      console.log('📦 Found cached data, parsing...');
      const data = JSON.parse(stored);
      console.log('📊 Cached data structure:', {
        hasRecommendations: !!data.recommendations,
        recommendationsCount: data.recommendations?.length || 0,
        timestamp: data.timestamp,
        version: data.version
      });
      
      // Check if data is less than 24 hours old
      const age = Date.now() - data.timestamp;
      const isRecent = age < 24 * 60 * 60 * 1000;
      
      console.log(`⏰ Cache age: ${Math.round(age / (60 * 1000))} minutes, isRecent: ${isRecent}`);
      
      if (isRecent && data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        console.log('✅ Using cached recommendations:', data.recommendations.length, 'vehicles');
        return data.recommendations;
      } else {
        console.log('🗑️ Removing expired or invalid cache');
        localStorage.removeItem(storageKey);
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading recommendations from storage:', error);
      // Clean up corrupted cache
      try {
        localStorage.removeItem(storageKey);
      } catch (cleanupError) {
        console.error('Failed to clean up corrupted cache:', cleanupError);
      }
      return null;
    }
  };

  // Save vehicle selection and mark Saturn as completed
  const saveVehicleSelection = async (selectedVehicle) => {
    setSavingSelection(true);
    const user = auth.currentUser;
    if (!user) {
      console.error('No authenticated user found');
      setSavingSelection(false);
      return false;
    }

    try {
      console.log('💾 Saving vehicle selection and completing Saturn...');
      console.log('Selected vehicle:', selectedVehicle);

      // Update user progress - mark Saturn as completed, set current planet to Jupiter, and save selected vehicle
      await updateUserProgress(user.uid, 'saturn', {
        selectedVehicle,
        selectedAt: new Date().toISOString(),
        saturnCompletedAt: new Date().toISOString()
      });
      console.log('✅ Vehicle selection saved and Saturn marked as completed, current planet updated to Jupiter');

      return true;
    } catch (error) {
      console.error('❌ Error saving vehicle selection:', error);
      return false;
    } finally {
      setSavingSelection(false);
    }
  };

  // Load data from Firebase if not provided via props
  const loadDataFromFirebase = async () => {
    console.log('🔥 Loading data from Firebase...');
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ No authenticated user found');
      setDataLoading(false);
      return;
    }

    try {
      // Load user profile and vehicle preferences from users collection
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('📄 User document data:', userData);
        
        setLoadedUserProfile(userData);
        setLoadedPreferences(userData.vehiclePreferences);
        console.log('✅ Loaded preferences from Firebase:', userData.vehiclePreferences);
        
        // Load saved vehicle selection if exists
        if (userData.selectedVehicle) {
          setSavedVehicleSelection(userData.selectedVehicle);
          console.log('✅ Loaded saved vehicle selection from Firebase:', userData.selectedVehicle);
        }
      }

      // Load financial info from financial_profiles collection
      const financialDoc = await getDoc(doc(db, 'financial_profiles', user.uid));
      if (financialDoc.exists()) {
        const financialData = financialDoc.data();
        console.log('💰 Financial document data:', financialData);
        setLoadedFinancialInfo(financialData);
        console.log('✅ Loaded financial info from Firebase:', financialData);
      }
    } catch (error) {
      console.error('❌ Error loading data from Firebase:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    console.log('🪐 SaturnResultsPage mounted');
    console.log('📋 Checking component props:');
    console.log('  - preferences:', preferences);
    console.log('  - financialInfo:', financialInfo);
    console.log('  - userProfile:', userProfile);
    
    // Load data from Firebase if not provided via props
    loadDataFromFirebase();
  }, []);

  // Trigger AI recommendations when data is available
  useEffect(() => {
    if (dataLoading) return; // Wait for Firebase data to load
    
    const finalPreferences = preferences || loadedPreferences;
    const finalFinancialInfo = financialInfo || loadedFinancialInfo;
    const finalUserProfile = userProfile || loadedUserProfile;
    
    console.log('🎯 Final data check:');
    console.log('  - finalPreferences:', finalPreferences);
    console.log('  - finalFinancialInfo:', finalFinancialInfo);
    console.log('  - finalUserProfile:', finalUserProfile);
    
    if (finalPreferences) {
      // Try to load from cache first
      console.log('🔍 Attempting to load cached recommendations...');
      const storageKey = getStorageKey(finalPreferences, finalFinancialInfo, finalUserProfile);
      
      if (storageKey) {
        console.log('🔑 Generated cache key:', storageKey);
        const cachedRecommendations = loadRecommendationsFromStorage(storageKey);
        
        if (cachedRecommendations && cachedRecommendations.length > 0) {
          console.log('🎯 Cache hit! Using cached recommendations, skipping Gemini API call');
          setVehicles(cachedRecommendations);
          setLoading(false);
          return;
        } else {
          console.log('❌ Cache miss or empty cache, will call Gemini API');
        }
      } else {
        console.log('❌ Could not generate cache key, will call Gemini API');
      }
      
      console.log('🚀 No valid cache found, starting fresh AI recommendations...');
      getAIRecommendations(finalPreferences, finalFinancialInfo, finalUserProfile, false);
    } else {
      console.log('❌ No preferences found! User needs to complete Uranus first.');
      setError('Please complete your vehicle preferences on Uranus first.');
      setLoading(false);
    }
  }, [dataLoading, preferences, loadedPreferences, financialInfo, loadedFinancialInfo, userProfile, loadedUserProfile]);

  const getAIRecommendations = async (finalPreferences, finalFinancialInfo, finalUserProfile, isRegeneration = false) => {
    console.log('🚀 Starting Gemini AI recommendations...');
    console.log('📊 Input Data:');
    console.log('  - Preferences:', finalPreferences);
    console.log('  - Financial Info:', finalFinancialInfo);
    console.log('  - User Profile:', finalUserProfile);
    console.log('  - Is Regeneration:', isRegeneration);
    
    if (isRegeneration) {
      setRegenerating(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log('🔑 API Key status:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'Missing');
      
      if (!apiKey) {
        throw new Error('API key is not configured');
      }

      console.log('🤖 Initializing Google Generative AI...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      console.log('✅ Model initialized successfully');

      // Build comprehensive prompt with ALL data
      const prompt = `You are a Toyota car expert and financial advisor. Based on ALL the customer information below, recommend exactly 3 Toyota or Lexus vehicles that would be the best fit. Use their financial profile to suggest appropriate financing options.

**Customer Profile:**
${finalUserProfile ? `
- Name: ${finalUserProfile.firstName} ${finalUserProfile.lastName}
- Email: ${finalUserProfile.email || 'Not provided'}
- Phone: ${finalUserProfile.phone || 'Not provided'}
- Address: ${finalUserProfile.address || 'Not provided'}
- Role: ${finalUserProfile.role || 'Customer'}
` : 'Basic customer information not available'}

**Complete Financial Information:**
${finalFinancialInfo ? `
- Employment Status: ${finalFinancialInfo.employmentStatus}
- Occupation: ${finalFinancialInfo.occupation}
- Employer: ${finalFinancialInfo.employerName}
- Annual Income: $${finalFinancialInfo.annualIncome}
- Credit Score: ${finalFinancialInfo.creditScore || 'Not provided'}
- Financial Goal: ${finalFinancialInfo.financialGoal || 'Not specified'}
- Payment Frequency Preference: ${finalFinancialInfo.paymentFrequency || 'Not specified'}
` : 'Financial information not provided - use vehicle preferences for budget guidance'}

**Vehicle Preferences:**
- Budget: ${finalPreferences.budget}
- Vehicle Type: ${finalPreferences.vehicleType}
- Family Size: ${finalPreferences.familySize}
- Primary Use: ${finalPreferences.primaryUse}
- Fuel Preference: ${finalPreferences.fuelType}

**Important Considerations:**
- Consider their credit score (${finalFinancialInfo?.creditScore || 'unknown'}) when suggesting lease vs buy vs finance options
- Factor in their annual income ($${finalFinancialInfo?.annualIncome || 'unknown'}) for affordability
- Match vehicle recommendations to their employment stability (${finalFinancialInfo?.employmentStatus || 'unknown'})
- Align with their financial goal: ${finalFinancialInfo?.financialGoal || 'general vehicle purchase'}
- Consider their payment frequency preference: ${finalFinancialInfo?.paymentFrequency || 'monthly'}
- Suggest appropriate down payments based on their complete financial profile

**IMPORTANT: You MUST respond with ONLY valid JSON. No markdown, no code blocks, no extra text.**

For the imageUrl field, provide a direct link to a high-quality copyright-free image of the vehicle from Unsplash or similar free stock photo sites. Use this format:
- For Toyota vehicles: https://images.unsplash.com/photo-[relevant-toyota-image-id]
- Search Unsplash mentally for: "[YEAR] [MAKE] [MODEL] exterior"
- Provide actual working Unsplash URLs with proper photo IDs

Return a JSON array of exactly 3 vehicle recommendations with this EXACT structure:
[
  {
    "name": "2024 Toyota Camry LE",
    "year": "2024",
    "model": "Camry LE",
    "imageUrl": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    "priceNew": "$26,420 - $28,500",
    "priceUsed": "$22,000 - $25,000",
    "priceLeaseMonthly": "$299 - $349/month",
    "priceFinanceMonthly": "$450 - $520/month",
    "keyFeatures": [
      "2.5L 4-cylinder engine with 203 hp",
      "Toyota Safety Sense 3.0",
      "8-inch touchscreen with Apple CarPlay",
      "Spacious interior with 15.1 cu ft trunk"
    ],
    "whyGoodFit": "Perfect for daily commuting with excellent fuel economy (28/39 MPG). Fits your budget and provides Toyota's legendary reliability. Spacious enough for 4-5 people comfortably. Based on your ${finalFinancialInfo?.creditScore || 'financial profile'}, you qualify for competitive financing rates.",
    "pros": [
      "Excellent fuel efficiency",
      "Reliable and low maintenance costs",
      "Comfortable ride quality",
      "Strong resale value"
    ],
    "cons": [
      "Base model lacks some premium features",
      "Infotainment system could be more intuitive",
      "Rear seat space adequate but not class-leading"
    ],
    "fuelEconomy": "28 city / 39 highway MPG",
    "seating": "5 passengers",
    "category": "Sedan"
  }
]

CRITICAL: Return ONLY the JSON array. No other text before or after.`;

      console.log('📝 Prompt prepared. Length:', prompt.length, 'characters');
      console.log('🌍 Sending request to Gemini API...');
      
      const startTime = Date.now();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const endTime = Date.now();
      
      console.log(`⏱️ Gemini API response time: ${endTime - startTime}ms`);
      
      let text = response.text();
      console.log('📥 Raw AI response received:');
      console.log('  - Length:', text.length, 'characters');
      console.log('  - First 200 chars:', text.substring(0, 200));
      console.log('  - Last 200 chars:', text.substring(Math.max(0, text.length - 200)));
      console.log('  - Full response:', text);
      
      // Clean up response - remove markdown code blocks if present
      console.log('🧹 Cleaning response...');
      const originalText = text;
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      if (originalText !== text) {
        console.log('  - Removed markdown formatting');
        console.log('  - Cleaned text length:', text.length, 'characters');
      } else {
        console.log('  - No markdown formatting detected');
      }
      
      // Try to parse JSON
      console.log('🔍 Attempting to parse JSON...');
      let vehicleData;
      try {
        vehicleData = JSON.parse(text);
        console.log('✅ JSON parsed successfully!');
        console.log('  - Type:', typeof vehicleData);
        console.log('  - Is Array:', Array.isArray(vehicleData));
        console.log('  - Length:', Array.isArray(vehicleData) ? vehicleData.length : 'N/A');
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('📄 Attempted to parse:');
        console.error('  - Text:', text);
        console.error('  - Text type:', typeof text);
        console.error('  - Text length:', text.length);
        throw new Error('Failed to parse AI response as JSON. The AI might have returned invalid JSON.');
      }
      
      if (!Array.isArray(vehicleData)) {
        console.error('❌ Response validation failed: Not an array');
        console.error('  - Actual type:', typeof vehicleData);
        console.error('  - Data:', vehicleData);
        throw new Error('AI response is not an array of vehicles');
      }
      
      console.log('🎯 Vehicle data validation:');
      vehicleData.forEach((vehicle, index) => {
        console.log(`  Vehicle ${index + 1}:`, {
          name: vehicle.name,
          model: vehicle.model,
          priceNew: vehicle.priceNew,
          hasImageUrl: !!vehicle.imageUrl,
          featuresCount: vehicle.keyFeatures?.length || 0
        });
      });
      
      console.log('✅ Successfully parsed vehicles:', vehicleData.length, 'vehicles');
      setVehicles(vehicleData);
      
      // Save to local storage
      const storageKey = getStorageKey(finalPreferences, finalFinancialInfo, finalUserProfile);
      if (storageKey) {
        saveRecommendationsToStorage(storageKey, vehicleData);
      }
    } catch (error) {
      console.error('❌ Gemini API Error Details:');
      console.error('  - Error type:', error.constructor.name);
      console.error('  - Error message:', error.message);
      console.error('  - Error stack:', error.stack);
      console.error('  - Full error object:', error);
      
      // Check for network/API specific errors
      if (error.response) {
        console.error('  - HTTP Response Status:', error.response.status);
        console.error('  - HTTP Response Data:', error.response.data);
      }
      
      if (error.status) {
        console.error('  - API Status Code:', error.status);
      }
      
      // Provide a more helpful error message
      let errorMessage = 'Sorry, there was an error getting recommendations. ';
      if (error.message.includes('API key')) {
        errorMessage += 'Please check your API key configuration.';
        console.error('🔑 API Key Issue: Check environment variables');
      } else if (error.message.includes('404')) {
        errorMessage += 'The AI model is not available. Please try again later.';
        console.error('🤖 Model Availability Issue: gemini-2.5-flash may not be accessible');
      } else if (error.message.includes('JSON')) {
        errorMessage += 'The AI returned an invalid format. Please try again.';
        console.error('📄 JSON Parsing Issue: AI response format problem');
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage += 'API quota exceeded. Please try again later.';
        console.error('💰 Quota Issue: API usage limits reached');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage += 'Network connection issue. Please check your internet.';
        console.error('🌐 Network Issue: Connection problems');
      } else {
        errorMessage += error.message || 'Please try again.';
        console.error('❓ Unknown Error Type');
      }
      
      console.error('🔧 Suggested troubleshooting:');
      console.error('  1. Check API key in environment variables');
      console.error('  2. Verify internet connection');
      console.error('  3. Check Gemini API quotas and billing');
      console.error('  4. Verify model name (gemini-2.5-flash)');
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  // Function to handle regeneration
  const handleRegenerate = () => {
    const finalPreferences = preferences || loadedPreferences;
    const finalFinancialInfo = financialInfo || loadedFinancialInfo;
    const finalUserProfile = userProfile || loadedUserProfile;
    
    if (finalPreferences) {
      // Clear any cached data first
      const storageKey = getStorageKey(finalPreferences, finalFinancialInfo, finalUserProfile);
      if (storageKey) {
        localStorage.removeItem(storageKey);
        console.log('🗑️ Cleared cached recommendations');
      }
      
      getAIRecommendations(finalPreferences, finalFinancialInfo, finalUserProfile, true);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-gradient-to-b from-[#2d1810] via-[#4a2c1a] to-[#1a0f08] flex items-center justify-center">
        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
        </div>

        {/* Saturn Rings in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-96 h-96">
            {/* Planet */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-yellow-600 to-amber-900 opacity-20 blur-2xl" />
            {/* Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-40">
              <div className="absolute inset-0 border-8 border-amber-400/20 rounded-full" style={{ transform: 'rotateX(75deg)' }} />
              <div className="absolute inset-4 border-6 border-yellow-500/20 rounded-full" style={{ transform: 'rotateX(75deg)' }} />
            </div>
          </div>
        </div>

        <div className="text-center relative z-10">
          <Loader2 className="w-16 h-16 text-amber-400 animate-spin mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Saturn's AI is Analyzing...</h2>
          <p className="text-amber-200 text-lg">Finding your perfect Toyota match</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 w-screen h-screen overflow-auto bg-gradient-to-b from-[#2d1810] via-[#4a2c1a] to-[#1a0f08]"
      >
        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
        </div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onNavigate && onNavigate('saturn')}
          className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Saturn</span>
        </motion.button>

        {/* Error Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl w-full bg-red-500/10 backdrop-blur-xl rounded-3xl p-10 border border-red-400/30 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h2>
            <p className="text-red-200 text-lg mb-8">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRegenerate}
                className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => onNavigate && onNavigate('uranus-form')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl transition-all"
              >
                Change Preferences
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Vehicle Detail View
  if (selectedVehicle) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center fixed inset-0 w-screen h-screen overflow-auto bg-gradient-to-b from-[#2d1810] via-[#4a2c1a] to-[#1a0f08]"
      >
        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
        </div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setSelectedVehicle(null)}
          className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to List</span>
        </motion.button>

        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setSelectedVehicle(null)}
          className="fixed top-6 right-6 z-50 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
        >
          <X className="w-6 h-6" />
        </motion.button>

        {/* Vehicle Detail Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-8"
          >
            {/* Vehicle Hero */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
              {/* Vehicle Image */}
              <div className="mt-10 mb-10 w-full h-96 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-2xl mb-8 border border-amber-400/30 overflow-hidden">
                {selectedVehicle.imageUrl ? (
                  <img 
                    src={selectedVehicle.imageUrl} 
                    alt={selectedVehicle.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center" style={{ display: selectedVehicle.imageUrl ? 'none' : 'flex' }}>
                  <div className="text-center">
                    <Car className="w-32 h-32 text-amber-400 mx-auto mb-4" />
                    <p className="text-amber-200 text-lg">Vehicle Image</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Name */}
              <h1 className="text-5xl font-bold text-white mb-2">{selectedVehicle.name}</h1>
              <p className="text-2xl text-amber-200 mb-6">{selectedVehicle.year} {selectedVehicle.model}</p>
              
              {/* Previously Selected Indicator */}
              {savedVehicleSelection && selectedVehicle.name === savedVehicleSelection.name && (
                <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/50 text-green-300 px-4 py-2 rounded-xl mb-6">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">You previously selected this vehicle</span>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <Calendar className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">Year</p>
                  <p className="text-white font-bold text-lg">{selectedVehicle.year}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <Car className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">Type</p>
                  <p className="text-white font-bold text-lg">{selectedVehicle.category}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">Fuel Economy</p>
                  <p className="text-white font-bold text-lg">{selectedVehicle.fuelEconomy}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-white/60 text-sm">Seating</p>
                  <p className="text-white font-bold text-lg">{selectedVehicle.seating}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl p-6 border border-green-400/30">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-400" />
                    Purchase Price
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">New:</span>
                      <span className="text-white font-bold">{selectedVehicle.priceNew}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Used:</span>
                      <span className="text-white font-bold">{selectedVehicle.priceUsed}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2">
                      <span className="text-white/70">Finance:</span>
                      <span className="text-green-300 font-bold">{selectedVehicle.priceFinanceMonthly}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-2xl p-6 border border-blue-400/30">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                    Lease Options
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Monthly:</span>
                      <span className="text-white font-bold">{selectedVehicle.priceLeaseMonthly}</span>
                    </div>
                    <p className="text-sm text-white/60 mt-4">*Typical 36-month lease with $2,000 down</p>
                  </div>
                </div>
              </div>

              {/* Why It's a Good Fit */}
              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">Why This is Perfect For You</h3>
                <p className="text-white text-lg leading-relaxed">{selectedVehicle.whyGoodFit}</p>
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedVehicle.keyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-green-400 mb-4">Pros</h3>
                  <ul className="space-y-2">
                    {selectedVehicle.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-white">
                        <span className="text-green-400 text-xl">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-400 mb-4">Cons</h3>
                  <ul className="space-y-2">
                    {selectedVehicle.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-white">
                        <span className="text-orange-400 text-xl">−</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl transition-all"
              >
                View Other Vehicles
              </button>
              <button
                onClick={async () => {
                  if (savingSelection) return; // Prevent multiple clicks
                  
                  // Save vehicle selection and mark Saturn as completed
                  const saved = await saveVehicleSelection(selectedVehicle);
                  
                  if (saved) {
                    // Navigate to Jupiter Purchase Plan
                    if (onNavigate) {
                      onNavigate('jupiter-plan', { 
                        flight: { 
                          from: 'saturn', 
                          to: 'jupiter' 
                        },
                        selectedVehicle 
                      });
                    }
                  } else {
                    alert('Failed to save vehicle selection. Please try again.');
                  }
                }}
                disabled={savingSelection}
                className={`px-8 py-4 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                  savingSelection 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                }`}
              >
                {savingSelection ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Selection...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Select This Car & Continue →
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Vehicle Grid View (Default)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 w-screen h-screen overflow-auto bg-gradient-to-b from-[#2d1810] via-[#4a2c1a] to-[#1a0f08]"
    >
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => onNavigate && onNavigate('saturn')}
        className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Saturn</span>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <Sparkles className="w-16 h-16 text-amber-400 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-4">
            Your Perfect Matches
          </h1>
          <p className="text-xl text-amber-200 mb-6">
            {vehicles.length} personalized Toyota recommendations
          </p>
          
          {/* Regenerate Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleRegenerate}
            disabled={regenerating}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
              regenerating 
                ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed' 
                : 'bg-white/10 hover:bg-white/20 border-white/30 text-white hover:text-amber-300'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${regenerating ? 'animate-spin' : ''}`} />
            {regenerating ? 'Regenerating...' : 'Get New Recommendations'}
          </motion.button>
        </motion.div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group relative ${
                  savedVehicleSelection && vehicle.name === savedVehicleSelection.name
                    ? 'bg-green-500/20 border-2 border-green-400/60'
                    : 'bg-white/10 border border-white/20'
                }`}
              >
                {/* Previously Selected Badge */}
                {savedVehicleSelection && vehicle.name === savedVehicleSelection.name && (
                  <div className="absolute top-3 right-3 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Previously Selected
                  </div>
                )}
                
                {/* Vehicle Image */}
                <div className="w-full h-48 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border-b border-white/10 overflow-hidden">
                  {vehicle.imageUrl ? (
                    <img 
                      src={vehicle.imageUrl} 
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center" style={{ display: vehicle.imageUrl ? 'none' : 'flex' }}>
                    <Car className="w-20 h-20 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {vehicle.name}
                  </h3>
                  <p className="text-amber-200 mb-4">{vehicle.category} • {vehicle.year}</p>

                  {/* Price */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Buy New:</span>
                      <span className="text-white font-semibold">{vehicle.priceNew}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Lease:</span>
                      <span className="text-amber-300 font-semibold">{vehicle.priceLeaseMonthly}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:gap-4">
                    View Details
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex gap-4 justify-center"
        >
          <button
            onClick={() => onNavigate && onNavigate('uranus-form')}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl transition-all"
          >
            Refine Preferences
          </button>
          <button
            onClick={() => onNavigate && onNavigate('solar-system')}
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            Continue Journey →
          </button>
        </motion.div>
      </div>

      {/* Ambient glow */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Pet Companion */}
      <PetCompanion position="bottom-right" />
    </motion.div>
  );
};

export default SaturnPage;
