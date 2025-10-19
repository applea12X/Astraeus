import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, User, DollarSign, Car, FileText, CreditCard, TrendingUp } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const DealerViewModal = ({ userId, userProfile, onClose }) => {
  const [customerData, setCustomerData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('No authenticated user');
          setLoading(false);
          return;
        }

        // Fetch from users collection
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setCustomerData(userDoc.data());
        }

        // Fetch from financial_profiles collection
        const financialDocRef = doc(db, 'financial_profiles', user.uid);
        const financialDoc = await getDoc(financialDocRef);

        if (financialDoc.exists()) {
          setFinancialData(financialDoc.data());
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();

    // Handle ESC key to close modal
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [userId, onClose]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <div className="text-white text-2xl">Loading customer data...</div>
      </motion.div>
    );
  }

  const user = auth.currentUser;

  // Calculate journey progress
  const journeySteps = [
    { name: 'Neptune', key: 'neptuneCompleted', completed: customerData?.neptuneCompleted },
    { name: 'Uranus', key: 'uranusCompleted', completed: customerData?.uranusCompleted },
    { name: 'Saturn', key: 'saturnCompleted', completed: customerData?.saturnCompleted },
    { name: 'Jupiter', key: 'jupiterCompleted', completed: customerData?.jupiterCompleted },
    { name: 'Mars', key: 'marsCompleted', completed: customerData?.marsCompleted },
    { name: 'Earth', key: 'earthCompleted', completed: customerData?.earthCompleted },
  ];
  const completedSteps = journeySteps.filter(step => step.completed).length;
  const totalSteps = journeySteps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-y-auto m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6 flex items-center justify-between border-b border-orange-500/30">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Car className="w-8 h-8" />
                Dealer View - Customer Profile
              </h2>
              <p className="text-orange-100 mt-1">Comprehensive customer overview for dealership staff</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Demo Disclaimer */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg mx-8 mt-6 p-4">
            <p className="text-yellow-200 text-sm font-semibold">
              Demo Mode: This is a demonstration view for dealership staff. Some data may be simulated.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="p-8 space-y-6">
            {/* Customer Profile Section */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Customer Profile</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Name</p>
                  <p className="text-white font-semibold">
                    {customerData?.firstName && customerData?.lastName
                      ? `${customerData.firstName} ${customerData.lastName}`
                      : customerData?.firstName || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white font-semibold break-all">{user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Phone</p>
                  <p className="text-white font-semibold">{customerData?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Current Planet</p>
                  <p className="text-white font-semibold capitalize">
                    {customerData?.currentPlanet || 'Not started'}
                  </p>
                </div>
                <div className="col-span-full">
                  <p className="text-slate-400 text-sm mb-2">Journey Progress ({completedSteps} of {totalSteps} planets completed)</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold text-lg">{progressPercentage}%</span>
                  </div>
                  {/* Journey steps breakdown */}
                  <div className="flex flex-wrap gap-2">
                    {journeySteps.map((step) => (
                      <div
                        key={step.key}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                          step.completed
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-slate-700/50 text-slate-400 border-slate-600/30'
                        }`}
                      >
                        {step.completed ? '✓' : '○'} {step.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Financial Information</h3>
                {customerData?.neptuneCompleted && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                    Completed
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Employment Details */}
                <div>
                  <p className="text-slate-400 text-sm">Employment Status</p>
                  <p className="text-white font-semibold capitalize">
                    {financialData?.employmentStatus?.replace('-', ' ') || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Occupation</p>
                  <p className="text-white font-semibold">
                    {financialData?.occupation || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Employer Name</p>
                  <p className="text-white font-semibold">
                    {financialData?.employerName || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Annual Income</p>
                  <p className="text-white font-semibold text-lg">
                    {financialData?.annualIncome
                      ? `$${parseInt(financialData.annualIncome).toLocaleString()}`
                      : 'Not provided'}
                  </p>
                </div>

                {/* Credit Information */}
                <div>
                  <p className="text-slate-400 text-sm">Credit Score Range</p>
                  <p className="text-white font-semibold capitalize">
                    {financialData?.creditScore?.replace('-', ' ') || customerData?.softPullData?.creditScore || 'Not available'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Financial Goal</p>
                  <p className="text-white font-semibold capitalize">
                    {financialData?.financialGoal || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Payment Frequency</p>
                  <p className="text-white font-semibold capitalize">
                    {financialData?.paymentFrequency || 'Not specified'}
                  </p>
                </div>

                {/* Document Verification */}
                <div>
                  <p className="text-slate-400 text-sm mb-1">W2 Upload Status</p>
                  {customerData?.w2Verified ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">Not Uploaded</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Pay Stub Status</p>
                  {customerData?.payStubVerified ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">Not Uploaded</span>
                    </div>
                  )}
                </div>

                {/* Payment Capacity */}
                <div>
                  <p className="text-slate-400 text-sm">Monthly Payment Capacity</p>
                  <p className="text-white font-semibold text-lg">
                    {financialData?.annualIncome
                      ? `$${Math.round(parseInt(financialData.annualIncome) / 12 * 0.15).toLocaleString()}`
                      : 'N/A'}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">~15% of monthly income</p>
                </div>
              </div>
            </div>

            {/* Vehicle Preferences Section */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Vehicle Preferences</h3>
                {customerData?.uranusCompleted && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                    Completed
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Budget Range</p>
                  <p className="text-white font-semibold">
                    {customerData?.vehiclePreferences?.budget || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Vehicle Type</p>
                  <p className="text-white font-semibold">
                    {customerData?.vehiclePreferences?.vehicleType || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Family Size</p>
                  <p className="text-white font-semibold">
                    {customerData?.vehiclePreferences?.familySize
                      ? `${customerData.vehiclePreferences.familySize} people`
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Primary Use</p>
                  <p className="text-white font-semibold capitalize">
                    {customerData?.vehiclePreferences?.primaryUse || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Fuel Preference</p>
                  <p className="text-white font-semibold capitalize">
                    {customerData?.vehiclePreferences?.fuelType || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Vehicles Section - Show ALL vehicles */}
            {customerData?.recommendedVehicles && customerData.recommendedVehicles.length > 0 && (
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Car className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">AI Recommended Vehicles ({customerData.recommendedVehicles.length} total)</h3>
                  {customerData?.saturnCompleted && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                      Completed
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customerData.recommendedVehicles.map((vehicle, index) => (
                    <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600 hover:border-blue-500/50 transition-colors">
                      <p className="text-slate-400 text-xs mb-2">Recommendation #{index + 1}</p>
                      <p className="text-white font-bold text-lg">
                        {vehicle.year || 'N/A'} {vehicle.make || ''} {vehicle.model || ''}
                      </p>
                      <p className="text-green-400 font-semibold mt-2">
                        {vehicle.priceNew || vehicle.price ? (vehicle.priceNew || `$${vehicle.price?.toLocaleString()}`) : 'Price TBD'}
                      </p>
                      {vehicle.description && (
                        <p className="text-slate-300 text-xs mt-2 line-clamp-2">{vehicle.description}</p>
                      )}
                      {vehicle.mpg && (
                        <p className="text-cyan-400 text-xs mt-1">MPG: {vehicle.mpg}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Method Selection (Jupiter) */}
            {customerData?.paymentPlan && (
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Payment Method Selection (Jupiter)</h3>
                  {customerData?.jupiterCompleted && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                      Completed
                    </span>
                  )}
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Preferred Payment Method</p>
                  <p className="text-white font-bold text-2xl capitalize">
                    {customerData.paymentPlan === 'cash' ? 'Cash Purchase' : customerData.paymentPlan}
                  </p>
                  <p className="text-slate-300 text-sm mt-2">
                    {customerData.paymentPlan === 'finance' && 'Customer chose to finance the vehicle with a loan'}
                    {customerData.paymentPlan === 'lease' && 'Customer chose to lease the vehicle'}
                    {customerData.paymentPlan === 'cash' && 'Customer chose to pay in full with cash'}
                  </p>
                </div>
              </div>
            )}

            {/* Selected Vehicle Section */}
            {customerData?.selectedVehicle && (
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border-2 border-orange-500/50">
                <div className="flex items-center gap-3 mb-4">
                  <Car className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold text-white">Customer's Final Selection</h3>
                  <span className="px-3 py-1 bg-orange-500/30 text-orange-300 rounded-full text-xs font-semibold border border-orange-500/50 animate-pulse">
                    CUSTOMER'S CHOICE
                  </span>
                  {customerData?.jupiterCompleted && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                      Confirmed
                    </span>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {customerData.selectedVehicle.image && (
                    <img
                      src={customerData.selectedVehicle.image}
                      alt={`${customerData.selectedVehicle.make} ${customerData.selectedVehicle.model}`}
                      className="w-full md:w-64 h-48 object-cover rounded-lg border border-orange-500/30"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-bold text-2xl mb-2">
                      {customerData.selectedVehicle.year} {customerData.selectedVehicle.make} {customerData.selectedVehicle.model}
                    </p>
                    <p className="text-orange-400 font-bold text-3xl mb-4">
                      ${customerData.selectedVehicle.price?.toLocaleString() || 'Price TBD'}
                    </p>
                    {customerData.selectedVehicle.description && (
                      <p className="text-slate-300 text-sm">{customerData.selectedVehicle.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Plan Section */}
            {customerData?.paymentPlan && (
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Payment Plan</h3>
                  {customerData?.marsCompleted && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                      Completed
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Down Payment</p>
                    <p className="text-white font-semibold text-lg">
                      ${customerData.paymentPlan.downPayment?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Loan Term</p>
                    <p className="text-white font-semibold text-lg">
                      {customerData.paymentPlan.loanTerm || 'N/A'} months
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Monthly Payment</p>
                    <p className="text-white font-semibold text-lg">
                      ${customerData.paymentPlan.monthlyPayment?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Interest Rate</p>
                    <p className="text-white font-semibold text-lg">
                      {customerData.paymentPlan.interestRate || 'N/A'}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Payment Method</p>
                    <p className="text-white font-semibold capitalize">
                      {customerData.paymentPlan.method || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Export/Print Button */}
            <div className="flex justify-end gap-4 pt-4">
              <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Export Report (Demo)
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DealerViewModal;
