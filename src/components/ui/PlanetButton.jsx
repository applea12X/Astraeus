import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { getPlanetTheme, animations } from '@/constants/theme';
import { cn } from '@/lib/utils';

/**
 * Standardized button component with planet-themed styling
 *
 * @param {Object} props
 * @param {'neptune'|'mars'|'uranus'|'saturn'|'jupiter'} props.planet - Planet theme
 * @param {'primary'|'secondary'|'back'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {string} props.icon - Icon component (for back button)
 */
export const PlanetButton = ({
  planet = 'neptune',
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className,
  disabled = false,
  loading = false,
  icon,
  ...props
}) => {
  const theme = getPlanetTheme(planet);

  // Size configurations
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Variant configurations
  const variants = {
    primary: `
      bg-gradient-to-r from-[${theme.medium}]/30 to-[${theme.light}]/30
      hover:from-[${theme.medium}]/40 hover:to-[${theme.light}]/40
      border-[${theme.accent}]/60
      shadow-lg shadow-[${theme.accent}]/20
      hover:shadow-xl hover:shadow-[${theme.accent}]/30
    `,
    secondary: `
      bg-white/10 hover:bg-white/20
      border-white/20 hover:border-white/30
      shadow-lg shadow-white/10
      hover:shadow-xl hover:shadow-white/20
    `,
    back: `
      bg-white/10 hover:bg-white/20
      border-[${theme.accent}]/40 hover:border-[${theme.accent}]/60
      shadow-md shadow-[${theme.accent}]/10
    `,
  };

  const baseClasses = cn(
    'relative',
    'inline-flex items-center justify-center gap-2',
    'font-semibold text-white',
    'rounded-xl',
    'border-2',
    'backdrop-blur-md',
    'transition-all duration-300',
    'transform hover:scale-105',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
    sizes[size],
    variants[variant],
    className
  );

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ ...animations.pageTransition, duration: 0.2 }}
      {...props}
    >
      {/* Glow effect layer */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${theme.accent}20 0%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {variant === 'back' && (icon || <ChevronLeft size={20} />)}
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
};

/**
 * Specialized back button with consistent styling
 */
export const BackButton = ({ planet = 'neptune', onClick, className, ...props }) => {
  return (
    <PlanetButton
      planet={planet}
      variant="back"
      size="md"
      onClick={onClick}
      className={cn('group', className)}
      {...props}
    >
      Back
    </PlanetButton>
  );
};

export default PlanetButton;
