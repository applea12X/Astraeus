import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket } from 'lucide-react';
import Confetti from 'react-confetti';
import sunImage from '../assets/sun.png';
import mercuryImage from '../assets/mercury.png';
import venusImage from '../assets/venus.png';
import earthImage from '../assets/earth.png';
import marsImage from '../assets/mars.png';
import jupiterImage from '../assets/jupiter.png';
import saturnImage from '../assets/saturn.png';
import uranusImage from '../assets/uranus.png';
import neptuneImage from '../assets/neptune.png';
import NeptuneSpaceship from './ui/NeptuneSpaceship';
import { getUserProgress, startUserJourney, canAccessPlanet, PLANET_ORDER } from '../utils/userProgress';
import { auth } from '../firebase/config';
import AIShoppingAssistant from './AIShoppingAssistant';

const SolarSystem = ({ onNavigate, navPayload, userProfile }) => {
  const [showSpaceship, setShowSpaceship] = useState(false);
  const [spaceshipStartPos, setSpaceshipStartPos] = useState({ x: 0, y: 0 });
  const [spaceshipEndPos, setSpaceshipEndPos] = useState(null);
  const [hasPlayedTransfer, setHasPlayedTransfer] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [landedPlanet, setLandedPlanet] = useState(null);
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const scrollContainerRef = useRef(null);
  const neptuneRef = useRef(null);
  const uranusRef = useRef(null);
  const saturnRef = useRef(null);
  const jupiterRef = useRef(null);
  const marsRef = useRef(null);
  const earthRef = useRef(null);
  const animationStartedRef = useRef(false);
  const lastFlightRef = useRef(null);
  const celebrationTriggeredRef = useRef(false);
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

  // Planet image mapping
  const planetImages = {
    'Mercury': mercuryImage,
    'Venus': venusImage,
    'Earth': earthImage,
    'Mars': marsImage,
    'Jupiter': jupiterImage,
    'Saturn': saturnImage,
    'Uranus': uranusImage,
    'Neptune': neptuneImage
  };

  // Helper function to get ref for a planet
  const getPlanetRef = (planetId) => {
    switch(planetId) {
      case 8: return neptuneRef;
      case 7: return uranusRef;
      case 6: return saturnRef;
      case 5: return jupiterRef;
      case 4: return marsRef;
      case 3: return earthRef;
      default: return null;
    }
  };

  // Get a stable visual center based on the planet image (ignores glow/rings)
  const getPlanetImageCenter = (planetRef) => {
    if (!planetRef?.current) return null;
    const img = planetRef.current.querySelector('img');
    const target = img || planetRef.current;
    const rect = target.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

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
              // Find next uncompleted planet using correct order
              const planetIds = PLANET_ORDER.map(p => p.id);
              landed = planetIds.find(planet => !progress[`${planet}Completed`]) || 'jupiter';
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

  // Reload user progress when returning from planet completion
  useEffect(() => {
    const reloadProgressIfNeeded = async () => {
      const user = auth.currentUser;
      if (user && navPayload?.flight) {
        // Small delay to ensure progress update has been saved
        setTimeout(async () => {
          try {
            const progress = await getUserProgress(user.uid);
            setUserProgress(progress);

            // Update landed planet
            let landed = null;
            if (progress.journeyStarted) {
              if (progress.currentPlanet && !progress[`${progress.currentPlanet}Completed`]) {
                landed = progress.currentPlanet;
              } else {
                const planetIds = PLANET_ORDER.map(p => p.id);
                landed = planetIds.find(planet => !progress[`${planet}Completed`]) || 'earth';
              }
            }
            setLandedPlanet(landed);
          } catch (error) {
            console.error('Error reloading user progress:', error);
          }
        }, 1000);
      }
    };

    reloadProgressIfNeeded();
  }, [navPayload]);

  // Trigger celebration when returning from Earth with celebration payload
  useEffect(() => {
    if (navPayload?.celebration && !celebrationTriggeredRef.current) {
      celebrationTriggeredRef.current = true;

      // Start confetti immediately
      setShowCelebration(true);

      // Stop confetti after 10 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 10000);
    }
  }, [navPayload]);

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
      
      const nCenter = getPlanetImageCenter(neptuneRef);
      if (!nCenter) return;
      setAnimationInProgress(true);
      setSpaceshipStartPos({ x: nCenter.x, y: nCenter.y });
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
    } else if (planetName === 'Earth') {
      onNavigate('earth');
    }
  };

  const handleAnimationComplete = () => {
    setAnimationInProgress(false);
    // Reset animation guards to allow new animations
    animationStartedRef.current = false;
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
    // Reset animation guards to allow new animations
    animationStartedRef.current = false;

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

    // Prevent duplicate animations for the same flight path
    const flightKey = `${flight.from}-${flight.to}`;
    if (animationStartedRef.current || lastFlightRef.current === flightKey) {
      return;
    }

    // Mark animation as started IMMEDIATELY before any async operations
    animationStartedRef.current = true;
    lastFlightRef.current = flightKey;

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
          const nCenter = getPlanetImageCenter(neptuneRef);
          if (!nCenter) return;
          spaceshipStartPosition = {
            x: nCenter.x,
            y: nCenter.y - 40 // Approximate offset for spaceship position
          };
        }

        const uranusCenter = getPlanetImageCenter(uranusRef);
        if (!uranusCenter) return;

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
        if (!uranusRef.current || !saturnRef.current) {
          console.error('Refs not ready - uranusRef:', uranusRef.current, 'saturnRef:', saturnRef.current);
          return;
        }

        // Scroll to ensure both planets are visible
        // Saturn is closer to the sun (to the right), so scroll to show it
        saturnRef.current.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });

        // Debug: log the planet names and positions to verify refs are pointing to correct elements
        console.log('Uranus ref planet name:', uranusRef.current.querySelector('img')?.alt);
        console.log('Uranus parent right style:', uranusRef.current.parentElement?.style.right);
        console.log('Saturn ref planet name:', saturnRef.current.querySelector('img')?.alt);
        console.log('Saturn parent right style:', saturnRef.current.parentElement?.style.right);
        console.log('Jupiter ref planet name:', jupiterRef.current?.querySelector('img')?.alt);
        console.log('Jupiter parent right style:', jupiterRef.current?.parentElement?.style.right);

        // Wait a tick for scroll to complete before calculating positions
        requestAnimationFrame(() => {
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
            const uCenter = getPlanetImageCenter(uranusRef);
            if (!uCenter) return;
            spaceshipStartPosition = {
              x: uCenter.x,
              y: uCenter.y - 40 // Approximate offset for spaceship position
            };
          }

          const saturnCenter = getPlanetImageCenter(saturnRef);
          if (!saturnCenter) return;

          console.log('Uranus to Saturn - Spaceship start position:', spaceshipStartPosition, 'Saturn center:', saturnCenter);
          console.log('Saturn ref bounding rect (via img):', saturnCenter);

          setAnimationInProgress(true);
          setSpaceshipStartPos(spaceshipStartPosition);
          setSpaceshipEndPos(saturnCenter);
          setShowSpaceship(true);
        });
      };

      // Give more time for layout to settle
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => computeAndStart());
        });
      }, 300);
    } else if (flight.from === 'saturn' && flight.to === 'jupiter') {
      // Saturn to Jupiter transfer animation
      const computeAndStart = () => {
        if (!saturnRef.current || !jupiterRef.current) return;
        
        // Try to get the landed spaceship position first
        const landedSpaceshipElement = document.getElementById('landed-spaceship-saturn');
        let spaceshipStartPosition;
        
        if (landedSpaceshipElement) {
          const spaceshipRect = landedSpaceshipElement.getBoundingClientRect();
          spaceshipStartPosition = {
            x: spaceshipRect.left + spaceshipRect.width / 2,
            y: spaceshipRect.top + spaceshipRect.height / 2
          };
        } else {
          // Fallback to planet center if no landed spaceship found
          const sCenter = getPlanetImageCenter(saturnRef);
          if (!sCenter) return;
          spaceshipStartPosition = { 
            x: sCenter.x, 
            y: sCenter.y - 40 // Approximate offset for spaceship position
          };
        }
        
        const jupiterCenter = getPlanetImageCenter(jupiterRef);
        if (!jupiterCenter) return;
        
        console.log('Saturn to Jupiter - Spaceship start position:', spaceshipStartPosition, 'Jupiter center:', jupiterCenter);

        setAnimationInProgress(true);
        setSpaceshipStartPos(spaceshipStartPosition);
        setSpaceshipEndPos(jupiterCenter);
        setShowSpaceship(true);
      };

      // Give more time for layout to settle
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => computeAndStart());
        });
      }, 300);
    } else if (flight.from === 'jupiter' && flight.to === 'mars') {
      // Jupiter to Mars transfer animation
      const computeAndStart = () => {
        if (!jupiterRef.current || !marsRef.current) return;
        
        // Try to get the landed spaceship position first
        const landedSpaceshipElement = document.getElementById('landed-spaceship-jupiter');
        let spaceshipStartPosition;
        
        if (landedSpaceshipElement) {
          const spaceshipRect = landedSpaceshipElement.getBoundingClientRect();
          spaceshipStartPosition = {
            x: spaceshipRect.left + spaceshipRect.width / 2,
            y: spaceshipRect.top + spaceshipRect.height / 2
          };
        } else {
          // Fallback to planet center if no landed spaceship found
          const jCenter = getPlanetImageCenter(jupiterRef);
          if (!jCenter) return;
          spaceshipStartPosition = { 
            x: jCenter.x, 
            y: jCenter.y - 40 // Approximate offset for spaceship position
          };
        }
        
        const marsCenter = getPlanetImageCenter(marsRef);
        if (!marsCenter) return;
        
        console.log('Jupiter to Mars - Spaceship start position:', spaceshipStartPosition, 'Mars center:', marsCenter);

        setAnimationInProgress(true);
        setSpaceshipStartPos(spaceshipStartPosition);
        setSpaceshipEndPos(marsCenter);
        setShowSpaceship(true);
      };

      // Give more time for layout to settle
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => computeAndStart());
        });
      }, 300);
    } else if (flight.from === 'mars' && flight.to === 'earth') {
      // Mars to Earth transfer animation
      const computeAndStart = () => {
        if (!marsRef.current || !earthRef.current) return;
        
        // Try to get the landed spaceship position first
        const landedSpaceshipElement = document.getElementById('landed-spaceship-mars');
        let spaceshipStartPosition;
        
        if (landedSpaceshipElement) {
          const spaceshipRect = landedSpaceshipElement.getBoundingClientRect();
          spaceshipStartPosition = {
            x: spaceshipRect.left + spaceshipRect.width / 2,
            y: spaceshipRect.top + spaceshipRect.height / 2
          };
        } else {
          // Fallback to planet center if no landed spaceship found
          const mCenter = getPlanetImageCenter(marsRef);
          if (!mCenter) return;
          spaceshipStartPosition = { 
            x: mCenter.x, 
            y: mCenter.y - 40 // Approximate offset for spaceship position
          };
        }
        
        const earthCenter = getPlanetImageCenter(earthRef);
        if (!earthCenter) return;
        
        console.log('Mars to Earth - Spaceship start position:', spaceshipStartPosition, 'Earth center:', earthCenter);

        setAnimationInProgress(true);
        setSpaceshipStartPos(spaceshipStartPosition);
        setSpaceshipEndPos(earthCenter);
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
    <div className="fixed inset-0 w-screen h-screen overflow-x-hidden overflow-y-hidden bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1229]">
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
          ref={getPlanetRef(planet.id)}
          onClick={planet.id === 8 ? () => handlePlanetClick('Neptune') : planet.id === 7 ? () => handlePlanetClick('Uranus') : planet.id === 6 ? () => handlePlanetClick('Saturn') : planet.id === 5 ? () => handlePlanetClick('Jupiter') : planet.id === 4 ? () => handlePlanetClick('Mars') : planet.id === 3 ? () => handlePlanetClick('Earth') : undefined}
          className={`relative rounded-full shadow-2xl ${
            (planet.id === 8 || planet.id === 7 || planet.id === 6 || planet.id === 5 || planet.id === 4 || planet.id === 3) ? 
              userProgress && (canAccessPlanet(userProgress, planet.name.toLowerCase()) || userProgress?.[`${planet.name.toLowerCase()}Completed`]) || planet.id === 8 ?
                'cursor-pointer hover:scale-110 transition-transform duration-300' :
                'cursor-not-allowed opacity-50' :
              ''
          }`}
          style={{ width: `${planet.size}px`, height: `${planet.size}px` }} >
                <img
                  src={planetImages[planet.name]}
                  alt={planet.name}
                  className="w-full h-full object-contain rounded-full relative z-10"
                />
                {/* Subtle planet glow */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                  style={{
                    backgroundColor: planet.color,
                    opacity: 0.4,
                    width: `${planet.size * 1.5}px`,
                    height: `${planet.size * 1.5}px`,
                    zIndex: 0
                  }}
                />
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
                  (planet.id === 8 || planet.id === 7 || planet.id === 6 || planet.id === 5 || planet.id === 4 || planet.id === 3) 
                    ? userProgress && (canAccessPlanet(userProgress, planet.name.toLowerCase()) || userProgress?.[`${planet.name.toLowerCase()}Completed`]) || planet.id === 8
                      ? (planet.id === 4 ? 'bg-red-500/90 text-white animate-pulse' : planet.id === 5 ? 'bg-orange-500/90 text-white animate-pulse' : planet.id === 3 ? 'bg-blue-500/90 text-white animate-pulse' : 'bg-blue-500/90 text-white animate-pulse')
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
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-30 text-center">
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

      {/* Celebration Confetti */}
      {showCelebration && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={500}
          recycle={true}
          colors={['#ff0000', '#cc0000', '#ffffff', '#ff6b6b', '#ffd700', '#ff1493']}
          gravity={0.3}
        />
      )}

      {/* AI Shopping Assistant */}
      <AIShoppingAssistant
        selectedVehicle={null}
        financialInfo={{}}
        userProfile={userProfile}
        currentPageName="solar-system"
      />
    </div>
  );
};

export default SolarSystem;

