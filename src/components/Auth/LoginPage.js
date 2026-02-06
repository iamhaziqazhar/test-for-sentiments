import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { hashPassword, verifyPassword } from '../../utils/hashPassword';

function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if password is already set
    const savedPasswordHash = localStorage.getItem('appPasswordHash');
    if (savedPasswordHash) {
      setIsSetupMode(false);
    } else {
      setIsSetupMode(true);
    }
    setIsLoading(false);
  }, []);

  const handleSetupPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const hash = await hashPassword(password);
      localStorage.setItem('appPasswordHash', hash);
      
      // Create session
      sessionStorage.setItem('userSession', 'true');
      onLogin();
    } catch (err) {
      setError('Error setting up password. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      const savedHash = localStorage.getItem('appPasswordHash');
      const isCorrect = await verifyPassword(password, savedHash);

      if (isCorrect) {
        sessionStorage.setItem('userSession', 'true');
        onLogin();
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    } catch (err) {
      setError('Authentication error. Please try again.');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sentiment AI Hub</h1>
          <p>{isSetupMode ? 'Set Your Password' : 'Welcome Back'}</p>
        </div>

        <form onSubmit={isSetupMode ? handleSetupPassword : handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
            />
          </div>

          {isSetupMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            {isSetupMode ? 'Set Password' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p className="security-note">
            {isSetupMode 
              ? '✓ Password stored ' 
              : '✓ Local authentication - No cloud services'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;