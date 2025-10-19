import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  TrendingDown, 
  PiggyBank, 
  Target, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Calendar
} from 'lucide-react';

/**
 * DownPaymentMission - Interactive down payment education
 * 
 * Contains 4 sub-missions:
 * 1. Down Payment Basics
 * 2. 20/4/10 Rule Explained
 * 3. Down Payment Impact Simulator
 * 4. Saving Strategies
 */
const DownPaymentMission = ({ mission, category, onComplete, isCompleted, user }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [simulatorValues, setSimulatorValues] = useState({
    vehiclePrice: 30000,
    downPayment: 3000,
    apr: 5.5,
    termYears: 5
  });
  const [savingGoal, setSavingGoal] = useState({
    targetAmount: 5000,
    currentSavings: 1000,
    monthlyContribution: 300,
    targetMonths: 24
  });

  const missionContent = {
    'down-1-basics': {
      title: 'Down Payment Basics',
      steps: [
        {
          title: 'What is a Down Payment?',
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-6 border border-orange-400/20">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-400" />
                  Down Payment Definition
                </h4>
                <p className="text-gray-300 mb-4">
                  A down payment is <strong>money you pay upfront</strong> when buying a car. 
                  It reduces the amount you need to finance and shows lenders you're committed to the purchase.
                </p>
                <div className="bg-orange-800/30 rounded-lg p-4">
                  <p className="text-orange-200">
                    💰 <strong>Think of it as:</strong> A "good faith" deposit that reduces your loan amount and monthly payments.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-green-400/30">
                  <h5 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Benefits of Larger Down Payments
                  </h5>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Lower monthly payments</li>
                    <li>• Less interest paid over loan term</li>
                    <li>• Better loan approval odds</li>
                    <li>• Lower APR offers</li>
                    <li>• Instant equity in the vehicle</li>
                    <li>• Avoid being "upside down" on loan</li>
                  </ul>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 border border-yellow-400/30">
                  <h5 className="text-yellow-400 font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Common Down Payment Amounts
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">New Cars</span>
                      <span className="text-white font-semibold">10-20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Used Cars</span>
                      <span className="text-white font-semibold">15-25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Minimum Often Required</span>
                      <span className="text-white font-semibold">5-10%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-400/30 rounded-xl p-6">
                <h5 className="text-white font-semibold mb-4">Down Payment Example</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-800/30 rounded-lg">
                    <span className="text-gray-300">Vehicle Price</span>
                    <span className="text-white font-semibold">$25,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-800/30 rounded-lg">
                    <span className="text-gray-300">Down Payment (20%)</span>
                    <span className="text-orange-400 font-semibold">$5,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-800/50 rounded-lg border border-green-400/30">
                    <span className="text-green-300 font-semibold">Amount to Finance</span>
                    <span className="text-green-400 font-bold">$20,000</span>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Types of Down Payment Sources',
          content: (
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white mb-4">Where Can Down Payments Come From?</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Cash Savings',
                    description: 'Money saved in bank accounts, CDs, or money market accounts',
                    icon: <PiggyBank className="w-6 h-6" />,
                    pros: ['Most straightforward', 'No complications', 'Shows financial discipline'],
                    color: 'green'
                  },
                  {
                    title: 'Trade-In Value',
                    description: 'Value of your current vehicle traded toward the new purchase',
                    icon: <Calculator className="w-6 h-6" />,
                    pros: ['Convenient', 'Reduces need for cash', 'Simplifies transaction'],
                    color: 'blue'
                  },
                  {
                    title: 'Gift from Family',
                    description: 'Money given by family members for the down payment',
                    icon: <Target className="w-6 h-6" />,
                    pros: ['No repayment required', 'Can be substantial', 'Family support'],
                    color: 'purple'
                  },
                  {
                    title: 'Combination',
                    description: 'Mix of cash, trade-in, and/or gift to reach down payment goal',
                    icon: <TrendingDown className="w-6 h-6" />,
                    pros: ['Maximizes down payment', 'Uses all available resources', 'Flexible approach'],
                    color: 'orange'
                  }
                ].map((source) => (
                  <div key={source.title} className={`bg-${source.color}-900/30 border border-${source.color}-400/30 rounded-lg p-6`}>
                    <div className={`w-12 h-12 bg-${source.color}-500 rounded-lg flex items-center justify-center mb-4`}>
                      {source.icon}
                    </div>
                    <h5 className={`text-${source.color}-400 font-semibold mb-2`}>{source.title}</h5>
                    <p className="text-gray-300 text-sm mb-4">{source.description}</p>
                    <div className={`bg-${source.color}-800/30 rounded p-3`}>
                      <p className="text-xs text-gray-400 mb-2">Benefits:</p>
                      <ul className={`text-${source.color}-200 text-xs space-y-1`}>
                        {source.pros.map((pro, index) => (
                          <li key={index}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]
    },
    'down-2-rule': {
      title: '20/4/10 Rule Explained',
      steps: [
        {
          title: 'The Golden Rule of Car Buying',
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl p-6 border border-yellow-400/20">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-yellow-400" />
                  The 20/4/10 Rule
                </h4>
                <p className="text-gray-300 mb-6">
                  A simple guideline to help you make smart car buying decisions and avoid financial strain.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-yellow-800/30 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">20%</div>
                    <h5 className="text-white font-semibold mb-2">Down Payment</h5>
                    <p className="text-gray-300 text-sm">
                      Put down at least 20% of the vehicle's purchase price
                    </p>
                  </div>
                  
                  <div className="bg-orange-800/30 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-orange-400 mb-2">4</div>
                    <h5 className="text-white font-semibold mb-2">Year Limit</h5>
                    <p className="text-gray-300 text-sm">
                      Finance for no more than 4 years (48 months)
                    </p>
                  </div>
                  
                  <div className="bg-red-800/30 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-red-400 mb-2">10%</div>
                    <h5 className="text-white font-semibold mb-2">Income Ratio</h5>
                    <p className="text-gray-300 text-sm">
                      Total monthly vehicle expenses shouldn't exceed 10% of gross income
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-400/30 rounded-xl p-6">
                <h5 className="text-white font-semibold mb-4">Why This Rule Works</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="text-blue-400 font-semibold mb-3">20% Down Payment Benefits</h6>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Avoids being "upside down" immediately</li>
                      <li>• Qualifies for better interest rates</li>
                      <li>• Lower monthly payments</li>
                      <li>• Shows lenders you're a serious buyer</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-orange-400 font-semibold mb-3">4-Year Term Benefits</h6>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Pay less total interest</li>
                      <li>• Build equity faster</li>
                      <li>• Car still under warranty when paid off</li>
                      <li>• Forces you to buy within your means</li>
                    </ul>
                  </div>
                </div>
              </div>

              <TwentyFourTenCalculator />
            </div>
          )
        }
      ]
    },
    'down-3-simulator': {
      title: 'Down Payment Impact Simulator',
      steps: [
        {
          title: 'Interactive Down Payment Simulator',
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-400/20">
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-purple-400" />
                  See How Down Payments Affect Your Loan
                </h4>

                {/* Input Controls */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Vehicle Price</label>
                    <input
                      type="number"
                      value={simulatorValues.vehiclePrice}
                      onChange={(e) => setSimulatorValues({...simulatorValues, vehiclePrice: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Down Payment</label>
                    <input
                      type="number"
                      value={simulatorValues.downPayment}
                      onChange={(e) => setSimulatorValues({...simulatorValues, downPayment: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">APR (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={simulatorValues.apr}
                      onChange={(e) => setSimulatorValues({...simulatorValues, apr: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Term (Years)</label>
                    <input
                      type="number"
                      value={simulatorValues.termYears}
                      onChange={(e) => setSimulatorValues({...simulatorValues, termYears: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Down Payment Percentage Slider */}
                <div className="mb-6">
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Down Payment: ${simulatorValues.downPayment.toLocaleString()} 
                    ({((simulatorValues.downPayment / simulatorValues.vehiclePrice) * 100).toFixed(1)}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={simulatorValues.vehiclePrice * 0.5}
                    step={500}
                    value={simulatorValues.downPayment}
                    onChange={(e) => setSimulatorValues({...simulatorValues, downPayment: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>$0 (0%)</span>
                    <span>${(simulatorValues.vehiclePrice * 0.5).toLocaleString()} (50%)</span>
                  </div>
                </div>

                {/* Comparison Results */}
                <DownPaymentComparison values={simulatorValues} />

                {/* Quick Scenarios */}
                <div className="mt-6">
                  <h5 className="text-white font-semibold mb-4">Try Different Down Payment Amounts</h5>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { percent: 0, label: 'No Down Payment', color: 'red' },
                      { percent: 10, label: '10% Down', color: 'yellow' },
                      { percent: 20, label: '20% Down (Recommended)', color: 'green' },
                      { percent: 30, label: '30% Down', color: 'blue' }
                    ].map((scenario) => (
                      <button
                        key={scenario.percent}
                        onClick={() => setSimulatorValues({
                          ...simulatorValues, 
                          downPayment: Math.round(simulatorValues.vehiclePrice * (scenario.percent / 100))
                        })}
                        className={`p-4 bg-${scenario.color}-800/50 hover:bg-${scenario.color}-800/70 rounded-lg border border-${scenario.color}-400/30 text-left transition-all`}
                      >
                        <p className={`text-${scenario.color}-400 font-semibold`}>{scenario.label}</p>
                        <p className="text-gray-300 text-sm">
                          ${Math.round(simulatorValues.vehiclePrice * (scenario.percent / 100)).toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    'down-4-saving': {
      title: 'Saving Strategies',
      steps: [
        {
          title: 'How to Save for Your Down Payment',
          content: (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-xl p-6 border border-green-400/20">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-green-400" />
                  Down Payment Saving Plan
                </h4>
                
                <SavingPlanCalculator goal={savingGoal} setGoal={setSavingGoal} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-900/30 border border-blue-400/30 rounded-xl p-6">
                  <h5 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Smart Saving Strategies
                  </h5>
                  <ul className="text-gray-300 space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Automate savings:</strong> Set up automatic transfers to a dedicated car fund</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Use windfalls:</strong> Tax refunds, bonuses, and gifts go straight to car fund</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Reduce expenses:</strong> Cut subscriptions, eat out less, find cheaper insurance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Side income:</strong> Freelance, sell items, part-time work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>High-yield savings:</strong> Use accounts that earn 4-5% interest</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-900/30 border border-purple-400/30 rounded-xl p-6">
                  <h5 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Timeline Tips
                  </h5>
                  <div className="space-y-4">
                    <div className="bg-purple-800/30 rounded-lg p-4">
                      <h6 className="text-white font-semibold mb-2">6 Months Out</h6>
                      <p className="text-gray-300 text-sm">Start researching vehicles, calculate needed down payment, open dedicated savings account</p>
                    </div>
                    <div className="bg-purple-800/30 rounded-lg p-4">
                      <h6 className="text-white font-semibold mb-2">3 Months Out</h6>
                      <p className="text-gray-300 text-sm">Check credit score, get pre-approved for loans, intensify saving efforts</p>
                    </div>
                    <div className="bg-purple-800/30 rounded-lg p-4">
                      <h6 className="text-white font-semibold mb-2">1 Month Out</h6>
                      <p className="text-gray-300 text-sm">Finalize down payment amount, get cashier's check ready, schedule test drives</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/30 border border-yellow-400/30 rounded-xl p-6">
                <AlertTriangle className="w-6 h-6 text-yellow-400 mb-3" />
                <h5 className="text-white font-semibold mb-2">Don't Drain Your Emergency Fund</h5>
                <p className="text-gray-300 text-sm">
                  <strong>Important:</strong> Make sure you still have 3-6 months of expenses saved for emergencies 
                  AFTER making your down payment. Don't use your entire emergency fund for a car down payment.
                </p>
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

// 20/4/10 Rule Calculator Component
const TwentyFourTenCalculator = () => {
  const [income, setIncome] = useState(60000);
  const [vehiclePrice, setVehiclePrice] = useState(25000);
  
  const recommendedDownPayment = vehiclePrice * 0.2;
  const maxMonthlyBudget = (income / 12) * 0.1;
  const loanAmount = vehiclePrice - recommendedDownPayment;
  
  // Calculate monthly payment for 4-year term at 5% APR
  const monthlyRate = 0.05 / 12;
  const termMonths = 48;
  const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                        (Math.pow(1 + monthlyRate, termMonths) - 1);

  const ruleCompliant = monthlyPayment <= maxMonthlyBudget;

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/30">
      <h5 className="text-white font-semibold mb-4">20/4/10 Rule Calculator</h5>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-gray-300 text-sm mb-2 block">Annual Income</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm mb-2 block">Vehicle Price</label>
          <input
            type="number"
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-yellow-800/30 rounded-lg">
          <p className="text-yellow-400 font-semibold">20% Down Payment</p>
          <p className="text-2xl font-bold text-white">${recommendedDownPayment.toLocaleString()}</p>
        </div>
        <div className="text-center p-4 bg-orange-800/30 rounded-lg">
          <p className="text-orange-400 font-semibold">Monthly Payment (4yr)</p>
          <p className="text-2xl font-bold text-white">${monthlyPayment.toFixed(2)}</p>
        </div>
        <div className="text-center p-4 bg-red-800/30 rounded-lg">
          <p className="text-red-400 font-semibold">Max Budget (10%)</p>
          <p className="text-2xl font-bold text-white">${maxMonthlyBudget.toFixed(2)}</p>
        </div>
      </div>

      <div className={`mt-4 p-4 rounded-lg ${ruleCompliant ? 'bg-green-900/30 border border-green-400/30' : 'bg-red-900/30 border border-red-400/30'}`}>
        <p className={`font-semibold ${ruleCompliant ? 'text-green-400' : 'text-red-400'}`}>
          {ruleCompliant ? '✅ Follows 20/4/10 Rule' : '❌ Exceeds 20/4/10 Rule'}
        </p>
        <p className="text-gray-300 text-sm mt-1">
          {ruleCompliant 
            ? 'This purchase fits within safe financial guidelines.'
            : `Consider a less expensive vehicle or save more for down payment.`
          }
        </p>
      </div>
    </div>
  );
};

// Down Payment Comparison Component
const DownPaymentComparison = ({ values }) => {
  const { vehiclePrice, downPayment, apr, termYears } = values;
  
  const loanAmount = vehiclePrice - downPayment;
  const monthlyRate = apr / 100 / 12;
  const termMonths = termYears * 12;
  const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                        (Math.pow(1 + monthlyRate, termMonths) - 1);
  const totalPaid = monthlyPayment * termMonths + downPayment;
  const totalInterest = totalPaid - vehiclePrice;

  // Compare with no down payment scenario
  const noDownMonthlyRate = monthlyRate;
  const noDownMonthlyPayment = (vehiclePrice * noDownMonthlyRate * Math.pow(1 + noDownMonthlyRate, termMonths)) / 
                              (Math.pow(1 + noDownMonthlyRate, termMonths) - 1);
  const noDownTotalPaid = noDownMonthlyPayment * termMonths;
  const noDownTotalInterest = noDownTotalPaid - vehiclePrice;

  const monthlySavings = noDownMonthlyPayment - monthlyPayment;
  const interestSavings = noDownTotalInterest - totalInterest;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-900/30 border border-green-400/30 rounded-xl p-6">
          <h5 className="text-green-400 font-semibold mb-4">With ${downPayment.toLocaleString()} Down</h5>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Monthly Payment</span>
              <span className="text-white font-semibold">${monthlyPayment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Interest</span>
              <span className="text-orange-400">${totalInterest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Paid</span>
              <span className="text-green-400 font-bold">${totalPaid.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-400/30 rounded-xl p-6">
          <h5 className="text-red-400 font-semibold mb-4">With $0 Down</h5>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Monthly Payment</span>
              <span className="text-white font-semibold">${noDownMonthlyPayment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Interest</span>
              <span className="text-orange-400">${noDownTotalInterest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Paid</span>
              <span className="text-red-400 font-bold">${noDownTotalPaid.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-900/30 border border-purple-400/30 rounded-xl p-6">
        <h5 className="text-purple-400 font-semibold mb-4">Savings Summary</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Monthly Savings</p>
            <p className="text-2xl font-bold text-green-400">${monthlySavings.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Interest Savings</p>
            <p className="text-2xl font-bold text-green-400">${interestSavings.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Down Payment %</p>
            <p className="text-2xl font-bold text-purple-400">{((downPayment / vehiclePrice) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Saving Plan Calculator Component
const SavingPlanCalculator = ({ goal, setGoal }) => {
  const monthsToGoal = goal.targetAmount > goal.currentSavings 
    ? Math.ceil((goal.targetAmount - goal.currentSavings) / goal.monthlyContribution)
    : 0;

  const progressPercentage = (goal.currentSavings / goal.targetAmount) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-300 text-sm mb-2 block">Target Down Payment</label>
          <input
            type="number"
            value={goal.targetAmount}
            onChange={(e) => setGoal({...goal, targetAmount: parseInt(e.target.value)})}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm mb-2 block">Current Savings</label>
          <input
            type="number"
            value={goal.currentSavings}
            onChange={(e) => setGoal({...goal, currentSavings: parseInt(e.target.value)})}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      <div>
        <label className="text-gray-300 text-sm mb-2 block">
          Monthly Contribution: ${goal.monthlyContribution}
        </label>
        <input
          type="range"
          min={50}
          max={1000}
          step={25}
          value={goal.monthlyContribution}
          onChange={(e) => setGoal({...goal, monthlyContribution: parseInt(e.target.value)})}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$50/month</span>
          <span>$1,000/month</span>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h6 className="text-white font-semibold">Savings Progress</h6>
          <span className="text-green-400 font-bold">{progressPercentage.toFixed(1)}%</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
          <div 
            className="h-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Still Need</p>
            <p className="text-xl font-bold text-white">
              ${Math.max(0, goal.targetAmount - goal.currentSavings).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Months to Goal</p>
            <p className="text-xl font-bold text-blue-400">{monthsToGoal}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Target Date</p>
            <p className="text-xl font-bold text-purple-400">
              {new Date(Date.now() + monthsToGoal * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownPaymentMission;