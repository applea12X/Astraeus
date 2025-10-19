import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { getUserProgress } from '../utils/userProgress';

const PetContext = createContext();

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
};

// Pet evolution stages based on planet completion
export const PET_STAGES = {
  0: {
    name: 'Cosmic Egg',
    color: 'from-purple-400 to-pink-500',
    size: 60,
    glow: 'purple',
    accessories: [],
    message: 'A mysterious cosmic egg awaits your journey...'
  },
  1: {
    name: 'Nebula Sprite',
    color: 'from-blue-400 to-cyan-500',
    size: 70,
    glow: 'cyan',
    accessories: ['glow-ring'],
    message: 'Your companion has hatched into a Nebula Sprite!'
  },
  2: {
    name: 'Star Pup',
    color: 'from-cyan-400 to-teal-500',
    size: 80,
    glow: 'teal',
    accessories: ['glow-ring', 'tiny-wings'],
    message: 'Your Star Pup has grown wings!'
  },
  3: {
    name: 'Galaxy Guardian',
    color: 'from-teal-400 to-green-500',
    size: 90,
    glow: 'green',
    accessories: ['glow-ring', 'wings', 'crown'],
    message: 'Behold the Galaxy Guardian!'
  },
  4: {
    name: 'Astral Phoenix',
    color: 'from-orange-400 to-red-500',
    size: 100,
    glow: 'orange',
    accessories: ['glow-ring', 'wings', 'crown', 'aura'],
    message: 'Your companion has evolved into an Astral Phoenix!'
  },
  5: {
    name: 'Cosmic Deity',
    color: 'from-yellow-300 to-amber-500',
    size: 110,
    glow: 'gold',
    accessories: ['glow-ring', 'wings', 'crown', 'aura', 'particles'],
    message: 'Ultimate form achieved: Cosmic Deity!'
  }
};

export const PetProvider = ({ children, user }) => {
  const [petLevel, setPetLevel] = useState(0);
  const [petData, setPetData] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [evolutionMessage, setEvolutionMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Load pet data from Firestore
  useEffect(() => {
    const loadPetData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const savedPetLevel = userData.petLevel || 0;

          setPetLevel(savedPetLevel);
          setPetData({
            level: savedPetLevel,
            lastEvolution: userData.petLastEvolution || null,
            nickname: userData.petNickname || null
          });
        }
      } catch (error) {
        console.error('Error loading pet data:', error);
      }

      setLoading(false);
    };

    loadPetData();
  }, [user]);

  // Monitor user progress and trigger evolution
  useEffect(() => {
    const checkEvolution = async () => {
      if (!user) return;

      try {
        const progress = await getUserProgress(user.uid);

        // Calculate pet level based on completed planets
        // Level 0 = Egg (no planets completed)
        // Level 1 = First evolution (1 planet completed)
        // Level 2 = Second evolution (2 planets completed)
        // etc.
        const completedCount = progress.completedPlanets?.length || 0;
        const newLevel = Math.min(completedCount, 5); // Max level is 5

        // Check if pet should evolve
        if (newLevel > petLevel) {
          await evolvePet(newLevel);
        }
      } catch (error) {
        console.error('Error checking evolution:', error);
      }
    };

    // Check evolution periodically and on user change
    checkEvolution();
    const interval = setInterval(checkEvolution, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [user, petLevel]);

  // Evolve pet to new level
  const evolvePet = async (newLevel) => {
    if (!user || newLevel <= petLevel) return;

    try {
      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        petLevel: newLevel,
        petLastEvolution: new Date().toISOString()
      }, { merge: true });

      // Update local state
      setPetLevel(newLevel);
      setPetData(prev => ({
        ...prev,
        level: newLevel,
        lastEvolution: new Date().toISOString()
      }));

      // Show evolution message
      const stage = PET_STAGES[newLevel];
      setEvolutionMessage(stage.message);
      setShowMessage(true);

      // Auto-hide message after 5 seconds
      setTimeout(() => setShowMessage(false), 5000);

      console.log(`Pet evolved to level ${newLevel}: ${stage.name}`);
    } catch (error) {
      console.error('Error evolving pet:', error);
    }
  };

  // Set pet nickname
  const setPetNickname = async (nickname) => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        petNickname: nickname
      }, { merge: true });

      setPetData(prev => ({
        ...prev,
        nickname
      }));
    } catch (error) {
      console.error('Error setting pet nickname:', error);
    }
  };

  // Get current pet stage
  const getCurrentStage = () => {
    return PET_STAGES[petLevel] || PET_STAGES[0];
  };

  // Show custom message
  const showPetMessage = (message, duration = 3000) => {
    setEvolutionMessage(message);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), duration);
  };

  const value = {
    petLevel,
    petData,
    currentStage: getCurrentStage(),
    evolvePet,
    setPetNickname,
    showMessage,
    evolutionMessage,
    showPetMessage,
    loading
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
};

export default PetContext;
