import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, ChevronRight } from 'lucide-react';
import sunImage from '../assets/sun.png';
import NeptuneSpaceship from './ui/NeptuneSpaceship';
import AvatarGuide from './ui/AvatarGuide';
import { getUserProgress, getGuideMessage, getNextSuggestion, startUserJourney, canAccessPlanet } from '../utils/userProgress';
import { auth } from '../firebase/config';

const SolarSystem = ({ onNavigate, navPayload, userProfile }) => {
  const [showSpaceship, setShowSpaceship] = useState(false);
  const [spaceshipStartPos, setSpaceshipStartPos] = useState({ x: 0, y: 0 });
  const [spaceshipEndPos, setSpaceshipEndPos] = useState(null);
  const [hasPlayedTransfer, setHasPlayedTransfer] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [landedPlanet, setLandedPlanet] = useState(null);
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const neptuneRef = useRef(null);
  const uranusRef = useRef(null);
  const saturnRef = useRef(null);
  const jupiterRef = useRef(null);
  const marsRef = useRef(null);
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
  

  // Load user progress on component mount
  useEffect(() => {
    const loadUserProgress = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const progress = await getUserProgress(user.uid);
          setUserProgress(progress);
          
          // Determine landed planet - should be the next planet to visit
          let landed = null;
          if (progress.journeyStarted) {
            if (progress.currentPlanet && !progress[`${progress.currentPlanet}Completed`]) {
              // Current planet not completed yet
              landed = progress.currentPlanet;
            } else {
              // Find next uncompleted planet
              const planets = ['neptune', 'uranus', 'saturn', 'mars', 'jupiter'];
              landed = planets.find(planet => !progress[`${planet}Completed`]) || 'jupiter';
            }
          }
          setLandedPlanet(landed);
          
        } catch (error) {
          console.error('Error loading user progress:', error);
        }
      }
      setLoadingProgress(false);
    };

    loadUserProgress();
  }, []);

  const handlePlanetClick = async (planetName) => {
    const planetId = planetName.toLowerCase();
    
    // Check if user can access this planet
    if (userProgress && !canAccessPlanet(userProgress, planetId) && planetId !== 'neptune') {
      // Show message about completing prerequisites
      return;
    }

    // Special handling for Neptune (starting point)
    if (planetName === 'Neptune' && neptuneRef.current) {
      // Mark journey as started if it hasn't been
      const user = auth.currentUser;
      if (user && !userProgress?.journeyStarted) {
        await startUserJourney(user.uid);
        // Reload progress
        const updatedProgress = await getUserProgress(user.uid);
        setUserProgress(updatedProgress);
      }
      
      const rect = neptuneRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setAnimationInProgress(true);
      setSpaceshipStartPos({ x: centerX, y: centerY });
      setSpaceshipEndPos(null);
      setShowSpaceship(true);
    } else if (planetName === 'Uranus') {
      onNavigate('uranus');
    } else if (planetName === 'Saturn') {
      onNavigate('saturn');
    } else if (planetName === 'Jupiter') {
      onNavigate('jupiter');
    } else if (planetName === 'Mars') {
      onNavigate('mars');
    }
  };

  const handleAnimationComplete = () => {
    setAnimationInProgress(false);
    // Navigate to Neptune page after animation
    if (onNavigate) {
      onNavigate('neptune');
    }
  };

  const handleTransferComplete = () => {
    setShowSpaceship(false);
    setSpaceshipEndPos(null);
    setHasPlayedTransfer(true);
    setAnimationInProgress(false);
    
    // Update landed planet to the destination and navigate to the planet page
    const flight = navPayload && navPayload.flight;
    if (flight && flight.to) {
      setLandedPlanet(flight.to);
      
      // Navigate to the destination planet page after animation completes
      setTimeout(() => {
        if (onNavigate) {
          onNavigate(flight.to);
        }
      }, 1000); // Small delay to show the landed spaceship briefly
    }
  };

  // Trigger planet transfer when landing with payload
  useEffect(() => {
    if (hasPlayedTransfer) return;
    const flight = navPayload && navPayload.flight;
    if (!flight) return;
    
    if (flight.from === 'neptune' && flight.to === 'uranus') {
      // Compute centers once nodes are laid out
      const computeAndStart = () => {
        if (!neptuneRef.current || !uranusRef.current) return;
        
        // Try to get the landed spaceship position first
        const landedSpaceshipElement = document.getElementById('landed-spaceship-neptune');
        let spaceshipStartPosition;
        
        if (landedSpaceshipElement) {
          const spaceshipRect = landedSpaceshipElement.getBoundingClientRect();
          spaceshipStartPosition = {
            x: spaceshipRect.left + spaceshipRect.width / 2,
            y: spaceshipRect.top + spaceshipRect.height / 2
          };
        } else {
          // Fallback to planet center if no landed spaceship found
          const nRect = neptuneRef.current.getBoundingClientRect();
          spaceshipStartPosition = { 
            x: nRect.left + nRect.width / 2, 
            y: nRect.top + nRect.height / 2 - 40 // Approximate offset for spaceship position
          };
        }
        
        const uRect = uranusRef.current.getBoundingClientRect();
        const uranusCenter = { 
          x: uRect.left + uRect.width / 2, 
          y: uRect.top + uRect.height / 2 
        };
        
        console.log('Spaceship start position:', spaceshipStartPosition, 'Uranus center:', uranusCenter);
        
        setAnimationInProgress(true);
        setSpaceshipStartPos(spaceshipStartPosition);
        setSpaceshipEndPos(uranusCenter);
        setShowSpaceship(true);
      };
      
      // Give more time for layout to settle, especially with horizontal scrolling
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => computeAndStart());
        });
      }, 300);
    } else if (flight.from === 'uranus' && flight.to === 'saturn') {
      // Uranus to Saturn transfer animation
      const computeAndStart = () => {
        if (!uranusRef.current || !saturnRef.current) return;
        
        // Try to get the landed spaceship position first
        const landedSpaceshipElement = document.getElementById('landed-spaceship-uranus');
        let spaceshipStartPosition;
        
        if (landedSpaceshipElement) {
          const spaceshipRect = landedSpaceshipElement.getBoundingClientRect();
          spaceshipStartPosition = {
            x: spaceshipRect.left + spaceshipRect.width / 2,
            y: spaceshipRect.top + spaceshipRect.height / 2
          };
        } else {
          // Fallback to planet center if no landed spaceship found
          const uRect = uranusRef.current.getBoundingClientRect();
          spaceshipStartPosition = { 
            x: uRect.left + uRect.width / 2, 
            y: uRect.top + uRect.height / 2 - 40 // Approximate offset for spaceship position
          };
        }
        
        const sRect = saturnRef.current.getBoundingClientRect();
        const saturnCenter = { 
          x: sRect.left + sRect.width / 2, 
          y: sRect.top + sRect.height / 2 
        };
        
        console.log('Uranus to Saturn - Spaceship start position:', spaceshipStartPosition, 'Saturn center:', saturnCenter);
        
        setAnimationInProgress(true);
        setSpaceshipStartPos(spaceshipStartPosition);
        setSpaceshipEndPos(saturnCenter);
        setShowSpaceship(true);
      };
      
      // Give more time for layout to settle
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
          ref={planet.id === 8 ? neptuneRef : planet.id === 7 ? uranusRef : planet.id === 6 ? saturnRef : planet.id === 5 ? jupiterRef : planet.id === 4 ? marsRef : null}
          onClick={planet.id === 8 ? () => handlePlanetClick('Neptune') : planet.id === 7 ? () => handlePlanetClick('Uranus') : planet.id === 6 ? () => handlePlanetClick('Saturn') : planet.id === 5 ? () => handlePlanetClick('Jupiter') : planet.id === 4 ? () => handlePlanetClick('Mars') : undefined}
          className={`relative rounded-full shadow-2xl ${
            (planet.id === 8 || planet.id === 7 || planet.id === 6 || planet.id === 5 || planet.id === 4) ? 
              userProgress && canAccessPlanet(userProgress, planet.name.toLowerCase()) || planet.id === 8 ?
                'cursor-pointer hover:scale-110 transition-transform duration-300' :
                'cursor-not-allowed opacity-50' :
              ''
          }`}
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

              {/* Landed Spaceship Indicator */}
              {landedPlanet === planet.name.toLowerCase() && !animationInProgress && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 z-10"
                  id={`landed-spaceship-${planet.name.toLowerCase()}`}
                >
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    {/* Static version of spaceship */}
                    <div className="relative transform -rotate-45">
                      <Rocket 
                        className="w-10 h-10 text-red-500 drop-shadow-lg" 
                        strokeWidth={2} 
                        fill="#ef4444" 
                      />
                    </div>
                    
                    {/* Mascot "Cam" in the window */}
                    <div className="absolute top-2 left-3 w-4 h-4 bg-blue-400 rounded-full border border-cyan-300 flex items-center justify-center z-10">
                      <div className="text-sm">🐱</div>
                    </div>

                    {/* Gentle pulsing glow */}
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [0.8, 1.1, 0.8]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-red-400/30 rounded-full blur-sm scale-150"
                    />
                  </div>
                </motion.div>
              )}

              {/* Completed indicator */}
              {userProgress?.[`${planet.name.toLowerCase()}Completed`] && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10"
                >
                  <span className="text-white text-xs font-bold">✓</span>
                </motion.div>
              )}

              {/* Planet label */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2">
                <div className={`w-[80px] text-center py-1.5 rounded-full text-sm font-semibold shadow-lg ${
                  (planet.id === 8 || planet.id === 7 || planet.id === 6 || planet.id === 5 || planet.id === 4) 
                    ? userProgress && canAccessPlanet(userProgress, planet.name.toLowerCase()) || planet.id === 8
                      ? (planet.id === 4 ? 'bg-red-500/90 text-white animate-pulse' : 'bg-blue-500/90 text-white animate-pulse')
                      : 'bg-gray-500/90 text-gray-300'
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
      
      {/* Next Planet Suggestion Button */}
      {!loadingProgress && userProgress && userProgress.journeyStarted && (
        (() => {
          const suggestion = getNextSuggestion(userProgress);
          return suggestion.action !== 'stay' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-24 right-6 z-40"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (suggestion.planet) {
                    const planetRoutes = {
                      neptune: 'neptune',
                      uranus: 'uranus', 
                      saturn: 'saturn',
                      mars: 'mars',
                      jupiter: 'jupiter'
                    };
                    onNavigate(planetRoutes[suggestion.planet]);
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 font-semibold"
              >
                <span>{suggestion.title}</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          );
        })()
      )}

      {/* Avatar Guide */}
      {!loadingProgress && (
        <AvatarGuide
          message={getGuideMessage(userProgress, userProfile?.firstName, 'solar-system')}
          userName={userProfile?.firstName || 'Friend'}
          position="bottom-right"
          autoShow={true}
          persistent={false}
        />
      )}

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

