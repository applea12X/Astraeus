import React from 'react';
import JupiterLandingPage from './JupiterLandingPage';

const JupiterPage = ({ onNavigate, selectedVehicle }) => {
  return <JupiterLandingPage onNavigate={onNavigate} selectedVehicle={selectedVehicle} />;
};

export default JupiterPage;