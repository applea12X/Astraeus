# Space Pet Companion System 🐾✨

## Overview

The Space Pet Companion is an interactive animated companion that accompanies users throughout their planetary exploration journey. The pet evolves and gains new visual enhancements as users complete each planet, creating a gamified and engaging user experience.

## Features

### 🎨 Visual Evolution System
The pet has **6 evolution stages** that unlock as users progress through planets:

1. **Cosmic Egg** (Level 0 - Starting)
   - Mysterious purple-pink egg
   - Gentle pulsing glow
   - Appears when user first signs up

2. **Nebula Sprite** (Level 1 - After Neptune)
   - Blue-cyan orb with cute face
   - Glow ring effect
   - Hatches from the cosmic egg

3. **Star Pup** (Level 2 - After Uranus)
   - Cyan-teal gradient
   - Tiny wings appear
   - Enhanced glow ring

4. **Galaxy Guardian** (Level 3 - After Saturn)
   - Teal-green gradient
   - Full wings
   - Crown accessory
   - Stronger glow effects

5. **Astral Phoenix** (Level 4 - After Jupiter)
   - Orange-red gradient
   - Full wings with crown
   - Rotating aura effect
   - Size increase to 100px

6. **Cosmic Deity** (Level 5 - After Mars/Journey Complete)
   - Golden gradient
   - All accessories (wings, crown, aura)
   - Particle effects with orbiting stars
   - Maximum size at 110px

### ✨ Interactive Features

- **Idle Animation**: Gentle floating motion (up and down)
- **Hover Effects**:
  - Pet scales up and wobbles
  - Eyes blink
  - Sparkle effects appear
  - Blush marks show
- **Evolution Messages**: Toast-style messages announce each evolution
- **Level Display**: Badge showing current pet level
- **Optional Nickname**: Users can name their pet (stored in Firebase)

### 🎭 Animations

All animations powered by **Framer Motion**:
- Smooth floating idle animation (3s loop)
- Wing flapping for flying pets
- Rotating aura for high-level pets
- Orbiting particle effects for max level
- Sparkle effects on interaction
- Message bubble animations

## Technical Implementation

### File Structure

```
src/
├── contexts/
│   └── PetContext.jsx          # Global pet state management
├── components/
│   └── ui/
│       └── PetCompanion.jsx    # Main pet component
└── [All page components have PetCompanion integrated]
```

### Architecture

#### PetContext Provider
Location: `src/contexts/PetContext.jsx`

**Responsibilities:**
- Manages global pet state (level, data, messages)
- Loads pet data from Firebase Firestore
- Monitors user progress and triggers evolution
- Provides helper functions for pet interactions

**Key Functions:**
- `evolvePet(newLevel)` - Evolves pet to new level
- `setPetNickname(nickname)` - Sets custom pet name
- `showPetMessage(message, duration)` - Shows custom messages
- `getCurrentStage()` - Returns current evolution stage data

**Firebase Integration:**
Pet data is stored in the user document:
```javascript
users/{uid}
  ├── petLevel: number (0-5)
  ├── petLastEvolution: ISO timestamp
  └── petNickname: string (optional)
```

#### PetCompanion Component
Location: `src/components/ui/PetCompanion.jsx`

**Props:**
- `position` (string): 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'

**Features:**
- Fully responsive to pet level changes
- Automatic accessory rendering based on evolution stage
- Interactive hover states
- Periodic sparkle effects
- Message bubble system

### Evolution Trigger Logic

Evolution is triggered automatically by the `PetContext` provider:

1. Every 10 seconds, checks user's completed planets count
2. Calculates new level: `completedPlanets.length + 1`
3. If new level > current level, triggers evolution
4. Saves to Firebase and shows evolution message
5. Updates UI with new visual appearance

### Integration Points

The pet companion is integrated into all major pages:
- ✅ SolarSystem
- ✅ NeptunePage
- ✅ UranusPage
- ✅ UranusFormPage
- ✅ FinancialInfoPage
- ✅ SaturnPage
- ✅ SaturnResultsPage
- ✅ JupiterLandingPage
- ✅ MarsPage

Each page includes:
```jsx
import PetCompanion from './ui/PetCompanion';

// In JSX return:
<PetCompanion position="bottom-right" />
```

## Usage Guide

### For Users

1. **Start Your Journey**: Pet appears as a Cosmic Egg when you first sign up
2. **Complete Planets**: Each planet completion evolves your pet
3. **Interact**: Hover over your pet to see cute reactions
4. **Watch Evolution**: Evolution messages appear automatically
5. **Track Progress**: Pet level badge shows your progress

### For Developers

#### Adding the Pet to a New Page

```jsx
import PetCompanion from './ui/PetCompanion';

function NewPage() {
  return (
    <div>
      {/* Your page content */}

      {/* Add pet at the end */}
      <PetCompanion position="bottom-right" />
    </div>
  );
}
```

#### Triggering Custom Pet Messages

```jsx
import { usePet } from '../../contexts/PetContext';

function MyComponent() {
  const { showPetMessage } = usePet();

  const handleAction = () => {
    showPetMessage("Great job! 🎉", 3000);
  };
}
```

#### Accessing Pet Data

```jsx
import { usePet } from '../../contexts/PetContext';

function MyComponent() {
  const { petLevel, currentStage, petData } = usePet();

  console.log(`Pet is level ${petLevel}`);
  console.log(`Current stage: ${currentStage.name}`);
  console.log(`Pet nickname: ${petData?.nickname || 'None'}`);
}
```

## Customization

### Adding New Evolution Stages

Edit `src/contexts/PetContext.jsx` and add new stages to `PET_STAGES`:

```javascript
export const PET_STAGES = {
  6: {
    name: 'New Stage Name',
    color: 'from-color-400 to-color-500',
    size: 120,
    glow: 'colorName',
    accessories: ['glow-ring', 'wings', 'crown', 'aura', 'particles', 'newAccessory'],
    message: 'Evolution message here!'
  }
};
```

### Adding New Accessories

In `src/components/ui/PetCompanion.jsx`, add rendering logic:

```jsx
{/* New Accessory */}
{currentStage.accessories.includes('newAccessory') && (
  <motion.div
    // Accessory styling and animations
  />
)}
```

### Changing Colors

Modify the glow colors in `PetCompanion.jsx`:

```javascript
const glowColors = {
  purple: 'rgba(168, 85, 247, 0.6)',
  cyan: 'rgba(34, 211, 238, 0.6)',
  // Add new colors here
};
```

## Performance Considerations

- ✅ Pet component is lightweight (< 500 lines)
- ✅ Uses CSS transforms for animations (GPU accelerated)
- ✅ Firestore updates are batched and non-blocking
- ✅ Evolution checks run every 10 seconds (not on every render)
- ✅ Message auto-hide prevents clutter
- ⚠️ Particle effects only render at high levels (4+)

## Future Enhancements

Potential features to add:

1. **Pet Sound Effects**: Add subtle sounds on hover/evolution
2. **Pet Customization**: Allow users to choose pet colors/accessories
3. **Pet Interactions**: Click to make pet do tricks
4. **Pet Stats**: Show pet "happiness" or "loyalty" metrics
5. **Pet Inventory**: Unlock accessories through achievements
6. **Multiple Pets**: Allow users to collect different pet types
7. **Pet Mini-Games**: Interactive games with the pet
8. **Social Features**: Share pet progress with friends

## Troubleshooting

### Pet Not Appearing

1. Check that `PetProvider` wraps the app in `App.jsx`
2. Verify Firebase connection is working
3. Check browser console for errors
4. Ensure user is authenticated

### Pet Not Evolving

1. Check that planets are being marked as completed in Firebase
2. Verify `updateUserProgress` is being called after planet completion
3. Check `completedPlanets` array in user document
4. Look for errors in browser console

### Animation Performance Issues

1. Reduce particle count in `PetCompanion.jsx`
2. Disable blur effects for lower-end devices
3. Reduce animation complexity for levels 4+

## Dependencies

- **React**: Component framework
- **Framer Motion**: Animation library
- **Firebase Firestore**: Data persistence
- **Lucide React**: Icon library (for Star, Sparkles icons)
- **Tailwind CSS**: Styling

## Credits

Created for the Toyota Financial Services planetary exploration app at HackTX.

Designed to enhance user engagement through gamification and delightful interactions.

---

**Need Help?** Check the main project documentation in `CLAUDE.md` or reach out to the development team.
