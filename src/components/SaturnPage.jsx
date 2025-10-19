import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Loader2, Car, DollarSign, Calendar, Zap, ArrowRight, X } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SaturnPage = ({ onNavigate, preferences, financialInfo, userProfile }) => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (preferences) {
      getAIRecommendations();
    }
  }, [preferences]);

  const getAIRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key is not configured');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Build comprehensive prompt with ALL data
      const prompt = `You are a Toyota car expert and financial advisor. Based on ALL the customer information below, recommend 5-10 Toyota or Lexus vehicles that would be the best fit.

**Customer Profile:**
${userProfile ? `
- Name: ${userProfile.firstName} ${userProfile.lastName}
- Phone: ${userProfile.phone || 'Not provided'}
- Address: ${userProfile.address || 'Not provided'}
` : ''}

**Financial Information:**
${financialInfo ? `
- Employment Status: ${financialInfo.employmentStatus}
- Occupation: ${financialInfo.occupation}
- Employer: ${financialInfo.employerName}
- Annual Income: $${financialInfo.annualIncome}
` : 'Not provided - use vehicle preferences for budget guidance'}

**Vehicle Preferences:**
- Budget: ${preferences.budget}
- Vehicle Type: ${preferences.vehicleType}
- Family Size: ${preferences.familySize}
- Primary Use: ${preferences.primaryUse}
- Fuel Preference: ${preferences.fuelType}

**IMPORTANT: You MUST respond with ONLY valid JSON. No markdown, no code blocks, no extra text.**

Return a JSON array of 5-10 vehicle recommendations with this EXACT structure:
[
  {
    "name": "2024 Toyota Camry LE",
    "year": "2024",
    "model": "Camry LE",
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
    "whyGoodFit": "Perfect for daily commuting with excellent fuel economy (28/39 MPG). Fits your budget and provides Toyota's legendary reliability. Spacious enough for 4-5 people comfortably.",
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

      console.log('Sending prompt to Gemini...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      console.log('Raw AI response:', text);
      
      // Clean up response - remove markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to parse JSON
      let vehicleData;
      try {
        vehicleData = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Attempted to parse:', text);
        throw new Error('Failed to parse AI response as JSON. The AI might have returned invalid JSON.');
      }
      
      if (!Array.isArray(vehicleData)) {
        throw new Error('AI response is not an array of vehicles');
      }
      
      console.log('Successfully parsed vehicles:', vehicleData);
      setVehicles(vehicleData);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      
      // Provide a more helpful error message
      let errorMessage = 'Sorry, there was an error getting recommendations. ';
      if (error.message.includes('API key')) {
        errorMessage += 'Please check your API key configuration.';
      } else if (error.message.includes('404')) {
        errorMessage += 'The AI model is not available. Please try again later.';
      } else if (error.message.includes('JSON')) {
        errorMessage += 'The AI returned an invalid format. Please try again.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
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
          onClick={() => onNavigate && onNavigate('uranus')}
          className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Uranus</span>
        </motion.button>

        {/* Error Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl w-full bg-red-500/10 backdrop-blur-xl rounded-3xl p-10 border border-red-400/30 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h2>
            <p className="text-red-200 text-lg mb-8">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={getAIRecommendations}
                className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => onNavigate && onNavigate('uranus')}
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
              {/* Placeholder for vehicle image */}
              <div className="w-full h-96 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mb-8 border border-amber-400/30">
                <div className="text-center">
                  <Car className="w-32 h-32 text-amber-400 mx-auto mb-4" />
                  <p className="text-amber-200 text-lg">Vehicle Image Coming Soon</p>
                </div>
              </div>

              {/* Vehicle Name */}
              <h1 className="text-5xl font-bold text-white mb-2">{selectedVehicle.name}</h1>
              <p className="text-2xl text-amber-200 mb-6">{selectedVehicle.year} {selectedVehicle.model}</p>

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
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl transition-all"
              >
                View Other Vehicles
              </button>
              <button
                onClick={() => onNavigate && onNavigate('solar-system')}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold rounded-xl shadow-lg transition-all"
              >
                Continue Journey →
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
        onClick={() => onNavigate && onNavigate('uranus')}
        className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Uranus</span>
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
          <p className="text-xl text-amber-200">
            {vehicles.length} personalized Toyota recommendations
          </p>
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
                className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group"
              >
                {/* Vehicle Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center border-b border-white/10">
                  <Car className="w-20 h-20 text-amber-400 group-hover:scale-110 transition-transform" />
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
            onClick={() => onNavigate && onNavigate('uranus')}
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
    </motion.div>
  );
};

export default SaturnPage;
