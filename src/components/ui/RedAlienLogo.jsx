import React from 'react';

const RedAlienLogo = ({ size = 160, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer glow */}
      <circle cx="100" cy="100" r="90" fill="url(#alienGlow)" opacity="0.3" />
      
      {/* Head */}
      <ellipse cx="100" cy="90" rx="70" ry="80" fill="url(#alienGradient)" />
      
      {/* Eyes */}
      <ellipse cx="75" cy="85" rx="20" ry="28" fill="#000000" />
      <ellipse cx="125" cy="85" rx="20" ry="28" fill="#000000" />
      
      {/* Eye shine */}
      <ellipse cx="78" cy="78" rx="8" ry="10" fill="#ffffff" opacity="0.6" />
      <ellipse cx="128" cy="78" rx="8" ry="10" fill="#ffffff" opacity="0.6" />
      
      {/* Antennas */}
      <line x1="70" y1="30" x2="60" y2="10" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
      <line x1="130" y1="30" x2="140" y2="10" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
      <circle cx="60" cy="10" r="8" fill="#EF4444" />
      <circle cx="140" cy="10" r="8" fill="#EF4444" />
      
      {/* Antenna glow */}
      <circle cx="60" cy="10" r="12" fill="#EF4444" opacity="0.3" />
      <circle cx="140" cy="10" r="12" fill="#EF4444" opacity="0.3" />
      
      {/* Mouth */}
      <path
        d="M 80 110 Q 100 120 120 110"
        stroke="#000000"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Body suggestion */}
      <ellipse cx="100" cy="170" rx="40" ry="25" fill="url(#bodyGradient)" opacity="0.8" />
      
      {/* Gradients */}
      <defs>
        <radialGradient id="alienGradient" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="70%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </radialGradient>
        
        <radialGradient id="bodyGradient" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#DC2626" />
        </radialGradient>
        
        <radialGradient id="alienGlow">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default RedAlienLogo;

