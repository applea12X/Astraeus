# Pet Evolution Visual Reference 🐾

## Evolution Stages Overview

```
Level 0 → Level 1 → Level 2 → Level 3 → Level 4 → Level 5
  🥚  →   🔵   →   💙   →   💚   →   🧡   →   ✨
 Egg  →  Sprite →   Pup  → Guardian → Phoenix → Deity
```

---

## Stage 0: Cosmic Egg
**Unlocked:** At account creation
**Planet:** N/A (Starting state)

### Visual Appearance
- **Color**: Purple-pink gradient (`from-purple-400 to-pink-500`)
- **Size**: 60px
- **Icon**: 🥚 Egg emoji with rotating animation
- **Glow**: Soft purple glow
- **Accessories**: None

### Message
> "A mysterious cosmic egg awaits your journey..."

### Animation
- Gentle wobbling (±10deg rotation)
- Floating motion
- Pulsing glow

---

## Stage 1: Nebula Sprite
**Unlocked:** After completing Neptune
**Planet:** Neptune ✅

### Visual Appearance
- **Color**: Blue-cyan gradient (`from-blue-400 to-cyan-500`)
- **Size**: 70px
- **Face**: Two eyes with pupils, smiling mouth
- **Glow**: Cyan glow ring
- **Accessories**:
  - Glow ring (pulsing)

### Message
> "Your companion has hatched into a Nebula Sprite!"

### Animation
- Floating motion (up/down 8px)
- Eyes blink on hover
- Glow ring pulses (scale 1.4-1.6)
- Sparkles on interaction

---

## Stage 2: Star Pup
**Unlocked:** After completing Uranus
**Planets:** Neptune ✅ | Uranus ✅

### Visual Appearance
- **Color**: Cyan-teal gradient (`from-cyan-400 to-teal-500`)
- **Size**: 80px
- **Face**: Animated eyes and mouth
- **Glow**: Teal glow
- **Accessories**:
  - Glow ring (enhanced)
  - Tiny wings (4px × 6px each side)

### Message
> "Your Star Pup has grown wings!"

### Animation
- Floating motion
- Tiny wings flap (±15deg)
- Blush marks appear on hover
- Enhanced sparkle effects

---

## Stage 3: Galaxy Guardian
**Unlocked:** After completing Saturn
**Planets:** Neptune ✅ | Uranus ✅ | Saturn ✅

### Visual Appearance
- **Color**: Teal-green gradient (`from-teal-400 to-green-500`)
- **Size**: 90px
- **Face**: Expressive eyes and smile
- **Glow**: Green glow
- **Accessories**:
  - Glow ring (strong)
  - Full wings (8px × 12px)
  - Crown 👑 emoji on top

### Message
> "Behold the Galaxy Guardian!"

### Animation
- Floating motion
- Full wing flapping (±20deg)
- Crown wobbles slightly
- Crown moves up/down 2px
- Intense glow pulses

---

## Stage 4: Astral Phoenix
**Unlocked:** After completing Jupiter
**Planets:** Neptune ✅ | Uranus ✅ | Saturn ✅ | Jupiter ✅

### Visual Appearance
- **Color**: Orange-red gradient (`from-orange-400 to-red-500`)
- **Size**: 100px
- **Face**: Bright eyes, happy expression
- **Glow**: Orange glow
- **Accessories**:
  - Glow ring (very strong)
  - Full wings (enhanced)
  - Crown 👑
  - Rotating aura (conic gradient)

### Message
> "Your companion has evolved into an Astral Phoenix!"

### Animation
- Floating motion
- Wing flapping
- Crown wobbles
- **Rotating aura** (360deg, 8s linear loop)
- Multiple sparkle effects
- Blurred gradient ring rotation

---

## Stage 5: Cosmic Deity
**Unlocked:** After completing Mars (Journey Complete!)
**Planets:** All completed ✅

### Visual Appearance
- **Color**: Golden gradient (`from-yellow-300 to-amber-500`)
- **Size**: 110px (maximum)
- **Face**: Radiant expression
- **Glow**: Gold glow
- **Accessories**:
  - Glow ring (maximum)
  - Full wings (maximum size)
  - Crown 👑
  - Rotating aura
  - **8 Orbiting particles** (⭐ stars)

### Message
> "Ultimate form achieved: Cosmic Deity!"

### Animation
- Floating motion
- Wing flapping
- Crown wobbles
- Rotating aura (360deg loop)
- **8 orbiting star particles** (delayed animations)
  - Each star pulses opacity 0.3 → 1 → 0.3
  - Each star scales 0.5 → 1.2 → 0.5
  - Stars positioned in circle around pet
- Maximum sparkle effects

---

## Accessory Details

### Glow Ring
- Radial gradient blur effect
- Scales from 1.4x to 1.6x (pulsing)
- Opacity transitions 0.5 → 0.8 → 0.5
- Color matches pet stage glow color

### Tiny Wings (Stage 2)
- Small gradient wings (white/blue)
- Flap motion: ±15deg rotation
- Position: Side edges of pet body
- Size: 4px × 6px

### Full Wings (Stages 3-5)
- Larger gradient wings (white/blue)
- Enhanced flap motion: ±20deg
- Position: Extended from sides
- Size: 8px × 12px

### Crown (Stages 3-5)
- 👑 Emoji positioned above pet
- Wobbles: ±5deg rotation
- Moves vertically: 0 → -2px → 0
- Size: text-2xl (24px)

### Rotating Aura (Stages 4-5)
- Conic gradient background
- From glow color to transparent
- Full 360deg rotation
- Duration: 8 seconds linear
- Blur effect: 10px
- Scale: 1.8x pet size

### Orbiting Particles (Stage 5 only)
- 8 ⭐ star icons
- Positioned in circle (360deg / 8 = 45deg each)
- Distance: pet size/2 + 20px from center
- Each particle has 0.2s delay offset
- Pulsing opacity and scale animations

---

## Color Palette

### Stage Colors
```css
Stage 0: from-purple-400 to-pink-500
Stage 1: from-blue-400 to-cyan-500
Stage 2: from-cyan-400 to-teal-500
Stage 3: from-teal-400 to-green-500
Stage 4: from-orange-400 to-red-500
Stage 5: from-yellow-300 to-amber-500
```

### Glow Colors (RGBA)
```javascript
purple: rgba(168, 85, 247, 0.6)
cyan:   rgba(34, 211, 238, 0.6)
teal:   rgba(20, 184, 166, 0.6)
green:  rgba(34, 197, 94, 0.6)
orange: rgba(251, 146, 60, 0.6)
gold:   rgba(250, 204, 21, 0.6)
```

---

## Interactive States

### Hover State (All Stages)
- Pet scales to 1.15x
- Wobble animation (±5deg rotation)
- Eyes blink (scaleY: 1 → 0.1 → 1)
- Blush marks appear (pink circles)
- Sparkle icon appears (✨)
- Mouth widens (scaleX: 1.2)

### Evolution Animation
- Message bubble fades in from bottom
- Pet momentarily glows brighter
- Smooth transition between colors
- New accessories fade in
- Size increases smoothly

### Message Bubble
- Background: Purple-blue gradient
- Text: White, semi-bold
- Appears above pet
- Triangle pointer below
- Auto-hides after 5 seconds (evolution) or 3 seconds (custom)

---

## Size Progression
```
Stage 0: 60px  [████████░░] 60%
Stage 1: 70px  [█████████░] 70%
Stage 2: 80px  [██████████] 80%
Stage 3: 90px  [███████████] 90%
Stage 4: 100px [████████████] 100%
Stage 5: 110px [█████████████] 110% (MAX)
```

---

## Position Options

The pet can be positioned in any corner:
- `bottom-right` (default) - Most common
- `bottom-left`
- `top-right`
- `top-left`

Position is fixed and follows scroll.

---

## Browser Compatibility

✅ Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

⚠️ Reduced animations on low-power mode
⚠️ Particle effects may be disabled on mobile

---

**Visual Tip:** The pet becomes progressively more elaborate and impressive as users complete their journey, providing a strong sense of accomplishment and progress!
