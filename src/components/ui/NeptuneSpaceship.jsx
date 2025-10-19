import React, { useEffect, useState } from 'react';
// Temporarily removed framer-motion and lucide-react for simplified setup
// import { motion, useMotionValue, animate } from 'framer-motion';
// import { Rocket } from 'lucide-react';

const NeptuneSpaceship = ({ startPosition, endPosition, onAnimationComplete }) => {
  const SHIP_SIZE = 128; // matches w-32 h-32
  const HALF_SHIP = SHIP_SIZE / 2;

  // Anchor the ship's center to the provided start position
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(0.6);
  const rotate = useMotionValue(0);
  const opacity = useMotionValue(1);

  useEffect(() => {
    const run = async () => {
      if (!endPosition) {
        // INTRO MODE: Top of screen to Neptune
        const initialX = window.innerWidth / 2 - HALF_SHIP;
        const initialY = -200;
        x.set(initialX);
        y.set(initialY);
        scale.set(0.4);
        rotate.set(45);
        opacity.set(1);

        // Fly to Neptune
        await Promise.all([
          animate(x, startPosition.x - 150, { duration: 1.5, ease: [0.4, 0, 0.2, 1] }),
          animate(y, startPosition.y - 100, { duration: 1.5, ease: [0.4, 0, 0.2, 1] }),
          animate(scale, 0.7, { duration: 1.5, ease: [0.4, 0, 0.2, 1] }),
          animate(rotate, 0, { duration: 1.5, ease: [0.4, 0, 0.2, 1] })
        ]);
        await Promise.all([
          animate(x, startPosition.x - HALF_SHIP, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
          animate(y, startPosition.y - HALF_SHIP, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
          animate(scale, 0.9, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
          animate(rotate, -15, { duration: 1, ease: [0.4, 0, 0.2, 1] })
        ]);
        await Promise.all([
          animate(x, startPosition.x - HALF_SHIP + 20, { duration: 0.8, ease: [0.4, 0, 0.2, 1] }),
          animate(y, startPosition.y - HALF_SHIP + 10, { duration: 0.8, ease: [0.4, 0, 0.2, 1] }),
          animate(scale, 0.2, { duration: 0.8, ease: [0.4, 0, 0.2, 1] }),
          animate(opacity, 0, { duration: 0.8, ease: [0.4, 0, 0.2, 1] })
        ]);
      } else {
        // TRANSFER MODE: Neptune to Uranus - completely redone
        
        // Start at Neptune (center the ship on Neptune)
        x.set(startPosition.x - HALF_SHIP);
        y.set(startPosition.y - HALF_SHIP);
        scale.set(0.8);
        rotate.set(0);
        opacity.set(1);

        // Phase 1: Launch from Neptune (upward and outward)
        await Promise.all([
          animate(x, startPosition.x - HALF_SHIP - 50, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
          animate(y, startPosition.y - HALF_SHIP - 100, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
          animate(scale, 1.2, { duration: 1, ease: [0.4, 0, 0.2, 1] }),
          animate(rotate, -30, { duration: 1, ease: [0.4, 0, 0.2, 1] })
        ]);

        // Phase 2: Arc toward Uranus (calculate proper direction)
        const midX = (startPosition.x + endPosition.x) / 2;
        const midY = Math.min(startPosition.y, endPosition.y) - 150; // Arc above both planets
        
        // Calculate angle pointing toward Uranus
        const dx = endPosition.x - startPosition.x;
        const dy = endPosition.y - startPosition.y;
        const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        
        await Promise.all([
          animate(x, midX - HALF_SHIP, { duration: 1.5, ease: [0.2, 0, 0.8, 1] }),
          animate(y, midY - HALF_SHIP, { duration: 1.5, ease: [0.2, 0, 0.8, 1] }),
          animate(scale, 1.0, { duration: 1.5, ease: [0.2, 0, 0.8, 1] }),
          animate(rotate, targetAngle, { duration: 1.5, ease: [0.2, 0, 0.8, 1] })
        ]);

        // Phase 3: Dive down to Uranus
        await Promise.all([
          animate(x, endPosition.x - HALF_SHIP, { duration: 1.2, ease: [0.4, 0, 0.2, 1] }),
          animate(y, endPosition.y - HALF_SHIP, { duration: 1.2, ease: [0.4, 0, 0.2, 1] }),
          animate(scale, 0.8, { duration: 1.2, ease: [0.4, 0, 0.2, 1] })
        ]);

        // Phase 4: Land and disappear
        await Promise.all([
          animate(scale, 0.3, { duration: 0.8, ease: [0.4, 0, 0.2, 1] }),
          animate(opacity, 0, { duration: 0.8, ease: [0.4, 0, 0.2, 1] })
        ]);
      }

      if (onAnimationComplete) onAnimationComplete();
    };

    run();
  }, [startPosition, endPosition, onAnimationComplete, x, y, scale, rotate, opacity]);

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

