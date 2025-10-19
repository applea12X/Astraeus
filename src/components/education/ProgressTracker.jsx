import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';

/**
 * ProgressTracker - Visual progress overview
 * 
 * Shows overall progress across all mission categories with animated stats
 */
const ProgressTracker = ({ progress, categories }) => {
  // Calculate overall statistics
  const totalMissions = categories.reduce((sum, cat) => sum + cat.missions.length, 0);
  const completedMissions = progress.completedMissions.length;
  const overallProgress = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;
  const totalBadges = categories.length;
  const earnedBadges = progress.unlockedBadges.length;

  const stats = [
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Missions Completed',
      value: `${completedMissions}/${totalMissions}`,
      percentage: overallProgress,
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: 'Badges Earned',
      value: `${earnedBadges}/${totalBadges}`,
      percentage: totalBadges > 0 ? (earnedBadges / totalBadges) * 100 : 0,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Total Points',
      value: progress.totalPoints.toLocaleString(),
      percentage: Math.min((progress.totalPoints / 2000) * 100, 100), // Max 2000 points
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Overall Progress',
      value: `${Math.round(overallProgress)}%`,
      percentage: overallProgress,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  // Get category-specific progress
  const getCategoryProgress = (category) => {
    const completed = category.missions.filter(mission => 
      progress.completedMissions.includes(mission.id)
    ).length;
    return (completed / category.missions.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-2 bg-gradient-to-r ${stat.color} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Progress */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Category Progress
        </h4>
        
        <div className="space-y-4">
          {categories.map((category, index) => {
            const categoryProgress = getCategoryProgress(category);
            const isCompleted = categoryProgress === 100;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {React.cloneElement(category.icon, { className: 'w-4 h-4 text-white' })}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{category.title}</span>
                    <div className="flex items-center gap-2">
                      {isCompleted && <Award className="w-4 h-4 text-yellow-400" />}
                      <span className="text-xs text-gray-400">{Math.round(categoryProgress)}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${categoryProgress}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-2 bg-gradient-to-r ${category.color} rounded-full ${
                        isCompleted ? 'shadow-lg' : ''
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Achievement Milestone */}
      {overallProgress >= 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-xl p-6 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <Award className="w-8 h-8 text-white" />
          </motion.div>
          
          <h3 className="text-xl font-bold text-white mb-2">🎉 Financial Education Master!</h3>
          <p className="text-gray-400">You've completed all credit education missions. You're now equipped with expert knowledge for your car-buying journey!</p>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressTracker;