import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Target, 
  CheckCircle,
  ArrowRight,
  Info,
  Lightbulb
} from 'lucide-react';

/**
 * APRMission - Interactive APR education missions
 * 
 * Contains 4 sub-missions:
 * 1. Interest Rate Basics
 * 2. Compound vs Simple Interest
 * 3. APR Impact Calculator
 * 4. Credit Score & APR Connection
 */
const APRMission = ({ mission, category, onComplete, isCompleted, user }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [calculatorValues, setCalculatorValues] = useState({
    loanAmount: 25000,
    apr: 5.5,
    termYears: 5
  });

  // Mission content for each APR sub-mission
  const missionContent = {
    'apr-1-basics': {
      title: 'Interest Rate Basics',
      steps: [
        {
          title: 'What is APR?',
          content: (
            <div className="space-y-6">
              <div className="bg-blue-900/30 border border-blue-400/30 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  APR Definition
                </h4>
                <p className="text-gray-300 mb-4">
                  <strong>APR (Annual Percentage Rate)</strong> is the yearly cost of borrowing money, 
                  including both the interest rate and any additional fees.
                </p>
                <div className="bg-blue-800/30 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">
                    💡 <strong>Key Point:</strong> APR gives you the true cost of a loan, making it easier 
                    to compare different lending options.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                  <h5 className="text-green-400 font-semibold mb-2">Lower APR = Better</h5>
                  <p className="text-gray-300 text-sm">
                    A 4% APR means you pay less in interest than a 7% APR loan.
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                  <h5 className="text-orange-400 font-semibold mb-2">Includes All Costs</h5>
                  <p className="text-gray-300 text-sm">
                    APR includes origination fees, not just the base interest rate.
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'APR vs Interest Rate',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-xl p-6 border border-blue-400/20">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">Interest Rate</h4>
                  <p className="text-gray-300 mb-4">
                    The base percentage charged for borrowing money.
                  </p>
                  <div className="text-2xl font-bold text-blue-400">5.0%</div>
                  <p className="text-gray-400 text-sm">Example rate</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-xl p-6 border border-purple-400/20">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">APR</h4>
                  <p className="text-gray-300 mb-4">
                    Interest rate + fees + other costs combined.
                  </p>
                  <div className="text-2xl font-bold text-purple-400">5.5%</div>
                  <p className="text-gray-400 text-sm">True cost with fees</p>
                </div>
              </div>
              
              <div className="bg-yellow-900/30 border border-yellow-400/30 rounded-xl p-6">
                <Lightbulb className="w-6 h-6 text-yellow-400 mb-3" />
                <p className="text-yellow-200">
                  <strong>Always compare APRs, not just interest rates!</strong> A loan with a 5% 
                  interest rate but high fees might have a 6% APR, making it more expensive than 
                  a 5.5% interest rate loan with low fees.
                </p>
              </div>
            </div>
          )
        },
        {
          title: 'Knowledge Check',
          content: (
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white mb-4">Test Your Understanding</h4>
              
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30">
                  <p className="text-white mb-4 font-medium">
                    Which loan would cost you less money overall?
                  </p>
                  <div className="space-y-3">
                    {[
                      { id: 'a', text: 'Loan A: 4.5% interest rate, 5.2% APR', correct: true },
                      { id: 'b', text: 'Loan B: 4.0% interest rate, 5.8% APR', correct: false }
                    ].map((option) => (
                      <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="apr-quiz-1"
                          value={option.id}
                          onChange={(e) => setQuizAnswers({...quizAnswers, question1: e.target.value})}
                          className="w-4 h-4 text-blue-500"
                        />
                        <span className="text-gray-300">{option.text}</span>
                      </label>
                    ))}
                  </div>
                  
                  {quizAnswers.question1 && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      quizAnswers.question1 === 'a' 
                        ? 'bg-green-900/30 border border-green-400/30' 
                        : 'bg-red-900/30 border border-red-400/30'
                    }`}>
                      <p className={`${quizAnswers.question1 === 'a' ? 'text-green-300' : 'text-red-300'}`}>
                        {quizAnswers.question1 === 'a' 
                          ? '✅ Correct! Loan A has a lower APR (5.2% vs 5.8%), so it costs less overall despite having a slightly higher interest rate.'
                          : '❌ Not quite. Look at the APR - Loan B has a 5.8% APR vs Loan A\'s 5.2% APR, making it more expensive overall.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    'apr-2-compound': {
      title: 'Compound vs Simple Interest',
      steps: [
        {
          title: 'Simple Interest Explained',
          content: (
            <div className="space-y-6">
              <div className="bg-green-900/30 border border-green-400/30 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-white mb-4">Simple Interest</h4>
                <p className="text-gray-300 mb-4">
                  Interest calculated only on the original loan amount (principal).
                </p>
                <div className="bg-green-800/30 rounded-lg p-4">
                  <p className="text-green-200 font-mono text-lg">
                    Interest = Principal × Rate × Time
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h5 className="text-white font-semibold mb-4">Example: $10,000 loan at 5% for 3 years</h5>
                <div className="space-y-2">
                  <p className="text-gray-300">Year 1: $10,000 × 5% = $500 interest</p>
                  <p className="text-gray-300">Year 2: $10,000 × 5% = $500 interest</p>
                  <p className="text-gray-300">Year 3: $10,000 × 5% = $500 interest</p>
                  <div className="border-t border-gray-600 pt-2 mt-4">
                    <p className="text-white font-semibold">Total Interest: $1,500</p>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Compound Interest Power',
          content: (
            <div className="space-y-6">
              <div className="bg-orange-900/30 border border-orange-400/30 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-white mb-4">Compound Interest</h4>
                <p className="text-gray-300 mb-4">
                  Interest calculated on the principal PLUS any previously earned interest.
                </p>
                <div className="bg-orange-800/30 rounded-lg p-4">
                  <p className="text-orange-200">
                    "Interest on interest" - grows faster over time!
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h5 className="text-white font-semibold mb-4">Same example: $10,000 at 5% compounded annually</h5>
                <div className="space-y-2">
                  <p className="text-gray-300">Year 1: $10,000 × 5% = $500 (Balance: $10,500)</p>
                  <p className="text-gray-300">Year 2: $10,500 × 5% = $525 (Balance: $11,025)</p>
                  <p className="text-gray-300">Year 3: $11,025 × 5% = $551 (Balance: $11,576)</p>
                  <div className="border-t border-gray-600 pt-2 mt-4">
                    <p className="text-white font-semibold">Total Interest: $1,576</p>
                    <p className="text-orange-400 text-sm">$76 more than simple interest!</p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    'apr-3-calculator': {
      title: 'APR Impact Calculator',
      steps: [
        {
          title: 'Interactive APR Calculator',
          content: (
            <div className="space-y-6">
              <div className="bg-purple-900/30 border border-purple-400/30 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-purple-400" />
                  Car Loan Calculator
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Loan Amount</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={calculatorValues.loanAmount}
                        onChange={(e) => setCalculatorValues({...calculatorValues, loanAmount: parseInt(e.target.value)})}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">APR (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorValues.apr}
                      onChange={(e) => setCalculatorValues({...calculatorValues, apr: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Loan Term (Years)</label>
                    <input
                      type="number"
                      value={calculatorValues.termYears}
                      onChange={(e) => setCalculatorValues({...calculatorValues, termYears: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>
                
                {/* Calculation Results */}
                <CalculatorResults values={calculatorValues} />
              </div>
              
              <div className="bg-blue-900/30 border border-blue-400/30 rounded-xl p-6">
                <h5 className="text-white font-semibold mb-4">Try Different Scenarios</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setCalculatorValues({loanAmount: 25000, apr: 3.5, termYears: 5})}
                    className="p-4 bg-green-800/50 hover:bg-green-800/70 rounded-lg border border-green-400/30 text-left transition-all"
                  >
                    <p className="text-green-400 font-semibold">Excellent Credit</p>
                    <p className="text-gray-300 text-sm">3.5% APR</p>
                  </button>
                  <button
                    onClick={() => setCalculatorValues({loanAmount: 25000, apr: 8.5, termYears: 5})}
                    className="p-4 bg-red-800/50 hover:bg-red-800/70 rounded-lg border border-red-400/30 text-left transition-all"
                  >
                    <p className="text-red-400 font-semibold">Poor Credit</p>
                    <p className="text-gray-300 text-sm">8.5% APR</p>
                  </button>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    'apr-4-credit': {
      title: 'Credit Score & APR Connection',
      steps: [
        {
          title: 'How Credit Scores Affect APR',
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-xl p-6 border border-blue-400/20">
                <h4 className="text-xl font-semibold text-white mb-4">Credit Score Impact</h4>
                <p className="text-gray-300 mb-6">
                  Your credit score directly affects the APR you're offered. Higher scores = lower rates!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { range: '750-850', label: 'Excellent', apr: '3.5-4.5%', color: 'green' },
                    { range: '700-749', label: 'Good', apr: '4.5-6.0%', color: 'blue' },
                    { range: '650-699', label: 'Fair', apr: '6.0-8.0%', color: 'yellow' },
                    { range: '600-649', label: 'Poor', apr: '8.0-12%', color: 'orange' },
                    { range: '300-599', label: 'Very Poor', apr: '12-18%', color: 'red' }
                  ].map((tier) => (
                    <div key={tier.range} className={`bg-${tier.color}-900/30 border border-${tier.color}-400/30 rounded-lg p-4`}>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">{tier.range}</p>
                        <p className={`text-${tier.color}-400 font-semibold mb-2`}>{tier.label}</p>
                        <p className="text-gray-300 text-sm">Typical APR:</p>
                        <p className={`text-${tier.color}-300 font-bold`}>{tier.apr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-900/30 border border-yellow-400/30 rounded-xl p-6">
                <Target className="w-6 h-6 text-yellow-400 mb-3" />
                <h5 className="text-white font-semibold mb-2">Improving Your Credit Score</h5>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Pay all bills on time (35% of score)</li>
                  <li>• Keep credit utilization below 30% (30% of score)</li>
                  <li>• Don't close old credit accounts (15% of score)</li>
                  <li>• Limit new credit applications (10% of score)</li>
                  <li>• Mix different types of credit (10% of score)</li>
                </ul>
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
      // Mission completed
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

// Calculator Results Component
const CalculatorResults = ({ values }) => {
  const { loanAmount, apr, termYears } = values;
  
  // Calculate monthly payment using standard loan formula
  const monthlyRate = apr / 100 / 12;
  const totalPayments = termYears * 12;
  const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                        (Math.pow(1 + monthlyRate, totalPayments) - 1);
  
  const totalPaid = monthlyPayment * totalPayments;
  const totalInterest = totalPaid - loanAmount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-1">Monthly Payment</p>
        <p className="text-2xl font-bold text-white">${monthlyPayment.toFixed(2)}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-1">Total Interest</p>
        <p className="text-2xl font-bold text-orange-400">${totalInterest.toFixed(2)}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-1">Total Paid</p>
        <p className="text-2xl font-bold text-purple-400">${totalPaid.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default APRMission;