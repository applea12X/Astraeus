import { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import SolarSystem from './components/SolarSystem';
import NeptunePage from './components/NeptunePage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 'landing' && <LandingPage onNavigate={() => handleNavigate('solar-system')} />}
      {currentPage === 'solar-system' && <SolarSystem onNavigate={handleNavigate} />}
      {currentPage === 'neptune' && <NeptunePage />}
    </>
  );
}

export default App;
