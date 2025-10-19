import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Sparkles, GraduationCap } from 'lucide-react';
import MissionHub from './MissionHub';

/**
 * EducationRocket - Floating rocket icon for credit education missions
 * 
 * This component provides access to the credit education system through
 * a rocket icon positioned next to the existing AI assistant avatar.
 * The rocket "launches" when clicked to open the mission hub.
 */
const EducationRocket = ({ user, userProfile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMissionHub, setShowMissionHub] = useState(false);
  const [hasNotification, setHasNotification] = useState(true); // Show notification for new missions

  // Check if user has any progress
  const hasProgress = userProfile?.educationProgress?.completedMissions?.length > 0;

  const handleRocketClick = () => {
    setShowMissionHub(true);
    setHasNotification(false); // Clear notification when opened
  };

  return (
    <>
      {/* Floating Rocket Button */}
      <motion.button
        initial={{ scale: 0, rotate: -180, x: 100 }}
        animate={{
          scale: 1,
          rotate: 0,
          x: 0,
          y: [0, -8, 0]
        }}
        transition={{
          delay: 0.6, // Appear after AI assistant
          type: 'spring',
          stiffness: 200,
          damping: 20,
          y: {
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }
        }}
        onClick={handleRocketClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-28 z-[9998] cursor-pointer" // Positioned left of AI assistant
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Rocket body */}
        <div className="relative w-14 h-16 bg-gradient-to-b from-orange-400 to-red-600 rounded-t-full rounded-b-lg shadow-lg flex items-center justify-center">
          {/* Rocket window */}
          <div className="absolute top-2 w-6 h-6 bg-blue-200 rounded-full border-2 border-blue-300">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-300 rounded-full flex items-center justify-center">
              <GraduationCap className="w-3 h-3 text-blue-800" />
            </div>
          </div>

          {/* Rocket fins */}
          <div className="absolute bottom-0 -left-2 w-3 h-4 bg-gray-600 transform skew-x-12 rounded-bl-lg"></div>
          <div className="absolute bottom-0 -right-2 w-3 h-4 bg-gray-600 transform -skew-x-12 rounded-br-lg"></div>

          {/* Rocket flames */}
          <motion.div
            animate={{
              scaleY: [0.8, 1.2, 0.8],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-3 h-6 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-b-full"></div>
          </motion.div>
          <motion.div
            animate={{
              scaleY: [1.2, 0.8, 1.2],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-2 h-4 bg-gradient-to-b from-red-500 to-orange-500 rounded-b-full"></div>
          </motion.div>

          {/* Shine effect */}
          <div className="absolute top-1 left-1 w-3 h-4 bg-white/30 rounded-full blur-sm"></div>
        </div>

        {/* Sparkle effects on hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 40],
                    y: [0, (Math.random() - 0.5) * 40],
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Notification badge */}
        {hasNotification && !hasProgress && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
          >
            <span className="text-xs text-white font-bold">!</span>
          </motion.div>
        )}

        {/* Progress indicator for returning users */}
        {hasProgress && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <GraduationCap className="w-3 h-3 text-white" />
            </motion.div>
          </div>
        )}
      </motion.button>

      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && !showMissionHub && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="fixed bottom-24 right-24 z-[9999] pointer-events-none"
          >
            <div className="bg-gradient-to-r from-orange-900 to-red-900 text-white px-3 py-2 rounded-lg shadow-xl border border-orange-400/30 text-sm font-medium">
              {hasProgress ? 'Continue Learning' : 'Start Credit Education'}
              <div className="absolute bottom-[-6px] right-8 w-3 h-3 bg-gradient-to-r from-orange-900 to-red-900 rotate-45 border-r border-b border-orange-400/30"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launch animation trail */}
      <AnimatePresence>
        {showMissionHub && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: 0,
              scale: 3,
              y: -200
            }}
            transition={{ duration: 0.6 }}
            className="fixed bottom-6 right-28 z-[9997] pointer-events-none"
          >
            <div className="w-14 h-16 bg-gradient-to-b from-orange-400 to-red-600 rounded-t-full rounded-b-lg opacity-50"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Hub Modal */}
      <AnimatePresence>
        {showMissionHub && (
          <MissionHub
            user={user}
            userProfile={userProfile}
            onClose={() => setShowMissionHub(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default EducationRocket;