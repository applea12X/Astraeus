import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, FileText, CreditCard, Check, X as XIcon, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth, db } from '../firebase/config';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

const NeptunePage = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [w2Status, setW2Status] = useState(null); // null, 'uploading', 'verified', 'failed'
  const [payStubStatus, setPayStubStatus] = useState(null);
  const [w2Data, setW2Data] = useState(null);
  const [payStubData, setPayStubData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSoftPullForm, setShowSoftPullForm] = useState(false);
  const [softPullStatus, setSoftPullStatus] = useState(null); // null, 'loading', 'success', 'failed'
  const [softPullData, setSoftPullData] = useState(null);
  const [softPullFormData, setSoftPullFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fileToGenerativePart = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeDocument = async (file, documentType) => {
    if (!genAI) {
      setErrorMessage('Gemini API not configured. Please set VITE_GEMINI_API_KEY.');
      return null;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const imagePart = await fileToGenerativePart(file);

      const prompt = documentType === 'w2' 
        ? `Analyze this W-2 tax form image and extract the following information:
1. Verify if this is a legitimate W-2 form (check for standard W-2 format, required fields, employer information)
2. Extract the employee's annual income (Box 1 - Wages, tips, other compensation)
3. Extract the employee's name if visible
4. Extract the employer's name if visible

Respond in JSON format:
{
  "isLegitimate": true/false,
  "annualIncome": "dollar amount or null",
  "employeeName": "name or null",
  "employerName": "name or null",
  "reason": "brief explanation of legitimacy determination"
}`
        : `Analyze this pay stub image and extract the following information:
1. Verify if this is a legitimate pay stub (check for standard pay stub format, required fields like pay period, employer info, deductions)
2. Extract or calculate the annual income based on the pay period and gross pay shown
3. Extract the employee's name if visible
4. Extract the employer's name if visible

Respond in JSON format:
{
  "isLegitimate": true/false,
  "annualIncome": "estimated annual income or null",
  "employeeName": "name or null", 
  "employerName": "name or null",
  "payPeriod": "pay period shown",
  "reason": "brief explanation of legitimacy determination"
}`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return data;
      }
      
      throw new Error('Could not parse response from Gemini');
    } catch (error) {
      console.error('Error analyzing document:', error);
      setErrorMessage(`Error analyzing document: ${error.message}`);
      return null;
    }
  };

  const handleW2Upload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setW2Status('uploading');
    setErrorMessage('');

    const result = await analyzeDocument(file, 'w2');
    
    if (result) {
      if (result.isLegitimate) {
        setW2Status('verified');
        setW2Data(result);
        
        // Save to Firebase
        const financialData = {};
        if (result.annualIncome) {
          // Extract numeric value from income string
          const incomeMatch = result.annualIncome.match(/[\d,]+/);
          if (incomeMatch) {
            financialData.annualIncome = incomeMatch[0].replace(/,/g, '');
          }
        }
        if (result.employerName) {
          financialData.employerName = result.employerName;
        }
        
        if (Object.keys(financialData).length > 0) {
          await saveFinancialDataToFirebase(financialData);
        }

        // Set W2 verification flag in users collection for dealer view
        const user = auth.currentUser;
        if (user) {
          try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
              w2Verified: true,
              w2UploadedAt: new Date().toISOString()
            });
            console.log('✅ W2 verification flag set in users collection');
          } catch (error) {
            // If user document doesn't exist, create it with the flag
            if (error.code === 'not-found') {
              await setDoc(userRef, {
                email: user.email,
                w2Verified: true,
                w2UploadedAt: new Date().toISOString(),
                createdAt: new Date().toISOString()
              });
              console.log('✅ W2 verification flag set in new users document');
            } else {
              console.error('Error setting W2 verification flag:', error);
            }
          }
        }
      } else {
        setW2Status('failed');
        setErrorMessage(result.reason || 'Document verification failed');
      }
    } else {
      setW2Status('failed');
    }
  };

  const handlePayStubUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPayStubStatus('uploading');
    setErrorMessage('');

    const result = await analyzeDocument(file, 'paystub');
    
    if (result) {
      if (result.isLegitimate) {
        setPayStubStatus('verified');
        setPayStubData(result);
        
        // Save to Firebase
        const financialData = {};
        if (result.annualIncome) {
          // Extract numeric value from income string
          const incomeMatch = result.annualIncome.match(/[\d,]+/);
          if (incomeMatch) {
            financialData.annualIncome = incomeMatch[0].replace(/,/g, '');
          }
        }
        if (result.employerName) {
          financialData.employerName = result.employerName;
        }
        
        if (Object.keys(financialData).length > 0) {
          await saveFinancialDataToFirebase(financialData);
        }

        // Set pay stub verification flag in users collection for dealer view
        const user = auth.currentUser;
        if (user) {
          try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
              payStubVerified: true,
              payStubUploadedAt: new Date().toISOString()
            });
            console.log('✅ Pay stub verification flag set in users collection');
          } catch (error) {
            // If user document doesn't exist, create it with the flag
            if (error.code === 'not-found') {
              await setDoc(userRef, {
                email: user.email,
                payStubVerified: true,
                payStubUploadedAt: new Date().toISOString(),
                createdAt: new Date().toISOString()
              });
              console.log('✅ Pay stub verification flag set in new users document');
            } else {
              console.error('Error setting pay stub verification flag:', error);
            }
          }
        }
      } else {
        setPayStubStatus('failed');
        setErrorMessage(result.reason || 'Document verification failed');
      }
    } else {
      setPayStubStatus('failed');
    }
  };

  const handleSoftPullSubmit = async (e) => {
    e.preventDefault();
    setSoftPullStatus('loading');
    setErrorMessage('');

    try {
      console.log('🧪 Running in MOCK MODE - Using simulated credit data');
      console.log('📝 Form data:', softPullFormData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock credit score (between 300-850)
      const mockScore = Math.floor(Math.random() * (850 - 300 + 1)) + 300;
      let mockRating = 'Fair';
      if (mockScore >= 800) mockRating = 'Excellent';
      else if (mockScore >= 740) mockRating = 'Very Good';
      else if (mockScore >= 670) mockRating = 'Good';
      else if (mockScore >= 580) mockRating = 'Fair';
      else mockRating = 'Poor';
      
      const mockData = {
        creditScore: mockScore,
        creditRating: mockRating,
        reportDate: new Date().toLocaleDateString(),
        name: `${softPullFormData.firstName} ${softPullFormData.lastName}`,
        address: `${softPullFormData.address}, ${softPullFormData.city}, ${softPullFormData.state} ${softPullFormData.zipCode}`
      };
      
      console.log('✅ Mock credit pull successful:', mockData);
      
      setSoftPullStatus('success');
      setSoftPullData(mockData);
      setShowSoftPullForm(false);
      
      // Save credit score to Firebase
      await saveFinancialDataToFirebase({
        creditScore: mockData.creditScore.toString()
      });
    } catch (error) {
      console.error('❌ Error performing soft credit pull:', error);
      setSoftPullStatus('failed');
      setErrorMessage(`Failed to pull credit score: ${error.message}`);
    }
  };

  const handleSoftPullFormChange = (field, value) => {
    setSoftPullFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveFinancialDataToFirebase = async (dataToSave) => {
    const user = auth.currentUser;
    if (!user) {
      console.warn('No user logged in, cannot save financial data');
      return;
    }

    try {
      const financialRef = doc(db, 'financial_profiles', user.uid);
      
      // Get existing data first
      const existingDoc = await getDoc(financialRef);
      
      if (existingDoc.exists()) {
        // Update existing document
        await updateDoc(financialRef, {
          ...dataToSave,
          updatedAt: new Date().toISOString()
        });
        console.log('✅ Updated financial data in Firebase:', dataToSave);
      } else {
        // Create new document
        await setDoc(financialRef, {
          ...dataToSave,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log('✅ Created financial data in Firebase:', dataToSave);
      }
    } catch (error) {
      console.error('❌ Error saving financial data to Firebase:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out'
      }}
    >
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <div className="relative">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => onNavigate && onNavigate('solar-system')}
            className="relative flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-2xl border transition-all duration-300 backdrop-blur-lg bg-gradient-to-r from-blue-500/30 to-blue-600/30 hover:from-blue-500/40 hover:to-blue-600/40 border-blue-400/60 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Solar System</span>
          </motion.button>
          {/* Button glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl -z-10 scale-110 opacity-60"></div>
        </div>
      </div>
      {/* Neptune-themed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a237e] via-[#283593] to-[#3949ab]">
        {/* Animated stars */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>

        {/* Large cartoon Neptune in the background */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1,
            transition: 'all 1.5s ease-out 0.3s'
          }}
        >
          {/* Neptune planet */}
          <div className="relative w-[600px] h-[600px]">
            {/* Main planet body */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4166F5] via-[#2E4DD7] to-[#1E3BA8] shadow-2xl">
              {/* Atmospheric bands */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div
                  className="absolute w-full h-[80px] bg-[#5A7FFF]/40 blur-sm animate-pulse"
                  style={{ 
                    top: '20%',
                    animation: 'float 20s linear infinite'
                  }}
                />
                <div
                  className="absolute w-full h-[60px] bg-[#3D5FE8]/30 blur-sm animate-pulse"
                  style={{ 
                    top: '45%',
                    animation: 'float 25s linear infinite reverse'
                  }}
                />
                <div
                  className="absolute w-full h-[70px] bg-[#2D4FD8]/35 blur-sm animate-pulse"
                  style={{ 
                    top: '70%',
                    animation: 'float 22s linear infinite'
                  }}
                />
              </div>

              {/* Great Dark Spot (Neptune's storm) */}
              <div
                className="absolute top-[35%] left-[25%] w-[120px] h-[90px] rounded-full bg-[#1a2d7a]/60 blur-md animate-pulse"
                style={{
                  animation: 'pulse-glow 8s ease-in-out infinite'
                }}
              />

              {/* Highlight/shine */}
              <div className="absolute top-[15%] left-[20%] w-[180px] h-[180px] rounded-full bg-white/20 blur-3xl" />
            </div>

            {/* Planet glow */}
            <div className="absolute inset-0 rounded-full bg-[#4166F5]/40 blur-[80px] scale-110 -z-10" />
          </div>
        </div>

        {/* Floating clouds/gas effects */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`cloud-${i}`}
            className="absolute rounded-full bg-white/5 blur-2xl animate-pulse"
            style={{
              width: Math.random() * 200 + 100 + 'px',
              height: Math.random() * 100 + 50 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center pt-24">
          <div
            className="text-center"
            style={{
              transform: 'translateY(0)',
              opacity: 1,
              transition: 'all 1s ease-out 0.8s'
            }}
          >
            <h1 className="text-7xl font-bold text-white drop-shadow-2xl mb-4 text-center">
              Welcome to Neptune
            </h1>
            
            
            {/* Interactive content area */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto border border-white/20 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {!showUploadOptions ? (
                  /* Initial options */
                  <motion.div
                    key="initial-view"
                    initial={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <h2 className="text-3xl font-semibold text-white mb-4">
                      Your Adventure Begins
                    </h2>
                    <p className="text-lg text-blue-50 leading-relaxed mb-8">
                      Neptune represents your introduction to the world of Toyota Financial.
                      Here you'll enter your preliminary financial information to get started.
                    </p>

                    <div className="space-y-6">
                      {/* Next button */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center space-y-4"
                      >
                        {/* Import Financials Button */}
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowUploadOptions(true)}
                            className="relative px-20 py-6 text-2xl font-semibold rounded-2xl border transition-all duration-300 backdrop-blur-lg min-w-[200px] bg-gradient-to-r from-blue-500/30 to-blue-600/30 hover:from-blue-500/40 hover:to-blue-600/40 border-blue-400/60 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
                          >
                            Import Financials Automatically
                          </motion.button>
                          
                          {/* Button glow effect */}
                          <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl -z-10 scale-110 opacity-60"></div>
                        </div>

                        {/* Input Manually Text */}
                        <button
                          onClick={() => onNavigate && onNavigate('financial-info')}
                          className="text-gray-400 text-base hover:text-gray-300 transition-colors cursor-pointer"
                        >
                          Input manually
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  /* Upload Options */
                  <motion.div
                    key="upload-view"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="space-y-6">
                  {/* Back button in upload view */}
                  <button
                    onClick={() => setShowUploadOptions(false)}
                    className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to options
                  </button>

                  <h3 className="text-xl font-semibold text-white text-center">
                    Upload Your Financial Documents
                  </h3>

                  {/* Three square boxes - now in a compact grid */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {/* W-2 Upload */}
                    <motion.div
                      whileHover={{ scale: w2Status === 'uploading' ? 1 : 1.05 }}
                      className={`relative aspect-square backdrop-blur-lg rounded-xl border-2 transition-all duration-300 ${
                        w2Status === 'verified' 
                          ? 'bg-green-500/20 border-green-400/80' 
                          : w2Status === 'failed'
                          ? 'bg-red-500/20 border-red-400/80'
                          : w2Status === 'uploading'
                          ? 'bg-blue-500/20 border-blue-400/80'
                          : 'bg-white/10 border-blue-400/40 hover:border-blue-400/80 cursor-pointer'
                      } group`}
                    >
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="w2-upload"
                        onChange={handleW2Upload}
                        disabled={w2Status === 'uploading'}
                      />
                      <label
                        htmlFor="w2-upload"
                        className={`absolute inset-0 flex flex-col items-center justify-center p-3 ${w2Status === 'uploading' ? '' : 'cursor-pointer'}`}
                      >
                        {w2Status === 'uploading' ? (
                          <>
                            <Loader2 className="w-10 h-10 text-blue-300 mb-2 animate-spin" />
                            <p className="text-xs text-blue-200 text-center">Analyzing...</p>
                          </>
                        ) : w2Status === 'verified' ? (
                          <>
                            <Check className="w-10 h-10 text-green-400 mb-2" />
                            <h4 className="text-sm font-semibold text-white mb-1 text-center">
                              W-2 Verified ✓
                            </h4>
                            {w2Data?.annualIncome && (
                              <p className="text-xs text-green-200 text-center">
                                Income: {w2Data.annualIncome}
                              </p>
                            )}
                          </>
                        ) : w2Status === 'failed' ? (
                          <>
                            <XIcon className="w-10 h-10 text-red-400 mb-2" />
                            <h4 className="text-sm font-semibold text-white mb-1 text-center">
                              W-2 Failed ✗
                            </h4>
                            <p className="text-xs text-red-200 text-center">
                              Try again
                            </p>
                          </>
                        ) : (
                          <>
                            <FileText className="w-10 h-10 text-blue-300 mb-2 group-hover:text-blue-200 transition-colors" />
                            <h4 className="text-sm font-semibold text-white mb-1 text-center">
                              W-2 Upload
                            </h4>
                            <p className="text-xs text-blue-200 text-center">
                              Click to upload
                            </p>
                          </>
                        )}
                      </label>
                      <div className={`absolute inset-0 rounded-xl blur-lg -z-10 scale-110 transition-opacity ${
                        w2Status === 'verified' 
                          ? 'bg-green-400/20 opacity-60' 
                          : w2Status === 'failed'
                          ? 'bg-red-400/20 opacity-60'
                          : 'bg-blue-400/10 opacity-0 group-hover:opacity-60'
                      }`}></div>
                    </motion.div>

                    {/* Pay Stub Upload */}
                    <motion.div
                      whileHover={{ scale: payStubStatus === 'uploading' ? 1 : 1.05 }}
                      className={`relative aspect-square backdrop-blur-lg rounded-xl border-2 transition-all duration-300 ${
                        payStubStatus === 'verified' 
                          ? 'bg-green-500/20 border-green-400/80' 
                          : payStubStatus === 'failed'
                          ? 'bg-red-500/20 border-red-400/80'
                          : payStubStatus === 'uploading'
                          ? 'bg-blue-500/20 border-blue-400/80'
                          : 'bg-white/10 border-blue-400/40 hover:border-blue-400/80 cursor-pointer'
                      } group`}
                    >
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="paystub-upload"
                        onChange={handlePayStubUpload}
                        disabled={payStubStatus === 'uploading'}
                      />
                      <label
                        htmlFor="paystub-upload"
                        className={`absolute inset-0 flex flex-col items-center justify-center p-3 ${payStubStatus === 'uploading' ? '' : 'cursor-pointer'}`}
                      >
                        {payStubStatus === 'uploading' ? (
                          <>
                            <Loader2 className="w-10 h-10 text-blue-300 mb-2 animate-spin" />
                            <p className="text-xs text-blue-200 text-center">Analyzing...</p>
                          </>
                        ) : payStubStatus === 'verified' ? (
                          <>
                            <Check className="w-10 h-10 text-green-400 mb-2" />
                            <h4 className="text-sm font-semibold text-white mb-1 text-center">
                              Pay Stub Verified ✓
                            </h4>
                            {payStubData?.annualIncome && (
                              <p className="text-xs text-green-200 text-center">
                                Est: {payStubData.annualIncome}
                              </p>
                            )}
                          </>
                        ) : payStubStatus === 'failed' ? (
                          <>
                            <XIcon className="w-10 h-10 text-red-400 mb-2" />
                            <h4 className="text-sm font-semibold text-white mb-1 text-center">
                              Pay Stub Failed ✗
                            </h4>
                            <p className="text-xs text-red-200 text-center">
                              Try again
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-blue-300 mb-2 group-hover:text-blue-200 transition-colors" />
                            <h4 className="text-sm font-semibold text-white mb-1 text-center">
                              Pay Stub Upload
                            </h4>
                            <p className="text-xs text-blue-200 text-center">
                              Click to upload
                            </p>
                          </>
                        )}
                      </label>
                      <div className={`absolute inset-0 rounded-xl blur-lg -z-10 scale-110 transition-opacity ${
                        payStubStatus === 'verified' 
                          ? 'bg-green-400/20 opacity-60' 
                          : payStubStatus === 'failed'
                          ? 'bg-red-400/20 opacity-60'
                          : 'bg-blue-400/10 opacity-0 group-hover:opacity-60'
                      }`}></div>
                    </motion.div>

                    {/* Soft Pull Credit Score */}
                    <motion.div
                      whileHover={{ scale: softPullStatus === 'loading' ? 1 : 1.05 }}
                      onClick={() => {
                        if (softPullStatus !== 'loading') {
                          setShowSoftPullForm(true);
                        }
                      }}
                      className={`relative aspect-square backdrop-blur-lg rounded-xl border-2 transition-all duration-300 ${
                        softPullStatus === 'success' 
                          ? 'bg-green-500/20 border-green-400/80' 
                          : softPullStatus === 'failed'
                          ? 'bg-red-500/20 border-red-400/80'
                          : softPullStatus === 'loading'
                          ? 'bg-blue-500/20 border-blue-400/80'
                          : 'bg-white/10 border-blue-400/40 hover:border-blue-400/80 cursor-pointer'
                      } group`}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                        {softPullStatus === 'loading' ? (
                          <>
                            <Loader2 className="w-10 h-10 text-blue-300 mb-2 animate-spin" />
                            <p className="text-xs text-blue-200 text-center">Pulling...</p>
                          </>
                        ) : softPullStatus === 'success' ? (
                          <>
                            <Check className="w-10 h-10 text-green-400 mb-2" />
                            <h4 className="text-sm font-semibold text-white mb-1 text-center">
                              Score Retrieved ✓
                            </h4>
                            {softPullData?.creditScore && (
                              <p className="text-xs text-green-200 text-center">
                                Score: {softPullData.creditScore}
                              </p>
                            )}
                          </>
                        ) : softPullStatus === 'failed' ? (
                          <>
                            <XIcon className="w-10 h-10 text-red-400 mb-2" />
                            <h4 className="text-sm font-semibold text-white mb-1 text-center">
                              Pull Failed ✗
                            </h4>
                            <p className="text-xs text-red-200 text-center">
                              Try again
                            </p>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-10 h-10 text-blue-300 mb-2 group-hover:text-blue-200 transition-colors" />
                            <h4 className="text-sm font-semibold text-white mb-1 text-center">
                              Credit Score
                            </h4>
                            <p className="text-xs text-blue-200 text-center">
                              Soft pull
                            </p>
                          </>
                        )}
                      </div>
                      <div className={`absolute inset-0 rounded-xl blur-lg -z-10 scale-110 transition-opacity ${
                        softPullStatus === 'success' 
                          ? 'bg-green-400/20 opacity-60' 
                          : softPullStatus === 'failed'
                          ? 'bg-red-400/20 opacity-60'
                          : 'bg-blue-400/10 opacity-0 group-hover:opacity-60'
                      }`}></div>
                    </motion.div>
                  </div>

                  {/* Error Message Display */}
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 text-center"
                    >
                      <p className="text-sm text-red-200">{errorMessage}</p>
                    </motion.div>
                  )}

                  {/* Success Summary */}
                  {(w2Data || payStubData || softPullData) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-500/20 border border-green-400/50 rounded-lg p-4"
                    >
                      <h4 className="text-sm font-semibold text-white text-center mb-3">
                        Financial Information Verified
                      </h4>
                      
                      {/* Horizontal layout for documents */}
                      <div className="grid grid-cols-2 gap-4">
                        {w2Data && (
                          <div className="text-xs text-green-200 bg-green-500/10 rounded-lg p-3 border border-green-400/30">
                            <p className="font-semibold mb-2 text-white">W-2 Document</p>
                            <p><strong>Name:</strong> {w2Data.employeeName || 'Extracted'}</p>
                            {w2Data.employerName && <p><strong>Employer:</strong> {w2Data.employerName}</p>}
                            {w2Data.annualIncome && <p><strong>Income:</strong> {w2Data.annualIncome}</p>}
                          </div>
                        )}
                        {payStubData && (
                          <div className="text-xs text-green-200 bg-green-500/10 rounded-lg p-3 border border-green-400/30">
                            <p className="font-semibold mb-2 text-white">Pay Stub Document</p>
                            <p><strong>Name:</strong> {payStubData.employeeName || 'Extracted'}</p>
                            {payStubData.employerName && <p><strong>Employer:</strong> {payStubData.employerName}</p>}
                            {payStubData.annualIncome && <p><strong>Est. Income:</strong> {payStubData.annualIncome}</p>}
                            {payStubData.payPeriod && <p><strong>Pay Period:</strong> {payStubData.payPeriod}</p>}
                          </div>
                        )}
                        {softPullData && (
                          <div className="text-xs text-green-200 bg-green-500/10 rounded-lg p-3 border border-green-400/30">
                            <p className="font-semibold mb-2 text-white">Credit Score</p>
                            {softPullData.creditScore && <p className="text-2xl font-bold text-white mb-1">{softPullData.creditScore}</p>}
                            {softPullData.creditRating && <p><strong>Rating:</strong> {softPullData.creditRating}</p>}
                            {softPullData.reportDate && <p><strong>Date:</strong> {softPullData.reportDate}</p>}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Continue button */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center pt-6"
                  >
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate && onNavigate('financial-info')}
                        className="relative px-12 py-3 text-lg font-semibold rounded-2xl border transition-all duration-300 backdrop-blur-lg bg-gradient-to-r from-blue-500/30 to-blue-600/30 hover:from-blue-500/40 hover:to-blue-600/40 border-blue-400/60 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                      >
                        Continue →
                      </motion.button>
                      <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl -z-10 scale-110 opacity-60"></div>
                    </div>
                  </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Ambient light effects */}
        <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Soft Pull Form Modal */}
      <AnimatePresence>
        {showSoftPullForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSoftPullForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-blue-400/30 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Soft Credit Pull</h2>
                <button
                  onClick={() => setShowSoftPullForm(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <p className="text-blue-200 mb-6">
                Please provide your basic information for a soft credit inquiry. No SSN or date of birth required. This will not affect your credit score.
              </p>

              <form onSubmit={handleSoftPullSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={softPullFormData.firstName}
                      onChange={(e) => handleSoftPullFormChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-blue-400/30 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={softPullFormData.lastName}
                      onChange={(e) => handleSoftPullFormChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-blue-400/30 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={softPullFormData.address}
                    onChange={(e) => handleSoftPullFormChange('address', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-blue-400/30 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                    placeholder="123 Main Street"
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={softPullFormData.city}
                      onChange={(e) => handleSoftPullFormChange('city', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-blue-400/30 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                      placeholder="Austin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={softPullFormData.state}
                      onChange={(e) => handleSoftPullFormChange('state', e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-blue-400/30 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                      placeholder="TX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={softPullFormData.zipCode}
                      onChange={(e) => handleSoftPullFormChange('zipCode', e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-blue-400/30 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                      placeholder="78701"
                    />
                  </div>
                </div>

                {/* Consent Notice */}
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                  <p className="text-xs text-blue-200">
                    By submitting this form, you authorize us to perform a soft credit inquiry using your name and address. 
                    This will not impact your credit score or appear on your credit report as an inquiry.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSoftPullForm(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-blue-400/30 text-white hover:bg-white/20 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={softPullStatus === 'loading'}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {softPullStatus === 'loading' ? 'Processing...' : 'Pull Credit Score'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeptunePage;

