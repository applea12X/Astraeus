import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import AIShoppingAssistant from './AIShoppingAssistant';

const UranusPage = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 w-screen h-screen overflow-hidden"
    >
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => onNavigate && onNavigate('solar-system')}
        className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Solar System</span>
      </motion.button>

      {/* Uranus-themed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1929] via-[#1e3a5f] to-[#0f1d2e]">
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

        {/* Large cartoon Uranus in the background */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          {/* Uranus planet */}
          <div className="relative w-[600px] h-[600px]">
            {/* Main planet body */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4FD0E0] via-[#3DB5C5] to-[#2A8FA0] shadow-2xl">
              {/* Atmospheric features */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <motion.div
                  className="absolute w-full h-[60px] bg-[#6FE0F0]/30 blur-sm"
                  style={{ top: '25%' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-full h-[50px] bg-[#5FD0E0]/25 blur-sm"
                  style={{ top: '50%' }}
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Highlight/shine */}
              <div className="absolute top-[20%] left-[25%] w-[150px] h-[150px] rounded-full bg-white/25 blur-3xl" />
            </div>

            {/* Planet glow */}
            <div className="absolute inset-0 rounded-full bg-[#4FD0E0]/40 blur-[80px] scale-110 -z-10" />
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-cyan-400/20 blur-xl"
            style={{
              width: Math.random() * 150 + 80 + 'px',
              height: Math.random() * 80 + 40 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              x: [0, Math.random() * 80 - 40],
              y: [0, Math.random() * 80 - 40],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{
              duration: Math.random() * 8 + 8,
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
              Welcome to Uranus
            </h1>
            
            {/* Interactive content area */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto border border-white/20"
            >
              <h2 className="text-3xl font-semibold text-white mb-4">
                Discover Your Perfect Vehicle
              </h2>
              <p className="text-lg text-cyan-100 leading-relaxed">
                Uranus represents your personal preferences and lifestyle. 
                Help us understand what you're looking for in your next vehicle 
                by answering a few simple questions about your needs.
              </p>
              
              {/* Next button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate && onNavigate('uranus-form')}
                className="mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Next →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Ambient light effects */}
        <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* AI Shopping Assistant */}
      <AIShoppingAssistant selectedVehicle={null} financialInfo={{}} userProfile={{}} currentPageName="uranus" />
    </motion.div>
  );
};

export default UranusPage;

