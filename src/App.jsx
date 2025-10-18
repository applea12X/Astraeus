import './App.css';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import LandingPage from './components/LandingPage';
import SignInForm from './components/ui/SignInForm';
import SignUpForm from './components/ui/SignUpForm';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showSignUp) {
    return (
      <SignUpForm 
        onSignIn={() => {
          setShowSignUp(false);
          setShowSignIn(true);
        }}
      />
    );
  }

  if (showSignIn) {
    return (
      <SignInForm 
        onSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />
    );
  }

  return (
    <LandingPage 
      onSignIn={() => setShowSignIn(true)}
      onSignUp={() => setShowSignUp(true)} 
      user={user} 
    />
  );
}

export default App;
