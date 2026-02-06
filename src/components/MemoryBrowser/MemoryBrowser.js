import React, { useState, useEffect } from 'react';
import './MemoryBrowser.css';
import { getConversationHistory, clearMemory } from '../../services/memoryService';

function MemoryBrowser() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    const history = getConversationHistory();
    setConversations(history);
  };

  const handleDelete = (id) => {
    const updated = conversations.filter((msg) => msg.id !== id);
    setConversations(updated);
    localStorage.setItem('conversationHistory', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      clearMemory();
      setConversations([]);
      setSelectedId(null);
    }
  };

  const selectedMessage = conversations.find((msg) => msg.id === selectedId);

  return (
    <div className="memory-browser">
      <div className="memory-header">
        <h2>📚 Memory Browser</h2>
        <button className="clear-button" onClick={handleClearAll}>
          🗑️ Clear All
        </button>
      </div>

      <div className="memory-container">
        <div className="memory-list">
          <h3>Stored Conversations ({conversations.length})</h3>

          {conversations.length === 0 ? (
            <div className="empty-memory">
              <p>No conversations stored yet.</p>
              <p className="hint">Start chatting to build your memory.</p>
            </div>
          ) : (
            <div className="conversation-items">
              {conversations.map((msg) => (
                <div
                  key={msg.id}
                  className={`conversation-item ${selectedId === msg.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(msg.id)}
                >
                  <div className="item-header">
                    <span className="item-icon">
                      {msg.type === 'user' ? '👤' : '🤖'}
                    </span>
                    <span className="item-api">{msg.api || 'N/A'}</span>
                  </div>
                  <div className="item-preview">
                    {msg.content.substring(0, 50)}...
                  </div>
                  <div className="item-time">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="memory-detail">
          {selectedMessage ? (
            <>
              <div className="detail-header">
                <h3>
                  {selectedMessage.type === 'user' ? 'User Message' : 'Assistant Response'}
                </h3>
                <button
                  className="delete-button"
                  onClick={() => {
                    handleDelete(selectedId);
                    setSelectedId(null);
                  }}
                >
                  ❌ Delete
                </button>
              </div>
              <div className="detail-meta">
                <span className="meta-item">
                  <strong>API:</strong> {selectedMessage.api}
                </span>
                <span className="meta-item">
                  <strong>Time:</strong> {new Date(selectedMessage.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="detail-content">{selectedMessage.content}</div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemoryBrowser;