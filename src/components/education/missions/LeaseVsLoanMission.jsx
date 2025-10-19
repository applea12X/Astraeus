import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Car, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  RefreshCw,
  Calculator,
  Zap
} from 'lucide-react';

/**
 * LeaseVsLoanMission - Interactive lease vs loan education
 * 
 * Contains 4 sub-missions:
 * 1. Lease Fundamentals
 * 2. Loan Fundamentals  
 * 3. The Great Comparison
 * 4. Real-World Scenarios
 */
const LeaseVsLoanMission = ({ mission, category, onComplete, isCompleted, user }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [comparisonValues, setComparisonValues] = useState({
    vehiclePrice: 30000,
    downPayment: 3000,
    leaseTermMonths: 36,
    loanTermYears: 5,
    leaseApr: 2.9,
    loanApr: 4.5,
    residualValue: 18000 // Estimated value at lease end
  });
  const [scenarioAnswers, setScenarioAnswers] = useState({});

  const missionContent = {
    'lease-1-fundamentals': {
      title: 'Lease Fundamentals',
      steps: [
        {
          title: 'What is Car Leasing?',
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-xl p-6 border border-green-400/20">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-green-400" />
                  Car Leasing Explained
                </h4>
                <p className="text-gray-300 mb-4">
                  Leasing is like <strong>renting a car long-term</strong>. You pay for the vehicle's 
                  depreciation during your lease term, plus interest and fees.
                </p>
                <div className="bg-green-800/30 rounded-lg p-4">
                  <p className="text-green-200">
                    🚗 <strong>You don't own the car</strong> - you're paying to use it for 2-4 years.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-green-400/30">
                  <h5 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Lease Pros
                  </h5>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Lower monthly payments</li>
                    <li>• Always drive newer cars</li>
                    <li>• Warranty usually covers repairs</li>
                    <li>• No worries about selling/trade-in</li>
                    <li>• Get latest safety features</li>
                  </ul>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 border border-red-400/30">
                  <h5 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Lease Cons
                  </h5>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Never own the vehicle</li>
                    <li>• Mileage restrictions (10k-15k/year)</li>
                    <li>• Wear-and-tear charges</li>
                    <li>• Continuous monthly payments</li>
                    <li>• Early termination fees</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-400/30 rounded-xl p-6">
                <h5 className="text-white font-semibold mb-4">How Lease Payments Work</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-800/30 rounded-lg">
                    <span className="text-gray-300">Vehicle Price</span>
                    <span className="text-white font-semibold">$30,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-800/30 rounded-lg">
                    <span className="text-gray-300">Estimated Value After 3 Years</span>
                    <span className="text-white font-semibold">$18,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-800/50 rounded-lg border border-green-400/30">
                    <span className="text-green-300 font-semibold">Depreciation You Pay</span>
                    <span className="text-green-400 font-bold">$12,000</span>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Lease Terms You Should Know',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    term: 'Capitalized Cost',
                    definition: 'The price of the vehicle (like MSRP for buying)',
                    example: 'If MSRP is $30,000, you might negotiate to $28,000',
                    color: 'blue'
                  },
                  {
                    term: 'Residual Value',
                    definition: 'What the car will be worth at lease end',
                    example: 'A $30,000 car might have 60% residual = $18,000',
                    color: 'green'
                  },
                  {
                    term: 'Money Factor',
                    definition: 'Like APR for leases (multiply by 2400 to get rough APR)',
                    example: 'Money factor 0.0012 = roughly 2.9% APR',
                    color: 'purple'
                  },
                  {
                    term: 'Disposition Fee',
                    definition: 'Fee charged at lease end for inspection/processing',
                    example: 'Usually $300-$500 when you return the car',
                    color: 'orange'
                  }
                ].map((item) => (
                  <div key={item.term} className={`bg-${item.color}-900/30 border border-${item.color}-400/30 rounded-lg p-6`}>
                    <h5 className={`text-${item.color}-400 font-semibold mb-2`}>{item.term}</h5>
                    <p className="text-gray-300 text-sm mb-3">{item.definition}</p>
                    <div className={`bg-${item.color}-800/30 rounded p-3`}>
                      <p className={`text-${item.color}-200 text-xs`}>
                        <strong>Example:</strong> {item.example}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]
    },
    'lease-2-loan-basics': {
      title: 'Loan Fundamentals',
      steps: [
        {
          title: 'Auto Loan Basics',
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 border border-blue-400/20">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  Auto Loan Explained
                </h4>
                <p className="text-gray-300 mb-4">
                  When you finance a car, you <strong>borrow money to buy it</strong>. You own the car 
                  from day one, but the lender holds the title until you pay off the loan.
                </p>
                <div className="bg-blue-800/30 rounded-lg p-4">
                  <p className="text-blue-200">
                    🏠 <strong>You own the asset</strong> - like a house mortgage, you're building equity.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-green-400/30">
                  <h5 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Loan Pros
                  </h5>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• You own the car</li>
                    <li>• Build equity over time</li>
                    <li>• No mileage restrictions</li>
                    <li>• Can modify the vehicle</li>
                    <li>• Eventually no monthly payments</li>
                    <li>• Can sell anytime</li>
                  </ul>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 border border-red-400/30">
                  <h5 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Loan Cons
                  </h5>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Higher monthly payments</li>
                    <li>• Responsible for all repairs after warranty</li>
                    <li>• Car depreciates (may owe more than it's worth)</li>
                    <li>• Need to handle selling/trading</li>
                    <li>• Stuck with older technology</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-900/30 border border-purple-400/30 rounded-xl p-6">
                <h5 className="text-white font-semibold mb-4">Loan Payment Breakdown</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded-lg">
                    <span className="text-gray-300">Vehicle Price</span>
                    <span className="text-white font-semibold">$30,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded-lg">
                    <span className="text-gray-300">Down Payment</span>
                    <span className="text-white font-semibold">$3,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-800/50 rounded-lg border border-blue-400/30">
                    <span className="text-blue-300 font-semibold">Amount Financed</span>
                    <span className="text-blue-400 font-bold">$27,000</span>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    'lease-3-comparison': {
      title: 'The Great Comparison',
      steps: [
        {
          title: 'Interactive Lease vs Loan Calculator',
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-400/20">
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-purple-400" />
                  Compare Your Options
                </h4>

                {/* Input Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Vehicle Price</label>
                    <input
                      type="number"
                      value={comparisonValues.vehiclePrice}
                      onChange={(e) => setComparisonValues({...comparisonValues, vehiclePrice: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Down Payment</label>
                    <input
                      type="number"
                      value={comparisonValues.downPayment}
                      onChange={(e) => setComparisonValues({...comparisonValues, downPayment: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Lease APR (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={comparisonValues.leaseApr}
                      onChange={(e) => setComparisonValues({...comparisonValues, leaseApr: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Comparison Results */}
                <LeaseVsLoanComparison values={comparisonValues} />

                {/* Quick Scenarios */}
                <div className="mt-6">
                  <h5 className="text-white font-semibold mb-4">Quick Scenarios</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setComparisonValues({
                        vehiclePrice: 25000, downPayment: 2500, leaseTermMonths: 36,
                        loanTermYears: 5, leaseApr: 2.9, loanApr: 4.5, residualValue: 15000
                      })}
                      className="p-4 bg-blue-800/50 hover:bg-blue-800/70 rounded-lg border border-blue-400/30 text-left transition-all"
                    >
                      <p className="text-blue-400 font-semibold">Economy Car</p>
                      <p className="text-gray-300 text-sm">$25,000 Honda Civic</p>
                    </button>
                    <button
                      onClick={() => setComparisonValues({
                        vehiclePrice: 35000, downPayment: 3500, leaseTermMonths: 36,
                        loanTermYears: 5, leaseApr: 3.2, loanApr: 4.8, residualValue: 21000
                      })}
                      className="p-4 bg-green-800/50 hover:bg-green-800/70 rounded-lg border border-green-400/30 text-left transition-all"
                    >
                      <p className="text-green-400 font-semibold">Mid-Size SUV</p>
                      <p className="text-gray-300 text-sm">$35,000 Toyota RAV4</p>
                    </button>
                    <button
                      onClick={() => setComparisonValues({
                        vehiclePrice: 50000, downPayment: 5000, leaseTermMonths: 36,
                        loanTermYears: 6, leaseApr: 3.5, loanApr: 5.2, residualValue: 30000
                      })}
                      className="p-4 bg-purple-800/50 hover:bg-purple-800/70 rounded-lg border border-purple-400/30 text-left transition-all"
                    >
                      <p className="text-purple-400 font-semibold">Luxury Vehicle</p>
                      <p className="text-gray-300 text-sm">$50,000 Lexus RX</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    'lease-4-scenarios': {
      title: 'Real-World Scenarios',
      steps: [
        {
          title: 'Decision-Making Scenarios',
          content: (
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white mb-4">Which Option is Best?</h4>
              
              {/* Scenario 1 */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30">
                <h5 className="text-white font-semibold mb-4">Scenario 1: Sarah, Marketing Manager</h5>
                <div className="bg-blue-900/30 rounded-lg p-4 mb-4">
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Drives 18,000 miles per year for work</li>
                    <li>• Likes to keep cars for 7-8 years</li>
                    <li>• Budget: $400/month</li>
                    <li>• Values long-term savings</li>
                  </ul>
                </div>
                
                <p className="text-white mb-4 font-medium">Should Sarah lease or buy?</p>
                <div className="space-y-3">
                  {[
                    { id: 'lease', text: 'Lease - Lower monthly payments', correct: false },
                    { id: 'buy', text: 'Buy - Better for high mileage and long ownership', correct: true }
                  ].map((option) => (
                    <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="scenario-1"
                        value={option.id}
                        onChange={(e) => setScenarioAnswers({...scenarioAnswers, scenario1: e.target.value})}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="text-gray-300">{option.text}</span>
                    </label>
                  ))}
                </div>
                
                {scenarioAnswers.scenario1 && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    scenarioAnswers.scenario1 === 'buy' 
                      ? 'bg-green-900/30 border border-green-400/30' 
                      : 'bg-red-900/30 border border-red-400/30'
                  }`}>
                    <p className={`${scenarioAnswers.scenario1 === 'buy' ? 'text-green-300' : 'text-red-300'}`}>
                      {scenarioAnswers.scenario1 === 'buy' 
                        ? '✅ Correct! Sarah drives too much for leasing (over 15k/year limit) and wants to keep the car long-term.'
                        : '❌ Not ideal. High mileage would result in excess mileage fees, and she wants to keep the car 7-8 years.'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Scenario 2 */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30">
                <h5 className="text-white font-semibold mb-4">Scenario 2: Mike, Tech Startup Founder</h5>
                <div className="bg-green-900/30 rounded-lg p-4 mb-4">
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Drives 8,000 miles per year (mostly city)</li>
                    <li>• Wants latest tech and safety features</li>
                    <li>• Prefers upgrading every 3 years</li>
                    <li>• Doesn't want repair hassles</li>
                  </ul>
                </div>
                
                <p className="text-white mb-4 font-medium">Should Mike lease or buy?</p>
                <div className="space-y-3">
                  {[
                    { id: 'lease', text: 'Lease - Perfect for low mileage and frequent upgrades', correct: true },
                    { id: 'buy', text: 'Buy - Build equity over time', correct: false }
                  ].map((option) => (
                    <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="scenario-2"
                        value={option.id}
                        onChange={(e) => setScenarioAnswers({...scenarioAnswers, scenario2: e.target.value})}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="text-gray-300">{option.text}</span>
                    </label>
                  ))}
                </div>
                
                {scenarioAnswers.scenario2 && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    scenarioAnswers.scenario2 === 'lease' 
                      ? 'bg-green-900/30 border border-green-400/30' 
                      : 'bg-red-900/30 border border-red-400/30'
                  }`}>
                    <p className={`${scenarioAnswers.scenario2 === 'lease' ? 'text-green-300' : 'text-red-300'}`}>
                      {scenarioAnswers.scenario2 === 'lease' 
                        ? '✅ Perfect choice! Low mileage, wants latest tech, and upgrades frequently - ideal for leasing.'
                        : '❌ Not optimal. Mike would lose money selling every 3 years due to depreciation, and miss out on latest features.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        }
      ]
    }
  };

  const currentMissionContent = missionContent[mission.id];
  const totalSteps = currentMissionContent?.steps.length || 1;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(mission.id, mission.points);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!currentMissionContent) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">Mission content not found</p>
      </div>
    );
  }

  const currentStepContent = currentMissionContent.steps[currentStep];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-4xl mx-auto"
        >
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-white">{currentStepContent.title}</h3>
              <span className="text-gray-400 text-sm">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                className={`h-2 bg-gradient-to-r ${category.color} rounded-full`}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">
            {currentStepContent.content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
            >
              Previous
            </button>

            <div className="text-center">
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Mission Completed</span>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${category.color} hover:shadow-lg text-white rounded-lg transition-all`}
            >
              {currentStep < totalSteps - 1 ? 'Next' : 'Complete Mission'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Lease vs Loan Comparison Component
const LeaseVsLoanComparison = ({ values }) => {
  const { vehiclePrice, downPayment, leaseTermMonths, loanTermYears, leaseApr, loanApr, residualValue } = values;
  
  // Lease calculations
  const leaseAmount = vehiclePrice - residualValue;
  const leaseMonthlyRate = leaseApr / 100 / 12;
  const leaseMonthlyPayment = (leaseAmount / leaseTermMonths) + ((vehiclePrice + residualValue) * leaseMonthlyRate);
  const leaseTotalPaid = leaseMonthlyPayment * leaseTermMonths + downPayment;
  
  // Loan calculations
  const loanAmount = vehiclePrice - downPayment;
  const loanMonthlyRate = loanApr / 100 / 12;
  const loanTermMonths = loanTermYears * 12;
  const loanMonthlyPayment = (loanAmount * loanMonthlyRate * Math.pow(1 + loanMonthlyRate, loanTermMonths)) / 
                            (Math.pow(1 + loanMonthlyRate, loanTermMonths) - 1);
  const loanTotalPaid = loanMonthlyPayment * loanTermMonths + downPayment;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Lease Option */}
      <div className="bg-green-900/30 border border-green-400/30 rounded-xl p-6">
        <h5 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Lease Option
        </h5>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Monthly Payment</span>
            <span className="text-white font-semibold">${leaseMonthlyPayment.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Term</span>
            <span className="text-white">{leaseTermMonths} months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Total Paid</span>
            <span className="text-green-400 font-bold">${leaseTotalPaid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Ownership</span>
            <span className="text-red-400">$0</span>
          </div>
        </div>
      </div>

      {/* Loan Option */}
      <div className="bg-blue-900/30 border border-blue-400/30 rounded-xl p-6">
        <h5 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Loan Option
        </h5>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Monthly Payment</span>
            <span className="text-white font-semibold">${loanMonthlyPayment.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Term</span>
            <span className="text-white">{loanTermMonths} months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Total Paid</span>
            <span className="text-blue-400 font-bold">${loanTotalPaid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">You Own</span>
            <span className="text-green-400 font-bold">The Car!</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="md:col-span-2 bg-purple-900/30 border border-purple-400/30 rounded-xl p-6">
        <h5 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Quick Analysis
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Monthly Savings (Lease)</p>
            <p className="text-2xl font-bold text-green-400">
              ${(loanMonthlyPayment - leaseMonthlyPayment).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">3-Year Cost Difference</p>
            <p className="text-2xl font-bold text-orange-400">
              ${(leaseTotalPaid - (loanMonthlyPayment * leaseTermMonths + downPayment)).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Loan Equity After 3 Years</p>
            <p className="text-2xl font-bold text-blue-400">
              ${(residualValue).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseVsLoanMission;