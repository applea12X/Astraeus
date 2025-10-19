import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Heart } from 'lucide-react';
import { usePet } from '../../contexts/PetContext';

const PetCompanion = ({ position = 'bottom-right' }) => {
  const { currentStage, petData, showMessage, evolutionMessage, petLevel } = usePet();
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [particles, setParticles] = useState([]);

  // Trigger sparkle effect periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Show heart on hover
  useEffect(() => {
    if (isHovered) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1500);
    }
  }, [isHovered]);

  // Generate particles for high-level pets
  useEffect(() => {
    if (petLevel >= 4) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (i * 360) / 8
      }));
      setParticles(newParticles);
    }
  }, [petLevel]);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  // Get glow color based on pet stage
  const glowColors = {
    purple: 'rgba(168, 85, 247, 0.6)',
    cyan: 'rgba(34, 211, 238, 0.6)',
    teal: 'rgba(20, 184, 166, 0.6)',
    green: 'rgba(34, 197, 94, 0.6)',
    orange: 'rgba(251, 146, 60, 0.6)',
    gold: 'rgba(250, 204, 21, 0.6)'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 pointer-events-none`}>
      <div className="relative pointer-events-auto">
        {/* Message bubble */}
        <AnimatePresence>
          {showMessage && evolutionMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border-2 border-white/30">
                <p className="text-sm font-bold">{evolutionMessage}</p>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-pink-600 border-r-2 border-b-2 border-white/30"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pet container */}
        <motion.div
          className="relative cursor-pointer"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Main pet body */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ width: `${currentStage.size}px`, height: `${currentStage.size}px` }}
          >
            {/* Outer glow ring - enhanced */}
            {currentStage.accessories.includes('glow-ring') && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${glowColors[currentStage.glow]} 0%, transparent 70%)`,
                  filter: 'blur(25px)',
                  transform: 'scale(1.8)'
                }}
                animate={{
                  scale: [1.6, 2.0, 1.6],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}

            {/* Pet body - MUCH CUTER! */}
            <motion.div
              className={`relative w-full h-full rounded-full bg-gradient-to-br ${currentStage.color} shadow-2xl border-4 border-white/40 overflow-hidden`}
              animate={{
                boxShadow: [
                  `0 0 30px ${glowColors[currentStage.glow]}`,
                  `0 0 50px ${glowColors[currentStage.glow]}`,
                  `0 0 30px ${glowColors[currentStage.glow]}`
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {petLevel === 0 ? (
                // EGG DESIGN - Much cuter!
                <div className="w-full h-full rounded-full flex items-center justify-center relative">
                  {/* Egg spots pattern */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-3 h-4 bg-white/30 rounded-full"></div>
                    <div className="absolute top-1/3 right-1/4 w-2 h-3 bg-white/30 rounded-full"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-4 h-5 bg-white/30 rounded-full"></div>
                    <div className="absolute bottom-1/4 right-1/3 w-2 h-3 bg-white/30 rounded-full"></div>
                  </div>

                  {/* Egg shine */}
                  <div className="absolute top-3 left-3 w-8 h-8 bg-white/50 rounded-full blur-md"></div>

                  {/* Mystery symbol */}
                  <motion.div
                    className="text-5xl"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                </div>
              ) : (
                // HATCHED CREATURE - Much cuter design!
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Big sparkly eyes - SUPER CUTE */}
                  <div className="relative z-10">
                    <div className="flex gap-2 mb-2 relative">
                      {/* Left eye */}
                      <motion.div
                        className="relative w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                        animate={{
                          scaleY: isHovered ? [1, 0.1, 1] : 1,
                          y: isHovered ? [0, -1, 0] : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Pupil */}
                        <motion.div
                          className="w-2.5 h-2.5 bg-gray-900 rounded-full relative"
                          animate={{
                            x: isHovered ? 1 : 0
                          }}
                        >
                          {/* Eye shine */}
                          <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                        </motion.div>
                      </motion.div>

                      {/* Right eye */}
                      <motion.div
                        className="relative w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                        animate={{
                          scaleY: isHovered ? [1, 0.1, 1] : 1,
                          y: isHovered ? [0, -1, 0] : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Pupil */}
                        <motion.div
                          className="w-2.5 h-2.5 bg-gray-900 rounded-full relative"
                          animate={{
                            x: isHovered ? 1 : 0
                          }}
                        >
                          {/* Eye shine */}
                          <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                        </motion.div>
                      </motion.div>

                      {/* Sparkles in eyes when happy */}
                      {isHovered && (
                        <>
                          <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: 180 }}
                            className="absolute -top-1 -left-1"
                          >
                            <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: -180 }}
                            className="absolute -top-1 -right-1"
                          >
                            <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                          </motion.div>
                        </>
                      )}
                    </div>

                    {/* Adorable mouth */}
                    <motion.div
                      className="relative flex justify-center"
                      animate={{
                        scaleX: isHovered ? 1.3 : 1,
                        y: isHovered ? 1 : 0
                      }}
                    >
                      <div className="w-5 h-2.5 border-3 border-white border-t-0 rounded-b-full bg-pink-400/30"></div>
                    </motion.div>

                    {/* Cute blush marks */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0.6 }}
                      className="absolute -left-6 top-2 w-3 h-2 bg-pink-400 rounded-full blur-sm"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0.6 }}
                      className="absolute -right-6 top-2 w-3 h-2 bg-pink-400 rounded-full blur-sm"
                    />
                  </div>

                  {/* Cute antenna/ears for higher levels */}
                  {petLevel >= 2 && (
                    <>
                      <motion.div
                        className="absolute -top-2 left-3 w-1.5 h-5 bg-gradient-to-t from-current to-transparent rounded-full"
                        animate={{
                          rotate: [-5, 5, -5],
                          scaleY: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full"></div>
                      </motion.div>
                      <motion.div
                        className="absolute -top-2 right-3 w-1.5 h-5 bg-gradient-to-t from-current to-transparent rounded-full"
                        animate={{
                          rotate: [5, -5, 5],
                          scaleY: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5
                        }}
                      >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full"></div>
                      </motion.div>
                    </>
                  )}
                </div>
              )}

              {/* Inner shine effect - enhanced */}
              <div className="absolute top-3 left-3 w-8 h-8 bg-white/60 rounded-full blur-md"></div>
              <div className="absolute top-4 left-4 w-4 h-4 bg-white/80 rounded-full blur-sm"></div>
            </motion.div>

            {/* Wings accessory - CUTER */}
            {currentStage.accessories.includes('wings') && (
              <>
                {/* Left wing */}
                <motion.div
                  className="absolute top-1/3 -left-6 w-10 h-16"
                  style={{ transformOrigin: 'right center' }}
                  animate={{
                    rotate: [0, -25, 0],
                    scaleX: [1, 1.15, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-white via-blue-200 to-purple-300 rounded-full opacity-80 shadow-lg border-2 border-white/50"></div>
                </motion.div>

                {/* Right wing */}
                <motion.div
                  className="absolute top-1/3 -right-6 w-10 h-16"
                  style={{ transformOrigin: 'left center' }}
                  animate={{
                    rotate: [0, 25, 0],
                    scaleX: [1, 1.15, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-white via-blue-200 to-purple-300 rounded-full opacity-80 shadow-lg border-2 border-white/50"></div>
                </motion.div>
              </>
            )}

            {/* Tiny wings accessory */}
            {currentStage.accessories.includes('tiny-wings') && !currentStage.accessories.includes('wings') && (
              <>
                <motion.div
                  className="absolute top-1/3 -left-3 w-6 h-8 bg-gradient-to-br from-white/80 to-cyan-300/60 rounded-full shadow-md border border-white/50"
                  style={{ transformOrigin: 'right center' }}
                  animate={{
                    rotate: [0, -15, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute top-1/3 -right-3 w-6 h-8 bg-gradient-to-br from-white/80 to-cyan-300/60 rounded-full shadow-md border border-white/50"
                  style={{ transformOrigin: 'left center' }}
                  animate={{
                    rotate: [0, 15, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </>
            )}

            {/* Crown accessory - cuter */}
            {currentStage.accessories.includes('crown') && (
              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl filter drop-shadow-lg"
                animate={{
                  rotate: [-5, 5, -5],
                  y: [0, -3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                👑
              </motion.div>
            )}

            {/* Aura accessory */}
            {currentStage.accessories.includes('aura') && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${glowColors[currentStage.glow]}, transparent, ${glowColors[currentStage.glow]})`,
                  transform: 'scale(2.2)',
                  filter: 'blur(15px)'
                }}
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )}

            {/* Particle effects */}
            {currentStage.accessories.includes('particles') && particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `rotate(${particle.angle}deg) translateX(${currentStage.size / 2 + 25}px)`
                }}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.6, 1.3, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: particle.id * 0.2
                }}
              >
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              </motion.div>
            ))}
          </motion.div>

          {/* Sparkle effect on hover/periodic */}
          <AnimatePresence>
            {(isHovered || showSparkle) && petLevel > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 180 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -top-3 -right-3"
              >
                <Sparkles className="w-7 h-7 text-yellow-300 fill-yellow-300 drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heart effect on hover */}
          <AnimatePresence>
            {showHeart && petLevel > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1.2, y: -20 }}
                exit={{ opacity: 0, scale: 0, y: -40 }}
                className="absolute -top-2 left-1/2 -translate-x-1/2"
              >
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500 drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Level indicator - cuter design */}
          <motion.div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 border-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.1 }}
          >
            ★ Lv. {petLevel} ★
          </motion.div>

          {/* Pet name if set */}
          {petData?.nickname && (
            <motion.div
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/95 text-gray-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 border-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              💖 {petData.nickname}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PetCompanion;
