import React, { useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Rocket } from 'lucide-react';

const NeptuneSpaceship = ({ startPosition, onAnimationComplete }) => {
  const SHIP_SIZE = 128; // matches w-32 h-32
  const HALF_SHIP = SHIP_SIZE / 2;

  // Anchor the ship's center to the provided start position
  const x = useMotionValue(startPosition.x - HALF_SHIP);
  const y = useMotionValue(startPosition.y - HALF_SHIP);
  const scale = useMotionValue(0.6);
  const rotate = useMotionValue(0);
  const opacity = useMotionValue(1);

  useEffect(() => {
    const sequence = async () => {
      // Phase 1: Take off from Neptune (lift up and grow)
      // Duration: 1.5 seconds
      await Promise.all([
        animate(y, startPosition.y - 300, { duration: 1.5, ease: [0.4, 0, 0.2, 1] }),
        animate(scale, 0.8, { duration: 1.5, ease: [0.4, 0, 0.2, 1] }),
        animate(rotate, -20, { duration: 1.5, ease: [0.4, 0, 0.2, 1] })
      ]);

      // Phase 2: Accelerate across the screen (zoom forward)
      // Duration: 1.5 seconds
      await Promise.all([
        animate(x, window.innerWidth / 2, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
        animate(y, window.innerHeight / 2, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
        animate(scale, 1.5, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
        animate(rotate, 0, { duration: 1, ease: [0.4, 0, 0.2, 1] })
      ]);

      // Phase 3: Zoom towards camera (scale up dramatically)
      // Duration: 1 second
      await Promise.all([
        animate(scale, 4, { duration: 0.8, ease: [0.4, 0, 0.2, 1] }),
        animate(opacity, 0, { duration: 0.8, ease: [0.4, 0, 0.2, 1] })
      ]);

      // Complete animation
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    };

    sequence();
  }, [startPosition, onAnimationComplete]);

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{ 
        top: 0,
        left: 0,
        x, 
        y, 
        scale,
        rotate,
        opacity,
        originX: 0.5,
        originY: 0.5
      }}
    >
      <div className="relative">
        {/* Spaceship Body */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Rocket Icon as ship */}
          <div className="absolute transform -rotate-45">
            <Rocket 
              className="w-24 h-24 text-red-500 drop-shadow-2xl" 
              strokeWidth={2} 
              fill="#ef4444" 
            />
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
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full"
            style={{
              left: Math.random() * 80 - 40,
              top: Math.random() * 80 - 40,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default NeptuneSpaceship;

