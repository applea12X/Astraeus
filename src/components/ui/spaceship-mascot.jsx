import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const SpaceshipMascot = ({ onAnimationComplete }) => {
  const [showShip, setShowShip] = useState(true);

  useEffect(() => {
    // Hide spaceship after animation completes
    const timer = setTimeout(() => {
      setShowShip(false);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  if (!showShip) return null;

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      initial={{ x: -200, y: window.innerHeight + 100 }}
      animate={{
        x: [
          -200,
          window.innerWidth * 0.2,
          window.innerWidth * 0.4,
          window.innerWidth * 0.6,
          window.innerWidth * 0.8,
          window.innerWidth + 200
        ],
        y: [
          window.innerHeight + 100,
          window.innerHeight * 0.7,
          window.innerHeight * 0.3,
          window.innerHeight * 0.4,
          window.innerHeight * 0.2,
          -200
        ],
        rotate: [0, -15, -30, -20, -45, -60],
        scale: [1, 1.2, 1, 1.1, 0.9, 0.7]
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }}
    >
      <div className="relative">
        {/* Spaceship Body */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Rocket Icon as ship */}
          <div className="absolute transform -rotate-45 scale-150">
            <Rocket className="w-24 h-24 text-red-500 drop-shadow-2xl" strokeWidth={2} fill="#ef4444" />
          </div>
          
          {/* Mascot "Cam" in the window */}
          <div className="absolute top-8 left-10 w-10 h-10 bg-blue-400 rounded-full border-4 border-cyan-300 shadow-xl flex items-center justify-center z-10">
            <div className="text-2xl">🐱</div>
          </div>

          {/* Engine glow/fire trail */}
          <motion.div
            className="absolute -bottom-4 -right-4 w-20 h-20"
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full blur-xl opacity-80"></div>
          </motion.div>

          {/* Stars trailing effect */}
          <motion.div
            className="absolute -left-8 top-1/2 transform -translate-y-1/2"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 1.5]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
          >
            <div className="text-yellow-300 text-4xl">✨</div>
          </motion.div>
        </div>

        {/* Sparkle effects */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: Math.random() * 60 - 30,
              top: Math.random() * 60 - 30,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SpaceshipMascot;

