import React, { useState } from 'react';
import './Navigation.css';

function Navigation({ currentPage, setCurrentPage, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const pages = [
    { id: 'dashboard', label: 'AI Chat', icon: '💬' },
    { id: 'memory', label: 'Memory', icon: '🧠' },
    { id: 'stats', label: 'API Stats', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handlePageClick = (pageId) => {
    setCurrentPage(pageId);
    setIsOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-header">
        <div className="logo">
          <span className="logo-icon">🤖</span>
          <span className="logo-text">Sentiment AI</span>
        </div>
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
        {pages.map((page) => (
          <button
            key={page.id}
            className={`nav-item ${currentPage === page.id ? 'active' : ''}`}
            onClick={() => handlePageClick(page.id)}
          >
            <span className="nav-icon">{page.icon}</span>
            <span className="nav-label">{page.label}</span>
          </button>
        ))}

        <button className="nav-item logout" onClick={onLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navigation;