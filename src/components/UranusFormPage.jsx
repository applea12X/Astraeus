import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Car, Users, DollarSign, Zap, Target } from 'lucide-react';
import { auth, db } from '../firebase/config';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const UranusPage = ({ onNavigate, onSubmitPreferences }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    budget: '',
    vehicleType: '',
    familySize: '',
    primaryUse: '',
    fuelType: ''
  });

  const steps = [
    {
      field: 'budget',
      label: 'What is your budget range?',
      type: 'select',
      icon: <DollarSign className="h-8 w-8" />,
      options: [
        { value: 'under-25k', label: 'Under $25,000' },
        { value: '25k-35k', label: '$25,000 - $35,000' },
        { value: '35k-50k', label: '$35,000 - $50,000' },
        { value: '50k-75k', label: '$50,000 - $75,000' },
        { value: 'over-75k', label: 'Over $75,000' }
      ]
    },
    {
      field: 'vehicleType',
      label: 'What type of vehicle do you prefer?',
      type: 'select',
      icon: <Car className="h-8 w-8" />,
      options: [
        { value: 'sedan', label: 'Sedan' },
        { value: 'suv', label: 'SUV' },
        { value: 'truck', label: 'Truck' },
        { value: 'minivan', label: 'Minivan' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'electric', label: 'Electric' }
      ]
    },
    {
      field: 'familySize',
      label: 'How many people will regularly use this vehicle?',
      type: 'select',
      icon: <Users className="h-8 w-8" />,
      options: [
        { value: '1-2', label: '1-2 people' },
        { value: '3-4', label: '3-4 people' },
        { value: '5-6', label: '5-6 people' },
        { value: '7+', label: '7+ people' }
      ]
    },
    {
      field: 'primaryUse',
      label: 'What will be the primary use?',
      type: 'select',
      icon: <Target className="h-8 w-8" />,
      options: [
        { value: 'daily-commute', label: 'Daily Commute' },
        { value: 'family-trips', label: 'Family Road Trips' },
        { value: 'off-road', label: 'Off-Road Adventures' },
        { value: 'business', label: 'Business/Work' },
        { value: 'mixed', label: 'Mixed Use' }
      ]
    },
    {
      field: 'fuelType',
      label: 'Fuel preference?',
      type: 'select',
      icon: <Zap className="h-8 w-8" />,
      options: [
        { value: 'gas', label: 'Gasoline' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'electric', label: 'Electric' },
        { value: 'no-preference', label: 'No Preference' }
      ]
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveVehiclePreferences = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare the vehicle preferences data with timestamp
      const preferencesData = {
        ...formData,
        completedAt: new Date().toISOString(),
        userId: user.uid
      };

      // Store in a 'vehicle_preferences' collection with user ID as document ID
      await setDoc(doc(db, 'vehicle_preferences', user.uid), preferencesData);
      
      // Also update the user's main profile to indicate they completed vehicle preferences and Uranus
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          hasCompletedVehiclePreferences: true,
          uranusCompleted: true,
          uranusCompletedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });
      } catch (updateError) {
        // If user document doesn't exist, create it
        if (updateError.code === 'not-found') {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            hasCompletedVehiclePreferences: true,
            uranusCompleted: true,
            uranusCompletedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          });
        } else {
          throw updateError;
        }
      }

      console.log('Vehicle preferences saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving vehicle preferences:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit preferences - save to Firebase and navigate to Saturn intro
      console.log('Vehicle preferences submitted:', formData);
      
      const saved = await saveVehiclePreferences();
      
      if (saved) {
        // Pass data to parent component
        if (onSubmitPreferences) {
          onSubmitPreferences(formData);
        }
        
        // Navigate to Saturn intro
        if (onNavigate) {
          onNavigate('saturn');
        }
      } else {
        alert('Failed to save vehicle preferences. Please try again.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const currentField = steps[currentStep].field;
    return formData[currentField] && formData[currentField].trim() !== '';
  };

  const currentStepData = steps[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-b from-[#0a1929] via-[#1e3a5f] to-[#0f1d2e]"
    >
      {/* Stars Background */}
      <div className="absolute inset-0">
        {[...Array(140)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => onNavigate && onNavigate('uranus')}
        className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Uranus</span>
      </motion.button>

      {/* Title */}
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-30 text-center">
        <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-2">Tell Us Your Preferences</h1>
        <p className="text-xl text-cyan-200">Help us find your perfect Toyota</p>
        <div className="mt-4 text-white/60 text-sm">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-32 left-1/2 -translate-x-1/2 w-96 z-30">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 shadow-2xl"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  {currentStepData.icon}
                </div>
              </div>

              {/* Question */}
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                {currentStepData.label}
              </h2>

              {/* Options */}
              <div className="space-y-4 mb-12">
                {currentStepData.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange(currentStepData.field, option.value)}
                    className={`w-full px-6 py-5 rounded-xl text-lg font-semibold transition-all ${
                      formData[currentStepData.field] === option.value
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className={`${currentStep > 0 ? 'flex-1' : 'w-full'} px-8 py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    canProceed() && !isSubmitting
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting && currentStep === steps.length - 1 ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    currentStep === steps.length - 1 ? 'Get Recommendations →' : 'Next →'
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Ambient glow effects */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
};

export default UranusPage;
