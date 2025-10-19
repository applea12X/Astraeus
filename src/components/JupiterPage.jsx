import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Car, DollarSign, Calendar } from 'lucide-react';

const JupiterPage = ({ onNavigate, selectedVehicle }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 w-screen h-screen overflow-auto bg-gradient-to-b from-[#f4e4c1] via-[#e8d4b0] to-[#d4c4a8]"
    >
      {/* Stars/Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-900/20"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.3
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => onNavigate && onNavigate('saturn-results')}
        className="fixed top-6 left-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/30 backdrop-blur-md border border-amber-900/20 text-amber-900 hover:bg-white/40 transition-all shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Results</span>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        {/* Success Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <CheckCircle className="w-16 h-16 text-white" />
            </motion.div>
          </div>
          <h1 className="text-5xl font-bold text-amber-900 drop-shadow-lg mb-4">
            Excellent Choice!
          </h1>
          <p className="text-2xl text-amber-800">
            You've selected your perfect vehicle
          </p>
        </motion.div>

        {/* Selected Vehicle Card */}
        {selectedVehicle && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-amber-900/20 shadow-2xl mb-12"
          >
            {/* Vehicle Image */}
            {selectedVehicle.imageUrl && (
              <div className="w-full h-96 overflow-hidden">
                <img 
                  src={selectedVehicle.imageUrl} 
                  alt={selectedVehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Vehicle Details */}
            <div className="p-10">
              <h2 className="text-4xl font-bold text-amber-900 mb-2">{selectedVehicle.name}</h2>
              <p className="text-2xl text-amber-700 mb-6">{selectedVehicle.year} • {selectedVehicle.category}</p>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl p-6 border border-green-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-700" />
                    <h3 className="font-bold text-green-900">Purchase Price</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-800">{selectedVehicle.priceNew}</p>
                  <p className="text-sm text-green-700 mt-1">or {selectedVehicle.priceFinanceMonthly}/month</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-2xl p-6 border border-blue-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 text-blue-700" />
                    <h3 className="font-bold text-blue-900">Lease Option</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">{selectedVehicle.priceLeaseMonthly}</p>
                  <p className="text-sm text-blue-700 mt-1">36-month lease</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-2xl p-6 border border-amber-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Car className="w-6 h-6 text-amber-700" />
                    <h3 className="font-bold text-amber-900">Fuel Economy</h3>
                  </div>
                  <p className="text-2xl font-bold text-amber-800">{selectedVehicle.fuelEconomy}</p>
                  <p className="text-sm text-amber-700 mt-1">city/highway MPG</p>
                </div>
              </div>

              {/* Why It's Perfect */}
              <div className="bg-amber-100/50 rounded-2xl p-6 border border-amber-300">
                <h3 className="text-2xl font-bold text-amber-900 mb-3">Why This is Perfect For You</h3>
                <p className="text-amber-800 text-lg leading-relaxed">{selectedVehicle.whyGoodFit}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 border border-amber-900/20 shadow-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-amber-900 mb-4">What's Next?</h2>
          <p className="text-xl text-amber-800 mb-8">
            Your Toyota Financial Services journey continues! We'll connect you with a local dealer to schedule a test drive and finalize your purchase.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => onNavigate && onNavigate('saturn-results')}
              className="px-8 py-4 bg-white/50 hover:bg-white/70 border border-amber-900/30 text-amber-900 font-semibold rounded-xl transition-all"
            >
              Change Vehicle
            </button>
            <button
              onClick={() => onNavigate && onNavigate('solar-system')}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              Continue Financial Journey →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Ambient glow effects */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
};

export default JupiterPage;

