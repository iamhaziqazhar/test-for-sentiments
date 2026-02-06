import React, { useState, useRef, useEffect } from 'react';
import './AIChat.css';
import { callAIAPI } from '../../services/aiService';
import { saveConversation, getConversationHistory } from '../../services/memoryService';

function AIChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedAPI, setSelectedAPI] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const messagesEndRef = useRef(null);

  const apis = [
    { id: 'openai', name: 'OpenAI GPT-4', icon: '🟢' },
    { id: 'anthropic', name: 'Anthropic Claude', icon: '🟡' },
    { id: 'deepseek', name: 'DeepSeek', icon: '🔵' },
    { id: 'grok', name: 'Grok by xAI', icon: '🟣' },
  ];

  // Load conversation history on mount
  useEffect(() => {
    const history = getConversationHistory();
    setMessages(history);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    if (!apiKey.trim()) {
      alert('Please enter an API key for the selected service');
      setShowKeyInput(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      api: selectedAPI,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await callAIAPI(selectedAPI, inputText, apiKey);

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        api: selectedAPI,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save to memory
      saveConversation([userMessage, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Error: ${error.message}`,
        api: selectedAPI,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat">
      <div className="chat-header">
        <h2>AI Chat Assistant</h2>
        <div className="chat-controls">
          <select
            value={selectedAPI}
            onChange={(e) => setSelectedAPI(e.target.value)}
            className="api-selector"
          >
            {apis.map((api) => (
              <option key={api.id} value={api.id}>
                {api.icon} {api.name}
              </option>
            ))}
          </select>
          <button
            className="key-button"
            onClick={() => setShowKeyInput(!showKeyInput)}
          >
            🔑 API Key
          </button>
        </div>
      </div>

      {showKeyInput && (
        <div className="key-input-section">
          <input
            type="password"
            placeholder="Enter your API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="key-input"
          />
          <small>Your API key is stored in memory during this session only.</small>
        </div>
      )}

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Start a conversation by typing a message below.</p>
            <p className="empty-hint">Each conversation is saved to your local memory.</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message message-${message.type}`}>
            <div className="message-header">
              <span className="message-icon">
                {message.type === 'user' ? '👤' : message.type === 'error' ? '⚠️' : '🤖'}
              </span>
              <span className="message-api">{message.api.toUpperCase()}</span>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="message message-loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-form">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message here..."
          rows="3"
          disabled={isLoading}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSendMessage(e);
            }
          }}
        />
        <button type="submit" disabled={isLoading || !inputText.trim()}>
          {isLoading ? '⏳ Sending...' : '📤 Send'}
        </button>
      </form>
    </div>
  );
}

export default AIChat;