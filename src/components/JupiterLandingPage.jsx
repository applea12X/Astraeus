import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import PetCompanion from './ui/PetCompanion';

const JupiterLandingPage = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
    >
      {/* Stars Background */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            initial={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3
            }}
            animate={{
              opacity: [Math.random() * 0.7 + 0.3, Math.random() * 0.3, Math.random() * 0.7 + 0.3]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Jupiter Planet in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-96 h-96">
          {/* Planet */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-orange-400 to-red-600 opacity-30 blur-2xl" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-300 via-orange-500 to-red-700 opacity-40" />
          
          {/* Jupiter's iconic bands */}
          <div className="absolute inset-8 rounded-full border-t-8 border-orange-300/30" />
          <div className="absolute inset-12 rounded-full border-t-4 border-red-400/30" />
          <div className="absolute inset-16 rounded-full border-t-8 border-yellow-400/30" />
          
          {/* Great Red Spot */}
          <div className="absolute top-1/3 right-1/4 w-12 h-8 bg-red-500/40 rounded-full blur-sm" />
        </div>
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => onNavigate && onNavigate('solar-system')}
        className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Solar System</span>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex justify-center mb-6">
              <Sparkles className="w-20 h-20 text-amber-400 animate-pulse" />
            </div>
            <h1 className="text-6xl font-bold text-white drop-shadow-2xl mb-6">
              Welcome to Jupiter
            </h1>
            <p className="text-2xl text-amber-200 mb-8">
              The Final Frontier of Your Financial Journey
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
              You've explored your finances on Neptune, defined your preferences on Uranus, 
              and discovered your perfect Toyota matches on Saturn. Now it's time to choose 
              your financing path and complete your journey to vehicle ownership.
            </p>
          </motion.div>

          {/* Journey Summary */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6">Your Journey So Far</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-4xl">🌊</div>
                  <h3 className="text-xl font-semibold text-blue-300">Neptune</h3>
                  <p className="text-sm text-blue-200">Financial Profile Complete</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl">🪐</div>
                  <h3 className="text-xl font-semibold text-cyan-300">Uranus</h3>
                  <p className="text-sm text-cyan-200">Vehicle Preferences Set</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl">🪙</div>
                  <h3 className="text-xl font-semibold text-amber-300">Saturn</h3>
                  <p className="text-sm text-amber-200">Perfect Matches Found</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-6"
          >
            <button
              onClick={() => onNavigate && onNavigate('jupiter-payment')}
              className="relative px-12 py-6 text-2xl font-bold rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg transition-all duration-300 flex items-center gap-4 mx-auto group hover:scale-105"
            >
              <span>Choose Your Financing Path</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
              
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-xl -z-10 scale-110 opacity-60"></div>
            </button>
            
            <p className="text-blue-200 text-sm">
              Select from cash purchase, financing, or leasing options
            </p>
          </motion.div>
        </div>
      </div>

      {/* Ambient light effects */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Pet Companion */}
      <PetCompanion position="bottom-right" />
    </motion.div>
  );
};

export default JupiterLandingPage;