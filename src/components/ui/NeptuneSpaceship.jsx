import React, { useEffect, useState } from 'react';
// Temporarily removed framer-motion and lucide-react for simplified setup
// import { motion, useMotionValue, animate } from 'framer-motion';
// import { Rocket } from 'lucide-react';

const NeptuneSpaceship = ({ startPosition, onAnimationComplete }) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set initial position completely off-screen (above viewport)
    const initialX = window.innerWidth / 2 - HALF_SHIP;
    const initialY = -200; // Start well above the screen
    
    // Set starting values
    x.set(initialX);
    y.set(initialY);
    scale.set(0.4);
    rotate.set(45);
    opacity.set(1);

    const sequence = async () => {
      // Phase 1: Approach Neptune from distance
      // Duration: 1.5 seconds
      await Promise.all([
        animate(x, startPosition.x - 150, { duration: 1.5, ease: [0.4, 0, 0.2, 1] }),
        animate(y, startPosition.y - 100, { duration: 1.5, ease: [0.4, 0, 0.2, 1] }),
        animate(scale, 0.7, { duration: 1.5, ease: [0.4, 0, 0.2, 1] }),
        animate(rotate, 0, { duration: 1.5, ease: [0.4, 0, 0.2, 1] })
      ]);

      // Phase 2: Close approach to Neptune
      // Duration: 1 second
      await Promise.all([
        animate(x, startPosition.x - HALF_SHIP, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
        animate(y, startPosition.y - HALF_SHIP, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
        animate(scale, 0.9, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
        animate(rotate, -15, { duration: 1, ease: [0.4, 0, 0.2, 1] })
      ]);

      // Phase 3: Dive into Neptune (shrink and fade)
      // Duration: 0.8 seconds
      await Promise.all([
        animate(x, startPosition.x - HALF_SHIP + 20, { duration: 0.8, ease: [0.4, 0, 0.2, 1] }),
        animate(y, startPosition.y - HALF_SHIP + 10, { duration: 0.8, ease: [0.4, 0, 0.2, 1] }),
        animate(scale, 0.2, { duration: 0.8, ease: [0.4, 0, 0.2, 1] }),
        animate(opacity, 0, { duration: 0.8, ease: [0.4, 0, 0.2, 1] })
      ]);

      // Complete animation
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    };

    sequence();
  }, [startPosition, onAnimationComplete, x, y, scale, rotate, opacity]);

  if (!isVisible) return null;

  const getAnimationStyle = () => {
    const baseStyle = {
      position: 'fixed',
      zIndex: 50,
      pointerEvents: 'none',
      left: startPosition.x - 64,
      top: startPosition.y - 64,
      transition: 'all 1.5s ease-out',
    };

    switch (animationPhase) {
      case 1:
        return {
          ...baseStyle,
          top: startPosition.y - 300,
          transform: 'scale(0.8) rotate(-20deg)',
        };
      case 2:
        return {
          ...baseStyle,
          left: window.innerWidth / 2 - 64,
          top: window.innerHeight / 2 - 64,
          transform: 'scale(1.5) rotate(0deg)',
        };
      case 3:
        return {
          ...baseStyle,
          transform: 'scale(4)',
          opacity: 0,
        };
      default:
        return {
          ...baseStyle,
          transform: 'scale(0.6)',
        };
    }
  };

  return (
    <div style={getAnimationStyle()}>
      <div className="relative">
        {/* Spaceship Body */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Simple rocket shape */}
          <div className="absolute transform -rotate-45">
            <div className="w-24 h-24 bg-red-500 rounded-t-full" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          </div>
          
          {/* Mascot "Cam" in the window */}
          <div className="absolute top-8 left-10 w-10 h-10 bg-blue-400 rounded-full border-4 border-cyan-300 shadow-xl flex items-center justify-center z-10">
            <div className="text-2xl">🐱</div>
          </div>

          {/* Engine glow/fire trail */}
          <div className="absolute -bottom-4 -right-4 w-20 h-20 animate-pulse">
            <div className="w-full h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full blur-xl opacity-80"></div>
          </div>

          {/* Stars trailing effect */}
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 animate-pulse">
            <div className="text-yellow-300 text-4xl">✨</div>
          </div>
        </div>

        {/* Sparkle effects */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full animate-pulse"
            style={{
              left: Math.random() * 80 - 40,
              top: Math.random() * 80 - 40,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NeptuneSpaceship;

