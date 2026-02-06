export const API_ENDPOINTS = {
  OPENAI: 'https://api.openai.com/v1/chat/completions',
  ANTHROPIC: 'https://api.anthropic.com/v1/messages',
  DEEPSEEK: 'https://api.deepseek.com/v1/chat/completions',
  GROK: 'https://api.x.ai/v1/chat/completions',
};

export const MODELS = {
  OPENAI: 'gpt-4',
  ANTHROPIC: 'claude-3-sonnet-20240229',
  DEEPSEEK: 'deepseek-chat',
  GROK: 'grok-beta',
};

export const APP_CONFIG = {
  APP_NAME: 'Sentiment AI Hub',
  VERSION: '1.0.0',
  MAX_MESSAGE_LENGTH: 4000,
  MAX_RESPONSE_LENGTH: 2000,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};