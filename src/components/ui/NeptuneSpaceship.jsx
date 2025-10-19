import React, { useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Rocket } from 'lucide-react';

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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-cyan-300 shadow-xl flex items-center justify-center z-10">
            {/* Cute face */}
            <div className="relative">
              {/* Eyes */}
              <div className="flex gap-1 mb-0.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
                <div className="w-1.5 h-1.5 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
              </div>

              {/* Mouth */}
              <div className="w-2 h-1 border border-white border-t-0 rounded-b-full"></div>
            </div>

            {/* Antennae */}
            <div className="absolute -top-1 left-1.5">
              <div className="w-0.5 h-2 bg-red-300"></div>
              <div className="w-1 h-1 bg-white rounded-full -mt-0.5 ml-[-2px]"></div>
            </div>
            <div className="absolute -top-1 right-1.5">
              <div className="w-0.5 h-2 bg-red-300"></div>
              <div className="w-1 h-1 bg-white rounded-full -mt-0.5 ml-[-2px]"></div>
            </div>
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

        {/* Spaceship glow effect */}
        <div className="absolute inset-0 bg-red-400/30 rounded-full blur-lg scale-150 animate-pulse"></div>
      </div>
    </motion.div>
  );
};

export default NeptuneSpaceship;

