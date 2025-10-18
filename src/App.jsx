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
import FinancialInfoPage from './components/FinancialInfoPage';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Fetch user profile from Firestore
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
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
    return <NeptunePage />;
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
