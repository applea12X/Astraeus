import React from 'react';
import { motion } from 'framer-motion';

const NeptunePage = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 w-screen h-screen overflow-hidden"
    >
      {/* Neptune-themed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a237e] via-[#283593] to-[#3949ab]">
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

        {/* Large cartoon Neptune in the background */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          {/* Neptune planet */}
          <div className="relative w-[600px] h-[600px]">
            {/* Main planet body */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4166F5] via-[#2E4DD7] to-[#1E3BA8] shadow-2xl">
              {/* Atmospheric bands */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <motion.div
                  className="absolute w-full h-[80px] bg-[#5A7FFF]/40 blur-sm"
                  style={{ top: '20%' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-full h-[60px] bg-[#3D5FE8]/30 blur-sm"
                  style={{ top: '45%' }}
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-full h-[70px] bg-[#2D4FD8]/35 blur-sm"
                  style={{ top: '70%' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Great Dark Spot (Neptune's storm) */}
              <motion.div
                className="absolute top-[35%] left-[25%] w-[120px] h-[90px] rounded-full bg-[#1a2d7a]/60 blur-md"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Highlight/shine */}
              <div className="absolute top-[15%] left-[20%] w-[180px] h-[180px] rounded-full bg-white/20 blur-3xl" />
            </div>

            {/* Planet glow */}
            <div className="absolute inset-0 rounded-full bg-[#4166F5]/40 blur-[80px] scale-110 -z-10" />
          </div>
        </motion.div>

        {/* Floating clouds/gas effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute rounded-full bg-white/5 blur-2xl"
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
              Welcome to Neptune
            </h1>
            
            
            {/* Interactive content area */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto border border-white/20"
            >
              <h2 className="text-3xl font-semibold text-white mb-4">
                Your Adventure Begins
              </h2>
              <p className="text-lg text-blue-50 leading-relaxed">
                Neptune represents your introduction to the world of Toyota Financial.
                Here you'll enter your preliminary financial information to get started.
              </p>
              
              {/* Next button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate && onNavigate('financial-info')}
                className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Next →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Ambient light effects */}
        <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default NeptunePage;

