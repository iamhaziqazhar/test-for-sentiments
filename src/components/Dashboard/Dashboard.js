import React from 'react';
import './Dashboard.css';
import AIChat from '../AiChat/AIChat';
import MemoryBrowser from '../MemoryBrowser/MemoryBrowser';
import APIStats from '../APIStats/APIStats';
import Settings from '../Settings/Settings';

function Dashboard({ currentPage }) {
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AIChat />;
      case 'memory':
        return <MemoryBrowser />;
      case 'stats':
        return <APIStats />;
      case 'settings':
        return <Settings />;
      default:
        return <AIChat />;
    }
  };

  return <div className="dashboard">{renderPage()}</div>;
}

export default Dashboard;