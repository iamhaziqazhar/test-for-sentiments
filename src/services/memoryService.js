// Memory Service - Handles conversation storage and retrieval

const STORAGE_KEY = 'conversationHistory';

export function saveConversation(messages) {
  const history = getConversationHistory();
  const updated = [...history, ...messages];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getConversationHistory() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearMemory() {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteConversation(id) {
  const history = getConversationHistory();
  const updated = history.filter((msg) => msg.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function searchMemory(query) {
  const history = getConversationHistory();
  const lowerQuery = query.toLowerCase();
  return history.filter(
    (msg) =>
      msg.content.toLowerCase().includes(lowerQuery) ||
      (msg.api && msg.api.toLowerCase().includes(lowerQuery))
  );
}

export function getMemoryStats() {
  const history = getConversationHistory();
  return {
    totalMessages: history.length,
    uniqueAPIs: new Set(history.map((msg) => msg.api)).size,
    oldestMessage: history.length > 0 ? history[0].timestamp : null,
    newestMessage: history.length > 0 ? history[history.length - 1].timestamp : null,
  };
}