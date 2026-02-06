import React, { useState, useEffect } from 'react';
import './APIStats.css';

function APIStats() {
  const [stats, setStats] = useState({
    openai: { calls: 0, tokens: 0 },
    anthropic: { calls: 0, tokens: 0 },
    deepseek: { calls: 0, tokens: 0 },
    grok: { calls: 0, tokens: 0 },
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('apiStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const totalCalls = Object.values(stats).reduce((sum, api) => sum + api.calls, 0);
  const totalTokens = Object.values(stats).reduce((sum, api) => sum + api.tokens, 0);

  const handleReset = () => {
    if (window.confirm('Reset all API statistics?')) {
      const newStats = {
        openai: { calls: 0, tokens: 0 },
        anthropic: { calls: 0, tokens: 0 },
        deepseek: { calls: 0, tokens: 0 },
        grok: { calls: 0, tokens: 0 },
      };
      setStats(newStats);
      localStorage.setItem('apiStats', JSON.stringify(newStats));
    }
  };

  const apis = [
    { id: 'openai', name: 'OpenAI', color: '#4a7c59' },
    { id: 'anthropic', name: 'Anthropic', color: '#3a86ff' },
    { id: 'deepseek', name: 'DeepSeek', color: '#ff6b6b' },
    { id: 'grok', name: 'Grok', color: '#ffa500' },
  ];

  return (
    <div className="api-stats">
      <div className="stats-header">
        <h2>📊 API Statistics</h2>
        <button className="reset-button" onClick={handleReset}>
          🔄 Reset Stats
        </button>
      </div>

      <div className="stats-summary">
        <div className="summary-card">
          <span className="summary-label">Total API Calls</span>
          <span className="summary-value">{totalCalls}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Tokens Used</span>
          <span className="summary-value">{totalTokens}</span>
        </div>
      </div>

      <div className="stats-grid">
        {apis.map((api) => (
          <div key={api.id} className="stat-card">
            <div className="stat-header">
              <h3>{api.name}</h3>
              <div className="stat-indicator" style={{ background: api.color }}></div>
            </div>
            <div className="stat-content">
              <div className="stat-item">
                <span className="stat-label">Calls</span>
                <span className="stat-number">{stats[api.id].calls}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tokens</span>
                <span className="stat-number">{stats[api.id].tokens}</span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{
                    width: `${(stats[api.id].calls / Math.max(totalCalls, 1)) * 100}%`,
                    background: api.color,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="stats-info">
        <p>📌 Statistics are stored locally in your browser.</p>
        <p>📌 Data is never sent to external servers.</p>
      </div>
    </div>
  );
}

export default APIStats;