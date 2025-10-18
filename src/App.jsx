import { useState } from 'react';
import './App.css';
import FirebaseExample from './components/FirebaseExample';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            React + Tailwind + Firebase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your modern web app starter template
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="text-blue-600 text-4xl mb-4">⚛️</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">React</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fast, modern React with Vite for lightning-fast development
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="text-cyan-600 text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Tailwind CSS</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Utility-first CSS framework for rapid UI development
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="text-orange-600 text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Firebase</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Backend as a service with authentication and database
              </p>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Interactive Counter Demo
            </h2>
            <div className="mb-6">
              <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                {count}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Click the button below to increment the counter
              </p>
            </div>
            <button
              onClick={() => setCount(count + 1)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Increment Counter
            </button>
            <button
              onClick={() => setCount(0)}
              className="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Reset
            </button>
          </div>

          {/* Firebase Example */}
          <div className="mt-12">
            <FirebaseExample />
          </div>

          {/* Getting Started */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              🚀 Getting Started
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>
                <strong className="text-gray-800 dark:text-white">1.</strong> Set up Firebase: Copy <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">.env.example</code> to <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">.env</code> and add your Firebase config
              </p>
              <p>
                <strong className="text-gray-800 dark:text-white">2.</strong> Import Firebase services from <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">src/firebase/config.js</code>
              </p>
              <p>
                <strong className="text-gray-800 dark:text-white">3.</strong> Start building your amazing app!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-600 dark:text-gray-400">
          <p>Edit <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded">src/App.jsx</code> to get started</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
