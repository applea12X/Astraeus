# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Toyota Financial Services (TFS) web application that gamifies the car shopping and financing experience through a solar system-themed journey. Built with React, Firebase, and AI-powered recommendations, it guides users through financial onboarding, vehicle preference selection, and personalized Toyota/Lexus recommendations.

## Development Commands

```bash
# Start development server (Vite with HMR at http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Architecture & Application Flow

### Page Navigation System
The app uses a custom navigation system managed in `App.jsx` through state (`currentPage`). Navigation flows through a solar system metaphor where each planet represents a different stage of the car buying journey:

1. **Landing Page** → Initial entry point with authentication
2. **Solar System** → Interactive planet selection hub
3. **Neptune** → Introduction to financial planning
4. **Uranus** → Vehicle preferences collection (via `UranusFormPage`)
5. **Saturn** → AI-powered vehicle recommendations (using Google Gemini API)
6. **Financial Info Page** → Detailed financial profile collection
7. **Saturn Results Page** → Final recommendations with financing options

### Key State Management Patterns

**App.jsx** orchestrates global state:
- `user` - Firebase authentication state
- `userProfile` - Firestore user document data
- `currentPage` - Navigation state (string-based page routing)
- `vehiclePreferences` - User's vehicle selection criteria
- `financialInfo` - User's financial profile data
- `navPayload` - Navigation metadata (e.g., spaceship animation triggers)

### Firebase Integration

Firebase is configured in `src/firebase/config.js` with services:
- **Authentication** (`auth`) - User sign-in/sign-up
- **Firestore** (`db`) - User profiles stored in `users` collection
- **Storage** (`storage`) - For file uploads if needed
- **Analytics** (`analytics`) - Usage tracking

**IMPORTANT**: The actual Firebase credentials are currently hardcoded in the config file. For production, these should be moved to environment variables using the `VITE_FIREBASE_*` pattern shown in the README.

### AI Integration

The app uses **Google Gemini API** (`@google/generative-ai`) for vehicle recommendations:
- Model: `gemini-2.5-flash`
- Location: `SaturnResultsPage.jsx` (lines 18-200+)
- API Key: Stored in `VITE_GEMINI_API_KEY` environment variable
- The AI prompt combines user profile, financial info, and vehicle preferences to generate 5-10 personalized Toyota/Lexus recommendations with financing options

### Component Architecture

**UI Components** (`src/components/ui/`):
- Radix UI primitives for accessible components
- Custom components: `NeptuneSpaceship`, `SignInForm`, `SignUpForm`, `UserProfileDropdown`, `GalaxyButton`
- Styled with Tailwind CSS utility classes

**Page Components** (`src/components/`):
- Each planet has a dedicated page component
- Pages receive `onNavigate` callback for navigation and optional data props
- Framer Motion animations for page transitions and interactive elements

### Styling System

- **Tailwind CSS 4.x** with `@tailwindcss/vite` plugin
- Path alias: `@/` maps to `src/` (configured in `vite.config.js`)
- Dark space theme with gradient backgrounds
- Custom animations using Framer Motion
- Utility functions in `src/lib/utils.js` (likely for className merging)

## Important Patterns & Conventions

### Navigation Pattern
```javascript
// Pages receive onNavigate prop
onNavigate('page-name', optionalPayload)

// For spaceship animations between planets
onNavigate('solar-system', { flight: { from: 'neptune', to: 'uranus' } })
```

### Data Flow for Recommendations
1. User fills out vehicle preferences in `UranusFormPage`
2. Preferences stored via `handleSubmitPreferences` in App.jsx
3. User fills financial info in `FinancialInfoPage`
4. Financial info stored via `handleSubmitFinancialInfo`
5. Both datasets passed to `SaturnResultsPage` along with `userProfile` from Firestore
6. AI generates recommendations combining all three data sources

### Environment Variables
Required in `.env` file (prefix with `VITE_` for Vite):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_GEMINI_API_KEY` (for AI recommendations)

### Animation Patterns
- Page transitions use Framer Motion's `AnimatePresence` with slide-in/slide-out effects
- Spaceship component (`NeptuneSpaceship.jsx`) animates between planet positions using absolute positioning and motion paths
- Planet interactions use hover scale transforms and glow effects

## Technology Stack

- **React 19.1.1** - UI library
- **Vite 7.x** - Build tool and dev server
- **Tailwind CSS 4.x** - Styling (@tailwindcss/vite plugin)
- **Firebase 12.x** - Authentication, Firestore, Storage
- **Framer Motion 12.x** - Animations
- **Google Generative AI** - Vehicle recommendations
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **React Hook Form + Zod** - Form handling and validation
- **Three.js** - 3D graphics (if needed for enhanced visuals)

## Code Quality

ESLint configuration (eslint.config.js):
- React Hooks rules enforced
- React Refresh plugin for HMR
- Unused vars allowed if uppercase (constants pattern)
- Browser globals enabled

## Development Notes

- The solar system layout uses absolute positioning with horizontal scrolling
- Planet positions calculated using `spacingPx` and `startOffsetPx` constants
- Spaceship animations require refs to planet DOM nodes to calculate positions
- User profile fetching has a 5-second timeout to prevent blocking navigation
- Page transitions use "sync" mode in AnimatePresence for smooth handoff
