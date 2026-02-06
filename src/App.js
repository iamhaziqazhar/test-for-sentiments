import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import Navigation from './components/Navigation/Navigation';
import LiveBackground from './components/Background/LiveBackground';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const sessionKey = sessionStorage.getItem('userSession');
    if (sessionKey) {
      setIsAuthenticated(true);
    }
  }, []);
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userSession');
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <LiveBackground />
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
      <main className="main-content">
        <Dashboard currentPage={currentPage} />
      </main>
    </div>
  );
}

export default App;