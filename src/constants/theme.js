// Design System Constants for HackTX-TFS

export const colors = {
  // Background gradients
  space: {
    dark: '#0a0e27',
    medium: '#1a1f3a',
    light: '#0f1229',
  },

  // Planet themes
  planets: {
    neptune: {
      dark: '#1a237e',
      medium: '#283593',
      light: '#3949ab',
      accent: '#4FD0E0',
    },
    mars: {
      dark: '#8B2500',
      medium: '#A0522D',
      light: '#CD853F',
      accent: '#E27B58',
    },
    uranus: {
      dark: '#1e3a5f',
      medium: '#2563eb',
      light: '#60a5fa',
      accent: '#4FD0E0',
    },
    saturn: {
      dark: '#713f12',
      medium: '#ca8a04',
      light: '#fbbf24',
      accent: '#fcd34d',
    },
    jupiter: {
      dark: '#7c2d12',
      medium: '#ea580c',
      light: '#fb923c',
      accent: '#fdba74',
    },
  },

  // Interactive colors
  primary: {
    blue: '#4166F5',
    blueLight: '#3B82F6',
    purple: '#9333EA',
    cyan: '#4FD0E0',
  },

  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Glass effects
  glass: {
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white30: 'rgba(255, 255, 255, 0.3)',
    black10: 'rgba(0, 0, 0, 0.1)',
    black20: 'rgba(0, 0, 0, 0.2)',
  },
};

export const spacing = {
  // Base spacing scale (in pixels)
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px

  // Component-specific spacing
  component: {
    cardPadding: '2rem',
    buttonPadding: '0.75rem 2rem',
    inputPadding: '0.75rem 1rem',
    sectionGap: '3rem',
  },
};

export const typography = {
  // Font sizes
  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },

  // Font weights
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line heights
  lineHeights: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
  },
};

export const animations = {
  // Durations
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '1000ms',
  },

  // Easing functions
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Page transitions
  pageTransition: {
    type: 'tween',
    ease: [0.4, 0, 0.2, 1],
    duration: 0.5,
  },

  // Variants
  variants: {
    page: {
      initial: { opacity: 0, x: 300 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 1, x: -300 },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
  },

  // Spring configs
  spring: {
    default: { stiffness: 100, damping: 12 },
    stiff: { stiffness: 200, damping: 20 },
    soft: { stiffness: 50, damping: 10 },
  },
};

export const effects = {
  // Blur values
  blur: {
    sm: 'blur(4px)',
    md: 'blur(12px)',
    lg: 'blur(24px)',
    xl: 'blur(40px)',
  },

  // Border radius
  radius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Glow effects
  glow: {
    blue: 'drop-shadow(0 0 20px rgba(65, 102, 245, 0.3))',
    purple: 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.3))',
    cyan: 'drop-shadow(0 0 20px rgba(79, 208, 224, 0.3))',
    red: 'drop-shadow(0 0 20px rgba(226, 123, 88, 0.3))',
    yellow: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.3))',
  },
};

// Helper function to get planet theme
export const getPlanetTheme = (planetName) => {
  const planet = planetName?.toLowerCase();
  return colors.planets[planet] || colors.planets.neptune;
};

// Helper function to create glassmorphism classes
export const glassEffect = (opacity = 10) => {
  return `backdrop-blur-lg bg-white/${opacity} border border-white/20`;
};
