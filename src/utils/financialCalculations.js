// Financial calculation utilities

/**
 * Calculate recommended car price range based on the 10% car rule
 * @param {Object} financialInfo - User's financial information
 * @returns {Object} - Recommended price range and breakdown
 */
export const calculateRecommendedCarPrice = (financialInfo) => {
  if (!financialInfo || !financialInfo.annualIncome) {
    return null;
  }

  // Convert annual income to monthly income (assuming it's gross)
  const annualIncome = parseFloat(financialInfo.annualIncome.replace(/[,$]/g, ''));
  const grossMonthlyIncome = annualIncome / 12;
  
  // Estimate net monthly income (rough estimate: 70-80% of gross)
  // This varies by state and tax situation, but 75% is a reasonable estimate
  const netMonthlyIncome = grossMonthlyIncome;
  
  // 10% rule: Total monthly car expenses should not exceed 10% of net income
  const maxMonthlyCarExpenses = netMonthlyIncome * 0.10;
  
  // Estimate other car expenses (insurance, gas, maintenance)
  // These are rough estimates that can vary significantly
  const estimatedInsurance = Math.min(200, maxMonthlyCarExpenses * 0.3); // $150-200/month typical
  const estimatedGas = Math.min(150, maxMonthlyCarExpenses * 0.25); // $100-150/month typical
  const estimatedMaintenance = Math.min(100, maxMonthlyCarExpenses * 0.15); // $50-100/month
  
  const totalOtherExpenses = estimatedInsurance + estimatedGas + estimatedMaintenance;
  
  // Maximum monthly payment available for the car loan
  const maxMonthlyPayment = Math.max(0, maxMonthlyCarExpenses - totalOtherExpenses);
  
  // Calculate purchase price using 20/4/10 rule assumptions
  // 20% down payment, 4-year loan, assume 6% APR (typical rate)
  const loanTermMonths = 48; // 4 years
  const annualInterestRate = 0.06;
  const monthlyInterestRate = annualInterestRate / 12;
  
  // Calculate maximum loan amount using payment formula
  // Payment = Principal * [r(1+r)^n] / [(1+r)^n - 1]
  // Solving for Principal: Principal = Payment * [(1+r)^n - 1] / [r(1+r)^n]
  let maxLoanAmount = 0;
  if (monthlyInterestRate > 0) {
    const factor = Math.pow(1 + monthlyInterestRate, loanTermMonths);
    maxLoanAmount = maxMonthlyPayment * (factor - 1) / (monthlyInterestRate * factor);
  } else {
    // If no interest, simple calculation
    maxLoanAmount = maxMonthlyPayment * loanTermMonths;
  }
  
  // Maximum car price = loan amount / 80% (since 20% down payment)
  const maxCarPrice = maxLoanAmount / 0.8;
  
  // Create price ranges
  const conservativeMax = maxCarPrice * 0.8; // More conservative estimate
  const moderateMax = maxCarPrice * 0.9;
  const optimisticMax = maxCarPrice;
  
  // Round to nearest $1000
  const roundToThousand = (amount) => Math.round(amount / 1000) * 1000;
  
  return {
    maxMonthlyCarExpenses: Math.round(maxMonthlyCarExpenses),
    maxMonthlyPayment: Math.round(maxMonthlyPayment),
    estimatedOtherExpenses: {
      insurance: Math.round(estimatedInsurance),
      gas: Math.round(estimatedGas),
      maintenance: Math.round(estimatedMaintenance),
      total: Math.round(totalOtherExpenses)
    },
    recommendedPriceRanges: {
      conservative: {
        min: roundToThousand(conservativeMax * 0.6),
        max: roundToThousand(conservativeMax),
        label: 'Conservative'
      },
      moderate: {
        min: roundToThousand(conservativeMax * 0.8),
        max: roundToThousand(moderateMax),
        label: 'Moderate'
      },
      optimistic: {
        min: roundToThousand(moderateMax * 0.8),
        max: roundToThousand(optimisticMax),
        label: 'Optimistic'
      }
    },
    calculations: {
      annualIncome,
      grossMonthlyIncome: Math.round(grossMonthlyIncome),
      netMonthlyIncome: Math.round(netMonthlyIncome),
      maxCarPrice: Math.round(maxCarPrice),
      downPayment: Math.round(maxCarPrice * 0.2),
      loanAmount: Math.round(maxLoanAmount)
    }
  };
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
 * Get budget recommendation message based on financial info
 * @param {Object} calculation 
 * @returns {string}
 */
export const getBudgetRecommendationMessage = (calculation) => {
  if (!calculation) {
    return "Complete your financial information to see personalized recommendations.";
  }
  
  const { recommendedPriceRanges, maxMonthlyPayment, maxMonthlyCarExpenses } = calculation;
  
  if (maxMonthlyPayment <= 0) {
    return "Based on your income, we recommend focusing on improving your financial situation before taking on a car payment. Consider looking at reliable used vehicles or improving your income first.";
  }
  
  return `Based on your income and the 10% rule, we recommend a vehicle in the ${formatCurrency(recommendedPriceRanges.moderate.min)} - ${formatCurrency(recommendedPriceRanges.moderate.max)} range, with a maximum monthly payment of ${formatCurrency(maxMonthlyPayment)}.`;
};