import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';

/**
 * Example component showing how to use Firebase Authentication
 * This is a simple example - you'll need to implement actual auth methods
 */
function FirebaseExample() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Firebase Auth Status
      </h3>
      
      {user ? (
        <div className="space-y-2">
          <p className="text-green-600 dark:text-green-400 font-semibold">
            ✓ User is authenticated
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Email: {user.email || 'No email available'}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            UID: {user.uid}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
            ⚠ No user authenticated
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Implement sign-in functionality to authenticate users
          </p>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>Note:</strong> To use Firebase authentication, you need to:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
          <li>Enable authentication methods in Firebase Console</li>
          <li>Import auth functions from 'firebase/auth'</li>
          <li>Implement sign-in/sign-up methods</li>
        </ul>
      </div>
    </div>
  );
}

export default FirebaseExample;

