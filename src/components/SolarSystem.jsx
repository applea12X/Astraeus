import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import sunImage from '../assets/sun.png';
import NeptuneSpaceship from './ui/NeptuneSpaceship';

const SolarSystem = ({ onNavigate, navPayload }) => {
  const [showSpaceship, setShowSpaceship] = useState(false);
  const [spaceshipStartPos, setSpaceshipStartPos] = useState({ x: 0, y: 0 });
  const [spaceshipEndPos, setSpaceshipEndPos] = useState(null);
  const [hasPlayedTransfer, setHasPlayedTransfer] = useState(false);
  const neptuneRef = useRef(null);
  const uranusRef = useRef(null);
  const saturnRef = useRef(null);
  const jupiterRef = useRef(null);
  // Evenly spaced planets extending left from the sun
  const spacingPx = 170;
  const startOffsetPx = 450; // distance of Mercury from the sun
  const basePlanets = [
    { id: 1, name: 'Mercury', size: 70, color: '#8C7853' },
    { id: 2, name: 'Venus', size: 90, color: '#FFC649' },
    { id: 3, name: 'Earth', size: 95, color: '#4A90E2' },
    { id: 4, name: 'Mars', size: 80, color: '#E27B58' },
    { id: 5, name: 'Jupiter', size: 130, color: '#C88B3A' },
    { id: 6, name: 'Saturn', size: 120, color: '#FAD5A5' },
    { id: 7, name: 'Uranus', size: 100, color: '#4FD0E0' },
    { id: 8, name: 'Neptune', size: 95, color: '#4166F5' }
  ];
  const planets = basePlanets.map((p, i) => ({ 
    ...p, 
    distance: startOffsetPx + i * spacingPx 
  }));
  

  const handlePlanetClick = (planetName) => {
    if (planetName === 'Neptune' && neptuneRef.current) {
      const rect = neptuneRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setSpaceshipStartPos({ x: centerX, y: centerY });
      setSpaceshipEndPos(null);
      setShowSpaceship(true);
    } else if (planetName === 'Uranus') {
      onNavigate('uranus');
    } else if (planetName === 'Saturn') {
      onNavigate('saturn');
    } else if (planetName === 'Jupiter') {
      onNavigate('jupiter');
    }
  };

  const handleAnimationComplete = () => {
    // Navigate to Neptune page after animation
    if (onNavigate) {
      onNavigate('neptune');
    }
  };

  const handleTransferComplete = () => {
    setShowSpaceship(false);
    setSpaceshipEndPos(null);
    setHasPlayedTransfer(true);
  };

  // Trigger Neptune -> Uranus transfer when landing with payload
  useEffect(() => {
    if (hasPlayedTransfer) return;
    const flight = navPayload && navPayload.flight;
    if (!flight) return;
    if (flight.from === 'neptune' && flight.to === 'uranus') {
      // Compute centers once nodes are laid out
      const computeAndStart = () => {
        if (!neptuneRef.current || !uranusRef.current) return;
        
        const nRect = neptuneRef.current.getBoundingClientRect();
        const uRect = uranusRef.current.getBoundingClientRect();
        
        const neptuneCenter = { 
          x: nRect.left + nRect.width / 2, 
          y: nRect.top + nRect.height / 2 
        };
        const uranusCenter = { 
          x: uRect.left + uRect.width / 2, 
          y: uRect.top + uRect.height / 2 
        };
        
        console.log('Neptune center:', neptuneCenter, 'Uranus center:', uranusCenter);
        console.log('Neptune rect:', nRect, 'Uranus rect:', uRect);
        console.log('Neptune ref element:', neptuneRef.current);
        console.log('Uranus ref element:', uranusRef.current);
        
        setSpaceshipStartPos(neptuneCenter);
        setSpaceshipEndPos(uranusCenter);
        setShowSpaceship(true);
      };
      
      // Give more time for layout to settle, especially with horizontal scrolling
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => computeAndStart());
        });
      }, 300);
    }
  }, [navPayload, hasPlayedTransfer]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-x-auto overflow-y-hidden bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1229]">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <div className="relative">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => onNavigate && onNavigate('landing')}
            className="relative flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-2xl border transition-all duration-300 backdrop-blur-lg bg-gradient-to-r from-blue-500/30 to-blue-600/30 hover:from-blue-500/40 hover:to-blue-600/40 border-blue-400/60 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Home</span>
          </motion.button>
          {/* Button glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl -z-10 scale-110 opacity-60"></div>
        </div>
      </div>

      {/* Stars Background (static) */}
      <div className="absolute inset-0">
        {[...Array(140)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Main Solar System Container */}
      <div className="relative min-w-max h-full flex items-center justify-end pr-0">
        {/* Sun on the right - large and mostly on-screen (no animation) */}
        <div className="absolute right-[-200px] top-1/2 transform -translate-y-1/2 z-20">
          <img 
            src={sunImage} 
            alt="Sun" 
            className="w-[650px] h-[650px] object-contain drop-shadow-[0_0_100px_rgba(255,200,50,0.9)]"
          />
          {/* Sun glow effect */}
          <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-[100px] scale-150 -z-10" />
        </div>

       {/* Planets */} 
       <div className="relative h-full flex items-center justify-center" style={{ width: '1750px', paddingLeft: '120px' }}> 
       {planets.map((planet, index) => ( <div key={planet.id} className="absolute" style={{
        right: `${planet.distance}px` }} > 
        {/* Planet */} 
        <div 
          ref={planet.id === 8 ? neptuneRef : planet.id === 7 ? uranusRef : planet.id === 6 ? saturnRef : planet.id === 5 ? jupiterRef : null}
          onClick={planet.id === 8 ? () => handlePlanetClick('Neptune') : planet.id === 7 ? () => handlePlanetClick('Uranus') : planet.id === 6 ? () => handlePlanetClick('Saturn') : planet.id === 5 ? () => handlePlanetClick('Jupiter') : undefined}
          className={`relative rounded-full shadow-2xl ${(planet.id === 8 || planet.id === 7 || planet.id === 6 || planet.id === 5) ? 'cursor-pointer hover:scale-110 transition-transform duration-300' : ''}`}
          style={{ width: `${planet.size}px`, height: `${planet.size}px` }} >
                <img 
                  src={sunImage} 
                  alt={planet.name} 
                  className="w-full h-full object-contain rounded-full"
                  style={{ filter: `hue-rotate(${index * 45}deg) brightness(0.9)` }}
                />
                {/* Subtle planet glow */}
                <div 
                  className="absolute inset-0 rounded-full blur-xl -z-10"
                  style={{ backgroundColor: planet.color, opacity: 0.35, transform: 'scale(1.5)' }}
                />
                {/* Saturn ring */}
                {planet.id === 6 && (
                  <div 
                    className="absolute top-1/2 left-1/2 border-4 border-yellow-200/40 rounded-full"
                    style={{
                      width: `${planet.size * 1.8}px`,
                      height: `${planet.size * 0.6}px`,
                      transform: 'translate(-50%, -50%) rotateX(75deg)',
                      borderTopColor: 'transparent',
                      borderBottomColor: 'transparent'
                    }}
                  />
                )}
              </div>

              {/* Planet label */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2">
                <div className={`w-[80px] text-center py-1.5 rounded-full text-sm font-semibold shadow-lg ${
                  (planet.id === 8 || planet.id === 7 || planet.id === 6 || planet.id === 5) 
                    ? 'bg-blue-500/90 text-white animate-pulse' 
                    : 'bg-white/90 text-gray-900'
                }`}>
                  {planet.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Title (static) */}
      <div className="fixed top-10 left-10 z-30">
        <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-2">Your Financial Journey</h1>
        <p className="text-xl text-blue-200">Choose a planet to begin your adventure</p>
      </div>

      {/* Ambient light effects (static) */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Spaceship animation */}
      {showSpaceship && (
        <NeptuneSpaceship
          startPosition={spaceshipStartPos}
          endPosition={spaceshipEndPos}
          onAnimationComplete={spaceshipEndPos ? handleTransferComplete : handleAnimationComplete}
        />
      )}
    </div>
  );
};

export default SolarSystem;

