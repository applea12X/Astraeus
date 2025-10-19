import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SaturnPage = ({ onNavigate, preferences }) => {
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState(null);
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
      
      // Try multiple model names - latest versions first
      const modelNames = [
        'gemini-2.5-flash'
      ];
      
      let model = null;
      let workingModelName = null;

      // Try each model
      for (const modelName of modelNames) {
        try {
          console.log(`Attempting to use model: ${modelName}`);
          model = genAI.getGenerativeModel({ model: modelName });
          workingModelName = modelName;
          console.log(`✓ Successfully initialized model: ${modelName}`);
          break;
        } catch (err) {
          console.log(`✗ Model ${modelName} failed:`, err.message);
          continue;
        }
      }

      if (!model) {
        throw new Error('No available Gemini models found. Please check your API key permissions.');
      }

      const prompt = `You are a Toyota car expert and financial advisor. Based on the following customer preferences, recommend 2-3 Toyota or Lexus vehicles that would be the best fit. Be specific and helpful.

Customer Preferences:
- Budget: ${preferences.budget}
- Vehicle Type: ${preferences.vehicleType}
- Family Size: ${preferences.familySize}
- Primary Use: ${preferences.primaryUse}
- Fuel Preference: ${preferences.fuelType}

Please provide:
1. **Top 2-3 Toyota/Lexus vehicle recommendations** with model names and years
2. **Price range** for each vehicle
3. **Key features** that match their needs
4. **Why it's a good fit** for their specific situation
5. **Pros and cons** for their use case

Format your response in a clear, structured way with headings and bullet points.`;

      console.log('Generating content with model...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Successfully generated response');
      setAiResponse(text);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      
      // Provide a more helpful error message
      let errorMessage = 'Sorry, there was an error getting recommendations. ';
      if (error.message.includes('API key')) {
        errorMessage += 'Please check your API key configuration.';
      } else if (error.message.includes('404')) {
        errorMessage += 'The AI model is not available. Please try again later.';
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

  // Results view
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

      {/* Results Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-16 h-16 text-amber-400 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-4">
              Saturn's Recommendations
            </h1>
            <p className="text-xl text-amber-200">
              Your personalized Toyota vehicle matches
            </p>
          </div>

          {/* AI Response */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-white whitespace-pre-wrap leading-relaxed">
                {aiResponse.split('\n').map((line, i) => {
                  // Bold headings
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <h3 key={i} className="text-2xl font-bold text-amber-400 mt-6 mb-3">
                        {line.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  // Bold inline text
                  if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <p key={i} className="mb-3">
                        {parts.map((part, j) => 
                          j % 2 === 1 ? <strong key={j} className="text-amber-300">{part}</strong> : part
                        )}
                      </p>
                    );
                  }
                  // Bullet points
                  if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                    return (
                      <li key={i} className="ml-6 mb-2">
                        {line.replace(/^[-•]\s*/, '')}
                      </li>
                    );
                  }
                  // Regular paragraphs
                  if (line.trim()) {
                    return <p key={i} className="mb-3">{line}</p>;
                  }
                  return <br key={i} />;
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex gap-4 justify-center">
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
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ambient glow */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
};

export default SaturnPage;

