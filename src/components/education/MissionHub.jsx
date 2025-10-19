import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Star, 
  TrendingUp, 
  Calculator, 
  Shield, 
  Target,
  X,
  Lock,
  CheckCircle,
  Award
} from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import MissionModal from './MissionModal';
import BadgeDisplay from './BadgeDisplay';
import ProgressTracker from './ProgressTracker';

/**
 * MissionHub - Central dashboard for credit education missions
 * 
 * This component provides a gamified learning experience with three main mission categories:
 * 1. Understanding APR (4 sub-missions)
 * 2. Lease vs Loan Showdown (4 sub-missions) 
 * 3. Down Payment Gravity Simulation (4 sub-missions)
 * 
 * Each category awards a unique celestial badge upon completion.
 */
const MissionHub = ({ user, userProfile, onClose }) => {
  const [selectedMission, setSelectedMission] = useState(null);
  const [educationProgress, setEducationProgress] = useState({
    completedMissions: [],
    unlockedBadges: [],
    currentMission: null,
    totalPoints: 0,
    lastActivity: null
  });
  const [loading, setLoading] = useState(true);

  // Mission definitions with celestial theme
  const missionCategories = [
    {
      id: 'apr-understanding',
      title: 'Understanding APR',
      icon: <Star className="w-8 h-8" />,
      description: 'Master the fundamentals of interest rates and APR',
      badgeId: 'apr-navigator-nebula',
      badgeName: 'APR Navigator Nebula',
      difficulty: 2,
      estimatedTime: '15 min',
      color: 'from-blue-600 to-purple-600',
      glowColor: 'blue-400',
      missions: [
        {
          id: 'apr-1-basics',
          title: 'Interest Rate Basics',
          description: 'Learn what APR means and how it affects your payments',
          points: 100,
          difficulty: 1
        },
        {
          id: 'apr-2-compound',
          title: 'Compound vs Simple Interest',
          description: 'Understand the difference and see visual comparisons',
          points: 150,
          difficulty: 2
        },
        {
          id: 'apr-3-calculator',
          title: 'APR Impact Calculator',
          description: 'Use interactive tools to see how APR affects total cost',
          points: 200,
          difficulty: 2
        },
        {
          id: 'apr-4-credit',
          title: 'Credit Score & APR Connection',
          description: 'Discover how your credit score affects interest rates',
          points: 150,
          difficulty: 1
        }
      ]
    },
    {
      id: 'lease-vs-loan',
      title: 'Lease vs Loan Showdown',
      icon: <TrendingUp className="w-8 h-8" />,
      description: 'Compare financing options like a financial expert',
      badgeId: 'finance-battle-commander',
      badgeName: 'Finance Battle Commander',
      difficulty: 2,
      estimatedTime: '20 min',
      color: 'from-green-600 to-teal-600',
      glowColor: 'green-400',
      missions: [
        {
          id: 'lease-1-fundamentals',
          title: 'Lease Fundamentals',
          description: 'What is leasing? Explore pros and cons',
          points: 125,
          difficulty: 1
        },
        {
          id: 'lease-2-loan-basics',
          title: 'Loan Fundamentals',
          description: 'Traditional auto loans, terms, and benefits',
          points: 125,
          difficulty: 1
        },
        {
          id: 'lease-3-comparison',
          title: 'The Great Comparison',
          description: 'Side-by-side lease vs loan calculator',
          points: 250,
          difficulty: 3
        },
        {
          id: 'lease-4-scenarios',
          title: 'Real-World Scenarios',
          description: 'Interactive decision-making scenarios',
          points: 200,
          difficulty: 2
        }
      ]
    },
    {
      id: 'down-payment',
      title: 'Down Payment Gravity',
      icon: <Calculator className="w-8 h-8" />,
      description: 'Simulate the gravitational effect of down payments',
      badgeId: 'gravity-master',
      badgeName: 'Gravity Master',
      difficulty: 2,
      estimatedTime: '18 min',
      color: 'from-orange-600 to-red-600',
      glowColor: 'orange-400',
      missions: [
        {
          id: 'down-1-basics',
          title: 'Down Payment Basics',
          description: 'What is a down payment and why it matters',
          points: 100,
          difficulty: 1
        },
        {
          id: 'down-2-rule',
          title: '20/4/10 Rule Explained',
          description: 'The golden rule of car buying',
          points: 150,
          difficulty: 2
        },
        {
          id: 'down-3-simulator',
          title: 'Down Payment Impact Simulator',
          description: 'Interactive tool showing payment differences',
          points: 200,
          difficulty: 2
        },
        {
          id: 'down-4-saving',
          title: 'Saving Strategies',
          description: 'How to save for a down payment effectively',
          points: 150,
          difficulty: 1
        }
      ]
    }
  ];

  // Load user's education progress
  useEffect(() => {
    const loadEducationProgress = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        if (userData?.educationProgress) {
          setEducationProgress(userData.educationProgress);
        }
      } catch (error) {
        console.error('Error loading education progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEducationProgress();
  }, [user]);

  // Calculate category completion percentage
  const getCategoryCompletion = (category) => {
    const completedCount = category.missions.filter(mission => 
      educationProgress.completedMissions.includes(mission.id)
    ).length;
    return (completedCount / category.missions.length) * 100;
  };

  // Check if category badge is unlocked
  const isBadgeUnlocked = (badgeId) => {
    return educationProgress.unlockedBadges.includes(badgeId);
  };

  // Check if mission is completed
  const isMissionCompleted = (missionId) => {
    return educationProgress.completedMissions.includes(missionId);
  };

  // Handle mission completion
  const handleMissionComplete = async (missionId, categoryId, pointsEarned) => {
    if (!user || isMissionCompleted(missionId)) return;

    const newProgress = {
      ...educationProgress,
      completedMissions: [...educationProgress.completedMissions, missionId],
      totalPoints: educationProgress.totalPoints + pointsEarned,
      lastActivity: new Date().toISOString()
    };

    // Check if category is now complete
    const category = missionCategories.find(cat => cat.id === categoryId);
    const categoryCompleted = category.missions.every(mission => 
      newProgress.completedMissions.includes(mission.id)
    );

    if (categoryCompleted && !newProgress.unlockedBadges.includes(category.badgeId)) {
      newProgress.unlockedBadges = [...newProgress.unlockedBadges, category.badgeId];
    }

    setEducationProgress(newProgress);

    // Update Firebase
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        educationProgress: newProgress
      });
    } catch (error) {
      console.error('Error updating education progress:', error);
    }
  };

  // Get difficulty stars
  const getDifficultyStars = (difficulty) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Star 
        key={i}
        className={`w-4 h-4 ${i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10001] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Mission Hub Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10001] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-white/10 shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Credit Education Missions</h2>
                <p className="text-gray-400">Transform your financial knowledge into cosmic power</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-semibold text-white">{educationProgress.totalPoints} Points</p>
                <p className="text-sm text-gray-400">{educationProgress.unlockedBadges.length}/3 Badges</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Progress Overview */}
            <div className="mb-8">
              <ProgressTracker 
                progress={educationProgress}
                categories={missionCategories}
              />
            </div>

            {/* Badge Collection */}
            {educationProgress.unlockedBadges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Your Badge Collection
                </h3>
                <BadgeDisplay badges={educationProgress.unlockedBadges} categories={missionCategories} />
              </div>
            )}

            {/* Mission Categories */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Available Missions</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {missionCategories.map((category) => {
                  const completion = getCategoryCompletion(category);
                  const isCompleted = completion === 100;
                  
                  return (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      className={`relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6 cursor-pointer transition-all ${
                        isCompleted ? 'ring-2 ring-yellow-400/30' : ''
                      }`}
                      onClick={() => setSelectedMission(category)}
                    >
                      {/* Badge indicator */}
                      {isCompleted && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-yellow-900" />
                        </div>
                      )}

                      {/* Glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 rounded-xl blur-xl`} />
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 text-white`}>
                          {category.icon}
                        </div>
                        
                        <h4 className="text-lg font-semibold text-white mb-2">{category.title}</h4>
                        <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                        
                        {/* Metadata */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            {getDifficultyStars(category.difficulty)}
                          </div>
                          <span className="text-xs text-gray-500">{category.estimatedTime}</span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completion}%` }}
                            className={`h-2 bg-gradient-to-r ${category.color} rounded-full`}
                          />
                        </div>
                        <p className="text-xs text-gray-400">{completion.toFixed(0)}% Complete</p>
                        
                        {/* Mission count */}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-gray-400">
                            {category.missions.filter(m => isMissionCompleted(m.id)).length}/{category.missions.length} missions
                          </span>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Target className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Mission Detail Modal */}
      <AnimatePresence>
        {selectedMission && (
          <MissionModal
            category={selectedMission}
            educationProgress={educationProgress}
            onClose={() => setSelectedMission(null)}
            onMissionComplete={handleMissionComplete}
            user={user}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MissionHub;