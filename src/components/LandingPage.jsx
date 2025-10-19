import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedShaderBackground from '../components/ui/animated-shader-background';
import GalaxyButton from './ui/GalaxyButton';
import UserProfileDropdown from './ui/UserProfileDropdown';
import AIShoppingAssistant from './AIShoppingAssistant';
import NeptuneSpaceship from './ui/NeptuneSpaceship';

const LandingPage = ({ onSignIn, onSignUp, onNavigate, onViewProfile, user, userProfile }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSpaceship, setShowSpaceship] = useState(true);
  const [spaceshipComplete, setSpaceshipComplete] = useState(false);

  useEffect(() => {
    // Show UI elements after spaceship animation completes
    if (spaceshipComplete) {
      setTimeout(() => {
        setIsVisible(true);
      }, 300);
    }
  }, [spaceshipComplete]);

  const handleSpaceshipComplete = () => {
    setSpaceshipComplete(true);
    setTimeout(() => {
      setShowSpaceship(false);
    }, 500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated Shader Background with Shooting Stars */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <AnimatedShaderBackground />
      </div>

      {/* Spaceship Intro Animation */}
      {showSpaceship && (
        <NeptuneSpaceship
          startPosition={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
          }}
          endPosition={null}
          onAnimationComplete={handleSpaceshipComplete}
        />
      )}

      {/* User Profile Dropdown - Top Right */}
      {user && (
        <div className="fixed top-6 right-6 z-50">
          <UserProfileDropdown 
            user={user}
            userProfile={userProfile}
            onViewProfile={onViewProfile}
            onSettings={() => {}}
          />
        </div>
      )}

      {/* Main Content - Fades in after spaceship */}
      <div
        className="relative flex flex-col items-center justify-center h-full px-4"
        style={{
          zIndex: 10,
          opacity: isVisible && spaceshipComplete ? 1 : 0,
          transform: isVisible && spaceshipComplete ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 1s ease-out'
        }}
      >
            {/* Toyota Logo */}
            <div
              className="mb-12 -mt-24"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'all 0.8s ease-out 0.3s'
              }}
            >
              <div className="flex flex-col items-center gap-6">
                {/* Toyota Financial Services Logo */}
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTGpPOmO3j2nk1h3x2XdI032elLVlQhBDv3A&s"
                    alt="Toyota Financial Services Logo"
                    className="w-40 h-auto drop-shadow-2xl rounded-2xl"
                  />

                {/* Title */}
                <h1
                  className="text-5xl md:text-6xl font-bold text-white text-center drop-shadow-2xl"
                  style={{
                    opacity: 1,
                    transition: 'opacity 0.8s ease-out 0.6s'
                  }}
                >
                  Astraeus
                </h1>
                
                <p
                  className="text-xl md:text-2xl text-blue-100 text-center drop-shadow-lg"
                  style={{
                    opacity: 1,
                    transition: 'opacity 0.8s ease-out 0.8s'
                  }}
                >

                </p>
              </div>
            </div>

            {/* Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-6 mb-10"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'all 0.8s ease-out 1s'
              }}
            >
              {user ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="text-white text-2xl font-bold">
                    Welcome back, {userProfile?.firstName || user.displayName || 'Explorer'}!
                  </div>
                  <GalaxyButton onClick={onNavigate} className="min-w-52">
                    Start Journey
                  </GalaxyButton>
                </motion.div>
              ) : (
                <>
                  <GalaxyButton onClick={onSignIn} className="min-w-52">
                    Sign In
                  </GalaxyButton>

                  <GalaxyButton onClick={onSignUp} className="min-w-52">
                    Sign Up
                  </GalaxyButton>
                </>
              )}
            </div>

            {/* Tagline */}
            <p
              className="text-blue-200 text-center max-w-2xl text-base px-10 pt-4"
              style={{
                opacity: 1,
                transition: 'opacity 0.8s ease-out 1.2s'
              }}
            >
              <br />
              Go on a space journey to find your next Toyota car!
            </p>
          </div>

      {/* Ambient light effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* AI Shopping Assistant */}
      <AIShoppingAssistant 
        selectedVehicle={null}
        financialInfo={{}}
        userProfile={userProfile}
      />
    </div>
  );
};

export default LandingPage;
