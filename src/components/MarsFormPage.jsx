import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Car, DollarSign, TrendingUp, Calendar, Wallet } from 'lucide-react';
import { auth } from '../firebase/config';
import { getUserProgress } from '../utils/userProgress';
import AIShoppingAssistant from './AIShoppingAssistant';

const MarsFormPage = ({ onNavigate, financialInfo, vehiclePreferences, userProfile, selectedVehicle: selectedVehicleProp }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(selectedVehicleProp || null);
  const [formData, setFormData] = useState({
    vehiclePrice: '',
    downPayment: '',
    paymentMethod: '', // 'finance', 'lease', 'lump-sum'
    creditScore: financialInfo?.creditScore || '',
    monthlyBudget: '',
    expectedMileage: ''
  });

  // Fetch saved payment plan and selected vehicle from Firebase
  useEffect(() => {
    const loadPaymentDataAndVehicle = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const progress = await getUserProgress(user.uid);

          // Load selected vehicle from Firebase if not passed as prop
          if (!selectedVehicleProp && progress.selectedVehicle) {
            setSelectedVehicle(progress.selectedVehicle);
            console.log('✅ Loaded selected vehicle from Firebase:', progress.selectedVehicle);
          }

          // Map Jupiter payment plan to Mars payment method
          // 'cash' -> 'lump-sum', 'finance' -> 'finance', 'lease' -> 'lease'
          if (progress.paymentPlan) {
            const paymentMethodMap = {
              'cash': 'lump-sum',
              'finance': 'finance',
              'lease': 'lease'
            };

            const mappedPaymentMethod = paymentMethodMap[progress.paymentPlan] || '';

            setFormData(prev => ({
              ...prev,
              paymentMethod: mappedPaymentMethod
            }));
          }

          // Pre-populate vehicle price from selected vehicle
          if ((selectedVehicleProp || progress.selectedVehicle) && !formData.vehiclePrice) {
            const vehicle = selectedVehicleProp || progress.selectedVehicle;
            // Extract numeric price from priceNew string (e.g., "$35,000" -> "35000")
            const priceMatch = vehicle.priceNew?.match(/[\d,]+/);
            if (priceMatch) {
              const price = priceMatch[0].replace(/,/g, '');
              setFormData(prev => ({
                ...prev,
                vehiclePrice: price
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error loading payment plan and vehicle:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentDataAndVehicle();
  }, [selectedVehicleProp]);

  const steps = [
    {
      field: 'vehiclePrice',
      label: 'What\'s your target vehicle price?',
      type: 'select',
      icon: <Car className="h-8 w-8" />,
      // Hide this step if we have a selected vehicle with price
      show: !selectedVehicle || !selectedVehicle.priceNew,
      options: [
        { value: '25000', label: '$25,000' },
        { value: '35000', label: '$35,000' },
        { value: '45000', label: '$45,000' },
        { value: '55000', label: '$55,000' },
        { value: '65000', label: '$65,000' },
        { value: '75000', label: '$75,000+' }
      ]
    },
    {
      field: 'paymentMethod',
      label: 'How would you prefer to pay?',
      type: 'cards',
      icon: <CreditCard className="h-8 w-8" />,
      // Only show this step if payment method wasn't loaded from Firebase
      show: !formData.paymentMethod || formData.paymentMethod === '',
      options: [
        {
          value: 'finance',
          title: 'Finance (Loan)',
          description: 'Build equity, own the vehicle',
          icon: <TrendingUp className="h-12 w-12" />,
          benefits: ['Build equity over time', 'Own the vehicle', 'No mileage restrictions', 'Modify as you wish'],
          bestFor: 'Long-term ownership, building assets'
        },
        {
          value: 'lease',
          title: 'Lease',
          description: 'Lower payments, newer vehicles',
          icon: <Calendar className="h-12 w-12" />,
          benefits: ['Lower monthly payments', 'Drive newer models', 'Warranty coverage', 'Upgrade every few years'],
          bestFor: 'Lower payments, latest features'
        },
        {
          value: 'lump-sum',
          title: 'Cash Purchase',
          description: 'Pay in full, immediate ownership',
          icon: <Wallet className="h-12 w-12" />,
          benefits: ['No monthly payments', 'No interest charges', 'Full ownership', 'Complete freedom'],
          bestFor: 'Maximum savings, full control'
        }
      ]
    },
    {
      field: 'downPayment',
      label: 'How much can you put down?',
      type: 'select',
      icon: <DollarSign className="h-8 w-8" />,
      show: formData.paymentMethod === 'finance',
      options: [
        { value: '0', label: '$0 (0%)' },
        { value: '0.05', label: '5% Down' },
        { value: '0.10', label: '10% Down' },
        { value: '0.15', label: '15% Down' },
        { value: '0.20', label: '20% Down (Recommended)' },
        { value: '0.25', label: '25% Down' }
      ]
    },
    {
      field: 'expectedMileage',
      label: 'How many miles do you drive per year?',
      type: 'select',
      icon: <Car className="h-8 w-8" />,
      show: formData.paymentMethod === 'lease',
      options: [
        { value: '8000', label: '8,000 miles/year (Low)' },
        { value: '12000', label: '12,000 miles/year (Average)' },
        { value: '15000', label: '15,000 miles/year (High)' },
        { value: '18000', label: '18,000+ miles/year (Very High)' }
      ]
    },
    {
      field: 'monthlyBudget',
      label: 'What\'s your comfortable monthly budget?',
      type: 'select',
      icon: <DollarSign className="h-8 w-8" />,
      show: formData.paymentMethod !== 'lump-sum',
      options: [
        { value: '300', label: 'Under $300/month' },
        { value: '400', label: '$300 - $400/month' },
        { value: '500', label: '$400 - $500/month' },
        { value: '600', label: '$500 - $600/month' },
        { value: '750', label: '$600 - $750/month' },
        { value: '1000', label: '$750+ /month' }
      ]
    }
  ];

  const visibleSteps = steps.filter(step => step.show !== false);
  const currentStepData = visibleSteps[currentStep];

  // Safety check: if currentStep is out of bounds, reset to 0
  useEffect(() => {
    if (visibleSteps.length > 0 && currentStep >= visibleSteps.length) {
      setCurrentStep(0);
    }
  }, [visibleSteps.length, currentStep]);

  // Auto-proceed if all steps are completed/hidden
  useEffect(() => {
    if (!isLoading && visibleSteps.length === 0 && formData.vehiclePrice && formData.paymentMethod) {
      // All questions answered, proceed to simulations
      console.log('🚀 All steps completed, auto-navigating to payment simulations');
      if (onNavigate) {
        onNavigate('payment-simulations', {
          paymentData: formData,
          financialInfo,
          vehiclePreferences
        });
      }
    }
  }, [isLoading, visibleSteps.length, formData.vehiclePrice, formData.paymentMethod]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit and navigate to simulations
      if (onNavigate) {
        onNavigate('payment-simulations', {
          paymentData: formData,
          financialInfo,
          vehiclePreferences
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (!currentStepData) return false;
    const currentField = currentStepData.field;
    return formData[currentField] && formData[currentField].trim() !== '';
  };

  const renderPaymentMethodCards = () => {
    if (!currentStepData?.options) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {currentStepData.options.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleInputChange(currentStepData.field, option.value)}
            className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              formData[currentStepData.field] === option.value
                ? 'border-red-400 bg-red-500/20 shadow-xl shadow-red-500/20'
                : 'border-white/20 bg-white/5 hover:border-red-300/50 hover:bg-white/10'
            }`}
          >
            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div className={`p-3 rounded-xl ${
                formData[currentStepData.field] === option.value
                  ? 'bg-red-500/30 text-red-300'
                  : 'bg-white/10 text-white/70'
              }`}>
                {React.cloneElement(option.icon, { className: 'w-8 h-8' })}
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-bold text-white text-center mb-1">
              {option.title}
            </h3>
            <p className="text-orange-100 text-center text-xs mb-3">
              {option.description}
            </p>

            {/* Benefits */}
            <div className="space-y-1.5 mb-3">
              {option.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center text-xs text-orange-50">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>

            {/* Best For */}
            <div className="border-t border-white/10 pt-2">
              <p className="text-xs text-orange-200 text-center">
                <span className="font-semibold">Best for:</span> {option.bestFor}
              </p>
            </div>

            {/* Selection indicator */}
            {formData[currentStepData.field] === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-xs">✓</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  // Show loading state while fetching payment plan or if no valid step data
  if (isLoading || !currentStepData || visibleSteps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-b from-[#8B2500] via-[#A0522D] to-[#CD853F] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your payment preferences...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-b from-[#8B2500] via-[#A0522D] to-[#CD853F]"
    >
      {/* Stars Background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
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
        onClick={() => onNavigate && onNavigate('mars')}
        className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Mars</span>
      </motion.button>

      {/* Main Content Container with side-by-side layout */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto pt-20 pb-12 px-6">
          
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-2">Payment Options</h1>
            <p className="text-xl text-orange-200">Choose your financial path</p>
            <div className="mt-3 text-white/60 text-sm">
              Step {currentStep + 1} of {visibleSteps.length}
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className={`grid gap-6 ${selectedVehicle ? 'grid-cols-1 lg:grid-cols-[380px_1fr]' : 'grid-cols-1'}`}>
            
            {/* Left Column - Vehicle Card (only if vehicle exists) */}
            {selectedVehicle && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:sticky lg:top-6 h-fit"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-xl">
                  {/* Vehicle Image */}
                  {selectedVehicle.imageUrl && (
                    <div className="w-full h-48 rounded-xl overflow-hidden bg-white/5 mb-4">
                      <img
                        src={selectedVehicle.imageUrl}
                        alt={selectedVehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Vehicle Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {selectedVehicle.name}
                    </h3>
                    <p className="text-orange-200 text-sm mb-4">
                      {selectedVehicle.year} • {selectedVehicle.category}
                    </p>
                    
                    {/* Stats Grid */}
                    <div className="space-y-3 bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Price</span>
                        <span className="font-bold text-green-300 text-lg">{selectedVehicle.priceNew}</span>
                      </div>
                      <div className="h-px bg-white/10"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Fuel Economy</span>
                        <span className="font-semibold text-white">{selectedVehicle.fuelEconomy}</span>
                      </div>
                      <div className="h-px bg-white/10"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Seating</span>
                        <span className="font-semibold text-white">{selectedVehicle.seating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Right Column - Form Content */}
            <div className="flex flex-col gap-6">
              {/* Progress Bar */}
              <div className="w-full">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / visibleSteps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Form Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentStep}-${formData.paymentMethod}`}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                      {currentStepData.icon}
                    </div>
                  </div>

                  {/* Question */}
                  <h2 className="text-3xl font-bold text-white text-center mb-10">
                    {currentStepData.label}
                  </h2>

                  {/* Options */}
                  {currentStepData.type === 'cards' ? (
                    renderPaymentMethodCards()
                  ) : (
                    <div className="space-y-4 mb-10">
                      {currentStepData.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleInputChange(currentStepData.field, option.value)}
                          className={`w-full px-6 py-5 rounded-xl text-lg font-semibold transition-all ${
                            formData[currentStepData.field] === option.value
                              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                              : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}

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
                      disabled={!canProceed()}
                      className={`${currentStep > 0 ? 'flex-1' : 'w-full'} px-8 py-4 font-semibold rounded-xl transition-all ${
                        canProceed()
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg'
                          : 'bg-white/10 text-white/50 cursor-not-allowed'
                      }`}
                    >
                      {currentStep === visibleSteps.length - 1 ? 'See Payment Options →' : 'Next →'}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient glow effects */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* AI Shopping Assistant */}
      <AIShoppingAssistant 
        selectedVehicle={selectedVehicle} 
        financialInfo={financialInfo} 
        userProfile={userProfile} 
        currentPageName="mars-form" 
      />
    </motion.div>
  );
};

export default MarsFormPage;