import React from 'react';
import { motion } from 'framer-motion';
import { BackButton } from './PlanetButton';
import { getPlanetTheme, animations, spacing } from '@/constants/theme';
import { cn } from '@/lib/utils';

/**
 * Standardized layout wrapper for planet-themed pages
 *
 * @param {Object} props
 * @param {'neptune'|'mars'|'uranus'|'saturn'|'jupiter'} props.planet - Planet theme
 * @param {React.ReactNode} props.children - Page content
 * @param {Function} props.onBack - Back button handler
 * @param {boolean} props.showBackButton - Show/hide back button
 * @param {string} props.title - Page title (optional)
 * @param {string} props.subtitle - Page subtitle (optional)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.backgroundStyle - Custom background styles
 */
export const PlanetPageLayout = ({
  planet = 'neptune',
  children,
  onBack,
  showBackButton = true,
  title,
  subtitle,
  className,
  backgroundStyle,
}) => {
  const theme = getPlanetTheme(planet);

  const defaultBackground = {
    background: `radial-gradient(ellipse at top, ${theme.dark} 0%, #0a0e27 50%, #1a1f3a 100%)`,
  };

  return (
    <motion.div
      className={cn(
        'min-h-screen w-full',
        'flex flex-col items-center justify-center',
        'relative overflow-hidden',
        'p-8',
        className
      )}
      style={backgroundStyle || defaultBackground}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animations.variants.page}
      transition={animations.pageTransition}
    >
      {/* Ambient glow effects */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.light} 0%, transparent 70%)` }}
      />

      {/* Back button */}
      {showBackButton && onBack && (
        <motion.div
          className="fixed top-8 left-8 z-50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BackButton planet={planet} onClick={onBack} />
        </motion.div>
      )}

      {/* Header section */}
      {(title || subtitle) && (
        <motion.div
          className="text-center mb-12 space-y-4 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title && (
            <h1 className="text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {children}
      </div>

      {/* Decorative stars background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.2,
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Content card wrapper with glassmorphism effect
 */
export const PlanetCard = ({ planet = 'neptune', children, className, ...props }) => {
  const theme = getPlanetTheme(planet);

  return (
    <motion.div
      className={cn(
        'relative',
        'backdrop-blur-lg bg-white/10',
        'border-2 border-white/20',
        'rounded-2xl',
        'p-8',
        'shadow-2xl',
        className
      )}
      style={{
        boxShadow: `0 0 40px ${theme.accent}20`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, ...animations.spring.default }}
      {...props}
    >
      {/* Card glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-50 -z-10"
        style={{
          background: `radial-gradient(circle at top, ${theme.accent}15 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {children}
    </motion.div>
  );
};

export default PlanetPageLayout;
