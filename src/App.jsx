import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { EnhancedDashboard } from './components/EnhancedDashboard';
import { Toaster } from './components/shared/Toaster';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground antialiased relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
        
        {/* Main Content */}
        <div className="relative z-10">
          <EnhancedDashboard />
        </div>
        
        {/* Toast Notifications */}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;