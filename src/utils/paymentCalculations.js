// Payment calculation utilities for Finance, Lease, and Lump Sum paths

/**
 * Calculate monthly payment for a loan
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
 * @param {number} termMonths - Loan term in months
 * @returns {number} Monthly payment
 */
export const calculateMonthlyPayment = (principal, annualRate, termMonths) => {
  if (annualRate === 0) {
    return principal / termMonths;
  }
  
  const monthlyRate = annualRate / 12;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return principal * (monthlyRate * factor) / (factor - 1);
};

/**
 * Calculate APR based on credit score
 * @param {number} creditScore - User's credit score
 * @param {string} vehicleType - 'new' or 'used'
 * @returns {number} APR as decimal
 */
export const getAPRByCreditScore = (creditScore, vehicleType = 'new') => {
  const baseRates = vehicleType === 'new' ? {
    excellent: 0.035, // 750+
    good: 0.055,      // 700-749
    fair: 0.085,      // 650-699
    poor: 0.135,      // 600-649
    bad: 0.185        // 550-599
  } : {
    excellent: 0.045, // Used cars typically 1% higher
    good: 0.065,
    fair: 0.095,
    poor: 0.145,
    bad: 0.195
  };

  if (creditScore >= 750) return baseRates.excellent;
  if (creditScore >= 700) return baseRates.good;
  if (creditScore >= 650) return baseRates.fair;
  if (creditScore >= 600) return baseRates.poor;
  return baseRates.bad;
};

/**
 * Calculate financing options
 * @param {Object} params - Financing parameters
 * @returns {Array} Array of financing options
 */
export const calculateFinancingOptions = ({
  vehiclePrice,
  downPayment = 0,
  creditScore,
  vehicleType = 'new'
}) => {
  const loanAmount = vehiclePrice - downPayment;
  const apr = getAPRByCreditScore(creditScore, vehicleType);
  
  const terms = [36, 48, 60, 72];
  
  return terms.map(termMonths => {
    const monthlyPayment = calculateMonthlyPayment(loanAmount, apr, termMonths);
    const totalPayments = monthlyPayment * termMonths;
    const totalInterest = totalPayments - loanAmount;
    const totalCost = totalPayments + downPayment;
    
    return {
      termMonths,
      termYears: termMonths / 12,
      loanAmount,
      apr: apr * 100, // Convert to percentage
      monthlyPayment: Math.round(monthlyPayment),
      totalPayments: Math.round(totalPayments),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalCost),
      downPayment
    };
  });
};

/**
 * Calculate equity building timeline for financing
 * @param {Object} option - Selected financing option
 * @param {number} vehiclePrice - Original vehicle price
 * @returns {Array} Monthly equity data
 */
export const calculateEquityTimeline = (option, vehiclePrice) => {
  const { loanAmount, apr, termMonths, monthlyPayment } = option;
  const monthlyRate = (apr / 100) / 12;
  const depreciationRate = 0.15; // 15% first year, then 10% annually
  
  let remainingBalance = loanAmount;
  const timeline = [];
  
  for (let month = 0; month <= termMonths; month++) {
    // Calculate vehicle depreciation
    let vehicleValue;
    if (month <= 12) {
      // First year: 15% depreciation
      vehicleValue = vehiclePrice * (1 - (depreciationRate * month / 12));
    } else {
      // After first year: 10% per year
      const yearsAfterFirst = (month - 12) / 12;
      vehicleValue = vehiclePrice * (1 - depreciationRate) * Math.pow(0.9, yearsAfterFirst);
    }
    
    const equity = Math.max(0, vehicleValue - remainingBalance);
    
    timeline.push({
      month,
      vehicleValue: Math.round(vehicleValue),
      remainingBalance: Math.round(remainingBalance),
      equity: Math.round(equity),
      isBreakeven: equity > 0 && month > 0 && timeline[month - 1]?.equity <= 0
    });
    
    if (month < termMonths && remainingBalance > 0) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);
    }
  }
  
  return timeline;
};

/**
 * Calculate payment breakdown over time (principal vs interest)
 * @param {Object} option - Selected financing option
 * @returns {Array} Monthly payment breakdown
 */
export const calculatePaymentBreakdown = (option) => {
  const { loanAmount, apr, termMonths, monthlyPayment } = option;
  const monthlyRate = (apr / 100) / 12;
  
  let remainingBalance = loanAmount;
  const breakdown = [];
  
  for (let month = 1; month <= Math.min(termMonths, 24); month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    breakdown.push({
      month,
      monthlyPayment: Math.round(monthlyPayment),
      principalPayment: Math.round(principalPayment),
      interestPayment: Math.round(interestPayment),
      principalPercentage: Math.round((principalPayment / monthlyPayment) * 100),
      interestPercentage: Math.round((interestPayment / monthlyPayment) * 100),
      remainingBalance: Math.round(remainingBalance - principalPayment)
    });
    
    remainingBalance -= principalPayment;
  }
  
  return breakdown;
};

/**
 * Calculate lease options
 * @param {Object} params - Lease parameters
 * @returns {Array} Array of lease options
 */
export const calculateLeaseOptions = ({
  vehiclePrice,
  creditScore,
  vehicleType = 'new'
}) => {
  // Lease calculations are more complex and vary by manufacturer
  // Using simplified model for demonstration
  
  const terms = [24, 36, 48];
  const residualValues = {
    24: 0.65, // 65% residual after 2 years
    36: 0.55, // 55% residual after 3 years
    48: 0.45  // 45% residual after 4 years
  };
  
  // Money factor is roughly APR/2400
  const apr = getAPRByCreditScore(creditScore, vehicleType);
  const moneyFactor = apr / 24;
  
  return terms.map(termMonths => {
    const residualValue = vehiclePrice * residualValues[termMonths];
    const depreciation = vehiclePrice - residualValue;
    const depreciationPayment = depreciation / termMonths;
    const financePayment = (vehiclePrice + residualValue) * moneyFactor;
    const monthlyPayment = depreciationPayment + financePayment;
    
    const totalPayments = monthlyPayment * termMonths;
    
    // Typical lease fees
    const upfrontCosts = monthlyPayment + 500 + 250; // First payment + security + fees
    
    return {
      termMonths,
      termYears: termMonths / 12,
      vehiclePrice,
      residualValue: Math.round(residualValue),
      monthlyPayment: Math.round(monthlyPayment),
      totalPayments: Math.round(totalPayments),
      moneyFactor: moneyFactor.toFixed(5),
      aprEquivalent: apr * 100,
      upfrontCosts: Math.round(upfrontCosts),
      mileageAllowance: 12000, // Default 12k/year
      excessMileageFee: 0.25
    };
  });
};

/**
 * Calculate lease vs buy comparison
 * @param {Object} leaseOption - Selected lease option
 * @param {Object} financeOption - Equivalent finance option
 * @returns {Object} Comparison data
 */
export const calculateLeaseVsBuy = (leaseOption, financeOption) => {
  const { termMonths } = leaseOption;
  
  // Lease total cost
  const leaseTotalCost = leaseOption.totalPayments + leaseOption.upfrontCosts;
  
  // Finance cost for same period
  const financePaymentsForPeriod = financeOption.monthlyPayment * termMonths;
  const remainingBalance = Math.max(0, financeOption.loanAmount - 
    (financePaymentsForPeriod - (financeOption.totalInterest * termMonths / financeOption.termMonths)));
  
  // Vehicle value after lease term (same as residual)
  const vehicleValueAtEnd = leaseOption.residualValue;
  const equityAtEnd = Math.max(0, vehicleValueAtEnd - remainingBalance);
  
  return {
    leaseCost: leaseTotalCost,
    financeCost: financePaymentsForPeriod + financeOption.downPayment,
    leaseAdvantage: Math.round(financePaymentsForPeriod + financeOption.downPayment - leaseTotalCost),
    equityBuilt: Math.round(equityAtEnd),
    ownershipStatus: {
      lease: 'Return vehicle or buy for residual',
      finance: `Own vehicle worth ~$${vehicleValueAtEnd.toLocaleString()}`
    }
  };
};

/**
 * Calculate mileage projections and fees
 * @param {number} estimatedMilesPerYear - User's estimated annual mileage
 * @param {Object} leaseOption - Selected lease option
 * @returns {Object} Mileage analysis
 */
export const calculateMileageAnalysis = (estimatedMilesPerYear, leaseOption) => {
  const { termMonths, mileageAllowance, excessMileageFee } = leaseOption;
  const allowedMiles = mileageAllowance * (termMonths / 12);
  const projectedMiles = estimatedMilesPerYear * (termMonths / 12);
  const excessMiles = Math.max(0, projectedMiles - allowedMiles);
  const excessFees = excessMiles * excessMileageFee;
  
  return {
    allowedMiles: Math.round(allowedMiles),
    projectedMiles: Math.round(projectedMiles),
    excessMiles: Math.round(excessMiles),
    excessFees: Math.round(excessFees),
    isOverage: excessMiles > 0,
    utilizationPercentage: Math.round((projectedMiles / allowedMiles) * 100)
  };
};

/**
 * Calculate lump sum purchase analysis
 * @param {Object} params - Purchase parameters
 * @returns {Object} Lump sum analysis
 */
export const calculateLumpSumAnalysis = ({
  vehiclePrice,
  currentCash,
  monthlyIncome,
  monthlyExpenses,
  expectedReturn = 0.07 // 7% annual return assumption
}) => {
  const taxesAndFees = vehiclePrice * 0.08; // Estimate 8% for taxes/fees
  const totalCashNeeded = vehiclePrice + taxesAndFees;
  const remainingCash = currentCash - totalCashNeeded;
  const emergencyFundNeeded = monthlyExpenses * 6; // 6 months expenses
  
  // Compare with financing alternative
  const financeOption = calculateFinancingOptions({
    vehiclePrice,
    downPayment: vehiclePrice * 0.2, // 20% down
    creditScore: 720 // Assume good credit for comparison
  })[1]; // 48-month option
  
  // Opportunity cost: what if cash was invested instead
  const cashToInvest = totalCashNeeded - financeOption.downPayment;
  const monthlyReturn = expectedReturn / 12;
  let investmentValue = cashToInvest;
  
  // Calculate investment growth over loan term
  for (let month = 0; month < financeOption.termMonths; month++) {
    investmentValue *= (1 + monthlyReturn);
  }
  
  const opportunityCost = investmentValue - cashToInvest;
  const interestSaved = financeOption.totalInterest;
  const netBenefit = interestSaved - opportunityCost;
  
  return {
    vehiclePrice,
    taxesAndFees: Math.round(taxesAndFees),
    totalCashNeeded: Math.round(totalCashNeeded),
    remainingCash: Math.round(remainingCash),
    emergencyFundNeeded: Math.round(emergencyFundNeeded),
    financialHealthScore: remainingCash >= emergencyFundNeeded ? 'excellent' : 
                         remainingCash >= emergencyFundNeeded * 0.5 ? 'good' : 'concerning',
    opportunityCost: {
      cashToInvest: Math.round(cashToInvest),
      projectedValue: Math.round(investmentValue),
      opportunityLoss: Math.round(opportunityCost),
      interestSaved: Math.round(interestSaved),
      netBenefit: Math.round(netBenefit),
      isLumpSumBetter: netBenefit > 0
    },
    immediateOwnershipBenefits: [
      'No monthly payments',
      `Save $${interestSaved.toLocaleString()} in interest`,
      'Full ownership from day one',
      'Freedom to sell anytime',
      'Lower insurance requirements',
      'Title in your name immediately'
    ]
  };
};

/**
 * Calculate 5-year ownership costs for lump sum
 * @param {number} vehiclePrice - Initial vehicle price
 * @returns {Array} Yearly cost breakdown
 */
export const calculateOwnershipCosts = (vehiclePrice) => {
  const costs = [];
  const baseInsurance = 1200; // Annual insurance
  const baseRegistration = 150; // Annual registration
  
  for (let year = 0; year <= 5; year++) {
    let maintenance = 0;
    
    if (year === 0) {
      // Purchase year
      maintenance = 500; // Basic maintenance
    } else if (year <= 3) {
      // Years 1-3: Basic maintenance
      maintenance = 800 + (year * 200);
    } else {
      // Years 4-5: Higher maintenance
      maintenance = 1500 + ((year - 3) * 300);
    }
    
    costs.push({
      year,
      purchaseCost: year === 0 ? vehiclePrice : 0,
      maintenance: Math.round(maintenance),
      insurance: Math.round(baseInsurance * (1 + year * 0.03)), // 3% annual increase
      registration: baseRegistration,
      total: year === 0 ? 
        vehiclePrice + maintenance + baseInsurance + baseRegistration :
        maintenance + Math.round(baseInsurance * (1 + year * 0.03)) + baseRegistration
    });
  }
  
  return costs;
};

/**
 * Format currency for display
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Get affordability assessment
 * @param {number} monthlyPayment 
 * @param {number} monthlyIncome 
 * @returns {Object}
 */
export const getAffordabilityAssessment = (monthlyPayment, monthlyIncome) => {
  const percentage = (monthlyPayment / monthlyIncome) * 100;
  
  let status, message, color;
  
  if (percentage <= 10) {
    status = 'excellent';
    message = 'Very affordable - well within recommended limits';
    color = 'green';
  } else if (percentage <= 15) {
    status = 'good';
    message = 'Affordable - within reasonable limits';
    color = 'blue';
  } else if (percentage <= 20) {
    status = 'caution';
    message = 'Consider your budget carefully';
    color = 'yellow';
  } else {
    status = 'warning';
    message = 'May strain your budget - consider alternatives';
    color = 'red';
  }
  
  return {
    percentage: Math.round(percentage),
    status,
    message,
    color
  };
};