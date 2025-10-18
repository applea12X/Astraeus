import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Clock, User, GraduationCap, Home, Coffee } from 'lucide-react';
import { IconGrid } from './ui/icon-set';

const FinancialInfoPage = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    employmentStatus: '',
    occupation: '',
    employerName: '',
    annualIncome: ''
  });

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
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle form submission here
      console.log('Financial info submitted:', formData);
      // Navigate to next screen (placeholder for now)
    }
  };

  const canProceed = () => {
    const currentField = steps[currentStep].field;
    return formData[currentField] && formData[currentField].toString().trim() !== '';
  };

  const currentStepData = steps[currentStep];

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

      {/* Title */}
      <div className="fixed top-10 left-10 z-30">
        <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-2">Financial Information</h1>
        <p className="text-xl text-blue-200">Tell us about your financial situation</p>
        <div className="mt-4 text-white/60">
          Step {currentStep + 1} of {steps.length}
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
                className="text-3xl font-bold text-white drop-shadow-2xl mb-24 text-center"
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
                    onItemClick={(item) => handleInputChange(currentStepData.field, item.value)}
                    className="max-w-2xl mx-auto"
                  />
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
                    disabled={!canProceed()}
                    className={`relative px-20 py-6 text-2xl font-semibold rounded-2xl border transition-all duration-300 backdrop-blur-lg min-w-[200px] ${
                      canProceed()
                        ? 'bg-gradient-to-r from-blue-500/30 to-blue-600/30 hover:from-blue-500/40 hover:to-blue-600/40 border-blue-400/60 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105'
                        : 'bg-white/10 border-white/20 text-white/50 cursor-not-allowed'
                    }`}
                  >
                    {currentStep === steps.length - 1 ? 'Complete' : 'Next →'}
                  </button>
                  
                  {/* Button glow effect */}
                  {canProceed() && (
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
    </motion.div>
  );
};

export default FinancialInfoPage;