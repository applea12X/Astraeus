import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedShaderBackground from './ui/animated-shader-background';
import SpaceshipMascot from './ui/spaceship-mascot';

const LandingPage = () => {
  const [showContent, setShowContent] = useState(false);

  const handleAnimationComplete = () => {
    setShowContent(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Starry Background Image */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          zIndex: 0
        }}
      />
      
      {/* Animated Shader Overlay for shooting stars effect */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1, opacity: 0.4 }}>
        <AnimatedShaderBackground />
      </div>

      {/* Spaceship Mascot Animation */}
      <SpaceshipMascot onAnimationComplete={handleAnimationComplete} />

      {/* Main Content - Fades in after spaceship animation */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="relative flex flex-col items-center justify-center h-full px-4"
            style={{ zIndex: 10 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Toyota Logo */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6"
            >
              <div className="flex flex-col items-center gap-3">
                {/* Toyota Logo Image */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                  <img 
                    src="https://www.edigitalagency.com.au/wp-content/uploads/Toyota-logo-png-large-size-vertical.png" 
                    alt="Toyota Logo"
                    className="w-40 h-auto drop-shadow-2xl m-4"
                  />
                </div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-5xl md:text-6xl font-bold text-white text-center drop-shadow-2xl"
                  style={{
                    textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(59, 130, 246, 0.5)'
                  }}
                >
                  Toyota Financial
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-xl md:text-2xl text-blue-100 text-center drop-shadow-lg"
                >
                  Your Journey Starts Here
                </motion.p>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
                style={{
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)'
                }}
              >
                Sign In
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-3 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white text-lg font-bold rounded-full shadow-2xl hover:bg-white/20 transition-all duration-300"
              >
                Sign Up
              </motion.button>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-blue-200 text-center max-w-2xl text-base px-4"
            >
              Discover personalized financing options tailored to your lifestyle. 
              Drive your dream Toyota today.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient light effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default LandingPage;

