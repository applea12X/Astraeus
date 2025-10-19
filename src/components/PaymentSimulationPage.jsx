import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calculator, DollarSign, Calendar, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { auth } from '../firebase/config';
import { updateUserProgress } from '../utils/userProgress';
import AIShoppingAssistant from './AIShoppingAssistant';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import {
  calculateFinancingOptions,
  calculateLeaseOptions,
  calculateLumpSumAnalysis,
  calculateEquityTimeline,
  calculatePaymentBreakdown,
  calculateLeaseVsBuy,
  calculateMileageAnalysis,
  calculateOwnershipCosts,
  formatCurrency,
  getAffordabilityAssessment
} from '../utils/paymentCalculations';

const PaymentSimulationPage = ({ onNavigate, navPayload }) => {
  const { paymentData, financialInfo, vehiclePreferences } = navPayload || {};
  const [selectedOption, setSelectedOption] = useState(null);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [whatIfParams, setWhatIfParams] = useState({});

  // Calculate all options based on payment method
  const calculations = useMemo(() => {
    if (!paymentData) return null;

    const vehiclePrice = parseInt(paymentData.vehiclePrice);
    const creditScore = parseInt(financialInfo?.creditScore || 700);
    const monthlyIncome = financialInfo?.annualIncome ? 
      parseInt(financialInfo.annualIncome.replace(/[,$]/g, '')) / 12 : 5000;

    switch (paymentData.paymentMethod) {
      case 'finance':
        const downPayment = vehiclePrice * parseFloat(paymentData.downPayment || 0.2);
        return {
          type: 'finance',
          options: calculateFinancingOptions({
            vehiclePrice,
            downPayment,
            creditScore
          }),
          monthlyIncome
        };

      case 'lease':
        return {
          type: 'lease',
          options: calculateLeaseOptions({
            vehiclePrice,
            creditScore
          }),
          monthlyIncome,
          expectedMileage: parseInt(paymentData.expectedMileage || 12000)
        };

      case 'lump-sum':
        return {
          type: 'lump-sum',
          analysis: calculateLumpSumAnalysis({
            vehiclePrice,
            currentCash: monthlyIncome * 12, // Estimate
            monthlyIncome,
            monthlyExpenses: monthlyIncome * 0.7 // Estimate 70% of income
          }),
          ownershipCosts: calculateOwnershipCosts(vehiclePrice),
          monthlyIncome
        };

      default:
        return null;
    }
  }, [paymentData, financialInfo]);

  const renderFinancingOptions = () => {
    if (!calculations || calculations.type !== 'finance') return null;

    return (
      <div className="space-y-8">
        {/* Options Comparison */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Financing Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {calculations.options.map((option, index) => {
              const affordability = getAffordabilityAssessment(option.monthlyPayment, calculations.monthlyIncome);
              
              return (
                <motion.div
                  key={option.termMonths}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedOption(option)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedOption?.termMonths === option.termMonths
                      ? 'border-red-400 bg-red-500/20'
                      : 'border-white/20 bg-white/5 hover:border-red-300/50'
                  }`}
                >
                  {/* Term */}
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-white">{option.termMonths} Months</h4>
                    <p className="text-orange-200">{option.termYears} Years</p>
                  </div>

                  {/* Monthly Payment */}
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-white">
                      {formatCurrency(option.monthlyPayment)}
                    </div>
                    <div className="text-sm text-orange-200">per month</div>
                  </div>

                  {/* Affordability */}
                  <div className={`text-center mb-4 p-2 rounded-lg bg-${affordability.color}-500/20`}>
                    <div className={`text-${affordability.color}-300 font-semibold`}>
                      {affordability.percentage}% of income
                    </div>
                    <div className={`text-xs text-${affordability.color}-200`}>
                      {affordability.status}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-orange-100">
                      <span>APR:</span>
                      <span>{option.apr.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-orange-100">
                      <span>Total Interest:</span>
                      <span>{formatCurrency(option.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between text-orange-100">
                      <span>Total Cost:</span>
                      <span>{formatCurrency(option.totalCost)}</span>
                    </div>
                  </div>

                  {/* Recommended badge */}
                  {index === 1 && (
                    <div className="mt-3 text-center">
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                        ✨ Recommended
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Detailed Analysis for Selected Option */}
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Equity Building Timeline */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Equity Building Timeline
              </h4>
              <EquityTimelineChart option={selectedOption} vehiclePrice={parseInt(paymentData.vehiclePrice)} />
            </div>

            {/* Payment Breakdown */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Payment Breakdown (First 12 Months)
              </h4>
              <PaymentBreakdownChart option={selectedOption} />
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderLeaseOptions = () => {
    if (!calculations || calculations.type !== 'lease') return null;

    return (
      <div className="space-y-8">
        {/* Options Comparison */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Lease Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {calculations.options.map((option, index) => {
              const affordability = getAffordabilityAssessment(option.monthlyPayment, calculations.monthlyIncome);
              const mileageAnalysis = calculateMileageAnalysis(calculations.expectedMileage, option);
              
              return (
                <motion.div
                  key={option.termMonths}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedOption(option)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedOption?.termMonths === option.termMonths
                      ? 'border-red-400 bg-red-500/20'
                      : 'border-white/20 bg-white/5 hover:border-red-300/50'
                  }`}
                >
                  {/* Term */}
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-white">{option.termMonths} Months</h4>
                    <p className="text-orange-200">{option.termYears} Years</p>
                  </div>

                  {/* Monthly Payment */}
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-white">
                      {formatCurrency(option.monthlyPayment)}
                    </div>
                    <div className="text-sm text-orange-200">per month</div>
                  </div>

                  {/* Mileage Warning */}
                  {mileageAnalysis.isOverage && (
                    <div className="mb-4 p-2 bg-yellow-500/20 rounded-lg">
                      <div className="text-yellow-300 text-xs font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Mileage Overage: {formatCurrency(mileageAnalysis.excessFees)}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-orange-100">
                      <span>Total Payments:</span>
                      <span>{formatCurrency(option.totalPayments)}</span>
                    </div>
                    <div className="flex justify-between text-orange-100">
                      <span>Residual Value:</span>
                      <span>{formatCurrency(option.residualValue)}</span>
                    </div>
                    <div className="flex justify-between text-orange-100">
                      <span>Upfront Cost:</span>
                      <span>{formatCurrency(option.upfrontCosts)}</span>
                    </div>
                  </div>

                  {/* Recommended badge */}
                  {index === 1 && (
                    <div className="mt-3 text-center">
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                        ✨ Recommended
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Detailed Analysis for Selected Option */}
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Lease vs Buy Comparison */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-xl font-bold text-white mb-4">Lease vs Buy Comparison</h4>
              <LeaseVsBuyChart leaseOption={selectedOption} />
            </div>

            {/* Mileage Analysis */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-xl font-bold text-white mb-4">Mileage Analysis</h4>
              <MileageAnalysisChart 
                expectedMileage={calculations.expectedMileage} 
                leaseOption={selectedOption} 
              />
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderLumpSumAnalysis = () => {
    if (!calculations || calculations.type !== 'lump-sum') return null;

    const { analysis, ownershipCosts } = calculations;

    return (
      <div className="space-y-8">
        {/* Cash Purchase Summary */}
        <div className="bg-white/5 rounded-xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">Cash Purchase Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cost Breakdown */}
            <div>
              <h4 className="text-lg font-semibold text-orange-200 mb-4">Total Cash Needed</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-white">
                  <span>Vehicle Price:</span>
                  <span>{formatCurrency(analysis.vehiclePrice)}</span>
                </div>
                <div className="flex justify-between text-orange-200">
                  <span>Taxes & Fees:</span>
                  <span>{formatCurrency(analysis.taxesAndFees)}</span>
                </div>
                <div className="border-t border-white/20 pt-3 flex justify-between text-xl font-bold text-white">
                  <span>Total Needed:</span>
                  <span>{formatCurrency(analysis.totalCashNeeded)}</span>
                </div>
              </div>
            </div>

            {/* Financial Impact */}
            <div>
              <h4 className="text-lg font-semibold text-orange-200 mb-4">Financial Impact</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-white">
                  <span>Remaining Cash:</span>
                  <span>{formatCurrency(analysis.remainingCash)}</span>
                </div>
                <div className="flex justify-between text-orange-200">
                  <span>Emergency Fund Needed:</span>
                  <span>{formatCurrency(analysis.emergencyFundNeeded)}</span>
                </div>
                <div className={`p-3 rounded-lg bg-${
                  analysis.financialHealthScore === 'excellent' ? 'green' :
                  analysis.financialHealthScore === 'good' ? 'yellow' : 'red'
                }-500/20`}>
                  <div className={`text-${
                    analysis.financialHealthScore === 'excellent' ? 'green' :
                    analysis.financialHealthScore === 'good' ? 'yellow' : 'red'
                  }-300 font-semibold capitalize`}>
                    Financial Health: {analysis.financialHealthScore}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity Cost Analysis */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="text-xl font-bold text-white mb-4">Opportunity Cost Analysis</h4>
          <OpportunityCostChart analysis={analysis} />
        </div>

        {/* Immediate Benefits */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="text-xl font-bold text-white mb-4">Immediate Ownership Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.immediateOwnershipBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-green-300">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!calculations) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-[#8B2500] via-[#A0522D] to-[#CD853F] flex items-center justify-center">
        <div className="text-white text-xl">Loading payment simulations...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 w-screen h-screen overflow-y-auto bg-gradient-to-b from-[#8B2500] via-[#A0522D] to-[#CD853F]"
    >
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => onNavigate && onNavigate('mars-form')}
        className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back</span>
      </motion.button>

      {/* Header */}
      <div className="pt-20 pb-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-white text-center mb-4">
            Payment Simulations
          </h1>
          <div className="text-center">
            <span className="px-4 py-2 bg-red-500/20 text-red-300 rounded-full text-lg font-semibold">
              {paymentData?.paymentMethod?.replace('-', ' ').toUpperCase()} PATH
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {calculations.type === 'finance' && renderFinancingOptions()}
          {calculations.type === 'lease' && renderLeaseOptions()}
          {calculations.type === 'lump-sum' && renderLumpSumAnalysis()}
        </div>
      </div>

      {/* Next Planet Button */}
      <div className="px-8 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  // Mark Mars as completed and trigger rocket animation
                  const user = auth.currentUser;
                  if (user) {
                    try {
                      await updateUserProgress(user.uid, 'mars');
                      console.log('Mars completed, triggering animation to Earth');
                      // Navigate with flight payload to trigger rocket animation
                      onNavigate && onNavigate('solar-system', { 
                        flight: { from: 'mars', to: 'earth' } 
                      });
                    } catch (error) {
                      console.error('Error updating Mars progress:', error);
                      // Fallback: navigate without animation
                      onNavigate && onNavigate('earth');
                    }
                  } else {
                    // No user logged in, just navigate
                    onNavigate && onNavigate('earth');
                  }
                }}
                className="relative px-20 py-6 text-2xl font-semibold rounded-2xl border transition-all duration-300 backdrop-blur-lg min-w-[200px] bg-gradient-to-r from-blue-500/30 to-purple-600/30 hover:from-blue-500/40 hover:to-purple-600/40 border-blue-400/60 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
              >
                Next Planet →
              </motion.button>
              
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl -z-10 scale-110 opacity-60"></div>
            </div>
            <p className="text-orange-200 text-sm mt-4 max-w-md mx-auto">
              Continue your journey to explore comprehensive purchase planning options
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Chart Components with Recharts
const EquityTimelineChart = ({ option, vehiclePrice }) => {
  const timeline = calculateEquityTimeline(option, vehiclePrice);
  
  // Prepare data for chart (every 6 months for cleaner display)
  const chartData = timeline.filter((_, i) => i % 6 === 0).map(point => ({
    month: point.month,
    year: (point.month / 12).toFixed(1),
    vehicleValue: point.vehicleValue,
    remainingBalance: point.remainingBalance,
    equity: point.equity
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <p className="text-white font-semibold">{`Month ${label} (Year ${(label/12).toFixed(1)})`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-4">
      <div className="text-orange-200 text-sm mb-4">
        Vehicle Value vs Loan Balance Over Time
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis 
              dataKey="month" 
              stroke="#fff" 
              tick={{ fill: '#fff', fontSize: 12 }}
              label={{ value: 'Months', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#fff' } }}
            />
            <YAxis 
              stroke="#fff" 
              tick={{ fill: '#fff', fontSize: 12 }}
              tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#fff' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#fff' }}
              iconType="line"
            />
            <Area
              type="monotone"
              dataKey="vehicleValue"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
              name="Vehicle Value"
            />
            <Area
              type="monotone"
              dataKey="remainingBalance"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.3}
              name="Loan Balance"
            />
            <Line
              type="monotone"
              dataKey="equity"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Your Equity"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-orange-200 mt-2">
        💡 Your equity becomes positive when the vehicle value exceeds the remaining loan balance
      </div>
    </div>
  );
};

const PaymentBreakdownChart = ({ option }) => {
  const breakdown = calculatePaymentBreakdown(option);
  
  // Prepare data for stacked bar chart (first 12 months)
  const chartData = breakdown.slice(0, 12).map(month => ({
    month: `Month ${month.month}`,
    principal: month.principalPayment,
    interest: month.interestPayment,
    principalPercent: month.principalPercentage,
    interestPercent: month.interestPercentage
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <p className="text-white font-semibold">{label}</p>
          <p style={{ color: '#10b981' }}>
            {`Principal: ${formatCurrency(data.principal)} (${data.principalPercent}%)`}
          </p>
          <p style={{ color: '#ef4444' }}>
            {`Interest: ${formatCurrency(data.interest)} (${data.interestPercent}%)`}
          </p>
          <p className="text-orange-200 text-sm mt-2">
            Total Payment: {formatCurrency(data.principal + data.interest)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-4">
      <div className="text-orange-200 text-sm mb-4">
        Principal vs Interest Distribution (First 12 Months)
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis 
              dataKey="month" 
              stroke="#fff" 
              tick={{ fill: '#fff', fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#fff" 
              tick={{ fill: '#fff', fontSize: 12 }}
              tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
              label={{ value: 'Payment Amount ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#fff' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar 
              dataKey="principal" 
              stackId="a" 
              fill="#10b981" 
              name="Principal (Builds Equity)"
              radius={[0, 0, 4, 4]}
            />
            <Bar 
              dataKey="interest" 
              stackId="a" 
              fill="#ef4444" 
              name="Interest (Cost of Borrowing)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-orange-200 mt-2">
        💡 Notice how the principal portion (green) grows while interest (red) shrinks over time
      </div>
    </div>
  );
};

const LeaseVsBuyChart = ({ leaseOption }) => {
  // Create a comparison with financing option
  const financeOption = calculateFinancingOptions({
    vehiclePrice: leaseOption.vehiclePrice,
    downPayment: leaseOption.vehiclePrice * 0.2,
    creditScore: 720
  }).find(opt => opt.termMonths === leaseOption.termMonths) || 
  calculateFinancingOptions({
    vehiclePrice: leaseOption.vehiclePrice,
    downPayment: leaseOption.vehiclePrice * 0.2,
    creditScore: 720
  })[1]; // 48-month fallback

  const leaseVsBuy = calculateLeaseVsBuy(leaseOption, financeOption);
  
  const chartData = [
    {
      option: 'Lease',
      monthlyPayment: leaseOption.monthlyPayment,
      totalCost: leaseVsBuy.leaseCost,
      equity: 0,
      ownership: 'Return or Buy'
    },
    {
      option: 'Finance',
      monthlyPayment: financeOption.monthlyPayment,
      totalCost: leaseVsBuy.financeCost,
      equity: leaseVsBuy.equityBuilt,
      ownership: 'You Own It'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <p className="text-white font-semibold">{data.option}</p>
          <p className="text-blue-300">Monthly: {formatCurrency(data.monthlyPayment)}</p>
          <p className="text-orange-300">Total Cost: {formatCurrency(data.totalCost)}</p>
          <p className="text-green-300">Equity Built: {formatCurrency(data.equity)}</p>
          <p className="text-purple-300">End Result: {data.ownership}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="text-orange-200 text-sm mb-4">
        {leaseOption.termMonths}-Month Lease vs Finance Comparison
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis 
              dataKey="option" 
              stroke="#fff" 
              tick={{ fill: '#fff', fontSize: 14 }}
            />
            <YAxis 
              stroke="#fff" 
              tick={{ fill: '#fff', fontSize: 12 }}
              tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#fff' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar 
              dataKey="totalCost" 
              fill="#f59e0b" 
              name="Total Cost"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="equity" 
              fill="#10b981" 
              name="Equity Built"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-500/20 p-4 rounded-lg">
          <h5 className="text-blue-300 font-semibold">Lease Advantage</h5>
          <p className="text-white text-sm">Lower monthly payment by {formatCurrency(financeOption.monthlyPayment - leaseOption.monthlyPayment)}</p>
        </div>
        <div className="bg-green-500/20 p-4 rounded-lg">
          <h5 className="text-green-300 font-semibold">Finance Advantage</h5>
          <p className="text-white text-sm">Build {formatCurrency(leaseVsBuy.equityBuilt)} in equity</p>
        </div>
      </div>
    </div>
  );
};

const MileageAnalysisChart = ({ expectedMileage, leaseOption }) => {
  const analysis = calculateMileageAnalysis(expectedMileage, leaseOption);
  
  // Create gauge-like data
  const gaugeData = [
    {
      category: 'Used',
      miles: analysis.projectedMiles,
      percentage: Math.min(100, analysis.utilizationPercentage)
    },
    {
      category: 'Remaining',
      miles: Math.max(0, analysis.allowedMiles - analysis.projectedMiles),
      percentage: Math.max(0, 100 - analysis.utilizationPercentage)
    }
  ];

  const COLORS = {
    'Used': analysis.isOverage ? '#ef4444' : '#3b82f6',
    'Remaining': '#10b981'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <p className="text-white font-semibold">{data.category}</p>
          <p className="text-blue-300">{data.miles.toLocaleString()} miles</p>
          <p className="text-orange-300">{data.percentage.toFixed(1)}% of allowance</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mileage Gauge */}
        <div>
          <div className="text-orange-200 text-sm mb-4">Mileage Usage Projection</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="percentage"
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.category]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: '#fff' }}
                  formatter={(value, entry) => `${value}: ${entry.payload.miles.toLocaleString()} mi`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mileage Statistics */}
        <div className="space-y-4">
          <div>
            <div className="text-orange-200 text-sm mb-2">Annual Allowance</div>
            <div className="text-2xl font-bold text-white">{leaseOption.mileageAllowance.toLocaleString()} miles/year</div>
          </div>
          <div>
            <div className="text-orange-200 text-sm mb-2">Your Projected Usage</div>
            <div className="text-2xl font-bold text-white">{expectedMileage.toLocaleString()} miles/year</div>
          </div>
          <div>
            <div className="text-orange-200 text-sm mb-2">Total Lease Allowance</div>
            <div className="text-2xl font-bold text-white">{analysis.allowedMiles.toLocaleString()} miles</div>
          </div>
          <div>
            <div className="text-orange-200 text-sm mb-2">Utilization Rate</div>
            <div className={`text-2xl font-bold ${analysis.isOverage ? 'text-red-400' : 'text-green-400'}`}>
              {analysis.utilizationPercentage}%
            </div>
          </div>
        </div>
      </div>
      
      {analysis.isOverage && (
        <div className="p-4 bg-red-500/20 rounded-lg border border-red-400/30">
          <div className="text-red-300 font-semibold text-lg mb-2">
            ⚠️ Mileage Overage Warning
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-red-200">Excess Miles: {analysis.excessMiles.toLocaleString()}</div>
              <div className="text-red-200">Overage Fee: ${leaseOption.excessMileageFee}/mile</div>
            </div>
            <div>
              <div className="text-red-200 font-semibold">Additional Cost: {formatCurrency(analysis.excessFees)}</div>
              <div className="text-orange-200 text-xs mt-1">Consider a higher mileage plan</div>
            </div>
          </div>
        </div>
      )}

      {!analysis.isOverage && analysis.utilizationPercentage > 80 && (
        <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
          <div className="text-yellow-300 font-semibold">
            💡 High Usage Detected
          </div>
          <div className="text-yellow-200 text-sm">
            You're using {analysis.utilizationPercentage}% of your allowance. Consider monitoring your usage carefully.
          </div>
        </div>
      )}
    </div>
  );
};

const OpportunityCostChart = ({ analysis }) => {
  const { opportunityCost } = analysis;
  
  const comparisonData = [
    {
      scenario: 'Pay Cash',
      benefit: opportunityCost.interestSaved,
      cost: 0,
      net: opportunityCost.interestSaved,
      description: 'Save on interest'
    },
    {
      scenario: 'Finance & Invest',
      benefit: opportunityCost.opportunityLoss,
      cost: opportunityCost.interestSaved,
      net: opportunityCost.opportunityLoss - opportunityCost.interestSaved,
      description: 'Investment returns'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <p className="text-white font-semibold">{data.scenario}</p>
          <p className="text-green-300">Benefit: {formatCurrency(data.benefit)}</p>
          <p className="text-red-300">Cost: {formatCurrency(data.cost)}</p>
          <p className="text-blue-300 font-semibold">Net: {formatCurrency(data.net)}</p>
          <p className="text-orange-200 text-sm">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="text-orange-200 text-sm mb-4">
        Cash Purchase vs Finance & Invest Comparison (Over {Math.round(opportunityCost.cashToInvest / analysis.vehiclePrice * 48)} months)
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis 
              dataKey="scenario" 
              stroke="#fff" 
              tick={{ fill: '#fff', fontSize: 12 }}
            />
            <YAxis 
              stroke="#fff" 
              tick={{ fill: '#fff', fontSize: 12 }}
              tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#fff' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar 
              dataKey="benefit" 
              fill="#10b981" 
              name="Financial Benefit"
              radius={[0, 0, 4, 4]}
            />
            <Bar 
              dataKey="cost" 
              fill="#ef4444" 
              name="Opportunity Cost"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg border-2 ${
          opportunityCost.isLumpSumBetter 
            ? 'border-green-400 bg-green-500/20' 
            : 'border-gray-400 bg-gray-500/20'
        }`}>
          <h5 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            💰 Pay Cash
            {opportunityCost.isLumpSumBetter && <span className="text-green-400">✓ Better</span>}
          </h5>
          <div className="space-y-2 text-sm">
            <div className="text-green-300">✓ Save {formatCurrency(opportunityCost.interestSaved)} in interest</div>
            <div className="text-green-300">✓ Immediate full ownership</div>
            <div className="text-green-300">✓ No monthly payments</div>
            <div className="text-orange-200">• No investment returns</div>
          </div>
        </div>
        
        <div className={`p-6 rounded-lg border-2 ${
          !opportunityCost.isLumpSumBetter 
            ? 'border-blue-400 bg-blue-500/20' 
            : 'border-gray-400 bg-gray-500/20'
        }`}>
          <h5 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            📈 Finance & Invest
            {!opportunityCost.isLumpSumBetter && <span className="text-blue-400">✓ Better</span>}
          </h5>
          <div className="space-y-2 text-sm">
            <div className="text-blue-300">✓ Potential {formatCurrency(opportunityCost.opportunityLoss)} returns</div>
            <div className="text-blue-300">✓ Keep cash liquid</div>
            <div className="text-blue-300">✓ Build credit history</div>
            <div className="text-red-300">• Pay {formatCurrency(opportunityCost.interestSaved)} in interest</div>
          </div>
        </div>
      </div>
      
      <div className="text-center p-4 bg-white/5 rounded-lg">
        <div className={`text-xl font-bold ${
          opportunityCost.isLumpSumBetter ? 'text-green-300' : 'text-blue-300'
        }`}>
          💡 {opportunityCost.isLumpSumBetter ? 'Cash purchase' : 'Finance & invest'} wins by{' '}
          {formatCurrency(Math.abs(opportunityCost.netBenefit))}
        </div>
        <div className="text-orange-200 text-sm mt-2">
          *Investment returns assume 7% annual return. Actual returns may vary.
        </div>
      </div>
      
      {/* AI Shopping Assistant */}
      <AIShoppingAssistant 
        selectedVehicle={null} 
        financialInfo={{}} 
        userProfile={{}} 
        currentPageName="payment-simulations" 
      />
    </div>
  );
};

export default PaymentSimulationPage;