import './App.css';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import SignInForm from './components/ui/SignInForm';
import SignUpForm from './components/ui/SignUpForm';
import SolarSystem from './components/SolarSystem';
import NeptunePage from './components/NeptunePage';
import ProfilePage from './components/ProfilePage';
import UranusPage from './components/UranusPage';
import UranusFormPage from './components/UranusFormPage';
import SaturnPage from './components/SaturnPage';
import SaturnResultsPage from './components/SaturnResultsPage';
import JupiterPage from './components/JupiterPage';
import FinancialInfoPage from './components/FinancialInfoPage';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');
  const [vehiclePreferences, setVehiclePreferences] = useState(null);
  const [financialInfo, setFinancialInfo] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [navPayload, setNavPayload] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User signed in' : 'No user');
      setUser(user);
      
      // Fetch user profile from Firestore with timeout
      if (user) {
        // Navigate immediately, then fetch profile in background
        if (currentPage === 'sign-in' || currentPage === 'sign-up') {
          console.log('Navigating to landing page...');
          setCurrentPage('landing');
        }
        
        // Fetch profile data asynchronously (non-blocking)
        const fetchProfile = async () => {
          try {
            console.log('Fetching user profile from Firestore...');
            const userDoc = await Promise.race([
              getDoc(doc(db, 'users', user.uid)),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 5000)
              )
            ]);
            
            if (userDoc.exists()) {
              console.log('User profile found:', userDoc.data());
              setUserProfile(userDoc.data());
            } else {
              console.log('No user profile found in Firestore');
              setUserProfile(null);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // Continue without profile data
            setUserProfile(null);
          }
        };
        
        fetchProfile();
      } else {
        setUserProfile(null);
        // If user logs out, go back to landing page
        if (currentPage !== 'landing' && currentPage !== 'sign-in' && currentPage !== 'sign-up') {
          setCurrentPage('landing');
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentPage]);

  const handleNavigate = (page, payload) => {
    // Handle special payloads
    if (payload?.selectedVehicle) {
      setSelectedVehicle(payload.selectedVehicle);
    }
    setNavPayload(payload ?? null);
    setCurrentPage(page);
  };

  const handleSubmitPreferences = (preferences) => {
    setVehiclePreferences(preferences);
  };

  const handleSubmitFinancialInfo = (info) => {
    setFinancialInfo(info);
  };

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 300
    },
    animate: {
      opacity: 1,
      x: 0
    },
    exit: {
      opacity: 1,
      x: -300
    }
  };

  const pageTransition = {
    type: "tween",
    ease: [0.4, 0, 0.2, 1],
    duration: 0.5
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render the current page with transitions
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'sign-in':
        return (
          <SignInForm 
            onSignUp={() => handleNavigate('sign-up')}
          />
        );
      case 'sign-up':
        return (
          <SignUpForm 
            onSignIn={() => handleNavigate('sign-in')}
          />
        );
      case 'solar-system':
        return <SolarSystem onNavigate={handleNavigate} navPayload={navPayload} />;
      case 'neptune':
        return <NeptunePage onNavigate={handleNavigate} />;
      case 'financial-info':
        return <FinancialInfoPage onNavigate={handleNavigate} onSubmitFinancialInfo={handleSubmitFinancialInfo} />;
      case 'jupiter':
        return <JupiterPage onNavigate={handleNavigate} financialInfo={null} />;
      case 'profile':
        return (
          <ProfilePage 
            user={user}
            onBack={() => handleNavigate('landing')}
          />
        );
      case 'uranus':
        return <UranusPage onNavigate={handleNavigate} financialInfo={financialInfo} />;
      case 'uranus-form':
        return (
          <UranusFormPage 
            onNavigate={handleNavigate} 
            onSubmitPreferences={handleSubmitPreferences}
            financialInfo={financialInfo}
          />
        );
      case 'saturn':
        return <SaturnPage onNavigate={handleNavigate} />;
      case 'saturn-results':
        return (
          <SaturnResultsPage 
            onNavigate={handleNavigate}
            preferences={vehiclePreferences}
            financialInfo={financialInfo}
            userProfile={userProfile}
          />
        );
      case 'jupiter':
        return (
          <JupiterPage 
            onNavigate={handleNavigate}
            selectedVehicle={selectedVehicle}
          />
        );
      default:
        return (
          <LandingPage 
            onSignIn={() => handleNavigate('sign-in')}
            onSignUp={() => handleNavigate('sign-up')}
            onNavigate={() => handleNavigate('solar-system')}
            onViewProfile={() => handleNavigate('profile')}
            user={user}
            userProfile={userProfile}
          />
        );
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1229]">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={currentPage}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
          className="absolute inset-0 w-full h-full"
        >
          {renderCurrentPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
