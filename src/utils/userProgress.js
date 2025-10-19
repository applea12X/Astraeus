import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Planet progression order
export const PLANET_ORDER = [
  { id: 'neptune', name: 'Neptune', route: 'neptune' },
  { id: 'uranus', name: 'Uranus', route: 'uranus' },
  { id: 'saturn', name: 'Saturn', route: 'saturn' },
  { id: 'jupiter', name: 'Jupiter', route: 'jupiter' },
  { id: 'mars', name: 'Mars', route: 'mars' }
];

// Progress stages and their requirements
export const PROGRESS_STAGES = {
  neptune: {
    name: 'Neptune',
    title: 'Financial Information',
    description: 'Enter your basic financial details',
    requires: [],
    completionField: 'neptuneCompleted'
  },
  uranus: {
    name: 'Uranus',
    title: 'Vehicle Preferences',
    description: 'Tell us about your vehicle needs',
    requires: ['neptune'],
    completionField: 'uranusCompleted'
  },
  saturn: {
    name: 'Saturn',
    title: 'Vehicle Recommendations',
    description: 'See personalized vehicle suggestions',
    requires: ['neptune', 'uranus'],
    completionField: 'saturnCompleted'
  },
  jupiter: {
    name: 'Jupiter',
    title: 'Final Selection',
    description: 'Choose your perfect vehicle',
    requires: ['neptune', 'uranus', 'saturn'],
    completionField: 'jupiterCompleted'
  },
  mars: {
    name: 'Mars',
    title: 'Payment Simulations',
    description: 'Explore financing options',
    requires: ['neptune', 'uranus', 'saturn', 'jupiter'],
    completionField: 'marsCompleted'
  }
};

/**
 * Get user's current progress from Firebase
 * @param {string} userId - User's Firebase UID
 * @returns {Object} User progress data
 */
export const getUserProgress = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        currentPlanet: userData.currentPlanet || 'neptune',
        completedPlanets: userData.completedPlanets || [],
        neptuneCompleted: userData.neptuneCompleted || false,
        uranusCompleted: userData.uranusCompleted || false,
        saturnCompleted: userData.saturnCompleted || false,
        marsCompleted: userData.marsCompleted || false,
        jupiterCompleted: userData.jupiterCompleted || false,
        lastVisited: userData.lastVisited || null,
        journeyStarted: userData.journeyStarted || false,
        journeyCompleted: userData.journeyCompleted || false,
        ...userData
      };
    }
    
    // Return default progress for new users
    return {
      currentPlanet: 'neptune',
      completedPlanets: [],
      neptuneCompleted: false,
      uranusCompleted: false,
      saturnCompleted: false,
      marsCompleted: false,
      jupiterCompleted: false,
      lastVisited: null,
      journeyStarted: false,
      journeyCompleted: false
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
};

/**
 * Update user progress when completing a planet
 * @param {string} userId - User's Firebase UID
 * @param {string} planet - Planet being completed
 * @param {Object} additionalData - Any additional data to save
 */
export const updateUserProgress = async (userId, planet, additionalData = {}) => {
  try {
    const currentProgress = await getUserProgress(userId);
    const nextPlanet = getNextPlanet(planet);
    
    const updateData = {
      [`${planet}Completed`]: true,
      [`${planet}CompletedAt`]: new Date().toISOString(),
      currentPlanet: nextPlanet,
      lastVisited: planet,
      lastUpdated: new Date().toISOString(),
      journeyStarted: true,
      ...additionalData
    };

    // Add to completed planets array if not already there
    const completedPlanets = currentProgress.completedPlanets || [];
    if (!completedPlanets.includes(planet)) {
      updateData.completedPlanets = [...completedPlanets, planet];
    }

    // Check if journey is completed
    if (planet === 'jupiter') {
      updateData.journeyCompleted = true;
      updateData.journeyCompletedAt = new Date().toISOString();
    }

    await setDoc(doc(db, 'users', userId), updateData, { merge: true });
    
    console.log(`Progress updated: ${planet} completed, next: ${nextPlanet}`);
    return updateData;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

/**
 * Get the next planet in the journey
 * @param {string} currentPlanet - Current planet
 * @returns {string|null} Next planet or null if journey complete
 */
export const getNextPlanet = (currentPlanet) => {
  const currentIndex = PLANET_ORDER.findIndex(p => p.id === currentPlanet);
  if (currentIndex >= 0 && currentIndex < PLANET_ORDER.length - 1) {
    return PLANET_ORDER[currentIndex + 1].id;
  }
  return null; // Journey complete
};

/**
 * Get the previous planet in the journey
 * @param {string} currentPlanet - Current planet
 * @returns {string|null} Previous planet or null if at start
 */
export const getPreviousPlanet = (currentPlanet) => {
  const currentIndex = PLANET_ORDER.findIndex(p => p.id === currentPlanet);
  if (currentIndex > 0) {
    return PLANET_ORDER[currentIndex - 1].id;
  }
  return null; // At start of journey
};

/**
 * Check if user can access a specific planet
 * @param {Object} userProgress - User's progress data
 * @param {string} planet - Planet to check access for
 * @returns {boolean} Whether user can access the planet
 */
export const canAccessPlanet = (userProgress, planet) => {
  const stage = PROGRESS_STAGES[planet];
  if (!stage) return false;

  // Check if all required stages are completed
  return stage.requires.every(requiredPlanet => 
    userProgress[`${requiredPlanet}Completed`] === true
  );
};

/**
 * Get user's progress percentage
 * @param {Object} userProgress - User's progress data
 * @returns {number} Progress percentage (0-100)
 */
export const getProgressPercentage = (userProgress) => {
  const totalPlanets = PLANET_ORDER.length;
  const completedCount = PLANET_ORDER.filter(planet => 
    userProgress[`${planet.id}Completed`] === true
  ).length;
  
  return Math.round((completedCount / totalPlanets) * 100);
};

/**
 * Get the planet where the spaceship should be "landed"
 * @param {Object} userProgress - User's progress data
 * @returns {string} Planet where spaceship is currently landed
 */
export const getLandedPlanet = (userProgress) => {
  if (!userProgress.journeyStarted) {
    return null; // No spaceship visible until journey starts
  }
  
  // If journey is completed, spaceship lands on Jupiter
  if (userProgress.journeyCompleted) {
    return 'jupiter';
  }
  
  // Spaceship lands on the current planet or last completed planet
  if (userProgress.currentPlanet) {
    return userProgress.currentPlanet;
  }
  
  // Find the last completed planet
  const completedPlanets = userProgress.completedPlanets || [];
  if (completedPlanets.length > 0) {
    return completedPlanets[completedPlanets.length - 1];
  }
  
  return 'neptune'; // Default to Neptune if journey started but no progress
};

/**
 * Get suggested next action for user
 * @param {Object} userProgress - User's progress data
 * @returns {Object} Suggestion with planet, action, and message
 */
export const getNextSuggestion = (userProgress) => {
  const currentPlanet = userProgress.currentPlanet || 'neptune';
  const nextPlanet = getNextPlanet(currentPlanet);
  
  // If journey not started
  if (!userProgress.journeyStarted) {
    return {
      planet: 'neptune',
      action: 'start',
      title: 'Start Your Journey',
      message: 'Begin your financial adventure on Neptune!'
    };
  }
  
  // If journey completed
  if (userProgress.journeyCompleted) {
    return {
      planet: 'jupiter',
      action: 'complete',
      title: 'Journey Complete!',
      message: 'Congratulations! Review your final selection on Jupiter.'
    };
  }
  
  // If current planet not completed
  if (!userProgress[`${currentPlanet}Completed`]) {
    const stage = PROGRESS_STAGES[currentPlanet];
    return {
      planet: currentPlanet,
      action: 'continue',
      title: `Continue on ${stage.name}`,
      message: stage.description
    };
  }
  
  // If ready for next planet
  if (nextPlanet) {
    const stage = PROGRESS_STAGES[nextPlanet];
    return {
      planet: nextPlanet,
      action: 'next',
      title: `Visit ${stage.name}`,
      message: stage.description
    };
  }
  
  // Fallback
  return {
    planet: currentPlanet,
    action: 'stay',
    title: 'Explore More',
    message: 'Take your time exploring your current planet.'
  };
};

/**
 * Mark user as having started their journey
 * @param {string} userId - User's Firebase UID
 */
export const startUserJourney = async (userId) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      journeyStarted: true,
      journeyStartedAt: new Date().toISOString(),
      currentPlanet: 'neptune',
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    
    console.log('User journey started');
  } catch (error) {
    console.error('Error starting user journey:', error);
    throw error;
  }
};

/**
 * Get contextual guide message based on user progress
 * @param {Object} userProgress - User's progress data
 * @param {string} userName - User's first name
 * @param {string} currentRoute - Current page route
 * @returns {string} Contextual message for the guide
 */
export const getGuideMessage = (userProgress, userName = 'Friend', currentRoute) => {
  const suggestion = getNextSuggestion(userProgress);
  
  // Route-specific messages
  if (currentRoute === 'solar-system') {
    if (!userProgress.journeyStarted) {
      return `Hi ${userName}! 👋 Welcome to your financial journey! Click on Neptune to start exploring your options.`;
    }
    
    if (userProgress.journeyCompleted) {
      return `Amazing work, ${userName}! 🎉 You've completed your entire financial journey. Visit Jupiter to review your final selection!`;
    }
    
    return `Hey ${userName}! ${suggestion.message} Ready to visit ${suggestion.planet}?`;
  }
  
  // Planet-specific completion messages
  if (currentRoute === 'neptune' && userProgress.neptuneCompleted) {
    return `Great job on Neptune, ${userName}! 🌊 Your financial info is saved. Ready to explore Uranus for vehicle preferences?`;
  }
  
  if (currentRoute === 'uranus' && userProgress.uranusCompleted) {
    return `Excellent work on Uranus, ${userName}! 🪐 Now let's see your personalized recommendations on Saturn!`;
  }
  
  if (currentRoute === 'saturn' && userProgress.saturnCompleted) {
    return `Perfect! ${userName}, you've seen your recommendations. Time to explore advanced payment options on Mars! 🔴`;
  }
  
  if (currentRoute === 'mars' && userProgress.marsCompleted) {
    return `Outstanding work on Mars, ${userName}! 🚀 Ready for the final step? Let's visit Jupiter for your vehicle selection!`;
  }
  
  if (currentRoute === 'jupiter' && userProgress.jupiterCompleted) {
    return `Congratulations, ${userName}! 🎉 You've completed your entire financial journey!`;
  }
  
  // Default encouragement message
  return `You're doing great, ${userName}! 🌟 Take your time exploring. I'm here if you need guidance!`;
};