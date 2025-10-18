import { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import SolarSystem from './components/SolarSystem';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    <>
      {currentPage === 'landing' && <LandingPage onNavigate={() => setCurrentPage('solar-system')} />}
      {currentPage === 'solar-system' && <SolarSystem />}
    </>
  );
}

export default App;
