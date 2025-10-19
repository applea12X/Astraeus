import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Star,
  Trophy,
  Lock
} from 'lucide-react';
import APRMission from './missions/APRMission';
import LeaseVsLoanMission from './missions/LeaseVsLoanMission';
import DownPaymentMission from './missions/DownPaymentMission';

/**
 * MissionModal - Individual mission content display
 * 
 * This modal displays the content for individual missions within a category.
 * It handles navigation between missions and tracks completion status.
 */
const MissionModal = ({ category, educationProgress, onClose, onMissionComplete, user }) => {
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const currentMission = category.missions[currentMissionIndex];
  
  // Check if mission is completed
  const isMissionCompleted = (missionId) => {
    return educationProgress.completedMissions.includes(missionId);
  };

  // Check if mission is unlocked (first mission or previous one completed)
  const isMissionUnlocked = (index) => {
    if (index === 0) return true;
    return isMissionCompleted(category.missions[index - 1].id);
  };

  // Handle mission completion
  const handleComplete = async (missionId, pointsEarned) => {
    await onMissionComplete(missionId, category.id, pointsEarned);
    
    // Auto-advance to next mission if available
    if (currentMissionIndex < category.missions.length - 1) {
      setTimeout(() => {
        setCurrentMissionIndex(currentMissionIndex + 1);
        setShowContent(false);
      }, 2000);
    }
  };

  // Navigate to specific mission
  const goToMission = (index) => {
    if (isMissionUnlocked(index)) {
      setCurrentMissionIndex(index);
      setShowContent(false);
    }
  };

  // Get mission content component
  const getMissionContent = () => {
    const baseProps = {
      mission: currentMission,
      category: category,
      onComplete: handleComplete,
      isCompleted: isMissionCompleted(currentMission.id),
      user: user
    };

    switch (category.id) {
      case 'apr-understanding':
        return <APRMission {...baseProps} />;
      case 'lease-vs-loan':
        return <LeaseVsLoanMission {...baseProps} />;
      case 'down-payment':
        return <DownPaymentMission {...baseProps} />;
      default:
        return <div className="text-white">Mission content not found</div>;
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10002] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-white/10 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center text-white`}>
              {category.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{category.title}</h2>
              <p className="text-gray-400">Mission {currentMissionIndex + 1} of {category.missions.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mission Navigation */}
        <div className="flex-shrink-0 p-6 border-b border-white/10 bg-gray-900/30">
          <div className="flex items-center gap-4 overflow-x-auto">
            {category.missions.map((mission, index) => {
              const isUnlocked = isMissionUnlocked(index);
              const isCompleted = isMissionCompleted(mission.id);
              const isCurrent = index === currentMissionIndex;
              
              return (
                <motion.button
                  key={mission.id}
                  onClick={() => goToMission(index)}
                  disabled={!isUnlocked}
                  whileHover={isUnlocked ? { scale: 1.05 } : {}}
                  className={`flex-shrink-0 p-3 rounded-xl border transition-all ${
                    isCurrent 
                      ? `bg-gradient-to-br ${category.color} border-white/20 text-white` 
                      : isCompleted
                      ? 'bg-green-900/30 border-green-400/30 text-green-400'
                      : isUnlocked
                      ? 'bg-gray-800/50 border-white/10 text-gray-300 hover:border-white/20'
                      : 'bg-gray-800/30 border-gray-600/30 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!isUnlocked ? (
                      <Lock className="w-4 h-4" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                    )}
                    <span className="text-sm font-medium">{mission.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getDifficultyStars(mission.difficulty)}
                    <span className="text-xs ml-2">{mission.points}pts</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Mission Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-280px)]">
          {!showContent ? (
            // Mission Overview
            <div className="p-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  {React.cloneElement(category.icon, { className: 'w-10 h-10 text-white' })}
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">{currentMission.title}</h3>
                <p className="text-gray-400 text-lg mb-6">{currentMission.description}</p>
                
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {getDifficultyStars(currentMission.difficulty)}
                    </div>
                    <p className="text-xs text-gray-500">Difficulty</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-yellow-400">{currentMission.points}</p>
                    <p className="text-xs text-gray-500">Points</p>
                  </div>
                  <div className="text-center">
                    <Trophy className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Reward</p>
                  </div>
                </div>
                
                {isMissionCompleted(currentMission.id) ? (
                  <div className="bg-green-900/30 border border-green-400/30 rounded-xl p-6 mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-green-400 font-semibold">Mission Completed!</p>
                    <p className="text-gray-400 text-sm">You've already mastered this topic</p>
                  </div>
                ) : !isMissionUnlocked(currentMissionIndex) ? (
                  <div className="bg-gray-800/30 border border-gray-600/30 rounded-xl p-6 mb-6">
                    <Lock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-600 font-semibold">Mission Locked</p>
                    <p className="text-gray-500 text-sm">Complete the previous mission to unlock</p>
                  </div>
                ) : null}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowContent(true)}
                  disabled={!isMissionUnlocked(currentMissionIndex)}
                  className={`px-8 py-4 rounded-xl text-white font-semibold flex items-center gap-3 mx-auto transition-all ${
                    !isMissionUnlocked(currentMissionIndex)
                      ? 'bg-gray-600 cursor-not-allowed opacity-50'
                      : isMissionCompleted(currentMission.id)
                      ? `bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600`
                      : `bg-gradient-to-r ${category.color} hover:shadow-lg`
                  }`}
                >
                  <Play className="w-5 h-5" />
                  {isMissionCompleted(currentMission.id) ? 'Review Mission' : 'Start Mission'}
                </motion.button>
              </motion.div>
            </div>
          ) : (
            // Mission Content
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMission.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                {getMissionContent()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Navigation Footer */}
        {showContent && (
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-t border-white/10 bg-gray-900/30">
            <button
              onClick={() => setShowContent(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (currentMissionIndex > 0) {
                    goToMission(currentMissionIndex - 1);
                  }
                }}
                disabled={currentMissionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              
              <button
                onClick={() => {
                  if (currentMissionIndex < category.missions.length - 1 && isMissionUnlocked(currentMissionIndex + 1)) {
                    goToMission(currentMissionIndex + 1);
                  }
                }}
                disabled={currentMissionIndex === category.missions.length - 1 || !isMissionUnlocked(currentMissionIndex + 1)}
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${category.color} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MissionModal;