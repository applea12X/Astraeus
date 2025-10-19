import React, { useState, useEffect } from 'react';
// Temporarily removed framer-motion for simplified setup
// import { motion } from 'framer-motion';

const NeptunePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out'
      }}
    >
      {/* Neptune-themed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a237e] via-[#283593] to-[#3949ab]">
        {/* Animated stars */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>

        {/* Large cartoon Neptune in the background */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1,
            transition: 'all 1.5s ease-out 0.3s'
          }}
        >
          {/* Neptune planet */}
          <div className="relative w-[600px] h-[600px]">
            {/* Main planet body */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4166F5] via-[#2E4DD7] to-[#1E3BA8] shadow-2xl">
              {/* Atmospheric bands */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div
                  className="absolute w-full h-[80px] bg-[#5A7FFF]/40 blur-sm animate-pulse"
                  style={{ 
                    top: '20%',
                    animation: 'float 20s linear infinite'
                  }}
                />
                <div
                  className="absolute w-full h-[60px] bg-[#3D5FE8]/30 blur-sm animate-pulse"
                  style={{ 
                    top: '45%',
                    animation: 'float 25s linear infinite reverse'
                  }}
                />
                <div
                  className="absolute w-full h-[70px] bg-[#2D4FD8]/35 blur-sm animate-pulse"
                  style={{ 
                    top: '70%',
                    animation: 'float 22s linear infinite'
                  }}
                />
              </div>

              {/* Great Dark Spot (Neptune's storm) */}
              <div
                className="absolute top-[35%] left-[25%] w-[120px] h-[90px] rounded-full bg-[#1a2d7a]/60 blur-md animate-pulse"
                style={{
                  animation: 'pulse-glow 8s ease-in-out infinite'
                }}
              />

              {/* Highlight/shine */}
              <div className="absolute top-[15%] left-[20%] w-[180px] h-[180px] rounded-full bg-white/20 blur-3xl" />
            </div>

            {/* Planet glow */}
            <div className="absolute inset-0 rounded-full bg-[#4166F5]/40 blur-[80px] scale-110 -z-10" />
          </div>
        </div>

        {/* Floating clouds/gas effects */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`cloud-${i}`}
            className="absolute rounded-full bg-white/5 blur-2xl animate-pulse"
            style={{
              width: Math.random() * 200 + 100 + 'px',
              height: Math.random() * 100 + 50 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <div
            className="text-center"
            style={{
              transform: 'translateY(0)',
              opacity: 1,
              transition: 'all 1s ease-out 0.8s'
            }}
          >
            <h1 className="text-7xl font-bold text-white drop-shadow-2xl mb-4">
              Welcome to Neptune
            </h1>
            <p className="text-2xl text-blue-100 drop-shadow-lg mb-8">
              The Ice Giant of Finance
            </p>
            
            {/* Interactive content area */}
            <div
              className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto border border-white/20"
              style={{
                transform: 'scale(1)',
                opacity: 1,
                transition: 'all 0.8s ease-out 1.2s'
              }}
            >
              <h2 className="text-3xl font-semibold text-white mb-4">
                Your Financial Adventure Begins
              </h2>
              <p className="text-lg text-blue-50 leading-relaxed">
                Neptune represents the deep, mysterious waters of advanced financial planning. 
                Here you'll learn about long-term investments, retirement planning, and building 
                lasting wealth for your future.
              </p>
              
              {/* Placeholder for future content */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {['Investments', 'Retirement', 'Savings'].map((topic, i) => (
                  <button
                    key={topic}
                    className="bg-gradient-to-br from-blue-500 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                    style={{
                      transform: 'translateY(0)',
                      opacity: 1,
                      transition: `all 0.3s ease-out ${1.5 + i * 0.1}s`
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ambient light effects */}
        <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default NeptunePage;

