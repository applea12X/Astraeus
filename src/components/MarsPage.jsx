import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import PetCompanion from './ui/PetCompanion';

const MarsPage = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 w-screen h-screen overflow-hidden"
    >
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <div className="relative">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => onNavigate && onNavigate('solar-system')}
            className="relative flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-2xl border transition-all duration-300 backdrop-blur-lg bg-gradient-to-r from-red-500/30 to-red-600/30 hover:from-red-500/40 hover:to-red-600/40 border-red-400/60 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transform hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Solar System</span>
          </motion.button>
          {/* Button glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-red-400/20 blur-xl -z-10 scale-110 opacity-60"></div>
        </div>
      </div>
      
      {/* Mars-themed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B2500] via-[#A0522D] to-[#CD853F]">
        {/* Animated stars */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              initial={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.7 + 0.3
              }}
              animate={{
                opacity: [Math.random() * 0.7 + 0.3, Math.random() * 0.3, Math.random() * 0.7 + 0.3]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Large cartoon Mars in the background */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          {/* Mars planet */}
          <div className="relative w-[600px] h-[600px]">
            {/* Main planet body */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E27B58] via-[#CD5C3C] to-[#A0442B] shadow-2xl">
              {/* Surface features and canyons */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <motion.div
                  className="absolute w-full h-[60px] bg-[#B5542C]/40 blur-sm"
                  style={{ top: '25%' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-full h-[80px] bg-[#8B3A1F]/30 blur-sm"
                  style={{ top: '50%' }}
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-full h-[50px] bg-[#9B4529]/35 blur-sm"
                  style={{ top: '75%' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Polar ice cap */}
              <motion.div
                className="absolute top-[5%] left-[40%] w-[100px] h-[80px] rounded-full bg-white/40 blur-md"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Olympus Mons (large volcano) */}
              <motion.div
                className="absolute top-[30%] left-[20%] w-[80px] h-[80px] rounded-full bg-[#6B2C14]/80 blur-sm"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.8, 0.9, 0.8]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Valles Marineris (canyon system) */}
              <motion.div
                className="absolute top-[60%] left-[15%] w-[200px] h-[20px] bg-[#5A2318]/60 blur-sm"
                style={{ borderRadius: '50px' }}
                animate={{
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Highlight/shine */}
              <div className="absolute top-[15%] left-[25%] w-[180px] h-[180px] rounded-full bg-orange-200/20 blur-3xl" />
            </div>

            {/* Planet glow */}
            <div className="absolute inset-0 rounded-full bg-[#E27B58]/40 blur-[80px] scale-110 -z-10" />
          </div>
        </motion.div>

        {/* Floating dust storms/atmospheric effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute rounded-full bg-orange-200/5 blur-2xl"
            style={{
              width: Math.random() * 200 + 100 + 'px',
              height: Math.random() * 100 + 50 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center"
          >
            <h1 className="text-7xl font-bold text-white drop-shadow-2xl mb-4">
              Welcome to Mars
            </h1>
            
            {/* Interactive content area */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto border border-white/20"
            >
              <h2 className="text-3xl font-semibold text-white mb-4">
                Advanced Financial Solutions
              </h2>
              <p className="text-lg text-orange-50 leading-relaxed">
                Mars represents your journey into advanced financial planning and credit solutions.
                Explore specialized financing options, credit building strategies, and 
                investment opportunities tailored to your unique financial profile.
              </p>
              
              {/* Next button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="mt-8"
              >
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate && onNavigate('mars-form')}
                    className="relative px-20 py-6 text-2xl font-semibold rounded-2xl border transition-all duration-300 backdrop-blur-lg min-w-[200px] bg-gradient-to-r from-red-500/30 to-red-600/30 hover:from-red-500/40 hover:to-red-600/40 border-red-400/60 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transform hover:scale-105"
                  >
                    Explore Solutions →
                  </motion.button>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-red-400/20 blur-xl -z-10 scale-110 opacity-60"></div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Ambient light effects */}
        <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Pet Companion */}
      <PetCompanion position="bottom-right" />
    </motion.div>
  );
};

export default MarsPage;