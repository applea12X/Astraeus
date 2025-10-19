import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const ToyotaLogoAnimation = ({ onComplete, centerPosition }) => {
  const [showTrail, setShowTrail] = useState(true);

  // Center the animation at the provided position or screen center
  const centerX = centerPosition?.x || window.innerWidth / 2;
  const centerY = centerPosition?.y || window.innerHeight / 2;

  // Generate points for exciting, randomized loop-de-loops!
  const generateLoopDeLoopPath = () => {
    const points = [];
    const numLoops = 4; // Four loop-de-loops

    // Randomized parameters for each loop (seeded for consistency)
    const seed = 12345; // Use same seed for consistent animation
    const random = (index) => {
      const x = Math.sin(seed + index * 12.9898) * 43758.5453123;
      return x - Math.floor(x);
    };

    // Start from left side with some vertical offset
    let currentX = centerX - 300;
    let currentY = centerY;

    for (let loopIndex = 0; loopIndex < numLoops; loopIndex++) {
      // Randomize each loop's properties
      const loopRadius = 80 + random(loopIndex * 3) * 70; // 80-150px radius
      const loopHeight = loopRadius * (0.8 + random(loopIndex * 3 + 1) * 0.6); // Elliptical
      const tiltAngle = (random(loopIndex * 3 + 2) - 0.5) * Math.PI * 0.4; // -36° to +36° tilt
      const direction = loopIndex % 2 === 0 ? 1 : -1; // Alternate directions
      const yOffset = (random(loopIndex * 4) - 0.5) * 100; // Vertical variation

      const loopCenterY = currentY + yOffset;

      // Create a randomized loop (ellipse with tilt)
      for (let i = 0; i <= 70; i++) {
        const t = i / 70;
        const angle = t * Math.PI * 2 + Math.PI / 2;

        // Base ellipse coordinates
        let x = Math.cos(angle) * loopRadius * direction;
        let y = -Math.sin(angle) * loopHeight;

        // Apply tilt rotation
        const rotatedX = x * Math.cos(tiltAngle) - y * Math.sin(tiltAngle);
        const rotatedY = x * Math.sin(tiltAngle) + y * Math.cos(tiltAngle);

        points.push({
          x: currentX + rotatedX,
          y: loopCenterY + rotatedY
        });
      }

      // Add wavy connecting path to next loop (if not last loop)
      if (loopIndex < numLoops - 1) {
        const nextSpacing = 120 + random(loopIndex * 5) * 100; // 120-220px spacing
        const waveAmplitude = 30 + random(loopIndex * 6) * 40; // Wave height
        const waveFrequency = 2 + random(loopIndex * 7) * 2; // Wave count

        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const waveY = Math.sin(t * Math.PI * waveFrequency) * waveAmplitude;
          points.push({
            x: currentX + loopRadius + t * nextSpacing,
            y: loopCenterY - loopHeight + waveY
          });
        }

        currentX += loopRadius + nextSpacing;
        currentY = loopCenterY - loopHeight;
      }
    }

    // Add a dramatic corkscrew spiral at the end
    const spiralRotations = 2;
    const spiralRadius = 60;
    const spiralHeight = 150;

    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const angle = t * Math.PI * 2 * spiralRotations;
      const radius = spiralRadius * (1 + t * 0.5); // Expands outward

      points.push({
        x: currentX + Math.cos(angle) * radius,
        y: currentY - t * spiralHeight + Math.sin(angle) * radius
      });
    }

    return points;
  };

  const loopPath = generateLoopDeLoopPath();

  useEffect(() => {
    // After animation completes, wait a bit then call onComplete
    const timer = setTimeout(() => {
      setShowTrail(false);
      if (onComplete) {
        onComplete();
      }
    }, 7000); // Animation duration + small delay

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Create SVG path string from points for the trail
  const createPathString = (points) => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* SVG trail showing the loop-de-loop path */}
      {showTrail && (
        <svg className="absolute inset-0 w-full h-full">
          {/* Animated trail path */}
          <path
            d={createPathString(loopPath)}
            fill="none"
            stroke="rgba(255, 50, 50, 0.6)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="20,10"
          >
            <animate
              attributeName="stroke-opacity"
              values="0;0.8;0.8;0"
              dur="7s"
              fill="freeze"
            />
            <animate
              attributeName="stroke-dashoffset"
              from="2000"
              to="0"
              dur="7s"
              fill="freeze"
            />
          </path>

          {/* Glowing trail effect */}
          <path
            d={createPathString(loopPath)}
            fill="none"
            stroke="rgba(255, 100, 100, 0.3)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#glow)"
          >
            <animate
              attributeName="stroke-opacity"
              values="0;0.6;0.6;0"
              dur="7s"
              fill="freeze"
            />
          </path>

          {/* Glow filter definition */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Celebration text */}
          <text
            x={centerX}
            y={centerY + 200}
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.9)"
            fontSize="42"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            letterSpacing="4"
          >
            <animate
              attributeName="opacity"
              values="0;0;1;1;0"
              dur="7s"
              keyTimes="0;0.4;0.5;0.85;1"
              fill="freeze"
            />
            🎉 JOURNEY COMPLETE! 🎉
          </text>
        </svg>
      )}

      {/* Animated spaceship following the path */}
      <motion.div
        className="absolute"
        animate={{
          x: loopPath.map(p => p.x),
          y: loopPath.map(p => p.y),
        }}
        transition={{
          duration: 6.5,
          ease: "linear",
          times: loopPath.map((_, i) => i / (loopPath.length - 1))
        }}
        style={{
          width: '48px',
          height: '48px',
          marginLeft: '-24px',
          marginTop: '-24px'
        }}
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
          {/* Spaceship icon */}
          <motion.div
            className="relative"
            animate={{
              rotate: [0, 360, 720, 1080]
            }}
            transition={{
              duration: 7,
              ease: "linear"
            }}
          >
            <Rocket
              className="w-10 h-10 text-red-500 drop-shadow-lg"
              strokeWidth={2}
              fill="#ef4444"
            />
          </motion.div>

          {/* Mascot "Cam" in the window */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-cyan-300 flex items-center justify-center z-10">
            {/* Cute face */}
            <div className="relative scale-50">
              {/* Eyes */}
              <div className="flex gap-0.5">
                <div className="w-1 h-1 bg-white rounded-full flex items-center justify-center">
                  <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                </div>
                <div className="w-1 h-1 bg-white rounded-full flex items-center justify-center">
                  <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                </div>
              </div>

              {/* Mouth */}
              <div className="w-1.5 h-0.5 border border-white border-t-0 rounded-b-full mt-0.5"></div>
            </div>

            {/* Antennae */}
            <div className="absolute -top-0.5 left-0.5 scale-50">
              <div className="w-0.5 h-1.5 bg-red-300"></div>
              <div className="w-0.5 h-0.5 bg-white rounded-full -mt-0.5"></div>
            </div>
            <div className="absolute -top-0.5 right-0.5 scale-50">
              <div className="w-0.5 h-1.5 bg-red-300"></div>
              <div className="w-0.5 h-0.5 bg-white rounded-full -mt-0.5"></div>
            </div>
          </div>

          {/* Glow trail */}
          <motion.div
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-red-400/40 rounded-full blur-lg scale-150"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ToyotaLogoAnimation;
