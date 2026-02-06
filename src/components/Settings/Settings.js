import React, { useState, useEffect } from 'react';
import './Settings.css';

function Settings() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoSave: true,
    fontSize: 'medium',
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  const handleExportMemory = () => {
    const memory = localStorage.getItem('conversationHistory');
    const stats = localStorage.getItem('apiStats');
    const data = {
      memory: JSON.parse(memory || '[]'),
      stats: JSON.parse(stats || '{}'),
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-memory-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportMemory = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          localStorage.setItem('conversationHistory', JSON.stringify(data.memory || []));
          localStorage.setItem('apiStats', JSON.stringify(data.stats || {}));
          alert('Memory imported successfully!');
          window.location.reload();
        } catch (err) {
          alert('Invalid backup file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearAllData = () => {
    if (window.confirm('This will delete all your data. Are you sure?')) {
      localStorage.clear();
      sessionStorage.clear();
      alert('All data cleared. Please refresh the page.');
      window.location.reload();
    }
  };

  return (
    <div className="settings">
      <h2>⚙️ Settings</h2>

      <div className="settings-section">
        <h3>Preferences</h3>
        <div className="setting-item">
          <label>Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Font Size</label>
          <select
            value={settings.fontSize}
            onChange={(e) => handleChange('fontSize', e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="setting-item checkbox">
          <input
            type="checkbox"
            id="notifications"
            checked={settings.notifications}
            onChange={(e) => handleChange('notifications', e.target.checked)}
          />
          <label htmlFor="notifications">Enable Notifications</label>
        </div>

        <div className="setting-item checkbox">
          <input
            type="checkbox"
            id="autoSave"
            checked={settings.autoSave}
            onChange={(e) => handleChange('autoSave', e.target.checked)}
          />
          <label htmlFor="autoSave">Auto-save Conversations</label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>
        <button className="action-button" onClick={handleExportMemory}>
          💾 Export Memory
        </button>
        <button className="action-button" onClick={handleImportMemory}>
          📂 Import Memory
        </button>
      </div>

      <div className="settings-section">
        <h3>Danger Zone</h3>
        <button className="danger-button" onClick={handleClearAllData}>
          ⚠️ Clear All Data
        </button>
      </div>

      <div className="settings-info">
        <h4>About</h4>
        <p>Sentiment AI Hub v1.0</p>
        <p>All data is stored locally. No information is sent to external servers.</p>
        <p>Your privacy is our priority.</p>
      </div>
    </div>
  );
}

export default Settings;