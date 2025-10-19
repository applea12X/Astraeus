import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

const AvatarGuide = ({ 
  message, 
  userName = 'Friend', 
  position = 'bottom-right',
  autoShow = true,
  onClose,
  persistent = false 
}) => {
  const [isVisible, setIsVisible] = useState(autoShow);
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  useEffect(() => {
    if (isVisible && message) {
      const timer = setTimeout(() => {
        setIsMessageVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, message]);

  const handleClose = () => {
    setIsMessageVisible(false);
    if (!persistent) {
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 300);
    }
  };

  const handleAvatarClick = () => {
    if (message && !isMessageVisible) {
      setIsMessageVisible(true);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'fixed bottom-6 right-6 z-50';
      case 'bottom-left':
        return 'fixed bottom-6 left-6 z-50';
      case 'top-right':
        return 'fixed top-20 right-6 z-50';
      case 'top-left':
        return 'fixed top-20 left-6 z-50';
      default:
        return 'fixed bottom-6 right-6 z-50';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={getPositionClasses()}>
      {/* Message Bubble */}
      <AnimatePresence>
        {isMessageVisible && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 max-w-sm"
          >
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
              {/* Speech bubble arrow */}
              <div className="absolute bottom-[-8px] left-8 w-4 h-4 bg-white/95 rotate-45 border-r border-b border-white/20"></div>
              
              {/* Close button */}
              {!persistent && (
                <button
                  onClick={handleClose}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </button>
              )}

              {/* Message content */}
              <div className="pr-6">
                <p className="text-gray-800 text-sm font-medium leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAvatarClick}
        className="relative cursor-pointer"
      >
        {/* Main avatar body */}
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

          {/* Sparkle effects */}
          <motion.div
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute -top-1 -left-1 w-2 h-2 text-yellow-300"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute -bottom-1 -right-1 w-2 h-2 text-yellow-300"
          >
            ✨
          </motion.div>
        </div>

        {/* Floating animation */}
        <motion.div
          animate={{
            y: [0, -4, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        />

        {/* Glow effect */}
        <div className="absolute inset-0 bg-red-400/30 rounded-full blur-lg scale-110 -z-10"></div>

        {/* Message indicator */}
        {message && !isMessageVisible && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
          >
            <MessageCircle className="w-2.5 h-2.5 text-white" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Predefined messages for different contexts
export const GUIDE_MESSAGES = {
  welcome: (name) => `Hi ${name}! 👋 Welcome to your financial journey! I'm here to guide you through each step. Let's start by exploring the planets!`,
  
  neptune: (name) => `Great job completing Neptune, ${name}! 🌊 You've entered your financial information. Ready to explore your vehicle preferences on Uranus?`,
  
  uranus: (name) => `Awesome work on Uranus, ${name}! 🪐 Now that we know your preferences, let's head to Saturn to see your personalized recommendations!`,
  
  saturn: (name) => `Perfect! ${name}, you've seen your recommendations on Saturn. 🪐 Ready to explore advanced payment options on Mars?`,
  
  mars: (name) => `Excellent progress, ${name}! 🔴 You've explored Mars payment simulations. Time to visit Jupiter for your final vehicle selection!`,
  
  jupiter: (name) => `Amazing journey, ${name}! 🪐 You're at Jupiter, the final step. Choose your perfect vehicle and complete your financial adventure!`,
  
  completed: (name) => `Congratulations, ${name}! 🎉 You've completed your entire financial journey! You're now ready to make an informed vehicle purchase decision.`,
  
  nextStep: (name, currentPlanet, nextPlanet) => `Hey ${name}! 👋 I see you're on ${currentPlanet}. When you're ready, let's continue to ${nextPlanet} for the next step of your journey!`,
  
  encouragement: (name) => `You're doing great, ${name}! 🌟 Take your time to explore each planet thoroughly. I'm here if you need any guidance!`
};

export default AvatarGuide;