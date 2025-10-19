import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Clock, User, GraduationCap, Home, Coffee, ArrowLeft, TrendingUp, TrendingDown, Minus, Star, Target, Car, Building, Calendar, DollarSign } from 'lucide-react';
import { IconGrid } from './ui/icon-set';
import { auth, db } from '../firebase/config';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import AIShoppingAssistant from './AIShoppingAssistant';

const FinancialInfoPage = ({ onNavigate, onSubmitFinancialInfo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employmentStatus: '',
    occupation: '',
    employerName: '',
    annualIncome: '',
    creditScore: '',
    financialGoal: '',
    paymentFrequency: ''
  });

  // Load existing financial data when component mounts
  useEffect(() => {
    const loadExistingData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const financialDoc = await getDoc(doc(db, 'financial_profiles', user.uid));
        if (financialDoc.exists()) {
          const existingData = financialDoc.data();
          console.log('Loading existing financial data:', existingData);
          
          // Update form data with existing values
          setFormData({
            employmentStatus: existingData.employmentStatus || '',
            occupation: existingData.occupation || '',
            employerName: existingData.employerName || '',
            annualIncome: existingData.annualIncome || '',
            creditScore: existingData.creditScore || '',
            financialGoal: existingData.financialGoal || '',
            paymentFrequency: existingData.paymentFrequency || ''
          });
        }
      } catch (error) {
        console.error('Error loading existing financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExistingData();
  }, []);

  const steps = [
    {
      field: 'employmentStatus',
      label: 'Employment Status',
      type: 'icons',
      placeholder: 'Select your employment status',
      options: [
        { 
          id: 'full-time',
          value: 'full-time', 
          name: 'Full-time', 
          icon: <Briefcase className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'part-time',
          value: 'part-time', 
          name: 'Part-time', 
          icon: <Clock className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'self-employed',
          value: 'self-employed', 
          name: 'Self-employed', 
          icon: <User className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'student',
          value: 'student', 
          name: 'Student', 
          icon: <GraduationCap className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'unemployed',
          value: 'unemployed', 
          name: 'Unemployed', 
          icon: <Home className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'retired',
          value: 'retired', 
          name: 'Retired', 
          icon: <Coffee className="h-8 w-8 text-white/80" />
        }
      ]
    },
    {
      field: 'creditScore',
      label: 'Credit Score Range',
      type: 'icons',
      placeholder: 'Select your credit score range',
      options: [
        { 
          id: 'poor',
          value: 'poor', 
          name: 'Poor (300-579)', 
          icon: <TrendingDown className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'fair',
          value: 'fair', 
          name: 'Fair (580-669)', 
          icon: <Minus className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'good',
          value: 'good', 
          name: 'Good (670-739)', 
          icon: <TrendingUp className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'excellent',
          value: 'excellent', 
          name: 'Excellent (740+)', 
          icon: <Star className="h-8 w-8 text-white/80" />
        }
      ]
    },
    {
      field: 'financialGoal',
      label: 'Primary Financial Goal',
      type: 'icons',
      placeholder: 'What are you looking to finance?',
      options: [
        { 
          id: 'vehicle',
          value: 'vehicle', 
          name: 'Vehicle Purchase', 
          icon: <Car className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'lease',
          value: 'lease', 
          name: 'Vehicle Lease', 
          icon: <Calendar className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'refinance',
          value: 'refinance', 
          name: 'Refinancing', 
          icon: <DollarSign className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'investment',
          value: 'investment', 
          name: 'Investment', 
          icon: <Target className="h-8 w-8 text-white/80" />
        }
      ]
    },
    {
      field: 'occupation',
      label: 'Occupation / Job Title',
      type: 'text',
      placeholder: 'e.g., Software Engineer, Teacher, Manager'
    },
    {
      field: 'employerName',
      label: 'Employer Name',
      type: 'text',
      placeholder: 'e.g., ABC Corporation, Self-employed'
    },
    {
      field: 'annualIncome',
      label: 'Annual Income (before tax)',
      type: 'number',
      placeholder: 'e.g., 50000'
    },
    {
      field: 'paymentFrequency',
      label: 'Payment Frequency Preference',
      type: 'icons',
      placeholder: 'How often would you like to make payments?',
      options: [
        { 
          id: 'weekly',
          value: 'weekly', 
          name: 'Weekly', 
          icon: <Calendar className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'biweekly',
          value: 'biweekly', 
          name: 'Bi-weekly', 
          icon: <Calendar className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'monthly',
          value: 'monthly', 
          name: 'Monthly', 
          icon: <Calendar className="h-8 w-8 text-white/80" />
        },
        { 
          id: 'quarterly',
          value: 'quarterly', 
          name: 'Quarterly', 
          icon: <Building className="h-8 w-8 text-white/80" />
        }
      ]
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Don't auto-advance on selection, let user click Next button
  };

  const saveFinancialInfo = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare the financial data with timestamp
      const financialData = {
        ...formData,
        completedAt: new Date().toISOString(),
        userId: user.uid
      };

      // Store in a 'financial_profiles' collection with user ID as document ID
      await setDoc(doc(db, 'financial_profiles', user.uid), financialData);
      
      // Also update the user's main profile to indicate they completed financial info and Neptune
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          hasCompletedFinancialInfo: true,
          neptuneCompleted: true,
          neptuneCompletedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });
      } catch (updateError) {
        // If user document doesn't exist, create it
        if (updateError.code === 'not-found') {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            hasCompletedFinancialInfo: true,
            neptuneCompleted: true,
            neptuneCompletedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          });
        } else {
          throw updateError;
        }
      }

      console.log('Financial info saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving financial info:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle form submission - save to Firestore and navigate
      console.log('Financial info submitted:', formData);
      
      const saved = await saveFinancialInfo();
      
      if (saved) {
        // Pass data to parent component
        if (onSubmitFinancialInfo) {
          onSubmitFinancialInfo(formData);
        }
        
        // Navigate back to solar system to continue journey with transfer animation
        if (onNavigate) {
          onNavigate('solar-system', { 
            flight: { 
              from: 'neptune', 
              to: 'uranus' 
            } 
          });
        }
      } else {
        alert('Failed to save financial information. Please try again.');
      }
    }
  };

  const canProceed = () => {
    const currentField = steps[currentStep].field;
    return formData[currentField] && formData[currentField].toString().trim() !== '';
  };

  const currentStepData = steps[currentStep];

  // Show loading state while fetching existing data
  if (loading) {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1229] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Loading your financial information...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1229]"
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
      <div className="fixed top-6 left-6 z-50">
        <div className="relative">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => onNavigate && onNavigate('neptune')}
            className="relative flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-2xl border transition-all duration-300 backdrop-blur-lg bg-gradient-to-r from-blue-500/30 to-blue-600/30 hover:from-blue-500/40 hover:to-blue-600/40 border-blue-400/60 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Neptune</span>
          </motion.button>
          {/* Button glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl -z-10 scale-110 opacity-60"></div>
        </div>
      </div>

      {/* Title */}
      <div className="fixed top-10 left-0 right-0 z-30 text-center">
        <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-2">Financial Information</h1>
        <p className="text-xl text-blue-200">Tell us about your financial situation</p>
        <div className="mt-4 text-white/60">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center p-8 pt-40">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${currentStep}`}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 shadow-2xl min-h-[400px] flex flex-col justify-center"
            >
              {/* Field Label */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`text-3xl font-bold text-white drop-shadow-2xl text-center ${
                  currentStepData.type === 'icons' ? 'mb-24' : 'mb-32'
                }`}
              >
                {currentStepData.label}
              </motion.h2>

              {/* Input Field */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-16 px-16"
              >
                {currentStepData.type === 'icons' ? (
                  <IconGrid 
                    items={currentStepData.options}
                    selectedValue={formData[currentStepData.field]}
                    onItemClick={(item) => handleInputChange(currentStepData.field, item.value)}
                    className="max-w-2xl mx-auto"
                  />
                ) : currentStepData.type === 'select' ? (
                  <div className="space-y-4">
                    {currentStepData.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange(currentStepData.field, option.value)}
                        className={`w-full px-6 py-5 rounded-2xl text-lg font-semibold transition-all ${
                          formData[currentStepData.field] === option.value
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl scale-105'
                            : 'bg-white/15 text-white/90 hover:bg-white/25 border border-white/30'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="relative w-3/4">
                      <input
                        type={currentStepData.type}
                        value={formData[currentStepData.field]}
                        onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                        placeholder={currentStepData.placeholder}
                        min={currentStepData.type === 'number' ? '0' : undefined}
                        className="w-full px-6 py-5 text-lg rounded-2xl bg-white/15 backdrop-blur-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300 shadow-xl drop-shadow-lg"
                      />
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-blue-400/10 blur-xl -z-10 scale-105"></div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Next Button */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="relative">
                  <button
                    onClick={handleNext}
                    disabled={!canProceed() || isSubmitting}
                    className={`relative px-20 py-6 text-2xl font-semibold rounded-2xl border transition-all duration-300 backdrop-blur-lg min-w-[200px] ${
                      canProceed() && !isSubmitting
                        ? 'bg-gradient-to-r from-blue-500/30 to-blue-600/30 hover:from-blue-500/40 hover:to-blue-600/40 border-blue-400/60 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105'
                        : 'bg-white/10 border-white/20 text-white/50 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting && currentStep === steps.length - 1 ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </div>
                    ) : (
                      currentStep === steps.length - 1 ? 'Complete' : 'Next →'
                    )}
                  </button>
                  
                  {/* Button glow effect */}
                  {canProceed() && !isSubmitting && (
                    <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl -z-10 scale-110 opacity-60"></div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Ambient light effects */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* AI Shopping Assistant */}
      <AIShoppingAssistant 
        selectedVehicle={null} 
        financialInfo={formData} 
        userProfile={{}} 
        currentPageName="neptune-financial-info" 
      />
    </motion.div>
  );
};

export default FinancialInfoPage;