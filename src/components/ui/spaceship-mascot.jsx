import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, animate, useMotionValue } from 'framer-motion';
import { Rocket } from 'lucide-react';

const SpaceshipMascot = ({ onAnimationComplete }) => {
  const [showShip, setShowShip] = useState(true);

  // Path setup for a smooth curve across the viewport
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pathRef = useRef(null);
  const pathD = useMemo(() => {
    // Smooth S-curve from bottom-left (slightly offscreen) to top-right (slightly offscreen)
    const startX = -0.1 * width;
    const startY = 1.1 * height;
    const c1X = 0.2 * width;
    const c1Y = 0.85 * height;
    const c2X = 0.35 * width;
    const c2Y = 0.4 * height;
    const midX = 0.6 * width;
    const midY = 0.5 * height;
    const s2X = 0.95 * width;
    const s2Y = 0.1 * height;
    const endX = 1.1 * width;
    const endY = -0.1 * height;
    return `M ${startX} ${startY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${midX} ${midY} S ${s2X} ${s2Y}, ${endX} ${endY}`;
  }, [width, height]);

  // Motion values for position and rotation
  const x = useMotionValue(-200);
  const y = useMotionValue(height + 100);
  const rotate = useMotionValue(-45);
  const progress = useMotionValue(0);

  useEffect(() => {
    // Animate progress along the path for smooth motion
    const controls = animate(progress, 1, { duration: 4, ease: 'easeInOut' });

    const path = pathRef.current;
    if (path) {
      const length = path.getTotalLength();
      const unsubscribe = progress.on('change', (v) => {
        const l = v * length;
        const pt = path.getPointAtLength(l);
        // Calculate tangent for rotation
        const nextPt = path.getPointAtLength(Math.min(length, l + 1));
        const angleDeg = (Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * 180) / Math.PI;
        x.set(pt.x);
        y.set(pt.y);
        rotate.set(angleDeg);
      });
      // Cleanup subscription
      return () => {
        controls.stop();
        unsubscribe();
      };
    }

    return () => controls.stop();
  }, [progress, x, y, rotate]);

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
    <>
      {/* Invisible SVG path used to drive smooth motion */}
      <svg
        className="fixed inset-0 w-screen h-screen pointer-events-none"
        viewBox={`0 0 ${width} ${height}`}
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <path ref={pathRef} d={pathD} fill="none" stroke="none" />
      </svg>

      <motion.div
        className="fixed z-50 pointer-events-none"
        style={{ x, y, rotate }}
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
    </>
  );
};

export default SpaceshipMascot;

