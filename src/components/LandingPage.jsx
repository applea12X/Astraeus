import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedShaderBackground from './ui/animated-shader-background';
import SpaceshipMascot from './ui/spaceship-mascot';
import GalaxyButton from './ui/GalaxyButton';

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
          backgroundImage: 'url(https://images.pexels.com/photos/8495477/pexels-photo-8495477.jpeg)',
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
              className="mb-12 -mt-24"
            >
              <div className="flex flex-col items-center gap-6">
                {/* Toyota Logo Image */}
                <div className="bg-white rounded-[2.5rem] overflow-hidden p-200 md:p-16 shadow-2xl">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTGpPOmO3j2nk1h3x2XdI032elLVlQhBDv3A&s" 
                    alt="Logo"
                    className="w-40 h-auto drop-shadow-2xl rounded-2xl"
                  />
                </div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-5xl md:text-6xl font-bold text-white text-center drop-shadow-2xl"
                >
                  Toyota Financial
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-xl md:text-2xl text-blue-100 text-center drop-shadow-lg"
                >

                </motion.p>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-6 mb-10"
            >
              <GalaxyButton className="min-w-52">Sign In</GalaxyButton>

              <GalaxyButton className="min-w-52">Sign Up</GalaxyButton>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-blue-200 text-center max-w-2xl text-base px-10 pt-50"
            >
              <br />
              Go on a space journey to find your next Toyota car!
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

