import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Car, Users, DollarSign, Zap, Target, Info } from 'lucide-react';
import PetCompanion from './ui/PetCompanion';
import { auth, db } from '../firebase/config';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { calculateRecommendedCarPrice, formatCurrency, getBudgetRecommendationMessage } from '../utils/financialCalculations';

const UranusPage = ({ onNavigate, onSubmitPreferences, financialInfo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    budget: '',
    vehicleType: '',
    familySize: '',
    primaryUse: '',
    fuelType: ''
  });

  // Load existing vehicle preferences when component mounts
  useEffect(() => {
    const loadExistingData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check user document for vehicle preferences
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const existingPreferences = userData.vehiclePreferences;
          
          if (existingPreferences) {
            console.log('Loading existing vehicle preferences:', existingPreferences);
            
            // Update form data with existing values
            setFormData({
              budget: existingPreferences.budget || '',
              vehicleType: existingPreferences.vehicleType || '',
              familySize: existingPreferences.familySize || '',
              primaryUse: existingPreferences.primaryUse || '',
              fuelType: existingPreferences.fuelType || ''
            });
          }
        }
      } catch (error) {
        console.error('Error loading existing vehicle preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExistingData();
  }, []);

  // Calculate recommended price range based on financial info
  const priceCalculation = useMemo(() => {
    return calculateRecommendedCarPrice(financialInfo);
  }, [financialInfo]);

  // Helper function to check if a budget option aligns with recommendations
  const getOptionRecommendationStatus = (optionValue, calculation) => {
    if (!calculation || !calculation.recommendedPriceRanges) return false;
    
    const { moderate } = calculation.recommendedPriceRanges;
    const recommendedMin = moderate.min;
    const recommendedMax = moderate.max;
    
    // Map budget option values to price ranges
    const budgetRanges = {
      'under-25k': { min: 0, max: 25000 },
      '25k-35k': { min: 25000, max: 35000 },
      '35k-50k': { min: 35000, max: 50000 },
      '50k-75k': { min: 50000, max: 75000 },
      'over-75k': { min: 75000, max: Infinity }
    };
    
    const optionRange = budgetRanges[optionValue];
    if (!optionRange) return false;
    
    // Check if there's significant overlap between recommended range and option range
    const overlapMin = Math.max(recommendedMin, optionRange.min);
    const overlapMax = Math.min(recommendedMax, optionRange.max);
    
    // Consider it recommended if there's meaningful overlap (at least 50% of recommended range)
    const overlapAmount = Math.max(0, overlapMax - overlapMin);
    const recommendedRangeSize = recommendedMax - recommendedMin;
    
    return overlapAmount > (recommendedRangeSize * 0.3); // 30% overlap threshold
  };

  const steps = [
    {
      field: 'budget',
      label: 'What is your budget range?',
      type: 'select',
      icon: <DollarSign className="h-8 w-8" />,
      hasRecommendation: true,
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
        budget: formData.budget,
        vehicleType: formData.vehicleType,
        familySize: formData.familySize,
        primaryUse: formData.primaryUse,
        fuelType: formData.fuelType,
        completedAt: new Date().toISOString()
      };

      // Update user document with vehicle preferences using merge
      await setDoc(doc(db, 'users', user.uid), {
        vehiclePreferences: preferencesData,
        hasCompletedVehiclePreferences: true,
        uranusCompleted: true,
        uranusCompletedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      console.log('Vehicle preferences saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving vehicle preferences:', error);
      console.error('Error details:', error.message, error.code);
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
        
        // Navigate to solar system with flight animation from Uranus to Saturn
        if (onNavigate) {
          onNavigate('solar-system', { 
            flight: { 
              from: 'uranus', 
              to: 'saturn' 
            } 
          });
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

  // Show loading state while fetching existing data
  if (loading) {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-b from-[#0a1929] via-[#1e3a5f] to-[#0f1d2e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Loading your vehicle preferences...</p>
        </div>
      </div>
    );
  }

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
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-2xl mb-1">Tell Us Your Preferences</h1>
        <p className="text-sm text-cyan-200 mb-3">Help us find your perfect Toyota</p>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-2">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="text-white/60 text-xs">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center pt-28 pb-6 px-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  {currentStepData.icon}
                </div>
              </div>

              {/* Question */}
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                {currentStepData.label}
              </h2>

              {/* Recommendation for budget step */}
              {currentStepData.hasRecommendation && priceCalculation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4 p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-lg backdrop-blur-sm"
                >
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-cyan-300 mb-1">
                        💡 Recommended Based on Your Income
                      </h3>
                      <p className="text-cyan-100 text-xs mb-2">
                        {getBudgetRecommendationMessage(priceCalculation)}
                      </p>

                      {priceCalculation.maxMonthlyPayment > 0 && (
                        <div className="grid grid-cols-3 gap-1.5 text-xs">
                          <div className="bg-cyan-600/20 p-2 rounded">
                            <div className="text-cyan-300 font-medium text-[10px]">Conservative</div>
                            <div className="text-white text-[11px]">
                              {formatCurrency(priceCalculation.recommendedPriceRanges.conservative.min)} - {formatCurrency(priceCalculation.recommendedPriceRanges.conservative.max)}
                            </div>
                          </div>
                          <div className="bg-cyan-600/30 p-2 rounded border border-cyan-400/50">
                            <div className="text-cyan-200 font-medium text-[10px]">✨ Recommended</div>
                            <div className="text-white font-semibold text-[11px]">
                              {formatCurrency(priceCalculation.recommendedPriceRanges.moderate.min)} - {formatCurrency(priceCalculation.recommendedPriceRanges.moderate.max)}
                            </div>
                          </div>
                          <div className="bg-cyan-600/20 p-2 rounded">
                            <div className="text-cyan-300 font-medium text-[10px]">Optimistic</div>
                            <div className="text-white text-[11px]">
                              {formatCurrency(priceCalculation.recommendedPriceRanges.optimistic.min)} - {formatCurrency(priceCalculation.recommendedPriceRanges.optimistic.max)}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-2 text-[10px] text-cyan-200/80">
                        Based on the 10% car rule: Max monthly payment of {formatCurrency(priceCalculation.maxMonthlyPayment)}
                        (includes insurance, gas, maintenance)
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* No recommendation message if no financial data */}
              {currentStepData.hasRecommendation && !priceCalculation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-yellow-400" />
                    <p className="text-yellow-100 text-xs">
                      Complete your financial information on Neptune to see personalized budget recommendations.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Options */}
              <div className="space-y-2.5 mb-6">
                {currentStepData.options.map((option) => {
                  // Check if this option aligns with recommendations
                  const isRecommended = currentStepData.hasRecommendation && priceCalculation && 
                    getOptionRecommendationStatus(option.value, priceCalculation);
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange(currentStepData.field, option.value)}
                      className={`w-full px-4 py-3 rounded-lg text-base font-semibold transition-all relative ${
                        formData[currentStepData.field] === option.value
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg scale-105'
                          : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                      } ${isRecommended ? 'ring-2 ring-cyan-400/50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {isRecommended && (
                          <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full">
                            ✨ Recommended
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg transition-all"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className={`${currentStep > 0 ? 'flex-1' : 'w-full'} px-6 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
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

      {/* Pet Companion */}
      <PetCompanion position="bottom-right" />
    </motion.div>
  );
};

export default UranusPage;
