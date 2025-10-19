import './App.css';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import LandingPage from './components/LandingPage';
import SignInForm from './components/ui/SignInForm';
import SignUpForm from './components/ui/SignUpForm';
import SolarSystem from './components/SolarSystem';
import NeptunePage from './components/NeptunePage';
import ProfilePage from './components/ProfilePage';
import UranusPage from './components/UranusPage';
import SaturnPage from './components/SaturnPage';
import FinancialInfoPage from './components/FinancialInfoPage';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');
  const [vehiclePreferences, setVehiclePreferences] = useState(null);
  const [financialInfo, setFinancialInfo] = useState(null);

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

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleSubmitPreferences = (preferences) => {
    setVehiclePreferences(preferences);
  };

  const handleSubmitFinancialInfo = (info) => {
    setFinancialInfo(info);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Navigation between different pages
  if (currentPage === 'sign-in') {
    return (
      <SignInForm 
        onSignUp={() => handleNavigate('sign-up')}
      />
    );
  }

  if (currentPage === 'sign-up') {
    return (
      <SignUpForm 
        onSignIn={() => handleNavigate('sign-in')}
      />
    );
  }

  if (currentPage === 'solar-system') {
    return <SolarSystem onNavigate={handleNavigate} />;
  }

  if (currentPage === 'neptune') {
    return <NeptunePage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'financial-info') {
    return (
      <FinancialInfoPage 
        onNavigate={handleNavigate}
        onSubmitFinancialInfo={handleSubmitFinancialInfo}
      />
    );
  }

  if (currentPage === 'uranus') {
    return (
      <UranusPage 
        onNavigate={handleNavigate}
        onSubmitPreferences={handleSubmitPreferences}
      />
    );
  }

  if (currentPage === 'saturn') {
    return (
      <SaturnPage 
        onNavigate={handleNavigate}
        preferences={vehiclePreferences}
        financialInfo={financialInfo}
        userProfile={userProfile}
      />
    );
  }

  if (currentPage === 'profile') {
    return (
      <ProfilePage 
        user={user}
        onBack={() => handleNavigate('landing')}
      />
    );
  }

  // Landing page (default)
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

export default App;
