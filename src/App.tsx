import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {!isStarted ? (
        <WelcomeScreen onStart={() => setIsStarted(true)} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
