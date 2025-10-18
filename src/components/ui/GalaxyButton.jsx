import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const GalaxyButton = ({ children, onClick, className = '' }) => {
  const ref = useRef(null);

  const handlePointerMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--gx', `${x}px`);
    el.style.setProperty('--gy', `${y}px`);
  };

  return (
    <motion.button
      ref={ref}
      onPointerMove={handlePointerMove}
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`galaxy-btn relative overflow-hidden rounded-lg px-24 h-[45px] text-xl font-extrabold text-white border border-white/60 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-[box-shadow,filter] duration-300 ${className}`}
      style={{
        WebkitTextStroke: '0 transparent'
      }}
    >
      {/* Soft outer glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_10px_40px_rgba(59,130,246,0.25)]"
      />

      {/* Galaxy gradient that reacts to cursor */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-[inherit] opacity-80 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(180px 180px at var(--gx, 50%) var(--gy, 50%), rgba(56,189,248,0.55), transparent 60%),\
             radial-gradient(220px 220px at calc(var(--gx, 50%) + 80px) calc(var(--gy, 50%) - 40px), rgba(236,72,153,0.5), transparent 60%),\
             radial-gradient(200px 200px at calc(var(--gx, 50%) - 90px) calc(var(--gy, 50%) + 20px), rgba(251,146,60,0.45), transparent 60%),\
             radial-gradient(260px 260px at 80% 50%, rgba(147,51,234,0.35), transparent 70%)',
          filter: 'blur(18px)'
        }}
      />

      {/* Subtle inner glass panel */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[inherit] bg-white/5"/>

      {/* Label with hover/active style transitions */}
      <span className="label relative z-10 select-none transition-[text-shadow,opacity] duration-300">
        {children}
      </span>

      {/* Active state outline text overlay */}
      <style>{`
        button:active > span.relative { opacity: 0.9; }
        button:active { box-shadow: 0 12px 45px rgba(99,102,241,0.35); }
        button:active span[aria-hidden].absolute { opacity: 1; }
      `}</style>
    </motion.button>
  );
};

export default GalaxyButton;

