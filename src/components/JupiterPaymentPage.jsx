import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, Check, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import AnimatedShaderBackground from './ui/animated-shader-background';
import { auth } from '../firebase/config';
import { updateUserProgress } from '../utils/userProgress';

const PaymentOption = ({ title, description, details, Icon, isSelected, onSelect, onToggleDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-8 rounded-3xl backdrop-blur-lg border transition-all duration-300 ${
        isSelected 
          ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-blue-400/50 shadow-2xl shadow-blue-500/20' 
          : 'bg-black/40 border-white/20 hover:bg-black/50 hover:border-white/30'
      }`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
        >
          <Check className="w-5 h-5 text-white" />
        </motion.div>
      )}

      {/* Content */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>

        <p className="text-blue-100/80">{description}</p>

        {/* Learn More Section */}
        <div className="space-y-3">
          <button
            onClick={() => {
              setShowDetails(!showDetails);
              onToggleDetails?.();
            }}
            className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
          >
            {showDetails ? <ChevronUp /> : <ChevronDown />}
            <span>{showDetails ? 'Show Less' : 'Learn More'}</span>
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-black/20 text-sm text-blue-100/90 space-y-3">
                  {details.map((detail, index) => (
                    <p key={index}>{detail}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Select Button */}
        <Button
          onClick={onSelect}
          className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
            isSelected
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          {isSelected ? 'Selected' : 'Select This Plan'}
        </Button>
      </div>
    </motion.div>
  );
};

const JupiterPaymentPage = ({ onNavigate, financialInfo, selectedVehicle }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const paymentOptions = [
    {
      id: 'cash',
      title: 'Cash Purchase',
      description: 'Pay the full amount upfront and own your Toyota immediately.',
      details: [
        '• Full ownership from day one',
        '• No monthly payments or interest charges',
        '• Potential for dealer cash incentives',
        '• Maximum flexibility for customization and usage',
        '• Lower total cost of ownership over time'
      ]
    },
    {
      id: 'finance',
      title: 'Finance (Auto Loan)',
      description: 'Spread the cost over time with fixed monthly payments.',
      details: [
        '• Low monthly payments spread over 2-7 years',
        '• Build equity with each payment',
        '• Competitive interest rates through Toyota Financial Services',
        '• Option to pay extra or settle early',
        '• Vehicle ownership after loan completion'
      ]
    },
    {
      id: 'lease',
      title: 'Lease',
      description: 'Drive a new Toyota with lower monthly payments and upgrade options.',
      details: [
        '• Lower monthly payments than financing',
        '• New vehicle every 2-3 years',
        '• Warranty coverage throughout lease term',
        '• No long-term commitment',
        '• Simple return or upgrade process at lease end'
      ]
    }
  ];

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };

  const handleToggleDetails = (planId) => {
    setExpandedCard(expandedCard === planId ? null : planId);
  };

  const handleContinue = async () => {
    if (!selectedPlan) return;

    try {
      const user = auth.currentUser;
      if (user) {
        // Mark Jupiter as completed and save payment plan selection
        await updateUserProgress(user.uid, 'jupiter', {
          paymentPlan: selectedPlan,
          paymentPlanSelectedAt: new Date().toISOString()
        });
      }

      // Trigger spaceship animation to Mars
      onNavigate('solar-system', { flight: { from: 'jupiter', to: 'mars' } });
    } catch (error) {
      console.error('Error updating progress:', error);
      // Still navigate even if progress update fails
      onNavigate('solar-system', { flight: { from: 'jupiter', to: 'mars' } });
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-auto">
      {/* Animated Background */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <AnimatedShaderBackground />
      </div>

      {/* Background Gradient Overlay */}
      <div 
        className="fixed inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%)',
          zIndex: 1
        }}
      />

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => onNavigate && onNavigate('solar-system')}
        className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Solar System</span>
      </motion.button>

   

      {/* Main Content */}
      <div className="relative z-10 min-h-screen py-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-4 drop-shadow-2xl"
          >
            Choose Your Payment Path
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-200"
          >
            Select the payment option that best fits your journey
          </motion.p>
        </div>

        {/* Payment Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
          {paymentOptions.map((option) => (
            <PaymentOption
              key={option.id}
              {...option}
              isSelected={selectedPlan === option.id}
              onSelect={() => handleSelectPlan(option.id)}
              onToggleDetails={() => handleToggleDetails(option.id)}
            />
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedPlan ? 1 : 0 }}
          className="fixed bottom-8 left-0 right-0 flex justify-center"
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedPlan}
            className={`px-20 py-6 text-xl font-bold rounded-2xl transition-all duration-300 ${
              selectedPlan
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 backdrop-blur-lg'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            <span>Continue Your Journey</span>
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      {/* Ambient light effects */}
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default JupiterPaymentPage;