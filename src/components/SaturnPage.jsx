import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const SaturnPage = ({ onNavigate }) => {
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

      {/* Saturn-themed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2d1810] via-[#4a2c1a] to-[#1a0f08]">
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

        {/* Large cartoon Saturn in the background */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          {/* Saturn planet */}
          <div className="relative w-[600px] h-[600px]">
            {/* Main planet body */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FAD5A5] via-[#E8B878] to-[#C89858] shadow-2xl">
              {/* Atmospheric bands */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <motion.div
                  className="absolute w-full h-[70px] bg-[#FFEAA7]/40 blur-sm"
                  style={{ top: '20%' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-full h-[60px] bg-[#F5D99B]/35 blur-sm"
                  style={{ top: '45%' }}
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-full h-[65px] bg-[#ECC884]/30 blur-sm"
                  style={{ top: '70%' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Highlight/shine */}
              <div className="absolute top-[18%] left-[22%] w-[160px] h-[160px] rounded-full bg-white/20 blur-3xl" />
            </div>

            {/* Planet glow */}
            <div className="absolute inset-0 rounded-full bg-[#FAD5A5]/40 blur-[80px] scale-110 -z-10" />
            
            {/* Saturn's magnificent rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[360px]" style={{ transform: 'translate(-50%, -50%) rotateX(75deg)' }}>
              <div className="absolute inset-0 border-[16px] border-amber-200/50 rounded-full" />
              <div className="absolute inset-6 border-[12px] border-yellow-300/40 rounded-full" />
              <div className="absolute inset-12 border-[8px] border-amber-300/30 rounded-full" />
              <div className="absolute inset-20 border-[6px] border-yellow-400/25 rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Floating dust particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute rounded-full bg-amber-400/15 blur-xl"
            style={{
              width: Math.random() * 120 + 60 + 'px',
              height: Math.random() * 60 + 30 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              x: [0, Math.random() * 70 - 35],
              y: [0, Math.random() * 70 - 35],
              opacity: [0.1, 0.2, 0.1]
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
              Welcome to Saturn
            </h1>
            
            {/* Interactive content area */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto border border-white/20"
            >
              <h2 className="text-3xl font-semibold text-white mb-4">
                Your AI-Powered Recommendations
              </h2>
              <p className="text-lg text-amber-100 leading-relaxed">
                Saturn's advanced AI has analyzed all your information - your financial profile,
                personal details, and vehicle preferences. Get ready to discover personalized
                Toyota and Lexus vehicles perfectly matched to your unique needs.
              </p>
              
              {/* Next button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate && onNavigate('saturn-results')}
                className="mt-8 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get My Recommendations →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Ambient light effects */}
        <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default SaturnPage;
