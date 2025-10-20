import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  DollarSign, 
  Calendar, 
  FileText, 
  Shield, 
  MapPin, 
  TrendingUp,
  AlertCircle,
  CreditCard,
  Clock,
  Target,
  Phone
} from 'lucide-react';

const JupiterPurchasePlan = ({ onNavigate, selectedVehicle, financialInfo, paymentMethod = 'finance' }) => {
  const [completedSteps, setCompletedSteps] = useState([]);

  // Calculate comprehensive financial breakdown
  const financialBreakdown = useMemo(() => {
    if (!selectedVehicle) return null;

    // Extract price from string (e.g., "$26,420 - $28,500" -> 27460 average)
    const extractPrice = (priceStr) => {
      const matches = priceStr.match(/\$[\d,]+/g);
      if (!matches) return 0;
      const prices = matches.map(p => parseInt(p.replace(/[$,]/g, '')));
      return prices.reduce((a, b) => a + b, 0) / prices.length;
    };

    const vehiclePrice = extractPrice(selectedVehicle.priceNew);
    
    // Personalized interest rate based on credit score
    const getInterestRate = () => {
      if (!financialInfo?.creditScore) return 7.5; // Default if no credit info
      switch(financialInfo.creditScore) {
        case 'excellent': return 4.5;  // 720+
        case 'good': return 6.0;       // 680-719
        case 'fair': return 9.5;       // 620-679
        case 'poor': return 14.0;      // < 620
        default: return 7.5;
      }
    };

    // Adjust down payment based on credit score and employment
    const getRecommendedDownPayment = () => {
      if (!financialInfo) return vehiclePrice * 0.20;
      
      // Lower credit = higher down payment recommended
      if (financialInfo.creditScore === 'excellent' || financialInfo.creditScore === 'good') {
        return vehiclePrice * 0.15; // 15% for good credit
      } else if (financialInfo.creditScore === 'fair') {
        return vehiclePrice * 0.20; // 20% for fair credit
      } else {
        return vehiclePrice * 0.25; // 25% for poor credit
      }
    };

    const downPayment = getRecommendedDownPayment();
    const downPaymentPercent = (downPayment / vehiclePrice * 100).toFixed(0);
    const loanAmount = vehiclePrice - downPayment;
    const interestRate = getInterestRate();
    const loanTermMonths = 60; // 5 years
    
    // Monthly payment calculation
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
    
    // Additional monthly costs - personalized based on vehicle type
    const estimatedInsurance = selectedVehicle.type?.includes('Hybrid') ? 140 : 160; // Hybrids slightly cheaper insurance
    const estimatedGas = parseFloat(selectedVehicle.fuelEconomy?.split('/')[0] || '30') > 35 ? 80 : 150;
    const estimatedMaintenance = selectedVehicle.type?.includes('Used') ? 100 : 75; // Used cars = higher maintenance
    
    const totalMonthlyCost = monthlyPayment + estimatedInsurance + estimatedGas + estimatedMaintenance;
    
    // Total cost of ownership over 5 years
    const totalInterest = (monthlyPayment * loanTermMonths) - loanAmount;
    const totalCost = vehiclePrice + totalInterest + (estimatedInsurance + estimatedGas + estimatedMaintenance) * loanTermMonths;

    // Affordability analysis based on user's income
    const userMonthlyIncome = financialInfo?.annualIncome ? parseInt(financialInfo.annualIncome) / 12 : 0;
    const debtToIncomeRatio = userMonthlyIncome > 0 ? (totalMonthlyCost / userMonthlyIncome * 100).toFixed(1) : 0;
    const recommendedMaxPayment = userMonthlyIncome * 0.15; // 15% of gross income
    const isAffordable = totalMonthlyCost <= recommendedMaxPayment;

    return {
      vehiclePrice,
      downPayment,
      downPaymentPercent,
      loanAmount,
      interestRate,
      loanTermMonths,
      monthlyPayment,
      estimatedInsurance,
      estimatedGas,
      estimatedMaintenance,
      totalMonthlyCost,
      totalInterest,
      totalCost,
      // Affordability metrics
      userMonthlyIncome,
      debtToIncomeRatio,
      recommendedMaxPayment,
      isAffordable,
      creditScoreLabel: financialInfo?.creditScore || 'not-provided'
    };
  }, [selectedVehicle, financialInfo]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Purchase timeline
  const timeline = [
    {
      phase: 'Pre-Purchase (Now - 2 Weeks)',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-blue-600 to-blue-700',
      tasks: [
        'Review and verify your credit score',
        'Gather required documents (listed below)',
        'Get pre-approved for financing',
        'Research insurance quotes (3-5 providers)',
        'Schedule test drive appointments'
      ]
    },
    {
      phase: 'Purchase Day (Week 2-3)',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-green-600 to-green-700',
      tasks: [
        'Visit dealership with all documents',
        'Complete test drive and vehicle inspection',
        'Negotiate final price and terms',
        'Review and sign financing paperwork',
        'Arrange insurance coverage (required before driving off)'
      ]
    },
    {
      phase: 'Post-Purchase (First Month)',
      icon: <Target className="w-6 h-6" />,
      color: 'from-purple-600 to-purple-700',
      tasks: [
        'Register vehicle with DMV',
        'Set up automatic payment for loan',
        'Schedule first maintenance appointment',
        'Download Toyota app for vehicle management',
        'Review warranty coverage and benefits'
      ]
    }
  ];

  // Required documents
  const requiredDocuments = [
    { category: 'Identification', items: ['Valid driver\'s license', 'Social Security card or number'] },
    { category: 'Proof of Income', items: ['Recent pay stubs (last 2-3 months)', 'W-2 forms or tax returns', 'Bank statements (last 2 months)'] },
    { category: 'Proof of Residence', items: ['Utility bill', 'Lease agreement or mortgage statement'] },
    { category: 'Financial', items: ['Proof of insurance or insurance quote', 'Down payment (cashier\'s check or financing pre-approval)', 'Current vehicle title (if trading in)'] }
  ];

  // Nearest dealers - Actual Austin, TX area Toyota dealerships
  const nearbyDealers = [
    { 
      name: 'Charles Maund Toyota', 
      distance: '4.2 miles', 
      phone: '(512) 454-2981', 
      address: '7901 N Lamar Blvd, Austin, TX 78752',
      website: 'https://www.charlesmaundtoyota.com'
    },
    { 
      name: 'Toyota of South Austin', 
      distance: '5.6 miles', 
      phone: '(512) 444-2098', 
      address: '4800 IH-35 South, Austin, TX 78745',
      website: 'https://www.autonationtoyotasouthaustin.com/'
    },
    { 
      name: 'Round Rock Toyota', 
      distance: '18.3 miles', 
      phone: '(512) 310-6969', 
      address: '2800 N I-35, Round Rock, TX 78681',
      website: 'https://www.roundrocktoyota.com'
    }
  ];

  const toggleStep = (stepId) => {
    setCompletedSteps(prev =>
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    );
  };

  const downloadPlan = () => {
    // In production, generate PDF
    alert('Plan download coming soon! This will generate a comprehensive PDF with all your purchase details.');
  };

  if (!selectedVehicle || !financialBreakdown) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-gradient-to-b from-[#0a0e27] via-[#1e1b4b] to-[#000000] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white text-xl">Please select a vehicle first</p>
          <button
            onClick={() => onNavigate('saturn-results')}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl"
          >
            Back to Vehicle Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 w-screen h-screen overflow-auto bg-gradient-to-b from-[#0a0e27] via-[#1e1b4b] to-[#000000]"
    >
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2.5 + 0.5 + 'px',
              height: Math.random() * 2.5 + 0.5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
        <button
          onClick={() => onNavigate('saturn-results')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.08] backdrop-blur-2xl border border-white/[0.12] text-white hover:bg-white/[0.12] transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium text-sm">Back</span>
        </button>

        <button
          onClick={downloadPlan}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          <span className="font-medium">Download Plan</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Your Purchase Plan
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            {selectedVehicle.name}
          </p>
          {financialInfo && (
            <p className="text-sm text-gray-400 mb-6">
              Personalized for {financialInfo.occupation || 'your situation'} • {financialInfo.creditScore === 'excellent' ? 'Excellent' : financialInfo.creditScore === 'good' ? 'Good' : financialInfo.creditScore === 'fair' ? 'Fair' : 'Building'} Credit • {formatCurrency(financialBreakdown.userMonthlyIncome)}/mo income
            </p>
          )}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-sm">
            <CheckCircle className="w-4 h-4" />
            AI-Optimized Based on Your Profile
          </div>
        </motion.div>

        {/* Financial Overview */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white/[0.08] backdrop-blur-2xl rounded-2xl p-8 border border-white/[0.12]"
            style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 0 40px rgba(99, 102, 241, 0.15)' }}>
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-8 h-8 text-emerald-400" />
              <h2 className="text-3xl font-bold text-white">Financial Breakdown</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Vehicle Price */}
              <div className="bg-white/[0.05] rounded-xl p-6 border border-white/[0.08]">
                <p className="text-gray-400 text-sm mb-2">Vehicle Price</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(financialBreakdown.vehiclePrice)}</p>
              </div>

              {/* Down Payment */}
              <div className="bg-white/[0.05] rounded-xl p-6 border border-white/[0.08]">
                <p className="text-gray-400 text-sm mb-2">Down Payment ({financialBreakdown.downPaymentPercent}%)</p>
                <p className="text-3xl font-bold text-blue-400">{formatCurrency(financialBreakdown.downPayment)}</p>
                <p className="text-xs text-gray-500 mt-1">Optimized for your credit</p>
              </div>

              {/* Monthly Payment */}
              <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-xl p-6 border border-emerald-500/30">
                <p className="text-emerald-300 text-sm mb-2 font-semibold">Monthly Payment</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(financialBreakdown.monthlyPayment)}</p>
                <p className="text-xs text-emerald-200 mt-1">{financialBreakdown.loanTermMonths} months @ {financialBreakdown.interestRate}% APR</p>
              </div>

              {/* Total Monthly Cost */}
              <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-xl p-6 border border-purple-500/30">
                <p className="text-purple-300 text-sm mb-2 font-semibold">Total Monthly Cost</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(financialBreakdown.totalMonthlyCost)}</p>
                <p className="text-xs text-purple-200 mt-1">Including insurance & gas</p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <h3 className="text-lg font-semibold text-white mb-4">Monthly Cost Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Loan Payment</p>
                  <p className="text-white font-semibold">{formatCurrency(financialBreakdown.monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Insurance (est.)</p>
                  <p className="text-white font-semibold">{formatCurrency(financialBreakdown.estimatedInsurance)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Gas (est.)</p>
                  <p className="text-white font-semibold">{formatCurrency(financialBreakdown.estimatedGas)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Maintenance (est.)</p>
                  <p className="text-white font-semibold">{formatCurrency(financialBreakdown.estimatedMaintenance)}</p>
                </div>
              </div>
            </div>

            {/* 5-Year Total */}
            <div className="mt-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-400/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">5-Year Total Cost of Ownership</p>
                  <p className="text-gray-400 text-xs mt-1">Includes all payments, insurance, gas, and maintenance</p>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(financialBreakdown.totalCost)}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Affordability Insights */}
        {financialInfo && financialBreakdown.userMonthlyIncome > 0 && (
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mb-12"
          >
            <div className={`backdrop-blur-2xl rounded-2xl p-8 border ${
              financialBreakdown.isAffordable 
                ? 'bg-green-500/10 border-green-400/30' 
                : 'bg-yellow-500/10 border-yellow-400/30'
            }`}
              style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  financialBreakdown.isAffordable 
                    ? 'bg-green-500/20' 
                    : 'bg-yellow-500/20'
                }`}>
                  {financialBreakdown.isAffordable ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {financialBreakdown.isAffordable 
                      ? '✓ This Vehicle Fits Your Budget' 
                      : '⚠ Budget Considerations'}
                  </h2>
                  <p className="text-gray-300">
                    {financialBreakdown.isAffordable
                      ? `Based on your ${formatCurrency(financialBreakdown.userMonthlyIncome)}/month income, this purchase is well within recommended limits.`
                      : `Based on your ${formatCurrency(financialBreakdown.userMonthlyIncome)}/month income, this purchase exceeds our recommended budget. Consider a larger down payment or longer loan term.`
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Debt-to-Income Ratio */}
                <div className="bg-white/[0.05] rounded-xl p-6 border border-white/[0.08]">
                  <p className="text-gray-400 text-sm mb-2">Debt-to-Income Ratio</p>
                  <p className={`text-3xl font-bold mb-1 ${
                    parseFloat(financialBreakdown.debtToIncomeRatio) <= 15 
                      ? 'text-green-400' 
                      : parseFloat(financialBreakdown.debtToIncomeRatio) <= 20 
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                  }`}>
                    {financialBreakdown.debtToIncomeRatio}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {parseFloat(financialBreakdown.debtToIncomeRatio) <= 15 
                      ? 'Excellent - Well below 15%' 
                      : parseFloat(financialBreakdown.debtToIncomeRatio) <= 20 
                        ? 'Good - Within 20% limit' 
                        : 'High - Consider adjustments'}
                  </p>
                </div>

                {/* Monthly Income */}
                <div className="bg-white/[0.05] rounded-xl p-6 border border-white/[0.08]">
                  <p className="text-gray-400 text-sm mb-2">Your Monthly Income</p>
                  <p className="text-3xl font-bold text-white mb-1">
                    {formatCurrency(financialBreakdown.userMonthlyIncome)}
                  </p>
                  <p className="text-xs text-gray-500">Gross income</p>
                </div>

                {/* Recommended Budget */}
                <div className="bg-white/[0.05] rounded-xl p-6 border border-white/[0.08]">
                  <p className="text-gray-400 text-sm mb-2">Recommended Max Payment</p>
                  <p className="text-3xl font-bold text-blue-400 mb-1">
                    {formatCurrency(financialBreakdown.recommendedMaxPayment)}
                  </p>
                  <p className="text-xs text-gray-500">15% of gross income</p>
                </div>
              </div>

              {/* Credit Score Impact */}
              <div className="mt-6 p-4 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-semibold mb-1">Interest Rate Based on Your Credit</p>
                    <p className="text-gray-400 text-xs">
                      {financialBreakdown.creditScoreLabel === 'excellent' && 'Excellent credit score (720+) - You qualify for the best rates!'}
                      {financialBreakdown.creditScoreLabel === 'good' && 'Good credit score (680-719) - You qualify for competitive rates.'}
                      {financialBreakdown.creditScoreLabel === 'fair' && 'Fair credit score (620-679) - Consider credit improvement for better rates.'}
                      {financialBreakdown.creditScoreLabel === 'poor' && 'Credit needs improvement - Focus on building credit for better terms.'}
                      {financialBreakdown.creditScoreLabel === 'not-provided' && 'Complete your financial profile for personalized rates.'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{financialBreakdown.interestRate}%</p>
                    <p className="text-xs text-gray-400">APR</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Purchase Timeline */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-white/[0.08] backdrop-blur-2xl rounded-2xl p-8 border border-white/[0.12]"
            style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 0 40px rgba(99, 102, 241, 0.15)' }}>
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">Your Purchase Timeline</h2>
            </div>

            <div className="space-y-6">
              {timeline.map((phase, index) => (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
                  )}

                  <div className="flex gap-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0 relative z-10`}>
                      {phase.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <h3 className="text-xl font-bold text-white mb-4">{phase.phase}</h3>
                      <ul className="space-y-3">
                        {phase.tasks.map((task, taskIndex) => {
                          const stepId = `${index}-${taskIndex}`;
                          const isCompleted = completedSteps.includes(stepId);
                          
                          return (
                            <li key={taskIndex}>
                              <button
                                onClick={() => toggleStep(stepId)}
                                className="flex items-start gap-3 text-left w-full p-3 rounded-lg hover:bg-white/[0.05] transition-colors"
                              >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                  isCompleted 
                                    ? 'bg-green-500 border-green-500' 
                                    : 'border-gray-500'
                                }`}>
                                  {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                                </div>
                                <span className={`text-base ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                                  {task}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Required Documents */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="bg-white/[0.08] backdrop-blur-2xl rounded-2xl p-8 border border-white/[0.12]"
            style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 0 40px rgba(99, 102, 241, 0.15)' }}>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-amber-400" />
              <h2 className="text-3xl font-bold text-white">Required Documents</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requiredDocuments.map((doc, index) => (
                <div key={index} className="bg-white/[0.05] rounded-xl p-6 border border-white/[0.08]">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    {doc.category}
                  </h3>
                  <ul className="space-y-2">
                    {doc.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Nearby Dealers */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-white/[0.08] backdrop-blur-2xl rounded-2xl p-8 border border-white/[0.12]"
            style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 0 40px rgba(99, 102, 241, 0.15)' }}>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-8 h-8 text-red-400" />
              <h2 className="text-3xl font-bold text-white">Nearby Toyota Dealers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nearbyDealers.map((dealer, index) => (
                <div key={index} className="bg-white/[0.05] rounded-xl p-6 border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{dealer.name}</h3>
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">{dealer.distance}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{dealer.address}</p>
                  <a 
                    href={`tel:${dealer.phone}`}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm mb-2"
                  >
                    <Phone className="w-4 h-4" />
                    {dealer.phone}
                  </a>
                  <div className="flex gap-2 mt-4">
                    <a
                      href={dealer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-white/[0.08] border border-white/[0.12] text-white rounded-lg text-sm font-medium hover:bg-white/[0.12] transition-colors text-center"
                    >
                      Visit Website
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dealer.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-colors text-center"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Budget Impact Alert */}
        {financialInfo?.annualIncome && (
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl p-6 border border-blue-400/30">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Budget Impact Analysis</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Based on your annual income of {formatCurrency(parseInt(financialInfo.annualIncome))}, 
                    this purchase represents {((financialBreakdown.totalMonthlyCost / (parseInt(financialInfo.annualIncome) / 12)) * 100).toFixed(1)}% 
                    of your monthly income.
                  </p>
                  <p className="text-gray-300 text-sm">
                    Financial advisors recommend keeping total vehicle expenses under 15-20% of your income. 
                    {((financialBreakdown.totalMonthlyCost / (parseInt(financialInfo.annualIncome) / 12)) * 100) < 20 
                      ? ' ✅ This purchase is within recommended guidelines!' 
                      : ' ⚠️ Consider a lower-priced vehicle or larger down payment to reduce monthly costs.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={() => onNavigate('solar-system', { celebration: true })}
            className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xl font-bold rounded-2xl transition-all duration-300 shadow-lg"
            style={{ boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' }}
          >
            Complete Your Journey
          </button>
          <p className="text-gray-400 text-sm mt-4">
            Ready to make your dream car a reality? Visit a dealer to get started!
          </p>
        </motion.div>
      </div>

      {/* Nebula Glow Effects */}
      <div className="fixed top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-10 pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-3xl opacity-10 pointer-events-none" />
    </motion.div>
  );
};

export default JupiterPurchasePlan;

