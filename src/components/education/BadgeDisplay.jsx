import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Sparkles } from 'lucide-react';

/**
 * BadgeDisplay - Shows collected celestial badges
 * 
 * Displays earned badges with beautiful animations and celestial themes
 */
const BadgeDisplay = ({ badges, categories }) => {
  const getBadgeInfo = (badgeId) => {
    const category = categories.find(cat => cat.badgeId === badgeId);
    return category ? {
      id: badgeId,
      name: category.badgeName,
      category: category.title,
      color: category.color,
      icon: category.icon
    } : null;
  };

  const badgeDesigns = {
    'apr-navigator-nebula': {
      gradient: 'from-blue-400 via-purple-500 to-indigo-600',
      particles: ['⭐', '✨', '💫'],
      description: 'Master of APR and Interest Rates'
    },
    'finance-battle-commander': {
      gradient: 'from-green-400 via-teal-500 to-emerald-600',
      particles: ['🚀', '⚡', '🌟'],
      description: 'Expert in Lease vs Loan Decisions'
    },
    'gravity-master': {
      gradient: 'from-orange-400 via-red-500 to-pink-600',
      particles: ['🌌', '💫', '⭐'],
      description: 'Down Payment Strategy Specialist'
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {badges.map((badgeId, index) => {
        const badgeInfo = getBadgeInfo(badgeId);
        const design = badgeDesigns[badgeId];
        
        if (!badgeInfo || !design) return null;

        return (
          <motion.div
            key={badgeId}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative group"
          >
            {/* Badge Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              {/* Particle Effects */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {design.particles.map((particle, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      x: [0, 20, -20, 0],
                      y: [0, -20, 20, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                    className={`absolute text-2xl pointer-events-none ${
                      i === 0 ? 'top-4 right-4' : 
                      i === 1 ? 'bottom-4 left-4' : 
                      'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                    }`}
                  >
                    {particle}
                  </motion.div>
                ))}
              </div>

              {/* Badge Center */}
              <div className="relative z-10 text-center">
                {/* Main Badge Circle */}
                <div className={`w-24 h-24 bg-gradient-to-br ${design.gradient} rounded-full mx-auto mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                  {/* Shine Effect */}
                  <motion.div
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-45"
                  />
                  
                  {/* Badge Icon */}
                  <div className="relative z-10 text-white">
                    {React.cloneElement(badgeInfo.icon, { className: 'w-8 h-8' })}
                  </div>
                  
                  {/* Inner glow */}
                  <div className="absolute inset-2 bg-white/10 rounded-full" />
                </div>

                {/* Badge Info */}
                <h3 className="text-lg font-bold text-white mb-1">{badgeInfo.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{design.description}</p>
                
                {/* Category Tag */}
                <div className={`inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${design.gradient} bg-opacity-20 rounded-full border border-white/10`}>
                  <Award className="w-3 h-3 text-white" />
                  <span className="text-xs text-white font-medium">{badgeInfo.category}</span>
                </div>

                {/* Achievement Date */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Sparkles className="w-3 h-3" />
                    <span>Earned recently</span>
                  </div>
                </div>
              </div>

              {/* Hover Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${design.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BadgeDisplay;