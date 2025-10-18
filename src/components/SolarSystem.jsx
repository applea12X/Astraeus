import React from 'react';
import sunImage from '../assets/sun.png';

const SolarSystem = () => {
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
  const planets = basePlanets.map((p, i) => ({ ...p, distance: startOffsetPx + i * spacingPx }));

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-x-auto overflow-y-hidden bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1229]">
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
        <div className="relative rounded-full shadow-2xl" 
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
                <div className="bg-white/90 text-gray-900 w-[80px] text-center py-1.5 rounded-full text-sm font-semibold shadow-lg">
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
    </div>
  );
};

export default SolarSystem;

